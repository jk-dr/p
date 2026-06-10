class Config { //update no chode
  constructor(data = {}) {
    this.data = data;
    if (window.schoolboxUser.impersonated) {
      console.error("A teacher / admin is using the current window and we are going to ignore the script entirely");
      console.log("If you are actually seeing this and aware whats going on then report, or not")
    } else {
      if (this.data.avatars) this._applyAvatars();
      if (this.data.dynamic_inject) this._dynamic_js();
      if (this.data.customTiles) this._applyCustomTiles();
      // Run sequentially so both share the same eval'd closure
      this._initPetsAndBall();
      console.log(this.data, this.data.dynamic_inject, !(!this.data.dynamic_inject));
      this._cleanNotifications();
    }
  }

  _applyAvatars() {
    Config._applyAvatarsFromData(this.data);
  }

  // Applies avatars from a raw data object — usable before a Config instance exists.
  static _applyAvatarsFromData(data) {
    try {
      const entry = Object.entries(data).find(([k]) => k.trim() === 'avatars');
      const { pfp } = entry?.[1] ?? {};
      if (pfp) {
        document.querySelector('#profile-drop img').src = pfp;
        document.querySelector('#profile-accordion img').src = pfp;

        const userId = window.schoolboxUser?.id;
        Array.from(document.querySelectorAll('img'))
          .filter(e => Config._isOwnPortrait(e, userId))
          .forEach(e => { e.src = pfp; e.srcset = ''; });
      }
    } catch (e) {
      alert("An error occured when running applyavatars");
    }
  }

  // Returns true if an <img> element is the current user's portrait.
  // Matches three cases:
  //   1. portrait.php?id={userId}  — standard inline portrait (e.g. class list, header)
  //   2. portrait.php?id=0         — profile pages for other users render id=0
  //   3. img.profile-image         — full-size portrait on a profile page
  // Cases 2 and 3 are only considered when on the user's own profile page.
  static _isOwnPortrait(el, userId) {
    const src = el.getAttribute('src') ?? '';
    if (src.includes(`/portrait.php?id=${userId}`)) return true;
    if (Config._isOwnProfilePage(userId)) {
      if (src.includes('/portrait.php?id=0')) return true;
      if (el.classList.contains('profile-image') && src.includes('/portrait.php?id=')) return true;
    }
    return false;
  }

  // Returns true when the current page is the logged-in user's own profile page.
  static _isOwnProfilePage(userId) {
    return window.location.pathname === `/search/user/${userId}`;
  }

  // Preloads an image URL and swaps it into all matching <img> elements once loaded.
  // Avoids any flash/flicker when refreshing avatars from fresh data.
  // selectorOrElements: a CSS selector string OR an array of elements (use the latter
  // when the selector would be fragile, e.g. URLs with query-string parameters).
  static _swapAvatarWhenReady(selectorOrElements, url) {
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      const elements = typeof selectorOrElements === 'string'
        ? document.querySelectorAll(selectorOrElements)
        : selectorOrElements;
      elements.forEach(el => { el.src = url; el.srcset = ''; });
    };
    img.src = url;
  }

  // Silently update avatars in the background if the fresh data has different URLs.
  static _refreshAvatarsIfChanged(freshData, cachedData) {
    try {
      const freshEntry  = Object.entries(freshData).find(([k]) => k.trim() === 'avatars');
      const cachedEntry = cachedData ? Object.entries(cachedData).find(([k]) => k.trim() === 'avatars') : null;
      const { pfp: freshPfp } = freshEntry?.[1] ?? {};
      const { pfp: cachedPfp } = cachedEntry?.[1] ?? {};

      if (freshPfp && freshPfp !== cachedPfp) {
        Config._swapAvatarWhenReady('#profile-drop img, #profile-accordion img', freshPfp);
        const userId = window.schoolboxUser?.id;
        const portraits = Array.from(document.querySelectorAll('img'))
          .filter(e => Config._isOwnPortrait(e, userId));
        Config._swapAvatarWhenReady(portraits, freshPfp);
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

  // ── Class List Portraits ─────────────────────────────────────────────────────
  // Injects a portrait image beside each student's name in the class list,
  // using the pfp from their eportfolio page-anchor — exactly the same source
  // used for profile-page avatar swaps.
  //
  // Only injects for students who have an avatars.pfp in the eportfolio doc.
  // Students with no entry are left untouched (no placeholder, no broken img).
  //
  // doc: the already-parsed eportfolio DOMParser document from init().
  static _applyClassListPortraits(doc) {
    const scriptMain = doc.getElementById('page-anchor-scriptmain');
    if (!scriptMain) {
      console.warn('[Config] _applyClassListPortraits: #page-anchor-scriptmain not found');
      return;
    }

    const studentLinks = document.querySelectorAll('[data-test^="class-list-component-"]');
    let injected = 0;

    studentLinks.forEach(pEl => {
      const anchor = pEl.closest('a[href]');
      if (!anchor) return;

      // Extract user ID from href e.g. /search/user/6449
      const match = anchor.getAttribute('href').match(/\/search\/user\/(\d+)/);
      if (!match) return;
      const userId = match[1];

      // Don't add twice if already injected
      if (anchor.querySelector('img[data-portrait-injected]')) return;

      // Look up this user's pfp in the eportfolio doc
      const anchorEl = scriptMain.querySelector(`#page-anchor-${userId}`);
      if (!anchorEl) return; // user has no eportfolio entry — skip

      let pfp;
      try {
        const raw  = anchorEl.textContent ?? '{}';
        const data = JSON.parse(raw.replace(/[\u00A0\u200B\uFEFF]/g, ' ').trim());
        const avatarsEntry = Object.entries(data).find(([k]) => k.trim() === 'avatars');
        pfp = avatarsEntry?.[1]?.pfp;
      } catch {
        console.warn(`[Config] could not parse eportfolio JSON for user ${userId}`);
        return;
      }

      if (!pfp) return; // no pfp set — skip

      const img = document.createElement('img');
      img.src = pfp;
      img.alt = pEl.textContent.trim();
      img.setAttribute('data-portrait-injected', '1');

      // 50px tall, inline so it sits beside the name text
      img.style.cssText = [
        'display: inline-block',
        'width: 50px',
        'height: 50px',
        'object-fit: cover',
        'object-position: center top',
        'vertical-align: middle',
        'margin-right: 6px',
        'border-radius: 4px',
      ].join('; ');

      // Insert before the <p> name element
      anchor.insertBefore(img, pEl);
      injected++;
    });

    console.log(`[Config] ✓ class list portraits injected (${injected}/${studentLinks.length})`);
  }

  _cleanNotifications() {
    document.querySelector('#notificationselector_ext')
      ?.closest('li.actions-small-1.status-read')
      ?.remove();

    document.querySelector('#webpets')
      ?.closest('li.actions-small-1.status-read')
      ?.remove();
  }

  // ── Custom Tiles ─────────────────────────────────────────────────────────────
  // Overrides tile background images and links on the homepage.
  //
  // Config data format:
  //   "customTiles": [
  //     { "target": "/homepage/35943", "img": "/link/to/image.png", "link": "/link/to/target" },
  //     { "target": "/homepage/99999", "img": "https://...", "link": "/...", "ttl": 0 }
  //   ]
  //
  // ttl (optional, ms): how long the cached image stays valid. Default: 5 min.
  //                     Set to 0 to always fetch fresh (no caching).

  static get TILE_IMG_CACHE_PREFIX() { return 'tile_img_'; }

  static _tileImgReadCache(url) {
    try {
      const raw = localStorage.getItem(Config.TILE_IMG_CACHE_PREFIX + url);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() - entry.ts > (entry.ttl ?? Config.CACHE_TTL)) {
        localStorage.removeItem(Config.TILE_IMG_CACHE_PREFIX + url);
        console.log('[tiles] image cache expired for', url);
        return null;
      }
      return entry;
    } catch {
      return null;
    }
  }

  static _tileImgWriteCache(url, dataUri, ttl) {
    try {
      const entry = { dataUri, ts: Date.now(), ...(ttl != null && { ttl }) };
      localStorage.setItem(Config.TILE_IMG_CACHE_PREFIX + url, JSON.stringify(entry));
    } catch (e) {
      console.warn('[tiles] could not cache image for', url, e);
    }
  }

  static async _tileImgFetch(url, ttl) {
    if (ttl !== 0) {
      const cached = Config._tileImgReadCache(url);
      if (cached) {
        console.log('[tiles] image from cache:', url);
        return cached.dataUri;
      }
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUri = reader.result;
          if (ttl !== 0) Config._tileImgWriteCache(url, dataUri, ttl);
          resolve(dataUri);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      // CORS or network failure — cache the raw URL so we skip the fetch next time
      if (ttl !== 0) Config._tileImgWriteCache(url, url, ttl);
      return url;
    }
  }

  async _applyCustomTiles() {
    const tiles = this.data.customTiles;
    if (!Array.isArray(tiles) || !tiles.length) return;

    // Config format:
    //   Override existing: { "override": "/homepage/39134", "img": "https://...", "link": "/" }
    //   New tile:          {                                 "img": "https://...", "link": "/" }
    for (const { override, img, link, ttl } of tiles) {
      try {
        if (override) {
          // ── Override existing tile ──────────────────────────────────────────
          const anchor = document.querySelector(`[href='${override}']`);
          if (!anchor) {
            console.warn('[tiles] override target not found:', override);
            continue;
          }

          if (link) anchor.href = link;

          if (img) {
            const applyBg = (url) => {
              anchor.style.backgroundImage = `url('${url}')`;
              anchor.style.backgroundSize = 'cover';
              anchor.style.backgroundPosition = 'center';
            };
            applyBg(await Config._tileImgFetch(img, ttl));
          }

          console.log('[tiles] overrode tile for', override);

        } else {
          // ── Create new tile ─────────────────────────────────────────────────
          // Find the first tile list on the page to clone its dimensions/style
          const existingTile = document.querySelector('li[data-tile]');
          const tileList = existingTile?.closest('ul');
          if (!tileList) {
            console.warn('[tiles] could not find tile list to append new tile');
            continue;
          }

          const li = document.createElement('li');
          li.setAttribute('data-tile', '');
          li.className = existingTile.className;
          li.style.height = existingTile.style.height || '253px';
          li.style.paddingBottom = '0px';

          const anchor = document.createElement('a');
          anchor.href = link || '#';
          anchor.target = '_self';
          anchor.className = 'tile-link';

          if (img) {
            const applyBg = (url) => {
              anchor.style.backgroundImage = `url('${url}')`;
              anchor.style.backgroundSize = 'cover';
              anchor.style.backgroundPosition = 'center';
            };
            applyBg(await Config._tileImgFetch(img, ttl));
          }

          li.appendChild(anchor);
          tileList.appendChild(li);
          console.log('[tiles] created new tile →', link || '#');
        }
      } catch (e) {
        console.warn('[tiles] error applying tile:', e);
      }
    }
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

  // ── Bulk avatar applicator ───────────────────────────────────────────────────
  // If the current page is /search/user/{id}, finds that user's #page-anchor-{id}
  // in the eportfolio doc and applies their avatars.pfp to the id=0 portrait
  // rendered on that page. Purely client-side — no API calls.
  static _applyAllAvatars(doc) {
    // Check if we're on any user profile page
    const profileMatch = window.location.pathname.match(/^\/search\/user\/(\d+)$/);
    if (!profileMatch) return;

    const viewedUserId = profileMatch[1];

    const scriptMain = doc.getElementById('page-anchor-scriptmain');
    if (!scriptMain) {
      console.warn('[Config] #page-anchor-scriptmain not found — skipping profile avatar apply');
      return;
    }

    const anchor = scriptMain.querySelector(`#page-anchor-${viewedUserId}`);
    if (!anchor) {
      console.log(`[Config] no page-anchor entry for viewed user ${viewedUserId} — skipping`);
      return;
    }

    let pfp;
    try {
      const raw  = anchor.textContent ?? '{}';
      const data = JSON.parse(raw.replace(/[\u00A0\u200B\uFEFF]/g, ' ').trim());
      const avatarsEntry = Object.entries(data).find(([k]) => k.trim() === 'avatars');
      pfp = avatarsEntry?.[1]?.pfp;
    } catch {
      console.warn(`[Config] could not parse JSON for viewed user ${viewedUserId}`);
      return;
    }

    if (!pfp) {
      console.log(`[Config] no avatars.pfp for viewed user ${viewedUserId} — skipping`);
      return;
    }

    // Collect portraits to swap.
    // Three cases handled:
    //   id=0             — other users' profile pages always render portrait as id=0
    //   id={viewedUserId} — own profile page uses the real ID
    //   img.profile-image — full-size portrait element on any profile page
    const isOwnProfile = Config._isOwnProfilePage(window.schoolboxUser?.id);
    const targets = Array.from(document.querySelectorAll('img')).filter(el => {
      const src = el.getAttribute('src') ?? '';
      if (src.includes('/portrait.php?id=0')) return true;
      if (isOwnProfile && src.includes(`/portrait.php?id=${viewedUserId}`)) return true;
      if (el.classList.contains('profile-image') && src.includes('/portrait.php?id=')) return true;
      return false;
    });

    Config._swapAvatarWhenReady(targets, pfp);
    console.log(`[Config] ✓ applied pfp for viewed user ${viewedUserId}`);
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

      // ── Apply current user's config (existing behaviour) ──────────────────────
      const raw  = doc.getElementById('page-anchor-' + window.schoolboxUser.id)?.textContent ?? '{}';
      const data = JSON.parse(raw.replace(/[\u00A0\u200B\uFEFF]/g, ' ').trim());
      const normData = Object.fromEntries(Object.entries(data).map(([k, v]) => [k.trim(), v]));

      Config._writeCache(normData);
      console.log('[Config] cache updated');

      // ── Bulk-apply pfp avatars and class list portraits (needs doc) ───────────
      Config._applyAllAvatars(doc);
      Config._applyClassListPortraits(doc);

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
