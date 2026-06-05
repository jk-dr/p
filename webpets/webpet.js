/**
 * webpet.js — Standalone, zero-dependency web pets
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

  const CACHE = 'webpets-gifs-v1';

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
    },
    clippy: {
      speed: 3.2, defaultColor: 'brown',
      colors: ['black', 'brown', 'green', 'yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    cockatiel: {
      speed: 4.0, defaultColor: 'brown',
      colors: ['brown', 'gray'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    crab: {
      speed: 3.4, defaultColor: 'red',
      colors: ['red'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    deno: {
      speed: 4.8, defaultColor: 'green',
      colors: ['green'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    dog: {
      speed: 5.5, defaultColor: 'brown',
      colors: ['akita', 'black', 'brown', 'red', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    fox: {
      speed: 5.2, defaultColor: 'red',
      colors: ['red', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
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
    },
    mod: {
      speed: 4.0, defaultColor: 'purple',
      colors: ['purple'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    monkey: {
      speed: 4.7, defaultColor: 'gray',
      colors: ['gray'],
      // monkey has no walk_fast
      movement: ['walk', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    morph: {
      speed: 4.0, defaultColor: 'purple',
      colors: ['purple'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    panda: {
      speed: 3.6, defaultColor: 'black',
      colors: ['black', 'brown'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    rat: {
      speed: 4.9, defaultColor: 'brown',
      colors: ['brown', 'gray', 'white'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    rocky: {
      speed: 2.8, defaultColor: 'gray',
      colors: ['gray'],
      // rocky has no with_ball or lie; walk_fast exists but no run
      movement: ['walk', 'walk_fast'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    'rubber-duck': {
      speed: 3.0, defaultColor: 'yellow',
      colors: ['yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    skeleton: {
      speed: 4.4, defaultColor: 'white',
      colors: ['blue', 'brown', 'green', 'orange', 'pink', 'purple', 'red', 'warrior', 'white', 'yellow'],
      // skeleton has no walk_fast
      movement: ['walk', 'run'],
      idle: ['idle', 'stand', 'swipe'],
      hover: 'swipe',
    },
    snail: {
      speed: 1.4, defaultColor: 'brown',
      colors: ['brown'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    snake: {
      speed: 3.7, defaultColor: 'green',
      colors: ['green'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    totoro: {
      speed: 3.1, defaultColor: 'gray',
      colors: ['gray'],
      // totoro has no walk_fast
      movement: ['walk', 'run'],
      idle: ['idle', 'lie', 'swipe'],
      hover: 'swipe',
    },
    turtle: {
      speed: 2.2, defaultColor: 'green',
      colors: ['green', 'orange'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'lie', 'swipe'],
      hover: 'swipe',
    },
    vampire: {
      speed: 4.4, defaultColor: 'converted',
      colors: ['converted', 'countess', 'girl'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
    },
    zappy: {
      speed: 5.0, defaultColor: 'yellow',
      colors: ['yellow'],
      movement: ['walk', 'walk_fast', 'run'],
      idle: ['idle', 'swipe'],
      hover: 'swipe',
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
      lastStepTime:           0,
      lastGif:                null,
      isHovered:              false,
    };

    this._mouseX = 0;
    this._mouseY = 0;
    this._rafId  = null;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._tick        = this._tick.bind(this);

    this._buildDOM();
    this._start();
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  WebPet.prototype._gifUrl = async function (action) {
    var c = this._cfg;
    const url = c.mediaBase + '/' + c.animal + '/' + c.color + '_' + action + '_8fps.gif';
  
    try {
      const cache = await caches.open(WEBPETS_CACHE);
      let response = await cache.match(url);
  
      if (!response) {
        response = await fetch(url, { mode: 'cors' });
        await cache.put(url, response.clone());
      }
  
      return URL.createObjectURL(await response.blob());
    } catch (e) {
      return url; // fallback to direct URL if cache/fetch fails
    }
  };

  WebPet.prototype._setGif = function (action) {
    var url = this._gifUrl(action);
    if (this._state.lastGif === url) return;
    this._state.lastGif = url;
    this._spriteEl.style.backgroundImage = 'url("' + url + '")';
  };

  WebPet.prototype._applyFacing = function () {
    this._spriteEl.style.transform = 'scaleX(' + this._state.facingDir + ')';
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
      'pointer-events:none',
      'transform-origin:bottom center',
      'overflow:visible',
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
      'pointer-events:none',
    ].join(';');
    sprite.style.backgroundImage = 'url("' + this._gifUrl(c.hoverAction) + '")';
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
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._rafId = requestAnimationFrame(this._tick);
    }
  };

  WebPet.prototype._onMouseMove = function (e) {
    this._mouseX = e.clientX;
    this._mouseY = e.clientY;
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
    var a = actions[Math.floor(Math.random() * actions.length)];
    this._state.movementAction   = a.name;
    this._state.movementSpeedMult = a.speedMultiplier;
  };

  WebPet.prototype._scheduleMovementPause = function (ts) {
    var p = this._cfg.idlePauseMs;
    this._state.movementPauseUntil = ts + p.min + Math.random() * Math.max(0, p.max - p.min);
  };

  WebPet.prototype._pickMovementTarget = function (x, boundsW) {
    var margin  = 16;
    var maxX    = Math.max(margin, boundsW - margin);
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
    if (ts - this._state.lastStepTime < STEP_MS) {
      this._rafId = requestAnimationFrame(this._tick);
      return;
    }
    this._state.lastStepTime = ts;

    var c       = this._cfg;
    var s       = this._state;
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
      targetX = this._mouseX - parentRect.left;
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
      this._setGif(c.hoverAction);
      this._applyFacing();
      this._showBubble(true);

    } else {
      this._showBubble(false);

      if (idle) {
        /* ── Idle state ── */
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
        x += (diffX / distX) * c.speed * s.movementSpeedMult;
        x = Math.min(Math.max(16, x), parentW - 16);
        s.x = x;

        if (!c.followMouse && s.movementTargetX !== null && distX <= c.idleDist) {
          s.movementTargetX = null;
          this._scheduleMovementPause(ts);
        }

        // Reset idle timer while moving
        if (c.idleActions.length > 0) s.idleAction = c.idleActions[0].name;
        s.idleActionUntil  = 0;
        s.idleCooldownUntil = 0;

        this._setGif(s.movementAction);
        this._applyFacing();
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
