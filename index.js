class Config {
  constructor(data = {}) {
    this.data = data;
    if (this.data.avatars ) this._applyAvatars();
    if (this.data.dynamic_inject) this._dynamic_js();
    // Run sequentially so both share the same eval'd closure
    this._initPetsAndBall();
    console.log(this.data, this.data.dynamic_inject, !(!this.data.dynamic_inject));
    this._cleanNotifications();
  }

  _applyAvatars() {
    try {
      const entry = Object.entries(this.data).find(([k]) => k.trim() === 'avatars');
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

        const wp = window.wp = window.wp || {};
        wp.balls = _balls;
        // wp.ball keeps a reference to the first ball for backwards compat
        wp.ball = _balls[0] ?? null;

        wp.popBall = function () {
          const ball = _balls.pop();
          if (ball) {
            ball.destroy();
            wp.ball = _balls[0] ?? null;
            console.log('%c💨 ball removed', 'color:#f87171');
          } else {
            console.log('no balls');
          }
          return wp;
        };

        wp.clearBalls = function () {
          _balls.forEach(b => b.destroy());
          _balls.length = 0;
          wp.ball = null;
          console.log('%c🧹 all balls cleared', 'color:#f87171');
          return wp;
        };

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

  static async init() {
    try {
      const html = await (await fetch('https://portal.tintern.vic.edu.au/eportfolio/1773/6128')).text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const raw  = doc.getElementById('page-anchor-' + window.schoolboxUser.id)?.textContent ?? '{}';
      const data = JSON.parse(raw.replace(/[\u00A0\u200B\uFEFF]/g, ' ').trim());
      const normData = Object.fromEntries(Object.entries(data).map(([k, v]) => [k.trim(), v]));
      return new Config(normData);
    } catch (e) {
      console.warn('[Config] init failed:', e);
      return new Config();
    }
  }
}

(async () => { await Config.init(); })();
