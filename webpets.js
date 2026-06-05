(async () => {
  const SRC   = 'https://raw.githubusercontent.com/jk-dr/p/refs/heads/main/webpets/webpet.js';
  const MEDIA = 'https://raw.githubusercontent.com/jk-dr/p/refs/heads/main/webpets/media';

  if (!window.WebPet) {
    const js = await fetch(SRC).then(r => r.text());
    (0, eval)(js);
  }

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
        '  wp.pause()    wp.resume()\n',
        'color:#818cf8;font-weight:bold','color:#94a3b8'
      ); return this;
    }
  };

wp.spawn("fox", "white", {followMouse: true,scale:1});wp.spawn("rat", "gray", {scale:1,speed:5});wp.spawn("dog", "akita", {scale:1,speed:8});wp.spawn("chicken", "brown", {scale:0.7,speed:3});wp.resume();
    
  console.log('%c✓ webpet.js loaded','color:#22c55e;font-weight:bold');
  wp.help

  document.querySelector("#webpets")?.closest('li.actions-small-1.status-read')?.remove();
})();
