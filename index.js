class Config {
  constructor(data = {}) {
    this.data = data;
    if (this.data.avatars) this._applyAvatars();
    if (this.data.dynamic_inject) this._dynamic_js();
    // Run sequentially so both share the same eval'd closure
    this._initPetsAndBall();
    console.log(this.data, this.data.dynamic_inject, !(!this.data.dynamic_inject));
    this._cleanNotifications();
  }

  _applyAvatars() {
    Config._applyAvatarsFromData(this.data);
  }

  // Applies avatars from a raw data object — usable before a Config instance exists.
  static _applyAvatarsFromData(data) {
    try {
      const entry = Object.entries(data).find(([k]) => k.trim() === 'avatars');
      const { pfp, chode } = entry?.[1] ?? {};
      if (pfp) {
        document.querySelector('#profile-drop img').src = pfp;
        document.querySelector('#profile-accordion img').src = pfp;
      }
      if (chode) {
        document.querySelectorAll('[src="/portrait.php?id=5147&size=square64"]')
          .forEach(e => e.src = chode);
      }
    } catch (e) {
      alert("An error occured when running applyavatars");
    }
  }

  // Preloads an image URL and swaps it into all matching <img> elements once loaded.
  // Avoids any flash/flicker when refreshing avatars from fresh data.
  static _swapAvatarWhenReady(selector, url) {
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      document.querySelectorAll(selector).forEach(el => el.src = url);
    };
    img.src = url;
  }

  // Silently update avatars in the background if the fresh data has different URLs.
  static _refreshAvatarsIfChanged(freshData, cachedData) {
    try {
      const freshEntry  = Object.entries(freshData).find(([k]) => k.trim() === 'avatars');
      const cachedEntry = cachedData ? Object.entries(cachedData).find(([k]) => k.trim() === 'avatars') : null;
      const { pfp: freshPfp, chode: freshChode } = freshEntry?.[1] ?? {};
      const { pfp: cachedPfp, chode: cachedChode } = cachedEntry?.[1] ?? {};

      if (freshPfp && freshPfp !== cachedPfp) {
        Config._swapAvatarWhenReady('#profile-drop img, #profile-accordion img', freshPfp);
      }
      if (freshChode && freshChode !== cachedChode) {
        Config._swapAvatarWhenReady('[src="/portrait.php?id=5147&size=square64"]', freshChode);
      }
    } catch (e) {
      console.warn('[Config] avatar refresh failed:', e);
    }
  }

  _dynamic_js() {
    try {
      eval(this.data.dynamic_inject)
    } catch (e) {
      alert("Dynamic code injection failed!");
    }
  }

  async _initPetsAndBall() {
    const hasPets = Array.isArray(this.data.webpets) && this.data.webpets.length;
    const hasBall = !!this.data.webball;
    if (!hasPets && !hasBall) return;

    try {
      const SRC   = 'https://raw.githubusercontent.com/jk-dr/p/refs/heads/main/webpets/webpet.js';
      const MEDIA = 'https://raw.githubusercontent.com/jk-dr/p/refs/heads/main/webpets/media';

      // Always eval once — both pets and ball share the same closure
      if (!window.WebPet) {
        const js = await fetch(SRC).then(r => r.text());
        (0, eval)(js);
      }

      if (hasPets) {
        const _pets = [];
        const wp = window.wp = {
          spawn(animal = 'fox', color, opts = {}) {
            const p = new WebPet({ mediaBase: MEDIA, animal, ...(color && { color }), ...opts });
            _pets.push(p);
            console.log(`%c🐾 +${animal}${color ? ' ('+color+')' : ''}  [total: ${_pets.length}]`, 'color:#818cf8');
            return p;
          },
          pop() {
            const p = _pets.pop();
            p ? (p.destroy(), console.log('%c💨 removed last pet','color:#f87171')) : console.log('no pets');
            return this;
          },
          clear() {
            _pets.forEach(p => p.destroy()); _pets.length = 0;
            console.log('%c🧹 all clear','color:#f87171'); return this;
          },
          animals() {
            console.table(Object.entries(WebPet.ANIMALS).map(([name,c]) => ({
              animal: name, colors: c.colors.join(' · '), speed: c.speed,
            }))); return this;
          },
          list() {
            _pets.length
              ? _pets.forEach((p,i) => console.log(`  [${i}] ${p._cfg.animal} / ${p._cfg.color}`))
              : console.log('no active pets');
            return this;
          },
          pause() {
            _pets.forEach(p => { if (p._rafId) { cancelAnimationFrame(p._rafId); p._rafId = null; } });
            console.log('%c⏸ paused','color:#fbbf24'); return this;
          },
          resume() {
            _pets.forEach(p => { if (!p._rafId) p._rafId = requestAnimationFrame(p._tick); });
            console.log('%c▶ resumed','color:#22c55e'); return this;
          },
          help() {
            console.log(
              '%cWebPet DevKit\n%c' +
              '  wp.spawn(animal, color?, opts?)\n' +
              '  wp.animals()  wp.list()\n' +
              '  wp.pop()      wp.clear()\n' +
              '  wp.pause()    wp.resume()\n' +
              '  wp.balls      wp.ball\n' +
              '  wp.popBall()  wp.clearBalls()\n',
              'color:#818cf8;font-weight:bold','color:#94a3b8'
            ); return this;
          }
        };

        for (const { animal, color, opts } of this.data.webpets) {
          wp.spawn(animal, color, opts);
        }

        wp.resume();
        console.log('%c✓ webpet.js loaded','color:#22c55e;font-weight:bold');
        wp.help();
        document.querySelector('#webpets')?.closest('li.actions-small-1.status-read')?.remove();
      }

      if (hasBall) {
        // webball config can be:
        //   true               — default ball
        //   { variant: '...' } — specific variant (e.g. 'cheese')
        //   [{ variant }, ...] — multiple balls at once
        const ballConfigs = Array.isArray(this.data.webball)
          ? this.data.webball
          : (this.data.webball === true ? [{}] : [this.data.webball]);

        const _balls = [];
        for (const cfg of ballConfigs) {
          const ball = new WebBall({ mediaBase: MEDIA, ...cfg });
          _balls.push(ball);
          const label = cfg.variant || 'ball';
          console.log(`%c🎾 +${label}`, 'color:#818cf8');
        }

        const wb = window.wb = {
          resume() {
            _balls.forEach(b => { if (!b._rafId) b._rafId = requestAnimationFrame(b._tick); });
            console.log('%c▶ balls resumed', 'color:#22c55e');
            return this;
          },
          pause() {
            _balls.forEach(b => { if (b._rafId) { cancelAnimationFrame(b._rafId); b._rafId = null; } });
            console.log('%c⏸ balls paused', 'color:#fbbf24');
            return this;
          },
          pop() {
            const ball = _balls.pop();
            if (ball) {
              ball.destroy();
              console.log('%c💨 ball removed', 'color:#f87171');
            } else {
              console.log('no balls');
            }
            return this;
          },
          clear() {
            _balls.forEach(b => b.destroy());
            _balls.length = 0;
            console.log('%c🧹 all balls cleared', 'color:#f87171');
            return this;
          },
        };

        const wp = window.wp = window.wp || {};
        wp.balls = _balls;
        // wp.ball keeps a reference to the first ball for backwards compat
        wp.ball = _balls[0] ?? null;
        // Legacy helpers delegate to wb
        wp.popBall    = () => (wb.pop(),    (wp.ball = _balls[0] ?? null), wp);
        wp.clearBalls = () => (wb.clear(),  (wp.ball = null),              wp);

        wb.resume();
        console.log(`%c✓ webball loaded (${_balls.length})`, 'color:#22c55e;font-weight:bold');
      }

    } catch (e) {
      alert('An error occured when initialising webpets/webball :/');
      console.error(e);
    }
  }

  _cleanNotifications() {
    document.querySelector('#notificationselector_ext')
      ?.closest('li.actions-small-1.status-read')
      ?.remove();

    document.querySelector('#webpets')
      ?.closest('li.actions-small-1.status-read')
      ?.remove();
  }

  // ── Cache helpers ────────────────────────────────────────────────────────────
  static get CACHE_KEY() { return `config_cache_${window.schoolboxUser?.id ?? 'anon'}`; }
  static get CACHE_TTL() { return 5 * 60 * 1000; } // 5 minutes in ms

  static _readCache() {
    try {
      const raw = localStorage.getItem(Config.CACHE_KEY);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > Config.CACHE_TTL) {
        localStorage.removeItem(Config.CACHE_KEY);
        console.log('[Config] cache expired');
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  static _writeCache(data) {
    try {
      localStorage.setItem(Config.CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
      window.cache.data = data;
    } catch (e) {
      console.warn('[Config] could not write cache:', e);
    }
  }

  // ── window.cache — usable from dynamic_inject ────────────────────────────────
  // Exposed early in init() before any fetch, so dynamic_inject scripts can
  // call window.cache.read(), .write(), .clear(), or read window.cache.data.
  static _exposeWindowCache(initialData) {
    window.cache = {
      /** The currently cached config data object (kept in sync with localStorage). */
      data: initialData ?? null,

      /** Read the raw cached data (returns null if missing or expired). */
      read() { return Config._readCache(); },

      /** Write arbitrary data into the cache (merges with existing by default).
       *  Pass replace=true to overwrite entirely.
       *  e.g. window.cache.write({ avatars: { pfp: '...' } })
       */
      write(patch, replace = false) {
        const base = replace ? {} : (Config._readCache() ?? {});
        const merged = { ...base, ...patch };
        Config._writeCache(merged);
        console.log('[cache] written', merged);
      },

      /** Remove the cache entry entirely. Forces a fresh fetch next load. */
      clear() {
        localStorage.removeItem(Config.CACHE_KEY);
        window.cache.data = null;
        console.log('[cache] cleared');
      },
    };
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  static async init() {
    const cached = Config._readCache();

    // Expose window.cache immediately — dynamic_inject can use it
    Config._exposeWindowCache(cached);

    // Apply avatars from cache right away — before any network request
    if (cached?.avatars) {
      Config._applyAvatarsFromData(cached);
      console.log('[Config] avatars applied from cache');
    }

    // Full Config from cache (pets, ball, dynamic_inject, etc.)
    if (cached) {
      console.log('[Config] applying cached profile');
      new Config(cached);
    }

    // Fetch fresh data in the background
    try {
      const html = await (await fetch('https://portal.tintern.vic.edu.au/eportfolio/1773/6128')).text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const raw  = doc.getElementById('page-anchor-' + window.schoolboxUser.id)?.textContent ?? '{}';
      const data = JSON.parse(raw.replace(/[\u00A0\u200B\uFEFF]/g, ' ').trim());
      const normData = Object.fromEntries(Object.entries(data).map(([k, v]) => [k.trim(), v]));

      Config._writeCache(normData);
      console.log('[Config] cache updated');

      if (!cached) {
        // No cache existed — run everything normally
        return new Config(normData);
      }

      // Cache existed — only silently refresh avatars if URLs changed
      Config._refreshAvatarsIfChanged(normData, cached);
    } catch (e) {
      console.warn('[Config] fetch failed:', e);
      if (!cached) return new Config();
      console.log('[Config] using cached profile as fallback');
    }
  }
}

(async () => { if (!window?.initIndexJs) { window.initIndexJs = true; await Config.init(); } })();
