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

HJHeath John BoweyFree planCaching GIF files in browser webpets portFree planUpgradeClaude finished the responseYou said: how to cache gif files in a browser im making a webpets static porthow to cache gif files in a browser im making a webpets static port11:56 AMClaude responded: Caching GIFs in a Browser (Static Site)Synthesized browser caching strategies for static GIF assetsSynthesized browser caching strategies for static GIF assetsCaching GIFs in a Browser (Static Site)
For a static webpets port, you have a few solid options depending on your setup:

1. Service Worker + Cache API (Best for full offline/static control)
Register a service worker that intercepts fetch requests and caches your GIFs on first load:
sw.js
jsconst CACHE_NAME = 'webpets-v1';
const ASSETS_TO_PRECACHE = [
  '/pets/cat_idle.gif',
  '/pets/dog_walk.gif',
  // ...or just cache all GIFs dynamically below
];

// Precache on install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_PRECACHE))
  );
});

// Serve from cache, fall back to network
self.addEventListener('fetch', event => {
  if (event.request.url.match(/\.gif$/)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
  }
});
Register it in your main JS:
jsif ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

2. HTTP Cache-Control Headers (Best if you control your server/CDN)
Set these headers on your GIF responses. For a static host like Netlify, Vercel, or nginx:
netlify.toml
toml[[headers]]
  for = "/*.gif"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
vercel.json
json{
  "headers": [
    {
      "source": "/(.*).gif",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
nginx
nginxlocation ~* \.gif$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

Use immutable only if you version your filenames (e.g. cat_idle.v2.gif), otherwise drop it and use max-age=86400 or similar.


3. Preload + JS Image Cache (In-memory, fast frame switching)
If you're swapping GIFs frequently (e.g. idle → walk → run), pre-load them into Image objects so they're ready instantly:
jsconst GIF_PATHS = ['idle.gif', 'walk.gif', 'run.gif', 'sleep.gif'];
const cache = {};

function preloadGifs(paths) {
  paths.forEach(path => {
    const img = new Image();
    img.src = `/pets/${path}`;
    cache[path] = img; // keeps reference alive in memory
  });
}

preloadGifs(GIF_PATHS);

// Later, swap your <img> src instantly:
document.getElementById('pet').src = cache['walk.gif'].src;

Which to use?
ApproachBest forService WorkerFull offline support, fine-grained controlCache-Control headersSimple, no JS needed, works with any static hostJS Image preloadFast in-page animation switching
For a webpets port, combining Cache-Control headers (long TTL) + JS preloading for the active pet's GIFs is the most practical combo. Add a service worker on top if you want it to work offline.You said: if its meant to be injectedif its meant to be injected11:59 AMClaude responded: When the script is injected (bookmarklet, userscript, browser extension, script tag injection), your options change:Evaluated caching strategies for injected scriptsEvaluated caching strategies for injected scriptsWhen the script is injected (bookmarklet, userscript, browser extension, script tag injection), your options change:

❌ Service workers — origin-scoped, you can't register one on a foreign page
❌ Cache-Control headers — you don't own the server
✅ Cache API — available directly from page context
✅ IndexedDB — fully persistent blob storage
✅ In-memory Image objects — simplest, lost on unload


Cache API from injected script (recommended)
Works directly in page context, no service worker needed:
jsconst CACHE = 'webpets-gifs-v1';
const GIF_BASE = 'https://your-cdn.com/pets/'; // where your GIFs live

async function loadGif(name) {
  const url = GIF_BASE + name;
  const cache = await caches.open(CACHE);

  let response = await cache.match(url);
  if (!response) {
    response = await fetch(url, { mode: 'cors' }); // GIF server needs CORS headers
    await cache.put(url, response.clone());
  }

  return URL.createObjectURL(await response.blob());
}

// Usage
loadGif('cat_idle.gif').then(blobUrl => {
  const img = document.createElement('img');
  img.src = blobUrl;
  document.body.appendChild(img);
});

Your GIF host needs Access-Control-Allow-Origin: * for cross-origin fetches. GitHub Pages and most CDNs have this by default.


IndexedDB (most persistent, works fully offline)
Better if you want GIFs to survive across origins or need more control:
jsfunction openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('webpets', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('gifs');
    req.onsuccess = e => res(e.target.result);
    req.onerror = rej;
  });
}

async function loadGif(name, url) {
  const db = await openDB();

  // Check IDB first
  const cached = await new Promise(res => {
    const tx = db.transaction('gifs', 'readonly');
    const req = tx.objectStore('gifs').get(name);
    req.onsuccess = e => res(e.target.result);
  });

  if (cached) return URL.createObjectURL(cached);

  // Fetch and store as blob
  const blob = await fetch(url, { mode: 'cors' }).then(r => r.blob());
  const tx = db.transaction('gifs', 'readwrite');
  tx.objectStore('gifs').put(blob, name);

  return URL.createObjectURL(blob);
}

// Usage
loadGif('cat_idle.gif', 'https://your-cdn.com/pets/cat_idle.gif').then(src => {
  document.getElementById('webpet').src = src;
});

Quick comparison
MethodPersists across reloadsCross-originComplexityIn-memory Image❌✅SimpleCache API✅Needs CORSMediumIndexedDB blob✅Needs CORSMore setup
For an injected webpets script, Cache API is the sweet spot — persistent, simple, and the browser manages eviction for you.You said: fix thisfix this
  WebPet.prototype._gifUrl = function (action) {
    var c = this._cfg;    const url = c.mediaBase + '/' + c.animal + '/' + c.color + '_' + action + '_8fps.gif';
    const cache = await caches.open(CACHE);    let response = await cache.match(url);
    if (!response) {
      response = await fetch(url, { mode: 'cors' }); // GIF server needs CORS headers
      await cache.put(url, response.clone());
    }    return URL.createObjectURL(await response.blob());    return c.mediaBase + '/' + c.animal + '/' + c.color + '_' + action + '_8fps.gif';
  };Show more12:08 PMClaude responded: Several issues: missing async, undefined CACHE constant, and a dead return at the end.Identified async/await misuse and refactored function structureIdentified async/await misuse and refactored function structureThe user has a broken function that mixes sync and async code, and has a duplicate return statement. Let me analyze the issues:

The function uses await but isn't declared as async
It uses CACHE which isn't defined in this snippet
There's a dead return statement at the end (after the blob URL return)
The function is a regular prototype method, not async - need to make it async
The caller will need to handle a Promise now

Let me fix this properly:
jsconst WEBPETS_CACHE = 'webpets-gifs-v1';

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
    // Fallback to direct URL if caching fails
    return url;
  }
};
Key fixes:

Add async to the function
Remove the dead return statement at the end
Define/use a cache name constant
Add try/catch with fallback to direct URL (in case caches API isn't available or fetch fails)
The caller will need to await this or use .then()

I should also mention that any caller of _gifUrl will now need to handle a Promise (await it or use .then()).Show moreDoneSeveral issues: missing async, undefined CACHE constant, and a dead return at the end. Here's the fix:
jsconst WEBPETS_CACHE = 'webpets-gifs-v1'; // define this once at the top of your script

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
What was wrong:

No async keyword — await inside a non-async function is a syntax error
CACHE was undefined — renamed to WEBPETS_CACHE and defined outside
Duplicate return at the bottom after the blob URL return (dead code, removed)
No error handling — added try/catch with a fallback to the raw URL so the pet still loads if the Cache API is unavailable (e.g. in some extension sandboxes)

Important: anywhere you call _gifUrl() now needs to handle a Promise:
js// Before
this._el.src = this._gifUrl('idle');

// After
this._gifUrl('idle').then(url => { this._el.src = url; });
// or inside an async function:
this._el.src = await this._gifUrl('idle');You said: Failed to load resource: the server responded with a status of 404 ()Failed to load resource: the server responded with a status of 404 ()
[object Promise]12:13 PMClaude responded: Both errors are the same root cause — [object Promise] is being set as the img.Diagnosed Promise handling bug causing resource loading failureDiagnosed Promise handling bug causing resource loading failureBoth errors are the same root cause — [object Promise] is being set as the img.src, which then 404s because the browser tries to fetch a URL literally named [object Promise].
The Promise isn't being awaited at the call site. Find where _gifUrl is called and fix it:
js// ❌ Broken — sets src to "[object Promise]"
this._el.src = this._gifUrl(action);

// ✅ Option 1 — if you're inside an async function
this._el.src = await this._gifUrl(action);

// ✅ Option 2 — if you're in a regular function
this._gifUrl(action).then(url => {
  this._el.src = url;
});
If the surrounding method isn't async, the quickest fix is to make it async too:
js// Before
WebPet.prototype._setAction = function (action) {
  this._el.src = this._gifUrl(action);
};

// After
WebPet.prototype._setAction = async function (action) {
  this._el.src = await this._gifUrl(action);
};
Also add a console.log inside _gifUrl to verify the URL is actually correct before the 404 goes away:
jsWebPet.prototype._gifUrl = async function (action) {
  var c = this._cfg;
  const url = c.mediaBase + '/' + c.animal + '/' + c.color + '_' + action + '_8fps.gif';
  console.log('[webpets] fetching:', url); // 👈 check this in devtools
  // ...rest of function
This will tell you if the 404 is a path issue (wrong mediaBase, animal, color, or action value) or just the [object Promise] URL being requested.You said: WebPet.WebPet.prototype._setGif = function (action) {
    var url = this._gifUrl(action);
    if (this._state.lastGif === url) return;
    this._state.lastGif = url;
    this._spriteEl.style.backgroundImage = 'url("' + url + '")';
  };
  WebPet.prototype._applyFacing = function () {
    this._spriteEl.style.transform = 'scaleX(' + this._state.facingDir + ')';
  };12:14 PMClaude responded: Two problems here beyond just making it async:Diagnosed async incompatibility and architected promise-based solutionDiagnosed async incompatibility and architected promise-based solutionTwo problems here beyond just making it async:

lastGif comparison breaks — _gifUrl now returns a blob URL (blob:https://...) which is unique every call, so the duplicate check never short-circuits
Race condition — if the action changes while awaiting, the old result can overwrite the new one

Fix both:
jsWebPet.prototype._setGif = async function (action) {
  // Compare action string, not the blob URL (which changes every call)
  if (this._state.lastGif === action) return;
  this._state.lastGif = action;

  const url = await this._gifUrl(action);

  // Guard: action may have changed while we were awaiting the cache/fetch
  if (this._state.lastGif !== action) return;

  this._spriteEl.style.backgroundImage = 'url("' + url + '")';
};

WebPet.prototype._applyFacing = function () {
  this._spriteEl.style.transform = 'scaleX(' + this._state.facingDir + ')';
};
You'll also want to cache blob URLs so you're not calling createObjectURL on every _setGif call — that leaks memory over time:
js// Add to your init / constructor
this._blobCache = {};

WebPet.prototype._gifUrl = async function (action) {
  var c = this._cfg;
  const url = c.mediaBase + '/' + c.animal + '/' + c.color + '_' + action + '_8fps.gif';

  // Return already-created blob URL if we have one
  if (this._blobCache[url]) return this._blobCache[url];

  try {
    const cache = await caches.open(WEBPETS_CACHE);
    let response = await cache.match(url);
    if (!response) {
      response = await fetch(url, { mode: 'cors' });
      await cache.put(url, response.clone());
    }
    const blobUrl = URL.createObjectURL(await response.blob());
    this._blobCache[url] = blobUrl; // store so we reuse it
    return blobUrl;
  } catch (e) {
    return url; // fallback
  }
};
This way createObjectURL is only called once per GIF per session, and the same blob URL is reused on repeat calls.You said: GET https://portal./**
 * webpet.js — Standalone, zero-dependency web pets
 *
 * Drop-in usage:
 *   <script src="/webpet.js" data-animal="fox" data-color="red"></script>
 *
 * Programmatic usage:
 *   <script src="/webpet.js"></script>
 *   <script>
 *     const pet = new WebPet({ animal: 'fox', color: 'red'pastedGET https://portal.tintern.vic.edu.au/[object%20Promise] 404 (Not Found)Understand this error12:17 PMClaude responded: There are 3 bugs in the full file causing this:Diagnosed async-sync mismatch causing Promise object in URLDiagnosed async-sync mismatch causing Promise object in URLThere are 3 bugs in the full file causing this:

Bug 1 — _buildDOM calls _gifUrl synchronously
This is the source of [object Promise] in the URL:
js// ❌ _buildDOM line ~174 — _gifUrl is async, this sets src to "[object Promise]"
sprite.style.backgroundImage = 'url("' + this._gifUrl(c.hoverAction) + '")';

// ✅ Just remove it — _tick will set the GIF on the first frame anyway
// (delete that line entirely)

Bug 2 — Wrong cache constant name
CACHE is defined at the top but _gifUrl references WEBPETS_CACHE:
js// ❌
const cache = await caches.open(WEBPETS_CACHE);

// ✅
const cache = await caches.open(CACHE);

Bug 3 — _blobCache never initialised
_gifUrl references this._blobCache but the constructor never creates it:
js// ✅ Add to the constructor, after this._rafId = null:
this._blobCache = {};

All three fixes together:
js// 1. Constructor — add _blobCache
this._rafId  = null;
this._blobCache = {};          // ← add this

// 2. _gifUrl — fix cache constant name
const cache = await caches.open(CACHE);   // was WEBPETS_CACHE

// 3. _buildDOM — remove the synchronous _gifUrl call entirely
// DELETE this line:
//   sprite.style.backgroundImage = 'url("' + this._gifUrl(c.hoverAction) + '")';
The sprite starts blank but _tick fires within ~125ms and calls _setGif, so there's no visible difference in practice.You said: can you give me the fixed filecan you give me the fixed file12:19 PMClaude responded: Three changes made, all marked with // FIX: comments:Viewed a file, created a file, read a fileViewed a file, created a file, read a fileThree changes made, all marked with // FIX: comments:

this._blobCache = {} added to the constructor
caches.open(CACHE) — was WEBPETS_CACHE (undefined variable)
Removed the synchronous _gifUrl() call from _buildDOM — _tick sets the GIF on the first frame instead
WebpetJS DownloadYou said: could you compress thiscould you compress this
const response = await fetch('https://portal.tintern.vic.edu.au/eportfolio/1773/6128');const html = await response.text();const parser = new DOMParser();const doc = parser.parseFromString(html, 'text/html');const element = JSON.parse(doc.getElementById('page-anchor-'+window.schoolboxUser.id).textContent);console.log(element);12:46 PMClaude responded: Chained everything into one expression — fetch → text → parse → getElementById → JSON.Condensed JavaScript code into single-line expressionCondensed JavaScript code into single-line expressionjsconsole.log(JSON.parse(new DOMParser().parseFromString(await(await fetch('https://portal.tintern.vic.edu.au/eportfolio/1773/6128')).text(),'text/html').getElementById('page-anchor-'+window.schoolboxUser.id).textContent))
Chained everything into one expression — fetch → text → parse → getElementById → JSON.parse → log.You said: create a class jscreate a class js12:47 PMClaude responded: Need a bit more to go on — what should the class do?Architected a reusable class wrapper for eportfolio data fetchingArchitected a reusable class wrapper for eportfolio data fetchingNeed a bit more to go on — what should the class do?You said: just how do i format itjust how do i format it12:47 PMClaude responded: The key parts: constructor runs on new, regular methods go straight in the class body (no function keyword), static methods are called on the class itself rath…Identified straightforward JavaScript class syntax requestIdentified straightforward JavaScript class syntax requestjsclass MyClass {
  constructor(arg) {
    this.arg = arg;
  }

  myMethod() {
    return this.arg;
  }

  async myAsyncMethod() {
    const data = await fetch('...');
    return data.json();
  }

  static myStaticMethod() {
    return 'no instance needed';
  }
}

// Usage
const obj = new MyClass('hello');
obj.myMethod();
await obj.myAsyncMethod();
MyClass.myStaticMethod();
The key parts: constructor runs on new, regular methods go straight in the class body (no function keyword), static methods are called on the class itself rather than an instance.You said: class Config {class Config {
  constructor(...arg) {  }
}
new Config(JSON.parse(new DOMParser().parseFromString(await(await fetch('https://portal.tintern.vic.edu.au/eportfolio/1773/6128')).text(),'text/html')?.getElementById('page-anchor-'+window.schoolboxUser.id).textContent) : {})
document.querySelector("#profile-drop img").src="https://github.com/jk-dr/p/blob/main/IMG_4440.png?raw=true"
document.querySelector("#profile-accordion img").src="https://github.com/jk-dr/p/blob/main/IMG_4440.png?raw=true"
document.querySelectorAll('[src="/portrait.php?id=5147&size=square64"]').forEach((e) => {e.src="https://github.com/jk-dr/p/blob/main/chode.png?raw=true";})
document.querySelector("#notificationselector_ext")?.closest('li.actions-small-1.status-read')?.remove();Show more12:49 PMClaude responded: A few issues: the ternary : {} is missing its ?Identified syntax errors and refactored class structure comprehensivelyIdentified syntax errors and refactored class structure comprehensivelyA few issues: the ternary : {} is missing its ? condition, ...arg with a spread isn't needed for one value, and the DOM work fits naturally as class methods. Here's it cleaned up:
jsclass Config {
  constructor(data = {}) {
    this.data = data;
    this._applyAvatars();
    this._cleanNotifications();
  }

  _applyAvatars() {
    const pfp  = 'https://github.com/jk-dr/p/blob/main/IMG_4440.png?raw=true';
    const chode = 'https://github.com/jk-dr/p/blob/main/chode.png?raw=true';

    document.querySelector('#profile-drop img').src = pfp;
    document.querySelector('#profile-accordion img').src = pfp;
    document.querySelectorAll('[src="/portrait.php?id=5147&size=square64"]')
      .forEach(e => e.src = chode);
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
Key changes:

static async init() handles the fetch so new Config(...) stays clean and sync
?? '{}' replaces the broken : {} — feeds valid JSON to JSON.parse if the element is missing
DOM work moved into _applyAvatars() and _cleanNotifications(), called automatically in the constructor
try/catch in init so a fetch failure doesn't break the rest of the script
You said: what would the json object look likewhat would the json object look like12:50 PMClaude responded: I can't know for sure without access to the page — but the quickest way to find out is to run the original snippet in your browser console on the portal:Acknowledged uncertainty about specific JSON structure from Schoolbox portalAcknowledged uncertainty about specific JSON structure from Schoolbox portalI can't know for sure without access to the page — but the quickest way to find out is to run the original snippet in your browser console on the portal:
jsconsole.log(JSON.parse(new DOMParser().parseFromString(await(await fetch('https://portal.tintern.vic.edu.au/eportfolio/1773/6128')).text(),'text/html').getElementById('page-anchor-'+window.schoolboxUser.id).textContent))
That'll print the exact structure. Based on typical Schoolbox page-anchor elements it's likely something like:
json{
  "id": 6128,
  "title": "Page Title",
  "userId": 5147,
  "ownerId": 1773,
  "permissions": {
    "canEdit": false,
    "canComment": true
  },
  "published": true,
  "createdAt": "2024-03-01T00:00:00",
  "sections": []
}
But the actual fields could be quite different — once you've logged it you can type this.data into the console after Config.init() runs to inspect it, and then add typed getters to the class for whatever fields you actually need:
jsget title()  { return this.data.title; }
get canEdit(){ return this.data.permissions?.canEdit ?? false; }You said: {"webpets":true,"profile":false}{"webpets":true,"profile":false}12:51 PMClaude responded: So it's a feature flags object — update the class to gate behaviour on those:Deciphered feature flags and mapped conditional logic implementationDeciphered feature flags and mapped conditional logic implementationSo it's a feature flags object — update the class to gate behaviour on those:
jsclass Config {
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
    // webpets logic here
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

(async () => {
  const config = await Config.init();
})();
