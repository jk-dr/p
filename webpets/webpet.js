/**
 * webpet.js — Standalone, zero-dependency web pets
 * Drop-in usage:
 *   <script src="/webpet.js" data-animal="fox" data-color="red"></script>
 *
 * Programmatic usage:
 *   <script src="/webpet.js"></script>
 *   <script>
 *     const pet = new WebPet({ animal: 'fox', color: 'red' });
 *   </script>
 *
 * The script auto-detects where GIF assets live based on its own <script src>.
 * If you need to override: new WebPet({ animal: 'fox', mediaBase: 'https://cdn.example.com/media' });
 *
 * Available animals:
 *   chicken, clippy, cockatiel, crab, deno, dog, fox, horse, mod, monkey,
 *   morph, panda, rat, rocky, rubber-duck, skeleton, snail, snake, totoro,
 *   turtle, vampire, zappy
 *
 * Horse special variants — color "paint" or "socks" support a `subcolor` option:
 *   new WebPet({ animal: 'horse', color: 'paint', subcolor: 'beige' })
 *   Subcolor choices: 'beige' | 'black' | 'brown'  (default: 'brown')
 */
(function (global) {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────────────
     Auto-detect script context for default media path
  ───────────────────────────────────────────────────────────────────────── */
  var _currentScript = document.currentScript;
  var _scriptSrc = _currentScript ? _currentScript.src : '';
  var _scriptDir = _scriptSrc
    ? _scriptSrc.substring(0, _scriptSrc.lastIndexOf('/') + 1)
    : '/';
  var _defaultMediaBase = _scriptDir + 'media';

  var CACHE = 'webpets-gifs-v1'; // FIX: was `const`, changed to `var` for consistency; name used correctly throughout

  /* ─────────────────────────────────────────────────────────────────────────
     Animal catalog
     Each entry defines defaults for that species.
     `movement` — ordered list of action names used while the pet walks.
     `idle`     — ordered list of action names for idle state.
     `hover`    — action played when the mouse is near.
  ───────────────────────────────────────────────────────────────────────── */
  var ANIMALS = {
    chicken: {
      speed: 4.3, defaultColor: 'brown',
      colors: ['brown', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Chickens peck around nervously and bob when they move
      behaviour: { nervous: true, jumpy: 4, distraction: 0.05, fearOthers: true },
      fearSize: 2,  // small prey bird
    },
    clippy: {
      speed: 3.2, defaultColor: 'brown',
      colors: ['black', 'brown', 'green', 'yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Clippy is eager and wiggly — and constantly distracted
      behaviour: { wobble: 4, flipChance: 0.05, distraction: 0.04 },
      fearSize: 3,  // office paperclip, mildly intimidating
    },
    cockatiel: {
      speed: 4.0, defaultColor: 'brown',
      colors: ['brown', 'gray'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Cockatiels are alert little birds — short bursts, slight hop
      behaviour: { nervous: true, jumpy: 3, distraction: 0.06, fearOthers: true },
      fearSize: 2,  // tiny bird
    },
    crab: {
      speed: 3.4, defaultColor: 'red',
      colors: ['red'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Crabs scuttle sideways and like to change direction
      behaviour: { flipChance: 0.12, distraction: 0.02 },
      fearSize: 4,  // claws! reasonably imposing
    },
    deno: {
      speed: 4.8, defaultColor: 'green',
      colors: ['green'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Deno is a speedy dino — bouncy and energetic
      behaviour: { jumpy: 6, distraction: 0.02 },
      fearSize: 9,  // it's a dinosaur
    },
    dog: {
      speed: 5.5, defaultColor: 'brown',
      colors: ['akita', 'black', 'brown', 'red', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Dogs are enthusiastic — they bound along, wag, and chase squirrels
      behaviour: { jumpy: 5, distraction: 0.06, chasesObjects: true },
      fearSize: 7,  // big dog, scary to small things
    },
    fox: {
      speed: 5.2, defaultColor: 'red',
      colors: ['red', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Foxes are cunning — quick direction changes, light prance
      behaviour: { flipChance: 0.08, jumpy: 3, distraction: 0.03, chasesObjects: true },
      fearSize: 6,  // predator
    },
    horse: {
      speed: 5.8, defaultColor: 'brown',
      // paint/socks are handled separately via subcolor option
      colors: ['black', 'brown', 'magical', 'paint', 'socks', 'warrior', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // paint/socks compound colors: the action becomes "{subcolor}_{action}"
      compoundColors: ['paint', 'socks'],
      // Horses gallop with a pronounced bounce
      behaviour: { jumpy: 8, distraction: 0.01 },
      fearSize: 10, // enormous
    },
    mod: {
      speed: 4.0, defaultColor: 'purple',
      colors: ['purple'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Mod is a chill moderator — steady, slight swagger
      behaviour: { distraction: 0.02 },
      fearSize: 5,  // authoritative but not physically threatening
    },
    monkey: {
      speed: 4.7, defaultColor: 'gray',
      colors: ['gray'],
      // monkey has no walk_fast
      movement: ['walk', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Monkeys swing around with big bouncy moves and zero attention span
      behaviour: { jumpy: 7, flipChance: 0.1, distraction: 0.07 },
      fearSize: 5,  // chaotic but mid-sized
    },
    morph: {
      speed: 4.0, defaultColor: 'purple',
      colors: ['purple'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Morph is a shapeshifter — wobbly, unpredictable, and easily distracted
      behaviour: { flipChance: 0.1, distraction: 0.05 },
      fearSize: 4,
    },
    panda: {
      speed: 3.6, defaultColor: 'black',
      colors: ['black', 'brown'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Pandas are famously lazy — long rests, slow gait
      behaviour: { lazy: true, distraction: 0.01 },
      fearSize: 8,  // big bear, very imposing
    },
    rat: {
      speed: 4.9, defaultColor: 'brown',
      colors: ['brown', 'gray', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Rats are skittish — erratic dashes, high flip chance, TERRIFIED of cursor and bigger animals
      behaviour: { nervous: true, flipChance: 0.18, distraction: 0.08, fearCursor: true, fearOthers: true },
      fearSize: 1,  // tiny prey — scared of almost everything
    },
    rocky: {
      speed: 2.8, defaultColor: 'gray',
      colors: ['gray'],
      // rocky has no with_ball or lie; walk_fast exists but no run
      movement: ['walk', 'walk_fast'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Rocky is a slow, heavy rock — plods along with a wobble
      behaviour: { lazy: true, distraction: 0.01 },
      fearSize: 6,  // it's a rock, intimidating by mass
    },
    'rubber-duck': {
      speed: 3.0, defaultColor: 'yellow',
      colors: ['yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Rubber ducks bob up and down on water, drifting wherever
      behaviour: { jumpy: 4, wobble: 3, distraction: 0.05 },
      fearSize: 1,  // it's a bath toy
    },
    skeleton: {
      speed: 4.4, defaultColor: 'white',
      colors: ['blue', 'brown', 'green', 'orange', 'pink', 'purple', 'red', 'warrior', 'white', 'yellow'],
      // skeleton has no walk_fast
      movement: ['walk', 'run'],
      idle: ['idle', 'stand', 'swipe'],
      hover: 'swipe',
      // Skeletons rattle and lurch as they walk
      behaviour: { flipChance: 0.06, distraction: 0.04 },
      fearSize: 7,  // spooky and tall
    },
    snail: {
      speed: 1.4, defaultColor: 'brown',
      colors: ['brown'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Snails are the definition of lazy
      behaviour: { lazy: true, distraction: 0.01 },
      fearSize: 1,
    },
    snake: {
      speed: 3.7, defaultColor: 'green',
      colors: ['green'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Snakes slither with a sinuous wobble and occasional direction change
      behaviour: { flipChance: 0.07, distraction: 0.02 },
      fearSize: 5,  // scary to small animals
    },
    totoro: {
      speed: 3.1, defaultColor: 'gray',
      colors: ['gray'],
      // totoro has no walk_fast
      movement: ['walk', 'run'],
      idle: ['idle', 'lie', 'swipe'],
      hover: 'swipe',
      // Totoro is a big gentle spirit — slow, slightly bouncy
      behaviour: { lazy: true, jumpy: 3, distraction: 0.03 },
      fearSize: 9,  // massive forest spirit
    },
    turtle: {
      speed: 2.2, defaultColor: 'green',
      colors: ['green', 'orange'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'lie', 'swipe'],
      hover: 'swipe',
      // Turtles are slow and steady — lazy, but with a gentle plod
      behaviour: { lazy: true, wobble: 1, distraction: 0.01 },
      fearSize: 3,
    },
    vampire: {
      speed: 4.4, defaultColor: 'converted',
      colors: ['converted', 'countess', 'girl'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Vampires are unpredictable — they dart and twist
      behaviour: { nervous: true, flipChance: 0.1, distraction: 0.05, fearOthers: true },
      fearSize: 6,  // scary but also scared of bigger things
    },
    zappy: {
      speed: 5.0, defaultColor: 'yellow',
      colors: ['yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Zappy is electric — bouncy, erratic, and scatterbrained
      behaviour: { jumpy: 6, flipChance: 0.08, distraction: 0.06 },
      fearSize: 3,
    },
  };

  /* Speed multipliers keyed by action suffix (last segment after last _) */
  var SPEED_MULTIPLIERS = {
    'walk':      1.00,
    'walk_fast': 1.35,
    'run':       1.80,
  };

  function speedFor(actionName) {
    // handles plain actions and compound ones like "brown_walk_fast"
    var parts = actionName.split('_');
    // try full name first, then last two parts, then last part
    if (SPEED_MULTIPLIERS[actionName] !== undefined) return SPEED_MULTIPLIERS[actionName];
    var tail2 = parts.slice(-2).join('_');
    if (SPEED_MULTIPLIERS[tail2] !== undefined) return SPEED_MULTIPLIERS[tail2];
    var tail1 = parts[parts.length - 1];
    if (SPEED_MULTIPLIERS[tail1] !== undefined) return SPEED_MULTIPLIERS[tail1];
    return 1.0;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     Global entity registry — used for spread-awareness so pets avoid bunching,
     and for followEntity targeting across WebPet and WebBall instances.
  ───────────────────────────────────────────────────────────────────────── */
  var _allEntities = [];           // replaces _allPets; holds WebPet and WebBall instances
  var _entityCounts = {};          // { 'fox': 2, 'dog': 1, 'ball': 1, … }

  function _resolveEntity(name) {
    for (var _ri = 0; _ri < _allEntities.length; _ri++) {
      if (_allEntities[_ri].name === name) return _allEntities[_ri];
    }
    return null;
  }

  /* ─────────────────────────────────────────────────────────────────────────
     WebPet constructor
  ───────────────────────────────────────────────────────────────────────── */

  /**
   * @param {object} options
   * @param {string}  options.animal        — Animal name (e.g. 'fox')
   * @param {string}  [options.color]       — Color variant (e.g. 'red')
   * @param {string}  [options.subcolor]    — Sub-color for horse paint/socks ('beige'|'black'|'brown')
   * @param {number}  [options.scale]       — Render scale multiplier (default 0.5)
   * @param {number}  [options.speed]       — Movement speed px/frame (default from catalog)
   * @param {number}  [options.idleDist]    — Distance at which pet stops and idles (default 48)
   * @param {number}  [options.hoverDist]   — Mouse distance to trigger hover action (default 50)
   * @param {string}  [options.hoverAction] — Action played when hovered (default from catalog)
   * @param {string}  [options.hoverMessage]— Speech bubble text shown on hover
   * @param {string}  [options.followEntity] — Name of the entity to follow; falls back to wander if not found
   * @param {string}  [options.name]         — Unique display name; default '<animal>-<N>'
   * @param {string}  [options.position]    — CSS position ('fixed'|'absolute', default 'fixed')
   * @param {number}  [options.zIndex]      — CSS z-index (default 9999)
   * @param {string}  [options.mediaBase]   — Base URL for GIF assets (auto-detected from script src)
   * @param {object}  [options.idlePauseMs] — { min, max } ms between movement segments
   * @param {string[]}[options.movementActions] — Override movement action names
   * @param {string[]}[options.idleActions]     — Override idle action names
   *
   * Behaviour modifiers:
   * @param {boolean|number} [options.jumpy]     — Vertical bounce while moving; true = 8 px amplitude, or pass a px value
   * @param {boolean|number} [options.wobble]    — Rotation swagger while walking; true = 5°, or pass degrees
   * @param {number}  [options.flipChance]       — 0–1 probability per step of reversing direction mid-walk (default 0)
   * @param {boolean} [options.nervous]          — Short erratic targets, higher flip chance, quicker pause cycles
   * @param {boolean} [options.lazy]             — Very long idle pauses, always picks the slowest movement action
 * @param {number}  [options.distraction]      — 0–1 chance per tick of losing interest and wandering to a random nearby spot (followEntity pets only; no-op in free-roam mode where random targets are already chosen)
   */
  function WebPet(options) {
    options = options || {};

    var animalId = options.animal || 'fox';
    var spec = ANIMALS[animalId] || ANIMALS['fox'];

    // Auto-name: increment counter for this animal type, build default name
    _entityCounts[animalId] = (_entityCounts[animalId] || 0) + 1;
    var entityName = options.name || (animalId + '-' + _entityCounts[animalId]);

    var color = options.color || spec.defaultColor;
    var subcolor = options.subcolor || 'brown';

    // For horse paint/socks: action names need a "{subcolor}_" prefix
    var isCompound = spec.compoundColors && spec.compoundColors.indexOf(color) !== -1;

    function prefixAction(name) {
      return isCompound ? (subcolor + '_' + name) : name;
    }

    var rawMovement = options.movementActions || spec.movement;
    var rawIdle = options.idleActions || spec.idle;
    var rawHover = options.hoverAction || spec.hover;

    // Build action objects
    var movementActions = rawMovement.map(function (name) {
      var a = prefixAction(name);
      return { name: a, speedMultiplier: speedFor(a) };
    });

    var idleActions = rawIdle.map(function (name) {
      var a = prefixAction(name);
      return {
        name: a,
        baseDuration: (name === 'idle' || name === 'lie' || name === 'stand') ? 2500 : 1200,
        extraDuration: (name === 'idle' || name === 'lie' || name === 'stand') ? 2000 : 800,
      };
    });

    var hoverAction = prefixAction(rawHover);

    // Merge species behaviour defaults under user-supplied options (user wins).
    var specBeh = spec.behaviour || {};
    var isErratic = options.erratic != null ? !!options.erratic : (specBeh.erratic != null ? !!specBeh.erratic : false);
    var beh = {
      jumpy:      options.jumpy      != null ? options.jumpy      : (specBeh.jumpy      != null ? specBeh.jumpy      : false),
      wobble:     options.wobble     != null ? options.wobble     : (specBeh.wobble     != null ? specBeh.wobble     : false),
      flipChance: options.flipChance != null ? +options.flipChance : (specBeh.flipChance != null ? specBeh.flipChance : null),
      nervous:    options.nervous    != null ? !!options.nervous  : (specBeh.nervous    != null ? !!specBeh.nervous  : false),
      lazy:       options.lazy       != null ? !!options.lazy     : (specBeh.lazy       != null ? !!specBeh.lazy     : false),
      distraction: options.distraction != null ? +options.distraction : (specBeh.distraction != null ? specBeh.distraction : 0),
    };
    // flipChance: if not set by user or species, derive from nervous
    if (beh.flipChance === null) beh.flipChance = beh.nervous ? 0.15 : 0;
    // erratic: crank everything to 11 — overrides individual flags unless the user set them explicitly
    if (isErratic) {
      if (options.jumpy      == null) beh.jumpy      = 12;
      if (options.wobble     == null) beh.wobble     = 18;
      if (options.flipChance == null) beh.flipChance = 0.45;
      if (options.nervous    == null) beh.nervous    = true;
      if (options.distraction == null) beh.distraction = 0.18;
    }

    this._cfg = {
      animal:        animalId,
      color:         color,
      mediaBase:     options.mediaBase || _defaultMediaBase,
      scale:         options.scale    != null ? +options.scale    : 0.5,
      speed:         options.speed    != null ? +options.speed    : (isErratic ? spec.speed * 2.2 : spec.speed),
      erratic:       isErratic,
      idleDist:      options.idleDist != null ? +options.idleDist : 48,
      hoverDist:     options.hoverDist != null ? +options.hoverDist : 50,
      hoverAction:   hoverAction,
      idlePauseMs:   options.idlePauseMs || { min: 1500, max: 2200 },
      followEntity:  options.followEntity || null,
      name:          entityName,
      position:      options.position || 'fixed',
      zIndex:        options.zIndex != null ? +options.zIndex : 9999,
      hoverMessage:  options.hoverMessage || '',
      spriteW:       100,
      spriteH:       100,
      movementActions: movementActions,
      idleActions:     idleActions,
      // ── Behaviour modifiers (resolved from species defaults + user options) ──
      jumpAmp:    beh.jumpy   === true ? 8  : (beh.jumpy   ? +beh.jumpy   : 0),
      wobbleDeg:  beh.wobble  === true ? 5  : (beh.wobble  ? +beh.wobble  : 0),
      flipChance: beh.flipChance,
      nervous:    beh.nervous,
      lazy:       beh.lazy,
      distraction: beh.distraction,
      fearCursor:  specBeh.fearCursor  || false,
      fearOthers:  specBeh.fearOthers  || false,
      fearSize:    spec.fearSize       != null ? spec.fearSize : 3,
      chasesObjects: (specBeh.chasesObjects && options.followEntity == null) ? true : false,
    };

    this.name = entityName;

    // 50/50 chance to spawn on the right side of the screen
    var spawnOnRight = Math.random() < 0.5;
    var spawnX = spawnOnRight
      ? window.innerWidth * 0.75 + Math.random() * window.innerWidth * 0.2
      : window.innerWidth * 0.05 + Math.random() * window.innerWidth * 0.2;

    this._state = {
      x:                      spawnX,
      facingDir:              1,
      idleAction:             idleActions[0] ? idleActions[0].name : 'idle',
      idleActionUntil:        0,
      idleCooldownUntil:      0,
      movementAction:         movementActions[0] ? movementActions[0].name : 'walk',
      movementSpeedMult:      1,
      movementPauseUntil:     0,
      movementTargetX:        null,
      distractionUntil:       0,
      distractionTargetX:     null,
      fleeTargetX:            null,
      fleeUntil:              0,
      peerFleeTargetX:        null,
      peerFleeUntil:          0,
      lastStepTime:           0,
      lastGif:                null,
      isHovered:              false,
      jumpPhase:              0,
      wobblePhase:            0,
      // ── Drag / gravity state ──
      isDragged:              false,
      isFalling:              false,
      // Offset from wrap's top-left corner to pointer at drag start (px)
      dragOffsetX:            0,
      dragOffsetY:            0,
      // Pixel position when airborne (from viewport top-left, matching fixed coords)
      airX:                   0,
      airY:                   0,
      // Downward velocity in px per logic step (positive = down)
      velY:                   0,
      velX:                   0,
      // Timestamp (ms) when the chased ball's speed first dropped below the threshold;
      // null means the ball is still moving fast enough to hold interest.
      ballLostInterestAt:     null,
    };

    this._mouseX = window.innerWidth  / 2;
    this._mouseY = window.innerHeight / 2;
    this._hasRealPointer = false; // set true on first real mousemove/touchmove
    this._mouseVY      = null;  // px/ms, tracked in _onMouseMove
    this._mouseVX      = null;  // px/ms, tracked in _onMouseMove
    this._lastMoveTime = null;
    this._rafId  = null;
    this._blobCache = {}; // FIX: initialise blob URL cache to avoid repeated createObjectURL calls

    this._onMouseMove  = this._onMouseMove.bind(this);
    this._onDragStart  = this._onDragStart.bind(this);
    this._onDragMove   = this._onDragMove.bind(this);
    this._onDragEnd    = this._onDragEnd.bind(this);
    this._tick         = this._tick.bind(this);

    this._buildDOM();
    this._start();
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  WebPet.prototype._gifUrl = async function (action) {
    var c = this._cfg;
    var url = c.mediaBase + '/' + c.animal + '/' + c.color + '_' + action + '_8fps.gif';

    // Return already-created blob URL if we have one (avoids repeated createObjectURL)
    if (this._blobCache[url]) return this._blobCache[url];

    try {
      var cache = await caches.open(CACHE); // FIX: was WEBPETS_CACHE (undefined)
      var response = await cache.match(url);

      if (!response) {
        response = await fetch(url, { mode: 'cors' });
        await cache.put(url, response.clone());
      }

      var blobUrl = URL.createObjectURL(await response.blob());
      this._blobCache[url] = blobUrl;
      return blobUrl;
    } catch (e) {
      return url; // fallback to direct URL if cache/fetch fails
    }
  };

  WebPet.prototype._setGif = async function (action) {
    // Compare action string, not the blob URL (which changes every call)
    if (this._state.lastGif === action) return;
    this._state.lastGif = action;

    var url = await this._gifUrl(action);

    // Guard: action may have changed while we were awaiting the cache/fetch
    if (this._state.lastGif !== action) return;

    this._spriteEl.style.backgroundImage = 'url("' + url + '")';
  };

  WebPet.prototype._applyFacing = function () {
    this._applyTransforms(0);
  };

  /**
   * Set sprite facing + optional rotation (wobble).
   * Keeps scaleX and rotate in a single transform so they compose correctly.
   */
  WebPet.prototype._applyTransforms = function (wobbleRot) {
    var rot = wobbleRot || 0;
    this._spriteEl.style.transform = 'scaleX(' + this._state.facingDir + ')'
      + (rot !== 0 ? ' rotate(' + rot + 'deg)' : '');
  };

  /* ── DOM construction ────────────────────────────────────────────────── */

  WebPet.prototype._buildDOM = function () {
    var c = this._cfg;
    var w = c.spriteW * c.scale;
    var h = c.spriteH * c.scale;

    // Outer container — positioned at the bottom of the viewport / parent
    var wrap = document.createElement('div');
    var initialLeft = this._state.x - (c.spriteW * c.scale / 2);
    wrap.style.cssText = [
      'position:'   + c.position,
      'bottom:0',
      'left:'       + initialLeft + 'px',
      'width:'      + w + 'px',
      'height:'     + h + 'px',
      'z-index:'    + c.zIndex,
      'pointer-events:auto',
      'transform-origin:bottom center',
      'overflow:visible',
      'cursor:grab',
      'user-select:none',
    ].join(';');
    this._wrapEl = wrap;

    // Sprite — background-image driven GIF display
    var sprite = document.createElement('div');
    sprite.style.cssText = [
      'width:100%',
      'height:100%',
      'background-repeat:no-repeat',
      'background-position:bottom center',
      'background-size:contain',
      'image-rendering:pixelated',
      'image-rendering:crisp-edges',
      'transform:scaleX(1)',
      'transform-origin:bottom center',
      'pointer-events:none',  /* drag is handled by the wrap */
    ].join(';');
    // FIX: removed synchronous _gifUrl() call here — it returned [object Promise]
    // _tick will set the correct GIF within the first animation frame
    this._spriteEl = sprite;
    wrap.appendChild(sprite);

    // Speech bubble — hidden unless hovered + hoverMessage set
    var bubble = document.createElement('div');
    bubble.style.cssText = [
      'display:none',
      'position:absolute',
      'left:50%',
      'bottom:100%',
      'transform:translateX(-50%)',
      'margin-bottom:8px',
      'padding:5px 9px',
      'max-width:160px',
      'border-radius:6px',
      'border:1.5px solid rgba(0,0,0,0.14)',
      'background:#ffffff',
      'color:#111111',
      'font-family:ui-monospace,SFMono-Regular,monospace',
      'font-size:11px',
      'line-height:1.3',
      'text-align:center',
      'white-space:pre-wrap',
      'box-shadow:0 2px 10px rgba(0,0,0,0.13)',
      'pointer-events:none',
      'z-index:1',
    ].join(';');
    bubble.textContent = c.hoverMessage;

    // Bubble tail triangle
    var tail = document.createElement('div');
    tail.setAttribute('aria-hidden', 'true');
    tail.style.cssText = [
      'position:absolute',
      'top:100%',
      'left:50%',
      'transform:translateX(-50%)',
      'width:0',
      'height:0',
      'border-left:6px solid transparent',
      'border-right:6px solid transparent',
      'border-top:6px solid rgba(0,0,0,0.14)',
    ].join(';');
    bubble.appendChild(tail);

    // Inner tail (matches bubble background)
    var tailInner = document.createElement('div');
    tailInner.setAttribute('aria-hidden', 'true');
    tailInner.style.cssText = [
      'position:absolute',
      'top:100%',
      'left:50%',
      'transform:translateX(-50%) translateY(-1.5px)',
      'width:0',
      'height:0',
      'border-left:5px solid transparent',
      'border-right:5px solid transparent',
      'border-top:5px solid #ffffff',
    ].join(';');
    bubble.appendChild(tailInner);

    this._bubbleEl = bubble;
    wrap.appendChild(bubble);

    document.body.appendChild(wrap);

    // Ghost element — a second sprite used to make edge-wrapping seamless.
    // It mirrors the real sprite but is offset by ±parentW so the pet appears
    // to slide in from the opposite edge before we do the invisible position swap.
    var ghost = document.createElement('div');
    ghost.style.cssText = [
      'position:'   + c.position,
      'bottom:0',
      'left:-9999px',
      'width:'      + w + 'px',
      'height:'     + h + 'px',
      'z-index:'    + c.zIndex,
      'pointer-events:none',
      'transform-origin:bottom center',
      'overflow:visible',
      'opacity:1',
    ].join(';');

    var ghostSprite = document.createElement('div');
    ghostSprite.style.cssText = [
      'width:100%',
      'height:100%',
      'background-repeat:no-repeat',
      'background-position:bottom center',
      'background-size:contain',
      'image-rendering:pixelated',
      'image-rendering:crisp-edges',
      'transform:scaleX(1)',
      'transform-origin:bottom center',
    ].join(';');
    this._ghostSpriteEl = ghostSprite;
    ghost.appendChild(ghostSprite);
    document.body.appendChild(ghost);
    this._ghostEl = ghost;
    this._ghostVisible = false;
  };

  WebPet.prototype._showBubble = function (visible) {
    if (!this._cfg.hoverMessage) return;
    this._bubbleEl.style.display = visible ? 'block' : 'none';
    this._state.isHovered = visible;
  };

  /**
   * Sync the ghost element's position/appearance with the real sprite.
   * The ghost is placed exactly one viewport-width away from the real pet,
   * on whichever side it is approaching — so as the real pet walks off-screen
   * the ghost is already walking on from the opposite edge.
   * Call only during normal pathing (not while dragged/falling).
   * @param {number} x        — logical centre x of the real pet
   * @param {number} leftPx   — real wrap left offset (px)
   * @param {number} parentW  — width of the parent/viewport
   */
  WebPet.prototype._syncGhost = function (x, leftPx, parentW) {
    var spriteW = this._cfg.spriteW * this._cfg.scale;
    var WRAP_MARGIN = spriteW * 1.5;

    // Decide if the pet is near an edge (within one sprite-width of going off-screen)
    var nearLeft  = x < WRAP_MARGIN * 2;
    var nearRight = x > parentW - WRAP_MARGIN * 2;

    if (!nearLeft && !nearRight) {
      // Nowhere near an edge — hide ghost
      if (this._ghostVisible) {
        this._ghostEl.style.left = '-9999px';
        this._ghostVisible = false;
      }
      return;
    }

    // Show ghost on the opposite side
    var ghostLeft = nearLeft
      ? leftPx + parentW    // ghost on the right (wrapping from left)
      : leftPx - parentW;   // ghost on the left  (wrapping from right)

    // Mirror the real sprite's visual state
    this._ghostSpriteEl.style.backgroundImage = this._spriteEl.style.backgroundImage;
    this._ghostSpriteEl.style.transform       = this._spriteEl.style.transform;
    this._ghostEl.style.bottom  = this._wrapEl.style.bottom;
    this._ghostEl.style.left    = ghostLeft + 'px';
    this._ghostVisible = true;
  };

  /** Hide and park the ghost off-screen (call when dragged/falling). */
  WebPet.prototype._hideGhost = function () {
    if (this._ghostVisible) {
      this._ghostEl.style.left = '-9999px';
      this._ghostVisible = false;
    }
  };

  /* ── Animation loop ──────────────────────────────────────────────────── */

  WebPet.prototype._start = function () {
    _allEntities.push(this);
    document.addEventListener('mousemove', this._onMouseMove);
    // Drag listeners on the wrap (mousedown) and document (move/up so drags don't break on fast moves)
    this._wrapEl.addEventListener('mousedown', this._onDragStart);
    document.addEventListener('mousemove',  this._onDragMove);
    document.addEventListener('mouseup',    this._onDragEnd);
    // Touch support
    this._wrapEl.addEventListener('touchstart', this._onDragStart, { passive: false });
    document.addEventListener('touchmove',  this._onDragMove,  { passive: false });
    document.addEventListener('touchend',   this._onDragEnd);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._rafId = requestAnimationFrame(this._tick);
    }
  };

  WebPet.prototype._onMouseMove = function (e) {
    var now = performance.now();
    var dt  = now - (this._lastMoveTime || now);
    if (dt > 0 && dt < 100) {
      var rawVY = (e.clientY - this._mouseY) / dt;
      var rawVX = (e.clientX - this._mouseX) / dt;
      this._mouseVY = this._mouseVY == null ? rawVY : this._mouseVY * 0.6 + rawVY * 0.4;
      this._mouseVX = this._mouseVX == null ? rawVX : this._mouseVX * 0.6 + rawVX * 0.4;
    }
    this._lastMoveTime = now;
    this._hasRealPointer = true;
    this._mouseX = e.clientX;
    this._mouseY = e.clientY;
  };

  /* ── Drag / pick-up helpers ──────────────────────────────────────────── */

  /** Normalise mouse or first touch to { clientX, clientY }. */
  WebPet.prototype._pointerCoords = function (e) {
    if (e.touches && e.touches.length) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  WebPet.prototype._onDragStart = function (e) {
    // Only primary button for mouse; always fire for touch
    if (e.type === 'mousedown' && e.button !== 0) return;
    // Prevent text selection, link activation, and scroll during drag
    e.preventDefault();

    var p    = this._pointerCoords(e);
    var rect = this._wrapEl.getBoundingClientRect();
    var s    = this._state;

    s.isDragged     = true;
    s.isFalling     = false;
    s.velY          = 0;
    s.dragOffsetX   = rect.left - p.clientX;
    s.dragOffsetY   = rect.top  - p.clientY;

    // Block selectstart so dragging over text doesn't highlight it
    this._onSelectStart = function (e) { e.preventDefault(); };
    document.addEventListener('selectstart', this._onSelectStart);
    // Suppress pointer cursor and selection on body
    this._prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    this._wrapEl.style.position = 'fixed';
    this._wrapEl.style.bottom   = 'auto';
    this._wrapEl.style.left     = rect.left + 'px';
    this._wrapEl.style.top      = rect.top  + 'px';
    this._wrapEl.style.cursor   = 'grabbing';
  };

  WebPet.prototype._onDragMove = function (e) {
    if (!this._state.isDragged) return;
    if (e.type === 'touchmove') e.preventDefault();

    var p  = this._pointerCoords(e);
    var s  = this._state;
    var c  = this._cfg;
    var w  = c.spriteW * c.scale;
    var h  = c.spriteH * c.scale;

    var newLeft = p.clientX + s.dragOffsetX;
    var newTop  = p.clientY + s.dragOffsetY;

    // Clamp to viewport
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    newLeft = Math.max(0, Math.min(newLeft, vw - w));
    newTop  = Math.max(0, Math.min(newTop,  vh - h));

    this._wrapEl.style.left = newLeft + 'px';
    this._wrapEl.style.top  = newTop  + 'px';

    // Sync logical position so the pet doesn't teleport when it lands
    s.airX = newLeft;
    s.airY = newTop;

    // Track velocity for fling — mirrors _onMouseMove so touch gets the same EMA
    var now2 = performance.now();
    var dt2  = now2 - (this._lastMoveTime || now2);
    if (dt2 > 0 && dt2 < 100) {
      var rawVX2 = (p.clientX - this._mouseX) / dt2;
      var rawVY2 = (p.clientY - this._mouseY) / dt2;
      this._mouseVX = this._mouseVX == null ? rawVX2 : this._mouseVX * 0.6 + rawVX2 * 0.4;
      this._mouseVY = this._mouseVY == null ? rawVY2 : this._mouseVY * 0.6 + rawVY2 * 0.4;
    }
    this._lastMoveTime = now2;
    this._hasRealPointer = true;
    this._mouseX = p.clientX;
    this._mouseY = p.clientY;
  };

  WebPet.prototype._onDragEnd = function (e) {
    if (!this._state.isDragged) return;

    var s  = this._state;
    var c  = this._cfg;
    var h  = c.spriteH * c.scale;

    s.isDragged = false;
    this._wrapEl.style.cursor = 'grab';

    // Restore selection behaviour
    if (this._onSelectStart) {
      document.removeEventListener('selectstart', this._onSelectStart);
      this._onSelectStart = null;
    }
    document.body.style.userSelect = this._prevUserSelect || '';

    var rect     = this._wrapEl.getBoundingClientRect();
    var vh       = window.innerHeight;
    var floorTop = vh - h;

    // If already on the floor, just land immediately
    if (rect.top >= floorTop) {
      this._landPet(rect.left);
      return;
    }

    var SCALE = 1.2 * 16.67;
    var MAX_V = 40;

    // Heavier (larger) pets are harder to fling — weight scales with rendered area.
    // Base is scale=0.5 (50×50px). A pet at scale=1.0 has 4× the area → half the velocity.
    var renderedArea  = (c.spriteW * c.scale) * (c.spriteH * c.scale);
    var baseArea      = (c.spriteW * 0.5)     * (c.spriteH * 0.5);
    var weightFactor  = Math.sqrt(renderedArea / baseArea); // sqrt keeps it from being too punishing
    var effectiveScale = SCALE / weightFactor;

    var velPxMsX = (this._mouseVX != null && isFinite(this._mouseVX)) ? this._mouseVX : 0;
    var velPxMsY = (this._mouseVY != null && isFinite(this._mouseVY)) ? this._mouseVY : 0;
    var velX = Math.max(-MAX_V, Math.min(velPxMsX * effectiveScale, MAX_V));
    var velY = Math.max(-MAX_V, Math.min(velPxMsY * effectiveScale, MAX_V));

    // If already on the floor AND no meaningful throw, just land immediately
    var MIN_BOUNCE_VY = 3.5;
    if (rect.top >= floorTop && Math.abs(velY) < MIN_BOUNCE_VY && Math.abs(velX) < MIN_BOUNCE_VY) {
      this._landPet(rect.left);
      return;
    }

    s.isFalling = true;
    s.airX      = rect.left;
    s.airY      = Math.min(rect.top, floorTop - 1); // ensure at least 1px above floor so bounce triggers
    s.velX      = velX;
    s.velY      = velY;
    // Reset velocity trackers so stale values don't bleed into next pick-up
    this._mouseVX = null;
    this._mouseVY = null;
  };

  /**
   * Snap the pet back onto the ground after a drop/throw.
   * @param {number} leftPx — current left offset in fixed coords (px)
   */
  WebPet.prototype._landPet = function (leftPx) {
    var s  = this._state;
    var c  = this._cfg;
    var w  = c.spriteW * c.scale;

    s.isFalling = false;
    s.velY      = 0;
    s.velX      = 0;
    s.airX      = 0;
    s.airY      = 0;

    // Sync logical x (centre of sprite) back to the normal coordinate system
    var parentEl   = this._wrapEl.parentElement;
    var parentRect = parentEl
      ? parentEl.getBoundingClientRect()
      : { left: 0, width: window.innerWidth };
    var centreX = leftPx + w / 2 - parentRect.left;
    centreX = Math.max(16, Math.min(centreX, parentRect.width - 16));
    s.x = centreX;

    // Restore normal bottom-anchored positioning
    this._wrapEl.style.position = c.position;
    this._wrapEl.style.top      = 'auto';
    this._wrapEl.style.bottom   = '0px';
    this._wrapEl.style.left     = (centreX - w / 2) + 'px';

    // Clear any stale movement target so the pet doesn't teleport
    s.movementTargetX = null;
    s.jumpPhase       = 0;
    s.wobblePhase     = 0;
  };

  WebPet.prototype._pickIdleAction = function (ts) {
    var actions = this._cfg.idleActions;
    if (!actions.length) return;
    var a = actions[Math.floor(Math.random() * actions.length)];
    this._state.idleAction       = a.name;
    this._state.idleActionUntil  = ts + a.baseDuration + Math.random() * a.extraDuration;
    this._state.idleCooldownUntil = this._state.idleActionUntil + this._cfg.idlePauseMs.min / 8;
  };

  WebPet.prototype._pickMovementAction = function () {
    var actions = this._cfg.movementActions;
    if (!actions.length) return;
    var pool = actions;
    // Lazy pets always pick the slowest available action
    if (this._cfg.lazy) {
      var slow = actions.filter(function (a) { return a.speedMultiplier <= 1.0; });
      if (slow.length) pool = slow;
    }
    var a = pool[Math.floor(Math.random() * pool.length)];
    this._state.movementAction    = a.name;
    this._state.movementSpeedMult = a.speedMultiplier;
  };

  WebPet.prototype._scheduleMovementPause = function (ts) {
    var p    = this._cfg.idlePauseMs;
    // lazy: very long pauses; nervous: very short pauses (lots of quick dashes)
    var mult = this._cfg.lazy ? 4.0 : (this._cfg.erratic ? 0.05 : (this._cfg.nervous ? 0.25 : 1.0));
    this._state.movementPauseUntil = ts + (p.min + Math.random() * Math.max(0, p.max - p.min)) * mult;
  };

  /**
   * Find the largest gap between pets (or between a pet and a wall) and
   * return the centre of that gap as the preferred target region.
   * Returns null if there are fewer than 2 peers.
   */
  WebPet.prototype._spreadTarget = function (x, boundsW) {
    var margin = 16;
    // Collect positions of all OTHER pets
    var others = [];
    for (var i = 0; i < _allEntities.length; i++) {
      if (_allEntities[i] !== this && _allEntities[i]._state) {
        others.push(_allEntities[i]._state.x);
      }
    }
    if (others.length === 0) return null; // only pet — go anywhere

    // Build a sorted list of "occupied" x values, bounded by the walls
    var pts = [margin].concat(others).concat([boundsW - margin]);
    pts.sort(function (a, b) { return a - b; });

    // Find the widest gap
    var bestGapCentre = null;
    var bestGapSize   = 0;
    for (var j = 0; j < pts.length - 1; j++) {
      var gapSize = pts[j + 1] - pts[j];
      if (gapSize > bestGapSize) {
        bestGapSize   = gapSize;
        bestGapCentre = (pts[j] + pts[j + 1]) / 2;
      }
    }

    // Only bother heading there if the gap is meaningfully larger than our
    // current position's nearest gap (i.e. we're actually bunching).
    if (bestGapSize < boundsW * 0.15) return null;

    // Add a small random jitter so pets don't all converge on the exact centre
    var jitter = (Math.random() - 0.5) * bestGapSize * 0.35;
    return Math.min(boundsW - margin, Math.max(margin, bestGapCentre + jitter));
  };

  WebPet.prototype._pickMovementTarget = function (x, boundsW) {
    var margin = 16;
    var wrapMargin = boundsW * 0.08;
    var maxX = boundsW + wrapMargin;

    // Erratic pets: extremely short random bursts in any direction, ignoring spread awareness entirely
    if (this._cfg.erratic) {
      var eDist = boundsW * 0.03 + Math.random() * boundsW * 0.08;
      var eDir  = Math.random() < 0.5 ? -1 : 1;
      this._state.movementTargetX = Math.min(maxX, Math.max(margin, x + eDir * eDist));
      return;
    }

    // Nervous pets take short, erratic dashes rather than long walks —
    // but still prefer emptier areas when bunching is detected.
    if (this._cfg.nervous) {
    
      // 25% chance to intentionally leave the screen
      if (Math.random() < 0.25) {
        this._state.movementTargetX =
          Math.random() < 0.5
            ? -wrapMargin
            : boundsW + wrapMargin;
        return;
      }
    
      var spreadT = this._spreadTarget(x, boundsW);
    
      if (spreadT !== null && Math.random() < 0.6) {
        var nervDir  = spreadT > x ? 1 : -1;
        var nervDist = boundsW * 0.05 + Math.random() * boundsW * 0.12;
    
        this._state.movementTargetX =
          Math.min(maxX, Math.max(margin, x + nervDir * nervDist));
      } else {
        var dist = boundsW * 0.05 + Math.random() * boundsW * 0.12;
        var dir  = Math.random() < 0.5 ? -1 : 1;
    
        this._state.movementTargetX =
          Math.min(maxX, Math.max(margin, x + dir * dist));
      }
    
      return;
    }

    // Spread-aware targeting: 70% of the time try to fill empty space
    var spreadTarget = this._spreadTarget(x, boundsW);
    if (spreadTarget !== null && Math.random() < 0.7) {
      this._state.movementTargetX = spreadTarget;
      return;
    }

    var minDist = boundsW * 0.2;
    var maxDist = boundsW * 0.55;
    var dist    = minDist + Math.random() * Math.max(0, maxDist - minDist);
    var avL     = Math.max(0, x - margin);
    var avR     = Math.max(0, maxX - x);
    var dir;
    if (avL >= dist && avR >= dist) dir = Math.random() < 0.5 ? -1 : 1;
    else if (avL >= dist)           dir = -1;
    else if (avR >= dist)           dir = 1;
    else                            dir = avL > avR ? -1 : 1;
    this._state.movementTargetX = Math.min(maxX, Math.max(margin, x + dir * dist));
  };

  WebPet.prototype._tick = function (ts) {
    var STEP_MS = 125; // ~8fps logic steps

    var c = this._cfg;
    var s = this._state;

    /* ── Dragged — position is driven by _onDragMove; nothing to do here ── */
    if (s.isDragged) {
      if (ts - s.lastStepTime >= STEP_MS) {
        s.lastStepTime = ts;
        this._setGif(s.idleAction || c.idleActions[0].name);
        this._applyFacing();
      }
      this._hideGhost();
      this._rafId = requestAnimationFrame(this._tick);
      return;
    }

    /* ── Falling — runs every RAF frame (60fps) for smooth physics ── */
    if (s.isFalling) {
      this._hideGhost();
      var GRAVITY   = 0.5;   // px/frame² downward acceleration
      var MAX_FALL  = 25;    // terminal fall velocity (px/frame)
      var BOUNCE    = 0.38;  // energy kept on wall/ceiling bounce (0=dead stop, 1=perfect)
      var spriteW_f = c.spriteW * c.scale;
      var spriteH_f = c.spriteH * c.scale;
      var vw_f      = window.innerWidth;
      var vh_f      = window.innerHeight;
      var floorTop  = vh_f - spriteH_f;
      var rightEdge = vw_f - spriteW_f;

      // Apply gravity
      s.velY = Math.min(s.velY + GRAVITY, MAX_FALL);

      // Advance position
      s.airX += s.velX;
      s.airY += s.velY;

      // ── Bounce off left / right walls ──
      if (s.airX <= 0) {
        s.airX = 0;
        s.velX = Math.abs(s.velX) * BOUNCE;
      } else if (s.airX >= rightEdge) {
        s.airX = rightEdge;
        s.velX = -Math.abs(s.velX) * BOUNCE;
      }

      // ── Bounce off ceiling ──
      if (s.airY <= 0) {
        s.airY = 0;
        s.velY = Math.abs(s.velY) * BOUNCE;
      }

      // ── Floor: bounce or land ──
      var FLOOR_BOUNCE  = 0.45;  // energy kept on floor bounce
      var MIN_BOUNCE_VY = 3.5;   // minimum velY (px/frame) needed to bounce
      if (s.airY >= floorTop) {
        s.airY = floorTop;
        if (s.velY > MIN_BOUNCE_VY) {
          // Bounce — reflect Y, dampen both axes
          s.velY = -s.velY * FLOOR_BOUNCE;
          s.velX =  s.velX * FLOOR_BOUNCE;
          this._wrapEl.style.left = s.airX + 'px';
          this._wrapEl.style.top  = s.airY + 'px';
        } else {
          // Not enough energy — come to rest
          this._wrapEl.style.left = s.airX + 'px';
          this._wrapEl.style.top  = s.airY + 'px';
          this._landPet(s.airX);
        }
      } else {
        this._wrapEl.style.left = s.airX + 'px';
        this._wrapEl.style.top  = s.airY + 'px';
      }

      this._rafId = requestAnimationFrame(this._tick);
      return;
    }

    /* ── Normal movement — throttled to STEP_MS ── */
    if (ts - s.lastStepTime < STEP_MS) {
      this._rafId = requestAnimationFrame(this._tick);
      return;
    }
    s.lastStepTime = ts;

    var spriteW = c.spriteW * c.scale;

    var WRAP_MARGIN = spriteW * 1.5;

    var parentEl    = this._wrapEl.parentElement;
    var parentRect  = parentEl
      ? parentEl.getBoundingClientRect()
      : { left: 0, width: window.innerWidth };
    var parentW     = parentRect.width;
    var wrapRect    = this._wrapEl.getBoundingClientRect();

    var x = s.x;
    var targetX;

    /* ── Cursor-fear (rats and fearCursor animals) ── */
    if (c.fearCursor && this._hasRealPointer && !s.isDragged) {
      // Lazy pets have a much smaller personal-space bubble and can't be bothered to sprint
      var FEAR_RADIUS  = c.lazy ? 60 : 180;
      var FEAR_MARGIN  = 20;
      var cx_f = wrapRect.left + wrapRect.width  / 2;
      var cy_f = wrapRect.top  + wrapRect.height / 2;
      var mouseDist = Math.hypot(this._mouseX - cx_f, this._mouseY - cy_f);

      if (mouseDist < FEAR_RADIUS) {
        // Lazy pets only bother 40% of the time — otherwise they just sit there
        if (c.lazy && Math.random() < 0.6) {
          // Can't be bothered. Clear flee state and carry on.
          s.fleeTargetX = null;
          s.fleeUntil   = 0;
          // fall through to normal movement below
        } else {
          // Pick a flee target away from the cursor, re-evaluate when we've reached
          // the current target OR when the timer expires (longer timer so the pet
          // commits to running off-screen rather than recalculating mid-way).
          var needsNewFlee = s.fleeTargetX === null ||
            (ts >= s.fleeUntil && Math.abs(s.fleeTargetX - x) < 48);

          if (needsNewFlee) {
            // Flee direction = opposite of cursor relative to pet centre
            var fleeDir = (cx_f >= this._mouseX) ? 1 : -1;
            // Lazy pets shuffle a short distance; others bolt far enough to leave the screen
            var fleeDist = c.lazy
              ? FEAR_RADIUS * 0.5 + Math.random() * parentW * 0.1
              : parentW * 0.6 + Math.random() * parentW * 0.4;
            // Allow the flee target to go off-screen so wrapping can fire
            s.fleeTargetX = x + fleeDir * fleeDist;
            // Long enough timer that the pet won't recalculate before crossing the edge
            s.fleeUntil = ts + 1500 + Math.random() * 500;
            // Lazy pets shuffle at walk speed; others always sprint
            if (c.lazy) {
              var walkAction = c.movementActions[0];
              s.movementAction    = walkAction ? walkAction.name : s.movementAction;
              s.movementSpeedMult = walkAction ? walkAction.speedMultiplier : s.movementSpeedMult;
            } else {
              var runAction = c.movementActions[c.movementActions.length - 1];
              s.movementAction    = runAction ? runAction.name : s.movementAction;
              s.movementSpeedMult = runAction ? runAction.speedMultiplier : s.movementSpeedMult;
            }
          }

          // Suppress cursor-fear if an attracted object (e.g. cheese for rats) is
          // very close — hunger wins over fear at short range.
          var SNATCH_RADIUS = 80;
          var suppressFear  = false;
          for (var sf_i = 0; sf_i < _allEntities.length; sf_i++) {
            var sf_e = _allEntities[sf_i];
            if (!(sf_e instanceof WebBall)) continue;
            var sf_a = sf_e._cfg.attractsAnimals;
            if (sf_a.length === 0 || sf_a.indexOf(c.animal) === -1) continue;
            var sf_r = sf_e._wrapEl.getBoundingClientRect();
            var sf_cx = sf_r.left + sf_r.width  / 2;
            var sf_cy = sf_r.top  + sf_r.height / 2;
            if (Math.hypot(sf_cx - cx_f, sf_cy - cy_f) < SNATCH_RADIUS) {
              suppressFear = true;
              break;
            }
          }
          if (suppressFear) {
            s.fleeTargetX = null;
            s.fleeUntil   = 0;
            // fall through to normal chase logic below
          } else {
          // Use the flee target instead of normal targeting
          var fleeDiffX  = s.fleeTargetX - x;
          var fleeDistX  = Math.abs(fleeDiffX) || 0.0001;
          if (Math.abs(fleeDiffX) > 0.5) s.facingDir = fleeDiffX < 0 ? -1 : 1;
          // Lazy pets shuffle at normal pace; others bolt at 1.6×
          var fleeSpeedMult = c.lazy ? 0.9 : 1.6;
          x += (fleeDiffX / fleeDistX) * c.speed * s.movementSpeedMult * fleeSpeedMult;
          // Apply wrap instead of clamping — same logic as normal pathing
          if (x < -WRAP_MARGIN) {
            x += parentW + WRAP_MARGIN * 2;
            if (s.fleeTargetX !== null) s.fleeTargetX += parentW + WRAP_MARGIN * 2;
          } else if (x > parentW + WRAP_MARGIN) {
            x -= parentW + WRAP_MARGIN * 2;
            if (s.fleeTargetX !== null) s.fleeTargetX -= parentW + WRAP_MARGIN * 2;
          }
          s.x = x;
          // Only non-lazy pets panic-bounce
          if (!c.lazy) {
            s.jumpPhase = (s.jumpPhase || 0) + 1.2;
            this._wrapEl.style.bottom = (Math.abs(Math.sin(s.jumpPhase)) * 6) + 'px';
          }
          s.idleAction      = c.idleActions[0] ? c.idleActions[0].name : 'idle';
          s.idleActionUntil = 0;
          this._setGif(s.movementAction);
          this._applyFacing();
          this._wrapEl.style.left = (x - spriteW / 2) + 'px';
          this._syncGhost(x, x - spriteW / 2, parentW);
          this._rafId = requestAnimationFrame(this._tick);
          return;
          } // end !suppressFear
        }
      } else {
        // Outside fear radius — clear flee state
        s.fleeTargetX = null;
        s.fleeUntil   = 0;
      }
    }

    /* ── Peer-fear: flee from nearby animals that are bigger/scarier ── */
    if (c.fearOthers && !s.isDragged) {
      var BASE_PEER_RADIUS = 120; // px baseline; scales up with size difference
      var mySize = c.fearSize;
      var worstThreat  = null;
      var worstThreatX = 0;
      var worstScore   = 0;

      for (var pi = 0; pi < _allEntities.length; pi++) {
        var peer = _allEntities[pi];
        if (peer === this) continue;
        if (peer instanceof WebBall) continue; // balls are objects, not threats
        var peerSize = peer._cfg.fearSize != null ? peer._cfg.fearSize : 3;
        var sizeDiff = peerSize - mySize;
        if (sizeDiff <= 0) continue; // only scared of bigger animals

        var peerRect = peer._wrapEl.getBoundingClientRect();
        var peerCX   = peerRect.left + peerRect.width  / 2;
        var peerCY   = peerRect.top  + peerRect.height / 2;
        var myCX     = wrapRect.left + wrapRect.width  / 2;
        var myCY     = wrapRect.top  + wrapRect.height / 2;
        var peerDist = Math.hypot(peerCX - myCX, peerCY - myCY);
        // Radius grows linearly with size difference; dino(9) vs rat(1)=8 → 240px+120 = 360px
        var triggerRadius = BASE_PEER_RADIUS + sizeDiff * 30;
        if (peerDist > triggerRadius) continue;

        var score = sizeDiff * (1 - peerDist / triggerRadius); // 0–8, higher = scarier
        if (score > worstScore) {
          worstScore   = score;
          worstThreat  = peer;
          worstThreatX = peerCX;
        }
      }

      if (worstThreat !== null) {
        // Lazy pets only react 30% of the time — can't be bothered
        if (c.lazy && Math.random() < 0.70) {
          // shrug — fall through to normal movement
        } else {
          // Use dedicated peer-flee state so cursor-fear can't clobber it
          var peerNeedsNewFlee = s.peerFleeTargetX === null ||
            (ts >= s.peerFleeUntil && Math.abs(s.peerFleeTargetX - x) < 48);

          if (peerNeedsNewFlee) {
            var peerFleeDir  = (wrapRect.left + wrapRect.width / 2) >= worstThreatX ? 1 : -1;
            var peerFleeDist = parentW * 0.5 + worstScore * parentW * 0.06;
            // Allow target off-screen so wrapping fires
            s.peerFleeTargetX = x + peerFleeDir * peerFleeDist;
            s.peerFleeUntil   = ts + 1500 + Math.random() * 500;

            // Sprint chance scales with size difference
            var sizeDiff3    = worstThreat._cfg.fearSize - mySize;
            var sprintChance = Math.min(1, sizeDiff3 / 5);
            if (!c.lazy && Math.random() < sprintChance) {
              var sprintAct = c.movementActions[c.movementActions.length - 1];
              s.movementAction    = sprintAct ? sprintAct.name : s.movementAction;
              s.movementSpeedMult = sprintAct ? sprintAct.speedMultiplier : s.movementSpeedMult;
            } else {
              var trotAct = c.movementActions[Math.floor(c.movementActions.length / 2)];
              s.movementAction    = trotAct ? trotAct.name : s.movementAction;
              s.movementSpeedMult = trotAct ? trotAct.speedMultiplier : s.movementSpeedMult;
            }
          }

          var pFleeDiffX = s.peerFleeTargetX - x;
          var pFleeDistX = Math.abs(pFleeDiffX) || 0.0001;
          if (Math.abs(pFleeDiffX) > 0.5) s.facingDir = pFleeDiffX < 0 ? -1 : 1;
          var pFleeSpeedMult = c.lazy ? 0.9 : 1.4;
          x += (pFleeDiffX / pFleeDistX) * c.speed * s.movementSpeedMult * pFleeSpeedMult;
          // Apply wrap instead of clamping
          if (x < -WRAP_MARGIN) {
            x += parentW + WRAP_MARGIN * 2;
            if (s.peerFleeTargetX !== null) s.peerFleeTargetX += parentW + WRAP_MARGIN * 2;
          } else if (x > parentW + WRAP_MARGIN) {
            x -= parentW + WRAP_MARGIN * 2;
            if (s.peerFleeTargetX !== null) s.peerFleeTargetX -= parentW + WRAP_MARGIN * 2;
          }
          s.x = x;
          if (!c.lazy) {
            s.jumpPhase = (s.jumpPhase || 0) + 0.9;
            this._wrapEl.style.bottom = (Math.abs(Math.sin(s.jumpPhase)) * 4) + 'px';
          }
          s.idleAction      = c.idleActions[0] ? c.idleActions[0].name : 'idle';
          s.idleActionUntil = 0;
          this._setGif(s.movementAction);
          this._applyFacing();
          this._wrapEl.style.left = (x - spriteW / 2) + 'px';
          this._syncGhost(x, x - spriteW / 2, parentW);
          this._rafId = requestAnimationFrame(this._tick);
          return;
        }
      }
    }

    // Auto-targeting: resolve which WebBall (if any) this pet should chase this tick.
    // Attracted targets (e.g. cheese → rat) are re-evaluated every tick so they can
    // override a previously latched generic target and react to new balls appearing.
    // Generic chasers (chasesObjects) still latch permanently via c.followEntity.
    var followTarget = null;

    // First: check for an attracted object — these always win over generic chasing.
    for (var ei = 0; ei < _allEntities.length; ei++) {
      var candidate = _allEntities[ei];
      if (!(candidate instanceof WebBall)) continue;
      var attracts = candidate._cfg.attractsAnimals;
      if (attracts.length > 0 && attracts.indexOf(c.animal) !== -1) {
        followTarget = candidate;
        break;
      }
    }

    // Second: fall back to the permanent generic-chaser latch (chasesObjects).
    if (!followTarget) {
      if (!c.followEntity) {
        for (var ei2 = 0; ei2 < _allEntities.length; ei2++) {
          var cand2 = _allEntities[ei2];
          if (!(cand2 instanceof WebBall)) continue;
          if (c.chasesObjects && cand2._cfg.attractsAnimals.length === 0) {
            c.followEntity = cand2.name;
            break;
          }
        }
      }
      followTarget = c.followEntity ? _resolveEntity(c.followEntity) : null;
    }

    // If the follow target is a WebBall that has nearly stopped, start a countdown
    // before losing interest. Duration scales with distraction: focused pets stay
    // longer (up to ~15 s), scatterbrained pets wander off sooner (~2 s).
    // Exception: if this ball specifically attracts this animal (e.g. cheese → rat),
    // the pet is ALWAYS interested when the cheese is grounded — they'll nibble on it.
    // The countdown resets whenever the ball starts moving again.
    if (followTarget && followTarget instanceof WebBall) {
      var bs = followTarget._state;
      var ballSpeed = Math.sqrt(bs.velX * bs.velX + bs.velY * bs.velY);
      var BALL_INTEREST_THRESHOLD = 1.5; // px/frame — below this the ball is "at rest"
      // Cheese (and other attracted-object) targets: never lose interest while grounded.
      var isAttractedTarget = followTarget._cfg.attractsAnimals.indexOf(c.animal) !== -1;
      // Less-distracted pets stay focused for longer. distraction=0 → 15 s, distraction=0.08+ → 2 s.
      var BALL_LOSE_INTEREST_MS = 2000 + (1 - Math.min(c.distraction, 0.08) / 0.08) * 13000;
      if (bs.isDragged || ballSpeed >= BALL_INTEREST_THRESHOLD) {
        // Ball is moving (or being held) — reset the countdown.
        // Also clear the nibble-distraction lock so the rat can react (flee/chase) normally.
        s.ballLostInterestAt = null;
        if (isAttractedTarget && s.distractionUntil > ts + 5000) {
          s.distractionUntil = 0; // unlock from nibble suppression
        }
      } else if (isAttractedTarget) {
        // Attracted target (e.g. cheese for rats) is at rest — always stay interested, never drop it.
        s.ballLostInterestAt = null;
      } else {
        // Generic ball is still — start the countdown if not already started
        if (s.ballLostInterestAt === null) {
          s.ballLostInterestAt = ts;
        } else if (ts - s.ballLostInterestAt >= BALL_LOSE_INTEREST_MS) {
          // Countdown elapsed — drop the target for this tick
          followTarget = null;
        }
      }
    }

    if (followTarget) {
      if (c.distraction > 0 && ts < s.distractionUntil && s.distractionTargetX !== null) {
        // Temporarily distracted — wander to a nearby spot, ignore the target
        targetX = s.distractionTargetX;
      } else {
        s.distractionTargetX = null; // distraction expired, back to following
        var ftRect = followTarget._wrapEl.getBoundingClientRect();
        targetX = ftRect.left + ftRect.width / 2 - parentRect.left;
      }
    } else if (ts < s.movementPauseUntil) {
      targetX = x;
    } else {
      if (s.movementTargetX === null) {
        this._pickMovementAction();
        this._pickMovementTarget(x, parentW);
      }
      targetX = s.movementTargetX !== null ? s.movementTargetX : x;
    }

    var diffX = targetX - x;
    var distX = Math.abs(diffX) || 0.0001;
    var idle  = distX < c.idleDist;

    // Face the direction of travel
    if (Math.abs(diffX) > 0.5) {
      s.facingDir = diffX < 0 ? -1 : 1;
    }

    // Hover detection (distance from mouse to sprite centre)
    var cx = wrapRect.left + wrapRect.width  / 2;
    var cy = wrapRect.top  + wrapRect.height / 2;
    var distToMouse = Math.hypot(this._mouseX - cx, this._mouseY - cy);

    // If a distraction is already running, skip hover entirely so the pet can
    // actually walk away to its distractionTargetX.  Without this guard the hover
    // branch fires every tick (mouse hasn't moved) and the pet never moves.
    var isDistracted = followTarget !== null && c.distraction > 0 &&
                       ts < s.distractionUntil && s.distractionTargetX !== null;

    if (this._hasRealPointer && distToMouse <= c.hoverDist && !isDistracted) {
      /* ── Hover state ── */
      // Reset jump / wobble when transitioning to hover
      if (c.jumpAmp  > 0) { s.jumpPhase  = 0; this._wrapEl.style.bottom = '0px'; }
      if (c.wobbleDeg > 0) { s.wobblePhase = 0; }
      this._setGif(c.hoverAction);
      this._applyFacing();
      this._showBubble(true);
      this._hideGhost();

      // Pets doing the swipe/hover animation right next to the mouse are easily
      // over-stimulated — boost distraction chance 5× while in hover range.
      if (followTarget && c.distraction > 0 && ts >= s.distractionUntil && Math.random() < c.distraction * 5) {
        var hDist   = parentW * 0.1 + Math.random() * parentW * 0.25;
        var hDir    = Math.random() < 0.5 ? -1 : 1;
        s.distractionTargetX = x + hDir * hDist; // no clamp — wrap handles edges
        s.distractionUntil   = ts + 1000 + Math.random() * 2000;
        this._pickMovementAction();
      }

    } else {
      this._showBubble(false);

      if (idle) {
        /* ── Idle state ── */
        // Reset jump / wobble when transitioning to idle
        if (c.jumpAmp  > 0) { s.jumpPhase  = 0; this._wrapEl.style.bottom = '0px'; }
        if (c.wobbleDeg > 0) { s.wobblePhase = 0; this._applyFacing(); }
        if (!followTarget) {
          if (s.movementTargetX !== null) {
            s.movementTargetX = null;
            this._scheduleMovementPause(ts);
          }
        }

        // ── Nibbling: if next to a grounded attracted target (e.g. cheese for rats),
        //    play the swipe/nibble animation and suppress distraction so they stay put.
        if (followTarget && followTarget instanceof WebBall) {
          var nb_bs = followTarget._state;
          var nb_ballSpeed = Math.sqrt(nb_bs.velX * nb_bs.velX + nb_bs.velY * nb_bs.velY);
          var nb_isGrounded = !nb_bs.isDragged && nb_ballSpeed < 1.5;
          var nb_isAttracted = followTarget._cfg.attractsAnimals.indexOf(c.animal) !== -1;
          if (nb_isGrounded && nb_isAttracted) {
            // Use the swipe idle action — it looks like an excited nibble/paw motion
            var nibbleAction = c.idleActions.length > 1 ? c.idleActions[1].name : c.idleActions[0].name;
            this._setGif(nibbleAction);
            this._applyFacing();
            this._hideGhost();
            // Suppress distraction so the rat doesn't wander away mid-nibble
            s.distractionUntil = ts + 9999999;
            this._rafId = requestAnimationFrame(this._tick);
            return;
          }
        }

        if (ts > s.idleCooldownUntil && ts > s.idleActionUntil) {
          this._pickIdleAction(ts);
        }
        this._setGif(s.idleAction);
        this._applyFacing();
        this._hideGhost();

      } else {
        /* ── Moving state ── */

        // Randomly flip direction mid-walk (flipChance / nervous)
        if (c.flipChance > 0 && s.movementTargetX !== null && Math.random() < c.flipChance) {
          var flipped = x - (s.movementTargetX - x);
          s.movementTargetX = flipped; // allow off-screen targets so wrapping can fire
        }

        // Distraction — abandon current target and pick a completely new one.
        // In free-roam mode, replaces movementTargetX directly.
        // In followEntity mode, sets a temporary distractionTargetX the pet wanders to before snapping back.
        if (c.distraction > 0 && Math.random() < c.distraction) {
          if (followTarget) {
            if (ts >= s.distractionUntil) {
              // Start a new distraction: pick a nearby random spot and a duration of 1–3 s
              var dDist   = parentW * 0.1 + Math.random() * parentW * 0.25;
              var dDir    = Math.random() < 0.5 ? -1 : 1;
              s.distractionTargetX = x + dDir * dDist; // no clamp — wrap handles edges
              s.distractionUntil   = ts + 1000 + Math.random() * 2000;
              this._pickMovementAction();
            }
          } else if (s.movementTargetX !== null) {
            this._pickMovementAction();
            this._pickMovementTarget(x, parentW);
          }
        }

        x += (diffX / distX) * c.speed * s.movementSpeedMult;

        // Seamless edge wrapping (only during pathing, not while dragged/falling).
        // When the pet walks fully off one edge, we teleport its logical x to the
        // opposite edge — but because the ghost has been shadowing it from there,
        // the visual transition is invisible to the viewer.
        if (x < -WRAP_MARGIN) {
          x += parentW + WRAP_MARGIN * 2;
          // Re-align movementTargetX to the new coordinate space so the pet
          // continues walking toward the same visual destination.
          if (s.movementTargetX !== null) s.movementTargetX += parentW + WRAP_MARGIN * 2;
          if (s.distractionTargetX !== null) s.distractionTargetX += parentW + WRAP_MARGIN * 2;
          if (s.fleeTargetX        !== null) s.fleeTargetX        += parentW + WRAP_MARGIN * 2;
          if (s.peerFleeTargetX    !== null) s.peerFleeTargetX    += parentW + WRAP_MARGIN * 2;
        } else if (x > parentW + WRAP_MARGIN) {
          x -= parentW + WRAP_MARGIN * 2;
          if (s.movementTargetX !== null) s.movementTargetX -= parentW + WRAP_MARGIN * 2;
          if (s.distractionTargetX !== null) s.distractionTargetX -= parentW + WRAP_MARGIN * 2;
          if (s.fleeTargetX        !== null) s.fleeTargetX        -= parentW + WRAP_MARGIN * 2;
          if (s.peerFleeTargetX    !== null) s.peerFleeTargetX    -= parentW + WRAP_MARGIN * 2;
        }

        s.x = x;

        // Vertical bounce (jumpy)
        if (c.jumpAmp > 0) {
          s.jumpPhase += 0.85;
          this._wrapEl.style.bottom = (Math.abs(Math.sin(s.jumpPhase)) * c.jumpAmp) + 'px';
        }

        // Rotation wobble (wobble)
        var wobbleRot = 0;
        if (c.wobbleDeg > 0) {
          s.wobblePhase += 0.55;
          wobbleRot = Math.sin(s.wobblePhase) * c.wobbleDeg;
        }

        if (!followTarget && s.movementTargetX !== null && distX <= c.idleDist) {
          s.movementTargetX = null;
          this._scheduleMovementPause(ts);
        }

        // Reset idle timer while moving
        if (c.idleActions.length > 0) s.idleAction = c.idleActions[0].name;
        s.idleActionUntil  = 0;
        s.idleCooldownUntil = 0;

        this._setGif(s.movementAction);
        this._applyTransforms(wobbleRot);
      }
    }

    this._wrapEl.style.left = (x - spriteW / 2) + 'px';
    // Keep ghost in sync for seamless edge wrapping
    this._syncGhost(x, x - spriteW / 2, parentW);
    this._rafId = requestAnimationFrame(this._tick);
  };

  /* ── WebBall variants catalog ───────────────────────────────────────── */

  /**
   * Each entry defines one throwable object variant.
   *   asset        — filename under mediaBase (no path prefix, no leading slash)
   *   attractsAnimals — animal IDs that will auto-chase this object even without
   *                  chasesObjects:true on their species. Empty = any chasesObjects pet.
   */
  var BALL_VARIANTS = {
    ball: {
      asset:          'ball.png',
      attractsAnimals: [],          // generic — any chasesObjects pet will chase it
    },
    cheese: {
      asset:          'cheese.png',
      attractsAnimals: ['rat'],     // rats specifically seek out cheese
    },
  };

  /* ── WebBall — a physics ball that pets can chase ────────────────────── */

  function WebBall(options) {
    options = options || {};

    _entityCounts['ball'] = (_entityCounts['ball'] || 0) + 1;
    var ballName = options.name || ('ball-' + _entityCounts['ball']);
    this.name    = ballName;

    var mediaBase   = options.mediaBase || _defaultMediaBase;
    var scale       = options.scale   != null ? +options.scale   : 0.5;
    var zIndex      = options.zIndex  != null ? +options.zIndex  : 9999999998;
    var position    = options.position || 'fixed';
    var variantId   = (options.variant && BALL_VARIANTS[options.variant]) ? options.variant : 'ball';
    var variantSpec = BALL_VARIANTS[variantId];
    var spriteW     = 64;
    var spriteH     = 64;
    var selectThrough = options.selectThrough ? true : false;

    this._cfg = {
      name:            ballName,
      mediaBase:       mediaBase,
      scale:           scale,
      position:        position,
      zIndex:          zIndex,
      spriteW:         spriteW,
      spriteH:         spriteH,
      variant:         variantId,
      asset:           variantSpec.asset,
      attractsAnimals: variantSpec.attractsAnimals,
      selectThrough:   selectThrough,
    };

    var ballW     = spriteW * scale;
    var ballH     = spriteH * scale;
    var spawnMaxX = window.innerWidth  - ballW;
    var spawnMaxY = window.innerHeight - ballH;
    var spawnX = Math.max(0, window.innerWidth  * 0.3 + Math.random() * window.innerWidth  * 0.4);
    var spawnY = Math.max(0, window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.3);
    spawnX = Math.min(spawnX, spawnMaxX);
    spawnY = Math.min(spawnY, spawnMaxY);

    this._state = {
      airX:        spawnX,
      airY:        spawnY,
      velX:        (Math.random() - 0.5) * 4,
      velY:        0,
      isFalling:   true,
      isDragged:   false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      rotation:    0,
      angularVel:  0,
    };

    this._mouseVX        = null;
    this._mouseVY        = null;
    this._lastMoveTime   = null;
    this._lastPointerX   = null;
    this._lastPointerY   = null;
    this._rafId          = null;
    this._blobCache      = {};
    this._prevUserSelect = '';
    this._onSelectStart  = null;

    this._onDragStart = this._onDragStart.bind(this);
    this._onDragMove  = this._onDragMove.bind(this);
    this._onDragEnd   = this._onDragEnd.bind(this);
    this._tick        = this._tick.bind(this);

    _allEntities.push(this);
    this._buildDOM();
    this._start();
  }

  WebBall.prototype._buildDOM = function () {
    var c  = this._cfg;
    var w  = c.spriteW * c.scale;
    var h  = c.spriteH * c.scale;
    var s  = this._state;

    var wrap = document.createElement('div');
    wrap.style.cssText = [
      'position:'   + c.position,
      'left:'       + s.airX + 'px',
      'top:'        + s.airY + 'px',
      'bottom:auto',
      'width:'      + w + 'px',
      'height:'     + h + 'px',
      'z-index:'    + c.zIndex,
      // selectThrough: pointer-events off so clicks pass through to elements below;
      // dragging is handled via the document-level _onDocMouseDown listener instead.
      c.selectThrough ? 'pointer-events:none' : 'pointer-events:auto',
      c.selectThrough ? '' : 'cursor:grab',
      'user-select:none',
    ].filter(Boolean).join(';');
    this._wrapEl = wrap;

    var img = document.createElement('img');
    img.style.cssText = [
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'image-rendering:pixelated',
      'image-rendering:crisp-edges',
      'transform-origin:center center',
    ].join(';');
    img.draggable = false;
    this._imgEl = img;
    wrap.appendChild(img);

    // Load via the same fetch/cache/blob pipeline as pet GIFs
    this._loadImg();

    document.body.appendChild(wrap);
  };

  WebBall.prototype._loadImg = async function () {
    var c   = this._cfg;
    var url = c.mediaBase + '/' + c.asset;
    if (this._blobCache[url]) { this._imgEl.src = this._blobCache[url]; return; }
    try {
      var cache    = await caches.open(CACHE);
      var response = await cache.match(url);
      if (!response || !response.ok) {
        if (response) await cache.delete(url); // evict any bad cached response
        response = await fetch(url);
        if (!response.ok) throw new Error('HTTP ' + response.status + ' fetching ' + url);
        await cache.put(url, response.clone());
      }
      var blobUrl = URL.createObjectURL(await response.blob());
      this._blobCache[url] = blobUrl;
      this._imgEl.src = blobUrl;
    } catch (e) {
      console.error('[WebBall] failed to load asset:', url, e);
      this._imgEl.src = url; // fallback to direct URL
    }
  };

  WebBall.prototype._start = function () {
    if (this._cfg.selectThrough) {
      // selectThrough: the wrap has pointer-events:none so it won't receive events.
      // Instead we listen on the document and manually hit-test against our rect.
      this._onDocMouseDown = this._onDocMouseDown.bind(this);
      this._onDocTouchStart = this._onDocTouchStart.bind(this);
      document.addEventListener('mousedown',  this._onDocMouseDown);
      document.addEventListener('touchstart', this._onDocTouchStart, { passive: false });
    } else {
      this._wrapEl.addEventListener('mousedown',  this._onDragStart);
      this._wrapEl.addEventListener('touchstart', this._onDragStart, { passive: false });
    }
    document.addEventListener('mousemove',  this._onDragMove);
    document.addEventListener('mouseup',    this._onDragEnd);
    document.addEventListener('touchmove',  this._onDragMove,  { passive: false });
    document.addEventListener('touchend',   this._onDragEnd);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._rafId = requestAnimationFrame(this._tick);
    }
  };

  WebBall.prototype._onDocMouseDown = function (e) {
    if (e.button !== 0) return;
    var p    = this._pointerCoords(e);
    var rect = this._wrapEl.getBoundingClientRect();
    if (p.clientX >= rect.left && p.clientX <= rect.right &&
        p.clientY >= rect.top  && p.clientY <= rect.bottom) {
      this._onDragStart(e);
    }
  };

  WebBall.prototype._onDocTouchStart = function (e) {
    var p    = this._pointerCoords(e);
    var rect = this._wrapEl.getBoundingClientRect();
    if (p.clientX >= rect.left && p.clientX <= rect.right &&
        p.clientY >= rect.top  && p.clientY <= rect.bottom) {
      this._onDragStart(e);
    }
  };

  WebBall.prototype._tick = function () {
    var s = this._state;
    var c = this._cfg;

    try {
      if (s.isDragged) {
        this._rafId = requestAnimationFrame(this._tick);
        return;
      }

      var GRAVITY      = 0.5;
      var BOUNCE_FLOOR = 0.55;
      var BOUNCE_WALL  = 0.45;
      var MIN_BOUNCE   = 2.5;
      var MAX_FALL     = 30;
      // Degrees per pixel of horizontal travel (tune to taste)
      var ROT_RATE     = 1.8;
      // Angular damping per frame
      var ANG_DAMP     = 0.98;

      var w         = c.spriteW * c.scale;
      var h         = c.spriteH * c.scale;
      var vw        = window.innerWidth;
      var vh        = window.innerHeight;
      var floor     = vh - h;
      var rightEdge = vw - w;

      // Always apply gravity
      s.velY = Math.min(s.velY + GRAVITY, MAX_FALL);

      s.airX += s.velX;
      s.airY += s.velY;

      // --- Rotation ---
      // Angular velocity tracks horizontal movement
      s.angularVel = s.velX * ROT_RATE;

      // Left/right walls
      if (s.airX <= 0) {
        s.airX = 0;
        s.velX = Math.abs(s.velX) * BOUNCE_WALL;
        s.angularVel = -s.angularVel * BOUNCE_WALL;
      } else if (s.airX >= rightEdge) {
        s.airX = rightEdge;
        s.velX = -Math.abs(s.velX) * BOUNCE_WALL;
        s.angularVel = -s.angularVel * BOUNCE_WALL;
      }

      // Ceiling
      if (s.airY <= 0) {
        s.airY = 0;
        s.velY = Math.abs(s.velY) * BOUNCE_WALL;
      }

      // Floor
      if (s.airY >= floor) {
        s.airY = floor;
        if (s.velY > MIN_BOUNCE) {
          s.velY = -s.velY * BOUNCE_FLOOR;
          s.velX =  s.velX * BOUNCE_FLOOR;
          s.angularVel = s.velX * ROT_RATE;
        } else {
          s.velY = 0;
          // Rolling friction when on floor
          s.velX *= 0.985;
          if (Math.abs(s.velX) < 0.3) s.velX = 0;
          s.angularVel *= ANG_DAMP;
          if (Math.abs(s.angularVel) < 0.1) s.angularVel = 0;
        }
      }

      s.rotation += s.angularVel;

      this._wrapEl.style.left = s.airX + 'px';
      this._wrapEl.style.top  = s.airY + 'px';
      this._imgEl.style.transform = 'rotate(' + s.rotation.toFixed(2) + 'deg)';
    } catch (e) {
      console.error('[WebBall] tick error:', e);
    }

    this._rafId = requestAnimationFrame(this._tick);
  };

  WebBall.prototype._pointerCoords = function (e) {
    if (e.touches && e.touches.length) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  WebBall.prototype._onDragStart = function (e) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    e.preventDefault();

    var p    = this._pointerCoords(e);
    var rect = this._wrapEl.getBoundingClientRect();
    var s    = this._state;

    s.isDragged    = true;
    s.velX         = 0;
    s.velY         = 0;
    s.angularVel   = 0;
    s.dragOffsetX  = rect.left - p.clientX;
    s.dragOffsetY  = rect.top  - p.clientY;

    this._onSelectStart = function (ev) { ev.preventDefault(); };
    document.addEventListener('selectstart', this._onSelectStart);
    this._prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    this._wrapEl.style.cursor = 'grabbing';
    this._mouseVX      = null;
    this._mouseVY      = null;
    this._lastPointerX = p.clientX;
    this._lastPointerY = p.clientY;
    this._lastMoveTime = performance.now();
  };

  WebBall.prototype._onDragMove = function (e) {
    if (!this._state.isDragged) return;
    if (e.type === 'touchmove') e.preventDefault();

    var p  = this._pointerCoords(e);
    var s  = this._state;
    var c  = this._cfg;
    var w  = c.spriteW * c.scale;
    var h  = c.spriteH * c.scale;

    var newLeft = p.clientX + s.dragOffsetX;
    var newTop  = p.clientY + s.dragOffsetY;

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    newLeft = Math.max(0, Math.min(newLeft, vw - w));
    newTop  = Math.max(0, Math.min(newTop,  vh - h));

    this._wrapEl.style.left = newLeft + 'px';
    this._wrapEl.style.top  = newTop  + 'px';

    s.airX = newLeft;
    s.airY = newTop;

    var now2 = performance.now();
    var dt2  = now2 - (this._lastMoveTime || now2);
    if (dt2 > 0 && dt2 < 100 && this._lastPointerX != null) {
      var rawVX2 = (p.clientX - this._lastPointerX) / dt2;
      var rawVY2 = (p.clientY - this._lastPointerY) / dt2;
      this._mouseVX = this._mouseVX == null ? rawVX2 : this._mouseVX * 0.6 + rawVX2 * 0.4;
      this._mouseVY = this._mouseVY == null ? rawVY2 : this._mouseVY * 0.6 + rawVY2 * 0.4;
    }
    this._lastMoveTime = now2;
    this._lastPointerX = p.clientX;
    this._lastPointerY = p.clientY;
  };

  WebBall.prototype._onDragEnd = function (e) {
    if (!this._state.isDragged) return;

    var s = this._state;
    s.isDragged = false;
    this._wrapEl.style.cursor = 'grab';

    if (this._onSelectStart) {
      document.removeEventListener('selectstart', this._onSelectStart);
      this._onSelectStart = null;
    }
    document.body.style.userSelect = this._prevUserSelect || '';

    var SCALE  = 1.2 * 16.67;
    var MAX_V  = 40;
    var velPxMsX = (this._mouseVX != null && isFinite(this._mouseVX)) ? this._mouseVX : 0;
    var velPxMsY = (this._mouseVY != null && isFinite(this._mouseVY)) ? this._mouseVY : 0;
    s.isFalling = true;
    s.velX = Math.max(-MAX_V, Math.min(velPxMsX * SCALE, MAX_V));
    s.velY = Math.max(-MAX_V, Math.min(velPxMsY * SCALE, MAX_V));

    this._mouseVX = null;
    this._mouseVY = null;
  };

  WebBall.prototype.destroy = function () {
    var idx = _allEntities.indexOf(this);
    if (idx !== -1) _allEntities.splice(idx, 1);
    if (this._rafId) cancelAnimationFrame(this._rafId);
    document.removeEventListener('mousemove', this._onDragMove);
    document.removeEventListener('mouseup',   this._onDragEnd);
    document.removeEventListener('touchmove', this._onDragMove);
    document.removeEventListener('touchend',  this._onDragEnd);
    if (this._cfg.selectThrough) {
      document.removeEventListener('mousedown',  this._onDocMouseDown);
      document.removeEventListener('touchstart', this._onDocTouchStart);
    }
    if (this._onSelectStart) {
      document.removeEventListener('selectstart', this._onSelectStart);
      this._onSelectStart = null;
    }
    document.body.style.userSelect = this._prevUserSelect || '';
    if (this._wrapEl) {
      this._wrapEl.removeEventListener('mousedown',  this._onDragStart);
      this._wrapEl.removeEventListener('touchstart', this._onDragStart);
    }
    if (this._wrapEl && this._wrapEl.parentNode) {
      this._wrapEl.parentNode.removeChild(this._wrapEl);
    }
  };

  /* ── Public API ──────────────────────────────────────────────────────── */

  /** Stop animation and remove the pet from the DOM. */
  WebPet.prototype.destroy = function () {
    var idx = _allEntities.indexOf(this);
    if (idx !== -1) _allEntities.splice(idx, 1);
    if (this._rafId) cancelAnimationFrame(this._rafId);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mousemove', this._onDragMove);
    document.removeEventListener('mouseup',   this._onDragEnd);
    document.removeEventListener('touchmove', this._onDragMove);
    document.removeEventListener('touchend',  this._onDragEnd);
    if (this._onSelectStart) {
      document.removeEventListener('selectstart', this._onSelectStart);
      this._onSelectStart = null;
    }
    document.body.style.userSelect = this._prevUserSelect || '';
    if (this._wrapEl) {
      this._wrapEl.removeEventListener('mousedown',  this._onDragStart);
      this._wrapEl.removeEventListener('touchstart', this._onDragStart);
    }
    if (this._wrapEl && this._wrapEl.parentNode) {
      this._wrapEl.parentNode.removeChild(this._wrapEl);
    }
    if (this._ghostEl && this._ghostEl.parentNode) {
      this._ghostEl.parentNode.removeChild(this._ghostEl);
    }
  };

  /** Convenience factory. */
  WebPet.create = function (options) {
    return new WebPet(options);
  };

  /** Reference to the full catalog (read-only). */
  WebPet.ANIMALS = ANIMALS;

  /* ─────────────────────────────────────────────────────────────────────────
     Auto-init from <script data-animal="…"> attributes
  ───────────────────────────────────────────────────────────────────────── */
  function autoInit() {
    if (!_currentScript) return;
    var ds = _currentScript.dataset;
    if (!ds.animal) return;

    var opts = { animal: ds.animal };
    if (ds.color)        opts.color        = ds.color;
    if (ds.subcolor)     opts.subcolor     = ds.subcolor;
    if (ds.scale)        opts.scale        = parseFloat(ds.scale);
    if (ds.speed)        opts.speed        = parseFloat(ds.speed);
    if (ds.idleDist)     opts.idleDist     = parseFloat(ds.idleDist);
    if (ds.hoverDist)    opts.hoverDist    = parseFloat(ds.hoverDist);
    if (ds.hoverAction)  opts.hoverAction  = ds.hoverAction;
    if (ds.hoverMessage) opts.hoverMessage = ds.hoverMessage;
    if (ds.followEntity) opts.followEntity = ds.followEntity;  // string entity name
    if (ds.name)         opts.name         = ds.name;
    if (ds.position)     opts.position     = ds.position;
    if (ds.zIndex)       opts.zIndex       = parseInt(ds.zIndex, 10);
    if (ds.mediaBase)    opts.mediaBase    = ds.mediaBase;
    if (ds.jumpy)        opts.jumpy        = ds.jumpy === 'true' ? true : parseFloat(ds.jumpy);
    if (ds.wobble)       opts.wobble       = ds.wobble === 'true' ? true : parseFloat(ds.wobble);
    if (ds.flipChance)   opts.flipChance   = parseFloat(ds.flipChance);
    if (ds.nervous)      opts.nervous      = ds.nervous === 'true';
    if (ds.lazy)         opts.lazy         = ds.lazy === 'true';
    if (ds.distraction)  opts.distraction  = parseFloat(ds.distraction);
    if (ds.erratic)      opts.erratic      = ds.erratic === 'true';

    new WebPet(opts);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     Expose globally
  ───────────────────────────────────────────────────────────────────────── */
  global.WebPet  = WebPet;
  global.WebBall = WebBall;

}(window));
