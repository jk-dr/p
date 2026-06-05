/**
 * webpet.js — Standalone, zero-dependency web pets new
 *
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
      behaviour: { nervous: true, jumpy: 4, distraction: 0.05 },
    },
    clippy: {
      speed: 3.2, defaultColor: 'brown',
      colors: ['black', 'brown', 'green', 'yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Clippy is eager and wiggly — and constantly distracted
      behaviour: { wobble: 4, flipChance: 0.05, distraction: 0.04 },
    },
    cockatiel: {
      speed: 4.0, defaultColor: 'brown',
      colors: ['brown', 'gray'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Cockatiels are alert little birds — short bursts, slight hop
      behaviour: { nervous: true, jumpy: 3, distraction: 0.06 },
    },
    crab: {
      speed: 3.4, defaultColor: 'red',
      colors: ['red'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Crabs scuttle sideways and like to change direction
      behaviour: { flipChance: 0.12, distraction: 0.02 },
    },
    deno: {
      speed: 4.8, defaultColor: 'green',
      colors: ['green'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Deno is a speedy dino — bouncy and energetic
      behaviour: { jumpy: 6, distraction: 0.02 },
    },
    dog: {
      speed: 5.5, defaultColor: 'brown',
      colors: ['akita', 'black', 'brown', 'red', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Dogs are enthusiastic — they bound along, wag, and chase squirrels
      behaviour: { jumpy: 5, distraction: 0.06 },
    },
    fox: {
      speed: 5.2, defaultColor: 'red',
      colors: ['red', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Foxes are cunning — quick direction changes, light prance
      behaviour: { flipChance: 0.08, jumpy: 3, distraction: 0.03 },
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
    },
    mod: {
      speed: 4.0, defaultColor: 'purple',
      colors: ['purple'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Mod is a chill moderator — steady, slight swagger
      behaviour: { distraction: 0.02 },
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
    },
    morph: {
      speed: 4.0, defaultColor: 'purple',
      colors: ['purple'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Morph is a shapeshifter — wobbly, unpredictable, and easily distracted
      behaviour: { flipChance: 0.1, distraction: 0.05 },
    },
    panda: {
      speed: 3.6, defaultColor: 'black',
      colors: ['black', 'brown'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Pandas are famously lazy — long rests, slow gait
      behaviour: { lazy: true, distraction: 0.01 },
    },
    rat: {
      speed: 4.9, defaultColor: 'brown',
      colors: ['brown', 'gray', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Rats are skittish — erratic dashes, high flip chance
      behaviour: { nervous: true, flipChance: 0.18, distraction: 0.08 },
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
    },
    'rubber-duck': {
      speed: 3.0, defaultColor: 'yellow',
      colors: ['yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Rubber ducks bob up and down on water, drifting wherever
      behaviour: { jumpy: 4, wobble: 3, distraction: 0.05 },
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
    },
    snail: {
      speed: 1.4, defaultColor: 'brown',
      colors: ['brown'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Snails are the definition of lazy
      behaviour: { lazy: true, distraction: 0.01 },
    },
    snake: {
      speed: 3.7, defaultColor: 'green',
      colors: ['green'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Snakes slither with a sinuous wobble and occasional direction change
      behaviour: { flipChance: 0.07, distraction: 0.02 },
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
    },
    turtle: {
      speed: 2.2, defaultColor: 'green',
      colors: ['green', 'orange'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'lie', 'swipe'],
      hover: 'swipe',
      // Turtles are slow and steady — lazy, but with a gentle plod
      behaviour: { lazy: true, wobble: 1, distraction: 0.01 },
    },
    vampire: {
      speed: 4.4, defaultColor: 'converted',
      colors: ['converted', 'countess', 'girl'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Vampires are unpredictable — they dart and twist
      behaviour: { nervous: true, flipChance: 0.1, distraction: 0.05 },
    },
    zappy: {
      speed: 5.0, defaultColor: 'yellow',
      colors: ['yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
      // Zappy is electric — bouncy, erratic, and scatterbrained
      behaviour: { jumpy: 6, flipChance: 0.08, distraction: 0.06 },
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
   * @param {boolean} [options.followMouse] — If true, pet chases the cursor
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
 * @param {number}  [options.distraction]      — 0–1 chance per tick of abandoning the current target and picking a new one (no-op when followMouse is true)
   */
  function WebPet(options) {
    options = options || {};

    var animalId = options.animal || 'fox';
    var spec = ANIMALS[animalId] || ANIMALS['fox'];

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

    this._cfg = {
      animal:        animalId,
      color:         color,
      mediaBase:     options.mediaBase || _defaultMediaBase,
      scale:         options.scale    != null ? +options.scale    : 0.5,
      speed:         options.speed    != null ? +options.speed    : spec.speed,
      idleDist:      options.idleDist != null ? +options.idleDist : 48,
      hoverDist:     options.hoverDist != null ? +options.hoverDist : 50,
      hoverAction:   hoverAction,
      idlePauseMs:   options.idlePauseMs || { min: 1500, max: 2200 },
      followMouse:   !!options.followMouse,
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
    };

    this._state = {
      x:                      10,
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
    };

    this._mouseX = 0;
    this._mouseY = 0;
    this._mouseVY      = null;  // px/ms, tracked in _onMouseMove
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
    wrap.style.cssText = [
      'position:'   + c.position,
      'bottom:0',
      'left:0',
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
  };

  WebPet.prototype._showBubble = function (visible) {
    if (!this._cfg.hoverMessage) return;
    this._bubbleEl.style.display = visible ? 'block' : 'none';
    this._state.isHovered = visible;
  };

  /* ── Animation loop ──────────────────────────────────────────────────── */

  WebPet.prototype._start = function () {
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
      // px/ms — smoothed with a simple exponential moving average
      var rawVY = (e.clientY - this._mouseY) / dt;
      this._mouseVY = this._mouseVY == null
        ? rawVY
        : this._mouseVY * 0.6 + rawVY * 0.4;
    }
    this._lastMoveTime = now;
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
    if (e.type === 'touchstart') e.preventDefault(); // prevent scroll while dragging

    var p    = this._pointerCoords(e);
    var rect = this._wrapEl.getBoundingClientRect();
    var s    = this._state;

    s.isDragged     = true;
    s.isFalling     = false;
    s.velY          = 0;
    // Offset from the pointer to the wrap's top-left corner, so the pet
    // doesn't snap its top-left corner to the cursor.
    s.dragOffsetX   = rect.left - p.clientX;
    s.dragOffsetY   = rect.top  - p.clientY;
    // Switch to absolute positioning so we can place it anywhere in the viewport
    this._wrapEl.style.position   = 'fixed';
    this._wrapEl.style.bottom     = 'auto';
    this._wrapEl.style.left       = rect.left + 'px';
    this._wrapEl.style.top        = rect.top  + 'px';
    this._wrapEl.style.cursor     = 'grabbing';
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
    // Mouse tracking update
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

    var rect     = this._wrapEl.getBoundingClientRect();
    var vh       = window.innerHeight;
    var floorTop = vh - h;

    // If already on the floor, just land immediately
    if (rect.top >= floorTop) {
      this._landPet(rect.left);
      return;
    }

    // Use the real-time mouse velocity (px/ms) tracked in _onMouseMove.
    // Convert to px/frame at 60fps (≈16.67ms per frame) for the RAF-driven physics.
    // Only carry downward velocity — upward throws aren't intended.
    var velPxMs  = (this._mouseVY != null && isFinite(this._mouseVY)) ? this._mouseVY : 0;
    // Scale: feels natural at ~0.4× raw velocity; clamp 0–20 px/frame
    var velPxFrame = Math.max(0, Math.min(velPxMs * 0.4 * 16.67, 20));

    s.isFalling = true;
    s.airX      = rect.left;
    s.airY      = rect.top;
    s.velY      = velPxFrame;
    // Reset velocity tracker so stale values don't bleed into next pick-up
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
    var mult = this._cfg.lazy ? 4.0 : (this._cfg.nervous ? 0.25 : 1.0);
    this._state.movementPauseUntil = ts + (p.min + Math.random() * Math.max(0, p.max - p.min)) * mult;
  };

  WebPet.prototype._pickMovementTarget = function (x, boundsW) {
    var margin  = 16;
    var maxX    = Math.max(margin, boundsW - margin);

    // Nervous pets take short, erratic dashes rather than long walks
    if (this._cfg.nervous) {
      var dist = boundsW * 0.05 + Math.random() * boundsW * 0.12;
      var dir  = Math.random() < 0.5 ? -1 : 1;
      this._state.movementTargetX = Math.min(maxX, Math.max(margin, x + dir * dist));
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
      this._rafId = requestAnimationFrame(this._tick);
      return;
    }

    /* ── Falling — runs every RAF frame (60fps) for smooth physics ── */
    if (s.isFalling) {
      var GRAVITY  = 0.5;   // px/frame² acceleration
      var MAX_FALL = 20;    // terminal velocity in px/frame
      var spriteH  = c.spriteH * c.scale;
      var floorTop = window.innerHeight - spriteH;

      s.velY = Math.min(s.velY + GRAVITY, MAX_FALL);
      s.airY = s.airY + s.velY;

      if (s.airY >= floorTop) {
        s.airY = floorTop;
        this._wrapEl.style.left = s.airX + 'px';
        this._wrapEl.style.top  = s.airY + 'px';
        this._landPet(s.airX);
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

    var parentEl    = this._wrapEl.parentElement;
    var parentRect  = parentEl
      ? parentEl.getBoundingClientRect()
      : { left: 0, width: window.innerWidth };
    var parentW     = parentRect.width;
    var wrapRect    = this._wrapEl.getBoundingClientRect();

    var x = s.x;
    var targetX;

    if (c.followMouse) {
      if (c.distraction > 0 && ts < s.distractionUntil && s.distractionTargetX !== null) {
        // Temporarily distracted — wander to a nearby spot, ignore the mouse
        targetX = s.distractionTargetX;
      } else {
        s.distractionTargetX = null; // distraction expired, back to mouse
        targetX = this._mouseX - parentRect.left;
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

    if (distToMouse <= c.hoverDist) {
      /* ── Hover state ── */
      // Reset jump / wobble when transitioning to hover
      if (c.jumpAmp  > 0) { s.jumpPhase  = 0; this._wrapEl.style.bottom = '0px'; }
      if (c.wobbleDeg > 0) { s.wobblePhase = 0; }
      this._setGif(c.hoverAction);
      this._applyFacing();
      this._showBubble(true);

      // Pets doing the swipe/hover animation right next to the mouse are easily
      // over-stimulated — boost distraction chance 5× while in hover range.
      if (c.followMouse && c.distraction > 0 && ts >= s.distractionUntil && Math.random() < c.distraction * 5) {
        var hMargin = 16;
        var hDist   = parentW * 0.1 + Math.random() * parentW * 0.25;
        var hDir    = Math.random() < 0.5 ? -1 : 1;
        s.distractionTargetX = Math.min(Math.max(hMargin, x + hDir * hDist), parentW - hMargin);
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
        if (!c.followMouse && s.movementTargetX !== null) {
          s.movementTargetX = null;
          this._scheduleMovementPause(ts);
        }
        if (ts > s.idleCooldownUntil && ts > s.idleActionUntil) {
          this._pickIdleAction(ts);
        }
        this._setGif(s.idleAction);
        this._applyFacing();

      } else {
        /* ── Moving state ── */

        // Randomly flip direction mid-walk (flipChance / nervous)
        if (c.flipChance > 0 && s.movementTargetX !== null && Math.random() < c.flipChance) {
          var flipped = x - (s.movementTargetX - x);
          var fMargin = 16;
          s.movementTargetX = Math.min(Math.max(fMargin, flipped), parentW - fMargin);
        }

        // Distraction — abandon current target and pick a completely new one.
        // In free-roam mode, replaces movementTargetX directly.
        // In followMouse mode, sets a temporary distractionTargetX the pet wanders to before snapping back.
        if (c.distraction > 0 && Math.random() < c.distraction) {
          if (c.followMouse) {
            if (ts >= s.distractionUntil) {
              // Start a new distraction: pick a nearby random spot and a duration of 1–3 s
              var dMargin = 16;
              var dDist   = parentW * 0.1 + Math.random() * parentW * 0.25;
              var dDir    = Math.random() < 0.5 ? -1 : 1;
              s.distractionTargetX = Math.min(Math.max(dMargin, x + dDir * dDist), parentW - dMargin);
              s.distractionUntil   = ts + 1000 + Math.random() * 2000;
              this._pickMovementAction();
            }
          } else if (s.movementTargetX !== null) {
            this._pickMovementAction();
            this._pickMovementTarget(x, parentW);
          }
        }

        x += (diffX / distX) * c.speed * s.movementSpeedMult;
        x = Math.min(Math.max(16, x), parentW - 16);
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

        if (!c.followMouse && s.movementTargetX !== null && distX <= c.idleDist) {
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
    this._rafId = requestAnimationFrame(this._tick);
  };

  /* ── Public API ──────────────────────────────────────────────────────── */

  /** Stop animation and remove the pet from the DOM. */
  WebPet.prototype.destroy = function () {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mousemove', this._onDragMove);
    document.removeEventListener('mouseup',   this._onDragEnd);
    document.removeEventListener('touchmove', this._onDragMove);
    document.removeEventListener('touchend',  this._onDragEnd);
    if (this._wrapEl) {
      this._wrapEl.removeEventListener('mousedown',  this._onDragStart);
      this._wrapEl.removeEventListener('touchstart', this._onDragStart);
    }
    if (this._wrapEl && this._wrapEl.parentNode) {
      this._wrapEl.parentNode.removeChild(this._wrapEl);
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
    if (ds.followMouse)  opts.followMouse  = ds.followMouse === 'true';
    if (ds.position)     opts.position     = ds.position;
    if (ds.zIndex)       opts.zIndex       = parseInt(ds.zIndex, 10);
    if (ds.mediaBase)    opts.mediaBase    = ds.mediaBase;
    if (ds.jumpy)        opts.jumpy        = ds.jumpy === 'true' ? true : parseFloat(ds.jumpy);
    if (ds.wobble)       opts.wobble       = ds.wobble === 'true' ? true : parseFloat(ds.wobble);
    if (ds.flipChance)   opts.flipChance   = parseFloat(ds.flipChance);
    if (ds.nervous)      opts.nervous      = ds.nervous === 'true';
    if (ds.lazy)         opts.lazy         = ds.lazy === 'true';
    if (ds.distraction)  opts.distraction  = parseFloat(ds.distraction);

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
  global.WebPet = WebPet;

}(window));
