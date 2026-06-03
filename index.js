(function(){

if (window.__TC_ACTIVE__) return;

function injectCleanMode() {
  if (window.__TC_ACTIVE__) return;
  window.__TC_ACTIVE__ = true;

var style = document.createElement('style');
style.textContent = `/* ============================================================
   MyTintern Clean Mode — content.css
   Injected into portal.tintern.vic.edu.au at runtime
   Design language: Utilitarian / editorial — clean whites,
   deep navy accent, mono type for data, generous spacing.
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

/* ── 0. CSS VARIABLES ─────────────────────────────────────── */
:root {
  --bg:        #0f1117;
  --surface:   #1a1d27;
  --border:    #2e3244;
  --navy:      #0c1623;
  --navy-dark: #2e4a7a;
  --accent:    #c7cad2;
  --white: #fff;
  --accent-lt: #1e2a45;
  --green:     #4caf82;
  --amber:     #f0a843;
  --red:       #e05c6a;
  --text:      #e8eaf2;
  --muted:     #7a7f9a;
  --pill-r:    6px;
  --nav-h:     56px;
  --sans:      'IBM Plex Sans', sans-serif;
  --mono:      'IBM Plex Mono', monospace;
  --shadow:    0 1px 3px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2);
  --sbx-color-text-primary: white;
  --sbx-color-foreground-primary: #1a1d27;
  --content-ui-submit-foreground: #1a1d27;
  --content-ui-submit-background: white !important;
  --content-ui-foreground: rgb(206, 201, 201);
  --content-ui-background: #291ec7;
  --sbx-config-color-active: #958fe7;
  --sbx-config-color-accent:  rgb(206, 201, 201);
  --sbx-color-border: rgb(39, 50, 144);
  --sbx-color-foreground-secondary: #232222;
}

/* ── 1. GLOBAL RESET ──────────────────────────────────────── */
body.tintern-clean,
body.tintern-clean * {
  box-sizing: border-box;
}

body.tintern-clean {
  background: var(--bg) !important;
  font-family: var(--sans) !important;
  color: var(--text) !important;
  margin: 0 !important;
  padding-top: var(--nav-h) !important;
  background-size: cover;
  background-position: center;
  background-attachment: fixed !important;
}



/* Kill the original Schoolbox chrome */
body.tintern-clean #left-off-canvas,
body.tintern-clean #right-off-canvas,
body.tintern-clean .off-canvas-wrap,
body.tintern-clean .move-right,
body.tintern-clean .inner-wrap > .row:first-child:not(#tc-nav-row),
body.tintern-clean .hybrid-bar,          /* original top nav */
body.tintern-clean #hybrid-bar,
body.tintern-clean .tab-bar,
body.tintern-clean .breadcrumb,
body.tintern-clean .global-footer,
body.tintern-clean footer,
body.tintern-clean .panel-left,
body.tintern-clean #nav,
body.tintern-clean .left-off-canvas-menu,
body.tintern-clean .right-off-canvas-menu,
body.tintern-clean .exit-off-canvas,
body.tintern-clean .off-canvas-overlap,
body.tintern-clean .schoolbox-alerts,
body.tintern-clean [data-tile-list],       /* image tile grids */
body.tintern-clean .news-summary,
body.tintern-clean .news-list,
body.tintern-clean .news-article,
body.tintern-clean .school-logo,
body.tintern-clean .c-header-search,
body.tintern-clean #account-content,
body.tintern-clean .portrait-column,
body.tintern-clean .column-right,         /* original Schoolbox right sidebar */
body.tintern-clean .column-left,          /* original Schoolbox left column */
body.tintern-clean .column-top {          /* original Schoolbox top column */
  display: none !important;
}

/* ── 2. OUR INJECTED NAV BAR ──────────────────────────────── */
#tc-clean-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-h);
  background: var(--navy);
  display: flex;
  align-items: center;
  padding: 0 0 0 20px;
  gap: 8px;
  z-index: 99999;
  box-shadow: 0 2px 12px rgba(0,0,0,.25);
  font-family: var(--sans);
}

#tc-clean-nav .tc-logo {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.04em;
  text-decoration: none;
  white-space: nowrap;
  padding-right: 16px;
  border-right: 1px solid rgba(255,255,255,.2);
  margin-right: 8px;
}

#tc-clean-nav .tc-logo span {
  opacity: 0.55;
  font-weight: 400;
}

#tc-clean-nav .tc-nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

#tc-clean-nav .tc-nav-links::-webkit-scrollbar { display: none; }

#tc-clean-nav .tc-nav-links a {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,.75);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  white-space: nowrap;
  transition: background .15s, color .15s;
}

#tc-clean-nav .tc-nav-links a:hover,
#tc-clean-nav .tc-nav-links a.active {
  background: rgba(255,255,255,.15);
  color: #fff;
}

#tc-clean-nav .tc-nav-links a.active {
  background: rgba(255,255,255,.2);
  color: #fff;
}

#tc-clean-nav .tc-user {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-shrink: 0;
}

#tc-clean-nav .tc-user-name {
  font-size: 13px;
  color: rgba(255,255,255,.7);
  font-family: var(--sans);
}

#tc-clean-nav .tc-logout {
  font-size: 12px;
  color: rgba(255,255,255,.5);
  text-decoration: none;
  font-family: var(--sans);
  padding: 4px 10px;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 4px;
  transition: all .15s;
}
#tc-clean-nav .tc-logout:hover {
  background: rgba(255,255,255,.1);
  color: #fff;
}

/* ── 3. PAGE WRAPPER ──────────────────────────────────────── */
#tc-clean-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 24px 60px;
  font-family: var(--sans);
}

/* ── 4. PAGE TITLE ────────────────────────────────────────── */
#tc-clean-page .tc-page-title {
  font-family: var(--sans);
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px;
  line-height: 1.2;
}

#tc-clean-page .tc-page-title small {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: var(--muted);
  margin-top: 3px;
  font-family: var(--mono);
}

/* ── 5. CARD ──────────────────────────────────────────────── */
.tc-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  font-family: var(--sans);
}

.tc-card-header {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tc-card-header h2 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--muted);
  margin: 0;
  font-family: var(--mono);
}

.tc-card-header a {
  font-size: 12px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-family: var(--sans);
}
.tc-card-header a:hover { text-decoration: underline; }

.tc-card-body {
  padding: 16px 20px;
}

/* ── 6. GRID LAYOUT ───────────────────────────────────────── */
.tc-grid {
  display: grid;
  gap: 16px;
}

.tc-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.tc-grid-3 {    grid-template-columns: repeat(3, minmax(0, 1fr));}
.tc-grid-main { grid-template-columns: 2fr 1fr; }
.tc-grid-full  { grid-template-columns: 1fr; }

@media (max-width: 800px) {
  .tc-grid-2,
  .tc-grid-3,
  .tc-grid-main { grid-template-columns: 1fr; }
}

/* ── 7. DASHBOARD — TODAY'S TIMETABLE ─────────────────────── */
.tc-today-row {
  display: grid;
  gap: 1px;
  background: var(--border);
}

.tc-period {
  display: grid;
  grid-template-columns: 128px auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: var(--surface);
  transition: all .15s ease;
  /* Reset link styles */
  text-decoration: none !important;
  color: inherit !important;
  cursor: pointer;
}

/* Subtle hover effect so the user knows it's clickable */
.tc-period:hover {
  background: var(--bg);
  padding-left: 24px; /* Slight shift to the right on hover */
}

.tc-due-item:hover {
  background: var(--bg);
}

/* Ensure free periods don't look clickable or change color */
.tc-period.free {
  cursor: default;
  pointer-events: none; /* Disables clicking on Free periods */
}

.tc-period:hover, .tc-due-item:hover { background: #404142; }

.tc-period.current {
  background: var(--accent-lt);
  border-left: 3px solid var(--accent);
}

.tc-period-time {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  text-align: left;
  line-height: 1.4;
}

body.tintern-clean .actions-small-1>.list-item, body.tintern-clean .island .row.actions-small-1>.list-item {
    padding: 0rem !important;
    width: 100%;
}

.tc-period-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  flex-shrink: 0;
}

@media only print, screen and (min-width: 40.0625em) {
    .calendar-list>li, .marking-input-list>li, .weather-list>li, .weather-forecast>li, .action-list>li, ul.az-list>li, ul.az-error-list>li, .resource-list>li, .permission-list>li, .news-list>li, .subject-list>li, .activity-list>li, .information-list>li {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
  }


.tc-period.current .tc-period-dot { background: var(--accent); }

.tc-period-info { min-width: 0; }

.tc-period-subject {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--sans);
}

.tc-period-meta {
  font-size: 12px;
  color: var(--muted);
  font-family: var(--mono);
  margin-top: 1px;
}

.tc-period-room {
  font-family: var(--mono);
  font-size: 11px;
  background: var(--bg);
  color: var(--muted);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  white-space: nowrap;
  flex-shrink: 0;
}

.tc-period.free .tc-period-subject {
  color: var(--muted);
  font-weight: 400;
  font-style: italic;
}

/* ── 8. DUE WORK LIST ─────────────────────────────────────── */
.tc-due-list { list-style: none; margin: 0; padding: 0; }

.tc-due-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  transition: all .15s ease;
}
.tc-due-item:last-child { border-bottom: none; }

.tc-due-badge {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 4px;
  margin-top: 2px;
}

.tc-due-badge.urgent {
  background: #fee2e2;
  color: var(--red);
}

.tc-due-badge.soon {
  background: #fff3cd;
  color: var(--amber);
}

.tc-due-badge.later {
  background: var(--accent-lt);
  color: var(--accent);
}

.tc-due-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  font-family: var(--sans);
}

.tc-due-title a {
  color: inherit;
  text-decoration: none;
}
.tc-due-title a:hover { color: var(--accent); }

.tc-due-subject {
  font-size: 12px;
  color: var(--muted);
  font-family: var(--mono);
  margin-top: 2px;
}

/* ── 9. QUICK LINKS ──────────────────────────────────────── */
.tc-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}

.tc-link-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  text-decoration: none;
  color: var(--text);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--sans);
  transition: all .15s;
}
.tc-link-btn:hover {
  background: var(--accent-lt);
  border-color: var(--accent);
  color: var(--accent);
}

.tc-link-btn .tc-link-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* ── 10. TIMETABLE FULL PAGE ─────────────────────────────── */
.tc-timetable-grid {
  display: grid;
  grid-template-columns: 70px repeat(10, 1fr);
  font-family: var(--mono);
  font-size: 11px;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.tc-tt-header {
  background: var(--navy);
  color: rgba(255,255,255,.85);
  padding: 10px 6px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .04em;
}

.tc-portrait {
  height: 100%;
}


.tc-tt-time {
  background: var(--bg);
  color: var(--muted);
  padding: 10px 6px;
  text-align: right;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.tc-tt-cell {
  background: #392954;
  padding: 8px 6px;
  font-size: 11px;
  font-family: var(--sans);
  min-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tc-tt-cell .tc-tt-subj {
  font-size: 12px;
  font-weight: 300;
  color:white;
  line-height: 1.3;
}

.tc-tt-cell .tc-tt-room {
  font-size: 10px;
  color: var(--muted);
  font-family: var(--mono);
  margin-top: 2px;
}

/* Tint for the active period time indicator on the far left column */
.tc-tt-time.active-period {
  background: var(--accent-lt) !important;
  color: var(--accent) !important;
  font-weight: 600;
}

/* Clear tint and matching outline for the exact current active class block */
.tc-tt-cell.active-block {
  background: var(--accent-lt) !important;
  position: relative;
  outline: 2px solid var(--accent);
  outline-offset: -2px;
  z-index: 10; /* Keeps the outline neatly above adjacent cell borders */
}

/* Make text colors match the active theme inside the current block */
.tc-tt-cell.active-block .tc-tt-subj {
  color: var(--accent) !important;
}

.tc-tt-cell.active-block .tc-tt-room,
.tc-tt-cell.active-block .tc-tt-teacher {
  color: var(--navy) !important;
  opacity: 0.8;
}

.tc-tt-cell .tc-tt-teacher {
  font-size: 10px;
  color: var(--muted);
  font-family: var(--mono);
}

.tc-tt-cell.free {
  background: #1a1a1a;
  color: transparent;
}

.tc-tt-cell.recess,
.tc-tt-cell.lunch {
  background: var(--bg);
}

.tc-tt-cell.recess .tc-tt-subj,
.tc-tt-cell.lunch .tc-tt-subj {
  font-size: 10px;
  font-weight: 400;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .06em;
  font-family: var(--mono);
}

/* ── 11. CALENDAR ─────────────────────────────────────────── */
.tc-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.tc-cal-header {
  background: var(--navy);
  color: rgba(255,255,255,.75);
  padding: 8px;
  text-align: center;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .06em;
}

.tc-cal-day {
  background: var(--surface);
  min-height: 100px;
  padding: 8px;
}


.tc-cal-day-num {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}


.tc-cal-event {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 3px;
  margin-bottom: 2px;
  font-family: var(--sans);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--accent-lt);
  color: var(--accent);
  font-weight: 500;
}

/* ── 12. SUBJECT PAGE ─────────────────────────────────────── */
.tc-subject-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tc-subject-badge {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: var(--accent-lt);
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: .05em;
}

/* Two-column layout */
.tc-subject-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
  align-items: start;
}

@media (max-width: 800px) {
  .tc-subject-layout { grid-template-columns: 1fr; }
}

.tc-subject-main { display: flex; flex-direction: column; gap: 12px; }
.tc-subject-side  { display: flex; flex-direction: column; gap: 12px; }

/* Pinned card (Unit Resources) */
.tc-subject-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* Accordion */
.tc-accordion { display: flex; flex-direction: column; gap: 6px; }

.tc-accordion-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.tc-accordion-hdr {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--muted);
  text-align: left;
  transition: background .15s, color .15s;
  border-bottom: 1px solid transparent;
}

.tc-accordion-item.open .tc-accordion-hdr {
  border-bottom-color: var(--border);
  color: var(--text);
}

.tc-accordion-hdr:hover { background: rgba(255,255,255,.03); color: var(--text); }

.tc-accordion-chevron {
  font-size: 10px;
  color: var(--muted);
  flex-shrink: 0;
  margin-left: 12px;
}

.tc-accordion-inner { padding: 16px 20px 20px; }

.tc-subject-content .grid li .card img {
  margin: 0 10px !important;
}

/* Subject content — Schoolbox internals restyled dark */
.tc-subject-content { color: var(--text); font-family: var(--sans); }

/* Reset Foundation grid inside subject content.
   Foundation's .row uses a negative margin to cancel the ~15px padding-left
   it adds to every .columns child. We zero .row's negative margins to stop
   bleed, so we must also zero the .columns padding — otherwise Teachers,
   Students, Course Outline, Reports, etc. shift right and get cropped. */
.tc-subject-content .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}
.tc-subject-content .columns {
  padding-left: 0 !important;
  padding-right: 0 !important;
  float: none !important;
}

/* ul.grid (Teachers, Class List) gets browser/Foundation default margin-left
   ~40px which pushes content right and causes the left edge to be clipped
   by .tc-card's overflow:hidden. Reset it here. */
.tc-subject-content ul.grid,
.tc-subject-content ul.grid li {
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
}

.tc-section-list { list-style: none; margin: 0; padding: 0; }

.tc-section-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  transition: color .12s;
}
.tc-section-item:last-child { border-bottom: none; }
.tc-section-item:hover { color: var(--accent); }

.tc-section-item::before {
  content: '';
  width: 3px;
  height: 20px;
  background: var(--border);
  border-radius: 2px;
  flex-shrink: 0;
  transition: background .12s;
}
.tc-section-item:hover::before { background: var(--accent); }

.tc-section-title {
  font-size: 14px;
  font-weight: 500;
  font-family: var(--sans);
  flex: 1;
}

.tc-section-arrow { font-size: 16px; color: var(--muted); }

/* Assessment rows */
.tc-assessment-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.tc-assessment-row:last-child { border-bottom: none; }

.tc-assessment-name { font-size: 14px; font-weight: 500; font-family: var(--sans); }
.tc-assessment-name a { color: var(--text); text-decoration: none; }
.tc-assessment-name a:hover { color: var(--accent); }

.tc-assessment-type {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .06em;
}

.tc-assessment-due {
  font-family: var(--mono);
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
.tc-assessment-due.overdue { background: #fee2e2; color: var(--red); }
.tc-assessment-due.soon    { background: #fff3cd; color: var(--amber); }
.tc-assessment-due.ok      { background: var(--bg); color: var(--muted); }

/* Teacher chips */
.tc-teacher-list { display: flex; flex-wrap: wrap; gap: 8px; }

.tc-teacher-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  font-family: var(--sans);
  color: var(--text);
}

.tc-teacher-chip .tc-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--navy);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--mono);
  flex-shrink: 0;
}

/* ── 13. EMPTY STATE ──────────────────────────────────────── */
.tc-empty {
  text-align: center;
  padding: 32px 20px;
  color: var(--muted);
  font-size: 13px;
  font-family: var(--sans);
}

/* ── 14. TOGGLE BUTTON ────────────────────────────────────── */
#tc-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 18px;
  font-size: 12px;
  font-family: var(--mono);
  font-weight: 600;
  cursor: pointer;
  z-index: 99998;
  box-shadow: 0 4px 16px rgba(0,0,37,.3);
  letter-spacing: .04em;
  transition: background .15s, transform .1s;
}
#tc-toggle-btn:hover {
  background: var(--accent);
  transform: translateY(-1px);
}

/* ── 15. SCROLLBAR ────────────────────────────────────────── */
body.tintern-clean ::-webkit-scrollbar { width: 6px; height: 6px; }
body.tintern-clean ::-webkit-scrollbar-track { background: transparent; }
body.tintern-clean ::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}


/* ── 17. SOCIAL STREAM ─────────────────────────────────────── */
.tc-stream-list { list-style: none; margin: 0; padding: 0; }

.tc-stream-post {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tc-stream-post:last-child { border-bottom: none; }

.tc-stream-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tc-stream-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent);
}
.tc-stream-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tc-stream-author {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--sans);
  color: var(--text);
  text-decoration: none;
}
.tc-stream-author:hover { color: var(--accent); }

.tc-stream-time {
  font-size: 11px;
  font-family: var(--mono);
  color: var(--muted);
  margin-top: 2px;
}

.tc-stream-body {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
  font-family: var(--sans);
}

.tc-stream-attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  text-decoration: none;
  color: var(--accent);
  font-size: 12px;
  font-family: var(--mono);
  overflow: hidden;
  transition: all .15s;
}
.tc-stream-attachment span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tc-stream-attachment:hover {
  background: var(--accent-lt);
  border-color: var(--accent);
}

.tc-stream-load-more {
  margin-top: 12px;
  width: 100%;
  padding: 8px 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
  font-size: 12px;
  font-family: var(--mono);
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}
.tc-stream-load-more:hover:not(:disabled) {
  background: var(--accent-lt);
  border-color: var(--accent);
  color: var(--accent);
}
.tc-stream-load-more:disabled { opacity: 0.45; cursor: default; }
/* ── 16. HIDDEN ORIGINALS when clean mode active ─────────── */
body.tintern-clean > .off-canvas-wrap,
body.tintern-clean > .inner-wrap {
  /* let content.js handle visibility per section */
}
`;
document.head.appendChild(style);

// ── 17. Dark → light override stylesheet ─────────────────────────────────────
// A separate <style> element so the rules are easy to find / remove later.
// CSS !important in a stylesheet beats non-!important inline style="" attributes,
// so this handles both CSS-set colours AND colours Schoolbox hard-codes inline.
var tcLightStyle = document.createElement('style');
tcLightStyle.textContent = `
/* ── 17. FORCE DARK → LIGHT INSIDE CARDS ─────────────────────────────────── */
/* Broad rule: force all children to light text + transparent background.       */
/* The restore rules below put known tc- components back to their proper values.*/
.tc-card *,
.tc-card *::before,
.tc-card *::after {
  color:            var(--text)   !important;
  background-color: transparent   !important;
  border-color:     var(--border) !important;
  fill:             var(--text)   !important;
}

/* ── Restore: card shell ── */
.tc-card                             { background-color: var(--surface)   !important; }
.tc-card .tc-card-header             { background-color: var(--surface)   !important; }
.tc-card .tc-card-body               { background-color: var(--surface)   !important; }

/* ── Restore: timetable rows ── */
.tc-card .tc-period                  { background-color: var(--surface)   !important; }
.tc-card .tc-period:hover,
.tc-card .tc-due-item:hover          { background-color: #404142          !important; }
.tc-card .tc-period.current          { background-color: var(--accent-lt) !important; }
.tc-card .tc-period-room             { background-color: var(--bg)        !important; color: var(--muted) !important; }

/* ── Restore: full timetable grid ── */
.tc-card .tc-tt-header               { background-color: var(--navy)      !important; color: rgba(255,255,255,.85) !important; }
.tc-card .tc-tt-time                 { background-color: var(--bg)        !important; color: var(--muted) !important; }
.tc-card .tc-tt-time.active-period   { background-color: var(--accent-lt) !important; color: var(--accent) !important; }
.tc-card .tc-tt-cell                 { background-color: #392954          !important; }
.tc-card .tc-tt-cell .tc-tt-subj     { color: white                       !important; }
.tc-card .tc-tt-cell .tc-tt-room,
.tc-card .tc-tt-cell .tc-tt-teacher  { color: var(--muted)                !important; }
.tc-card .tc-tt-cell.free            { background-color: #1a1a1a          !important; }
.tc-card .tc-tt-cell.recess,
.tc-card .tc-tt-cell.lunch           { background-color: var(--bg)        !important; }
.tc-card .tc-tt-cell.active-block    { background-color: var(--accent-lt) !important; }
.tc-card .tc-tt-cell.active-block .tc-tt-subj { color: var(--accent)      !important; }

/* ── Restore: urgency badges ── */
.tc-card .tc-due-badge.urgent        { background-color: #fee2e2 !important; color: var(--red)    !important; }
.tc-card .tc-due-badge.soon          { background-color: #fff3cd !important; color: var(--amber)  !important; }
.tc-card .tc-due-badge.later         { background-color: var(--accent-lt) !important; color: var(--accent) !important; }

/* ── Restore: assessment due chips ── */
.tc-card .tc-assessment-due.overdue  { background-color: #fee2e2 !important; color: var(--red)    !important; }
.tc-card .tc-assessment-due.soon     { background-color: #fff3cd !important; color: var(--amber)  !important; }
.tc-card .tc-assessment-due.ok       { background-color: var(--bg) !important; color: var(--muted) !important; }

/* ── Restore: quick-link buttons ── */
.tc-card .tc-link-btn                { background-color: var(--bg)        !important; color: var(--text) !important; }
.tc-card .tc-link-btn:hover          { background-color: var(--accent-lt) !important; color: var(--accent) !important; }

/* ── Restore: teacher chips ── */
.tc-card .tc-teacher-chip            { background-color: var(--bg)        !important; }

/* ── Restore: accordion + subject cards ── */
.tc-card .tc-accordion-item          { background-color: var(--surface)   !important; }
.tc-card .tc-subject-card            { background-color: var(--surface)   !important; }
.tc-card .tc-accordion-inner         { background-color: var(--surface)   !important; }

/* ── Restore: section/assessment list items ── */
.tc-card .tc-section-item            { color: var(--text) !important; }
.tc-card .tc-section-item:hover      { color: var(--accent) !important; }
.tc-card .tc-assessment-name a       { color: var(--text) !important; }
.tc-card .tc-assessment-name a:hover { color: var(--accent) !important; }
.tc-card .tc-assessment-type         { color: var(--muted) !important; }
`;
document.head.appendChild(tcLightStyle);

/**
 * MyTintern Clean Mode — content.js
 * Hooks into portal.tintern.vic.edu.au at document_end and replaces
 * the Schoolbox UI with a clean, accessible interface for Year 11/12 students.
 *
 * Strategy: inject our own DOM layer on top, hide original page sections,
 * and pull real data from the already-rendered original markup.
 */

(function () {
  'use strict';

  /* ─── CONSTANTS ─────────────────────────────────────────── */
  const PORTAL = 'https://portal.tintern.vic.edu.au';

  const NAV_LINKS = [
    { label: 'Home',               href: PORTAL + '/',                        match: /^\/$/ },
    { label: 'Classes',            href: PORTAL + '/learning/classes',         match: /\/learning\/classes/ },
    { label: 'Due Work',           href: PORTAL + '/learning/due',             match: /\/learning\/due/ },
    { label: 'Learning Activities',href: PORTAL + '/learning/activities',      match: /\/learning\/activities/ },
    { label: 'Timetable',          href: PORTAL + '/timetable',                match: /\/timetable/ },
    { label: 'Calendar',           href: PORTAL + '/calendar/week',            match: /\/calendar/ },
    { label: 'Grades',             href: PORTAL + '/learning/grades',          match: /\/learning\/grades/ },
    { label: 'Outlook',            href: 'https://outlook.office.com/',        match: null, external: true }
  ];

  /* ─── HELPERS ────────────────────────────────────────────── */

  document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href]');
    if (!a) return;

    const href = a.href;

    // Ignore external links
    if (new URL(href).origin !== location.origin) {
      return;
    }

    e.preventDefault();

    // Tell parent to show loader and hide iframe
    parent.postMessage({
      type: 'tc-navigate',
      href
    }, '*');
  }, true);

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

  function el(tag, props = {}, ...children) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else e.setAttribute(k, v);
    }
    children.forEach(c => c && e.append(typeof c === 'string' ? document.createTextNode(c) : c));
    return e;
  }

  function getPath() { return window.location.pathname; }

  function detectPage() {
    const p = getPath();
    if (p === '/' || p === '') return 'dashboard';
    if (p.startsWith('/timetable')) return 'timetable';
    if (p.startsWith('/calendar')) return 'calendar';
    // NOTE: /learning/classes must be checked before /learning/class
    // to prevent the 'subject' route swallowing the classes list page.
    if (p.startsWith('/learning/classes')) return 'classes';
    if (p.startsWith('/learning/activities')) return 'activities';
    if (p.startsWith('/learning/due')) return 'due';
    if (p.startsWith('/learning/grades')) return 'grades';
    if (p.startsWith('/homepage') || p.startsWith('/learning/class')) return 'subject';
    return 'generic';
  }

  function readBootstrapObjectFromScripts(varName) {
    const scriptText = [...document.scripts].map(s => s.textContent || '').join('\n');
    const patterns = [
      new RegExp(String.raw`${varName}\s*=\s*({[\s\S]*?})\s*;`),
      new RegExp(String.raw`window\.${varName}\s*=\s*({[\s\S]*?})\s*;`),
    ];

    for (const re of patterns) {
      const m = scriptText.match(re);
      if (!m) continue;
      try {
        return JSON.parse(m[1]);
      } catch (_) {
        try {
          return Function(`"use strict"; return (${m[1]});`)();
        } catch (_) {
          /* ignore */
        }
      }
    }
    return null;
  }

  function readBootstrapStringProperty(varName, prop) {
    const scriptText = [...document.scripts].map(s => s.textContent || '').join('\n');
    const re = new RegExp(String.raw`${varName}\.${prop}\s*=\s*["']([^"']+)["']\s*;`);
    const m = scriptText.match(re);
    return m ? m[1] : '';
  }


  /* ─── USER INFO ──────────────────────────────────────────── */
  function getUserInfo() {
    const live = (window.schoolboxUser && typeof window.schoolboxUser === 'object') ? window.schoolboxUser : {};
    const parsed = readBootstrapObjectFromScripts('schoolboxUser') || {};
    const nameFromScript = readBootstrapStringProperty('schoolboxUser', 'name');

    return {
      name:
        live.preferredName ||
        live.firstname ||
        parsed.preferredName ||
        parsed.firstname ||
        nameFromScript ||
        parsed.fullName ||
        live.fullName ||
        'Student',
      fullName: live.fullName || parsed.fullName || nameFromScript || '',
      id: parsed.id,
      year: live.year || parsed.year || '',
      email: live.email || parsed.email || '',
      impersonated: !!(live.impersonated || parsed.impersonated),
    };
  }

  /* ─── INJECT TOP NAV ─────────────────────────────────────── */
  function buildNav() {
    const user = getUserInfo();
    const path = getPath();

    const nav = el('div', { id: 'tc-clean-nav' });

    // Logo
    const logo = el('a', { class: 'tc-logo', href: PORTAL + '/' });
    logo.innerHTML = 'MyTintern';
    nav.append(logo);

    // Links
    const linksWrap = el('div', { class: 'tc-nav-links' });
    NAV_LINKS.forEach(link => {
      const a = el('a', {
        href: link.href,
        ...(link.external ? { target: '_blank', rel: 'noopener' } : {})
      }, link.label);
      if (link.match && link.match.test(path)) a.classList.add('active');
      linksWrap.append(a);
    });
    nav.append(linksWrap);

    // User
    const userDiv = el('div', { class: 'tc-user' });
    if (user.name) {
      const yr = user.year ? ` · Yr ${user.year}` : '';
      userDiv.append(el('span', { class: 'tc-user-name' }, `${user.name}${yr}`));
    }
    userDiv.append(el('a', { class: 'tc-logout', href: PORTAL + '/logout.php' }, 'Logout'));
    userDiv.append(el('img', { class: 'tc-portrait', src: `https://portal.tintern.vic.edu.au/portrait.php?id=${getUserInfo().id}&size=square192`}, ''))
    nav.append(userDiv);

    document.body.prepend(nav);
  }

  /* ─── TOGGLE BUTTON ──────────────────────────────────────── */
  function buildToggle() {
    const btn = el('button', { id: 'tc-toggle-btn' }, '↩ Original');
    btn.title = 'Toggle between Clean Mode and original Schoolbox UI';
    btn.addEventListener('click', () => {
      const isClean = document.body.classList.toggle('tintern-clean');
      const page = qs('#tc-clean-page');
      const orig = qs('#tc-original-content');
      if (isClean) {
        btn.textContent = '↩ Original';
        if (page) page.style.display = '';
        if (orig) orig.style.display = 'none';
      } else {
        btn.textContent = '⚡ Alt';
        if (page) page.style.display = 'none';
        if (orig) orig.style.display = '';
      }
    });
    document.body.append(btn);
  }

  /* ─── WRAP ORIGINAL CONTENT ──────────────────────────────── */
  function wrapOriginal() {
    // Find the main page content container
    const selectors = ['.inner-wrap', '.main-content', '#content', '.off-canvas-wrap'];
    let origEl = null;
    for (const s of selectors) {
      origEl = qs(s);
      if (origEl) break;
    }
    if (origEl && !qs('#tc-original-content')) {
      origEl.id = 'tc-original-content';
      origEl.style.display = 'none'; // hide by default in clean mode
    }
  }

  /* ─── CARD BUILDER ───────────────────────────────────────── */
  function card(title, linkHref, linkLabel, bodyContent) {
    const c = el('div', { class: 'tc-card' });

    const hdr = el('div', { class: 'tc-card-header' });
    hdr.append(el('h2', {}, title));
    if (linkHref) hdr.append(el('a', { href: linkHref }, linkLabel || 'View all →'));
    c.append(hdr);

    const body = el('div', { class: 'tc-card-body' });
    if (typeof bodyContent === 'string') body.innerHTML = bodyContent;
    else if (bodyContent) body.append(bodyContent);
    c.append(body);

    return c;
  }

  function getRelativeGreeting() {
    const hours = new Date().getHours();
    if (hours < 12) {
      return 'Good morning';
    } else if (hours < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE: DASHBOARD
  ═══════════════════════════════════════════════════════════ */
  function buildDashboard(wrap) {
    const user = getUserInfo();

    // Title
    const now = new Date();
    const dayStr = now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
    const titleEl = el('div', { class: 'tc-page-title' }, `${getRelativeGreeting()}, ${user.name}`);
    titleEl.append(el('small', {}, dayStr));
    wrap.append(titleEl);

    // Main grid
    const grid = el('div', { class: 'tc-grid tc-grid-main' });

    // ── LEFT: timetable today (top-left, always first) + quick links (files) + news
    const left = el('div', { class: 'tc-grid tc-grid-full', style: 'gap:16px' });

    console.log(document.querySelectorAll('.timetable-small table tr'));

    // Timetable MUST be top-left — always the first item in the left column
    left.append(buildTodayCard());

    // Quick links (includes My Files) SHOULD be on the left
    left.append(buildQuickLinks());

    // News — polls for Schoolbox's AJAX-loaded news items
    const newsContainerEl = qs('[id^="news-container-"]');
    if (newsContainerEl) {
      const newsSlot = el('div', { class: 'tc-news-slot' });
      left.append(newsSlot);
      buildNewsCard(newsSlot);
    }

    // ── RIGHT: upcoming due work + my links
    const right = el('div', { class: 'tc-grid tc-grid-full', style: 'gap:16px' });

    right.append(buildMyLinks());

    // Due work needs polling — the widget may not be in the DOM at paint time.
    const dueSlot = el('div');
    dueSlot.append(card('Upcoming Due Work', PORTAL + '/learning/due', 'See all →',
      el('div', { class: 'tc-empty' }, '⏳ Loading…')));
    right.append(dueSlot);

    let dueAttempts = 0;
    function pollDue() {
      // Scope to the UpcomingWorkController widget so we don't get tricked by
      // assessment links inside the notifications/messages panel (#msg-content).
      const widget = qs('.Schoolbox_Learning_Component_Dashboard_UpcomingWorkController')
        || qs('[class*="UpcomingWorkController"]')
        || qs('ul.action-list:not(#msg-content)');
      const searchRoot = widget || document;
      const hasItems = qs('a.title[href*="/learning/assessments/"]', searchRoot) !== null;
      if (hasItems || dueAttempts >= 10) {
        dueSlot.innerHTML = '';
        dueSlot.append(buildDueCard());
        return;
      }
      dueAttempts++;
      setTimeout(pollDue, 500);
    }
    pollDue();

    grid.append(left, right);
    wrap.append(grid);
  }

  function buildTodayCard() {
  const periods = extractTodayPeriods();
  const dayLabel = qs('[data-timetable-header]')?.textContent?.trim() || 'Today';
  const bodyEl = el('div', { class: 'tc-today-row' });

  if (periods.length === 0) {
    bodyEl.append(el('div', { class: 'tc-empty' }, 'No timetable data found for today.'));
  } else {
    periods.forEach(p => {
      // 1. Change 'div' to 'a' and add the href attribute
      const row = el('a', { 
        href: p.url ? p.url : "#", 
        class: 'tc-period' + (p.isCurrent ? ' current' : '')
      });

      const timeEl = el('div', { class: 'tc-period-time' }, p.time || '');
      const dot = el('div', { class: 'tc-period-dot' });
      if (p.color && !p.isFree) {
        dot.style.backgroundColor = p.color;
        dot.style.border = '1px solid rgba(0,0,0,0.1)';
        dot.style.transform = 'scale(1.2)';
      }
      const info = el('div', { class: 'tc-period-info' });
      
      const subjText = p.isFree ? 'Free Period' : (p.subject);
      info.append(el('div', { class: 'tc-period-subject' }, subjText));
      
      if (p.teacher && !p.isFree) {
        info.append(el('div', { class: 'tc-period-meta' }, p.teacher));
      }
      
      row.append(timeEl, dot, info);
      
      if (p.room && !p.isFree) {
        row.append(el('div', { class: 'tc-period-room' }, p.room));
      } else {
        row.append(el('div'));
      }
      
      bodyEl.append(row);
    });
  }

  const c = el('div', { class: 'tc-card' });
  const hdr = el('div', { class: 'tc-card-header' });
  hdr.append(el('h2', {}, `Today · ${dayLabel}`));
  hdr.append(el('a', { href: PORTAL + '/timetable' }, 'Full timetable →'));
  c.append(hdr, bodyEl);
  return c;
}


  function extractTodayPeriods() {
    const periods = [];

    // 1. Target ONLY the mobile table to avoid duplicates from the desktop view.
    const rows = document.querySelectorAll('.timetable-small table tr');
    console.log(rows, window.location)

    if (rows.length > 0) {
      rows.forEach(row => {
        const th = row.querySelector('th');
        const td = row.querySelector('td');

        if (!th || !td) return;

        // 2. Extract Time from the header
        const timeEl = th.querySelector('time.meta');
        const time = timeEl ? timeEl.textContent.trim() : '';

        // 3. Determine if this is the active period
        const isCurrent = th.classList.contains('timetable-period-active') || 
                          td.querySelector('.timetable-subject-active') !== null;

        // 4. Extract Subject details
        const subjEl = td.querySelector('.timetable-subject');

        if (subjEl) {
          const bgColor = subjEl.style.backgroundColor || ''; // <-- Extract color
          const subjLinkEl = td.querySelector('.timetable-subject span, .timetable-subject a');
          const subjName = subjLinkEl?.textContent?.trim() || '';
          const subjUrl = subjLinkEl?.getAttribute('href') || '#'; // <--- Capture the URL
          
          // The room is usually the last div inside the timetable-subject
          const infoDivs = subjEl.querySelectorAll('div');
          const room = infoDivs.length >= 2 ? infoDivs[infoDivs.length - 1].textContent.trim() : '';

          periods.push({
            subject: subjName,
            room: room,
            url: subjUrl,
            teacher: '', // Teacher isn't explicitly visible in this specific HTML snippet
            time: time,
            isCurrent: isCurrent,
            isFree: false,
            color: bgColor
          });
        } else {
          // If there is no subject div, it's a break or assembly
          // Grab the text node from the header (ignoring the <time> tag)
          let periodName = th.childNodes[0]?.textContent?.trim() || 'Free Period';

          periods.push({
            subject: periodName,
            room: '',
            teacher: '',
            time: time,
            isCurrent: isCurrent,
            isFree: true
          });
        }
      });
    }

    // Fallback if no table is found
    if (periods.length === 0) {
      const PERIOD_TIMES = [];
    }

    return periods;
  }

  function buildDueCard(limit = 6) {
    const items = extractDueWork();

    const listEl = el('ul', { class: 'tc-due-list' });
    if (items.length === 0) {
      listEl.append(el('li', { class: 'tc-empty' }, '✓ Nothing overdue — you\'re on top of it!'));
    } else {
      (limit ? items.slice(0, limit) : items).forEach(item => {
        const li = el('li', { class: 'tc-due-item', style: 'cursor:pointer;' });
        li.addEventListener('mouseenter', () => { li.style.boxShadow = '0 2px 8px rgba(0,37,122,.12)'; });
        li.addEventListener('mouseleave', () => { li.style.boxShadow = ''; });
        if (item.href) li.addEventListener('click', () => { window.location.href = item.href; });

        // Urgency badge
        const daysLeft = item.daysLeft ?? 999;
        const badgeClass = daysLeft <= 1 ? 'urgent' : daysLeft <= 5 ? 'soon' : 'later';
        const badgeText = daysLeft <= 0 ? 'DUE' : daysLeft === 1 ? 'TMRW' : `${daysLeft}d`;
        li.append(el('span', { class: `tc-due-badge ${badgeClass}` }, badgeText));

        const info = el('div', {});
        const titleEl = el('div', { class: 'tc-due-title' });
        if (item.href) {
          titleEl.append(el('a', { href: item.href }, item.title));
        } else {
          titleEl.textContent = item.title;
        }
        info.append(titleEl);

        const metaLine = [];
        if (item.subject) metaLine.push(item.subject);
        if (item.dateStr) metaLine.push(item.dateStr);
        if (metaLine.length > 0) {
          info.append(el('div', { class: 'tc-due-subject' }, metaLine.join(' · ')));
        }

        li.append(info);
        listEl.append(li);
      });
    }

    return card('Upcoming Due Work', limit == 0 ? "" : PORTAL + '/learning/due', limit == 0 ? "" : 'See all →', listEl);
  }

  function extractDueWork() {
    const results = [];
    const seen = new Set();

    // ── Strategy 1: Scope to the correct container for due work.
    // There are TWO different ul.action-list elements on the homepage:
    //   1. #msg-content.action-list  — the notifications/messages panel (NOT due work)
    //   2. ul.action-list on /learning/due — the actual due work list
    // On the dashboard homepage, due work lives in ul.information-list inside
    // .Schoolbox_Learning_Component_Dashboard_UpcomingWorkController.
    // We must prefer the UpcomingWorkController scope on the dashboard to avoid
    // accidentally scoping to the messages panel instead.
    //
    // Structure per item (both /learning/due and dashboard widget):
    //   <li> <div class="card small-12">
    //     <h3><a class="title" href="/learning/assessments/...">Title</a></h3>
    //     <p class="meta"><a href="/homepage/...">Subject Name</a> ...</p>
    //     <p class="meta"><span ...><time datetime="ISO">Jun 10, 2026</time></span></p>
    //   </div></li>
    const upcomingWorkWidget = qs('.Schoolbox_Learning_Component_Dashboard_UpcomingWorkController')
      || qs('[class*="UpcomingWorkController"]')
      || qs('[class*="UpcomingWork"]');

    // On /learning/due the container is ul.action-list (not the #msg-content one)
    const duePageList = qs('ul.action-list:not(#msg-content)');

    const scope = upcomingWorkWidget || duePageList || document;

    const titleLinks = qsa('a.title[href*="/learning/assessments/"]', scope);
    titleLinks.forEach(link => {
      const href = link.href;
      if (seen.has(href)) return;
      seen.add(href);

      const title = link.textContent.trim();
      if (!title || title.length < 3) return;

      const container = link.closest('.card, li, article');

      // Subject: first <a> in the first p.meta is always the top-level class/subject link
      // (e.g. "VCE Business Management Unit 3/4"). We use the first anchor specifically
      // because some items have two anchors in p.meta (class > sub-section).
      const metaParas = container ? qsa('p.meta', container) : [];
      const subjectEl = metaParas.length > 0 ? qs('a', metaParas[0]) : null;
      const subject = subjectEl?.textContent?.trim() || '';

      // Date: use <time> textContent for display, datetime attr for day calculation
      const timeEl = container ? qs('time', container) : null;
      const dateStr = timeEl?.textContent?.trim() || '';
      const datetimeAttr = timeEl?.getAttribute('datetime') || dateStr;
      const daysLeft = parseDaysLeft(datetimeAttr);

      results.push({ title, href, subject, daysLeft, dateStr });
    });

    if (results.length > 0) return results;

    // ── Strategy 2: Fallback — still restricted to assessment URLs only,
    // never broad selectors that could match class cards or nav links.
    const fallbackContainers = [
      qs('ul.action-list'),
      qs('[data-loaded] section'),
      qs('#report_container'),
    ].filter(Boolean);

    const fallbackScope = fallbackContainers[0] || document;
    const fallbackLinks = qsa('a.title[href*="/learning/assessments/"], a[href*="/learning/assessments/"]', fallbackScope);
    fallbackLinks.forEach(link => {
      const href = link.href;
      if (seen.has(href)) return;
      seen.add(href);
      const title = link.textContent.trim();
      if (!title || title.length < 3) return;
      const container = link.closest('.card, li, article');
      const metaParas = container ? qsa('p.meta', container) : [];
      const subject = (metaParas.length > 0 ? qs('a', metaParas[0]) : null)?.textContent?.trim() || '';
      const timeEl = container ? qs('time', container) : null;
      const dateStr = timeEl?.textContent?.trim() || '';
      const datetimeAttr = timeEl?.getAttribute('datetime') || dateStr;
      const daysLeft = parseDaysLeft(datetimeAttr);
      results.push({ title, href, subject, daysLeft, dateStr });
    });

    return results;
  }

  function parseDaysLeft(str) {
    if (!str) return 999;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Try to parse various date formats
    const date = new Date(str);
    if (!isNaN(date)) {
      const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      return diff;
    }

    // Look for "X days" or similar
    const m = str.match(/(\d+)\s*day/i);
    if (m) return parseInt(m[1], 10);
    if (/today/i.test(str)) return 0;
    if (/tomorrow/i.test(str)) return 1;
    return 999;
  }

  /* ─── DARK→LIGHT HELPERS ─────────────────────────────────────────────────── */

  // isDark: true when a computed CSS colour (rgb/rgba string) has a luma < 100.
  // Tune the threshold (0–255) if "really dark" needs adjusting.
  function isDark(cssColor) {
    var m = cssColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return false;
    return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) < 100;
  }

  // lightifyCard: walks every element inside a card and rewrites any inline-style
  // dark colour to its light equivalent.  The CSS !important block (section 17)
  // handles colours that come from stylesheets; this function handles colours
  // that Schoolbox's own scripts write via el.style.color / el.style.backgroundColor
  // after the page has already loaded.
  function lightifyCard(cardEl) {
    cardEl.querySelectorAll('*').forEach(function(node) {
      if (!(node instanceof HTMLElement)) return;
      var cs = window.getComputedStyle(node);

      // Dark inline text  → light text
      if (node.style.color && isDark(cs.color)) {
        node.style.setProperty('color', 'var(--text)', 'important');
      }

      // Dark/opaque inline background → transparent (card surface colour shows through)
      var bg = cs.backgroundColor;
      if (node.style.backgroundColor && isDark(bg) && bg !== 'rgba(0, 0, 0, 0)') {
        node.style.setProperty('background-color', 'transparent', 'important');
      }
    });
  }

  function buildQuickLinks() {
    const links = [
      { icon: '📅', label: 'Timetable',    href: PORTAL + '/timetable' },
      { icon: '📋', label: 'Due Work',     href: PORTAL + '/learning/due' },
      { icon: '📊', label: 'Grades',       href: PORTAL + '/learning/grades' },
      { icon: '📚', label: 'Classes',      href: PORTAL + '/learning/classes' },
      { icon: '📆', label: 'Calendar',     href: PORTAL + '/calendar/week' },
      { icon: '✉️', label: 'Outlook',      href: 'https://outlook.office.com/', target: '_blank' },
      { icon: '📁', label: 'My Files',     href: PORTAL + '/my-files/' },
      { icon: '📝', label: 'Reports',      href: PORTAL + '/user/profile/documents/reports' },
    ];

    const grid = el('div', { class: 'tc-links-grid' });
    links.forEach(link => {
      const a = el('a', {
        class: 'tc-link-btn',
        href: link.href,
        ...(link.target ? { target: link.target, rel: 'noopener' } : {})
      });
      a.append(el('span', { class: 'tc-link-icon' }, link.icon));
      a.append(document.createTextNode(link.label));
      grid.append(a);
    });

    return card('Quick Access', null, null, grid);
  }

  function buildMyLinks() {
    // Extract "My Links" from the sidebar
    const myLinksNav = qs('#side-menu-mylinks');
    const links = [];

    if (myLinksNav) {
      qsa('a', myLinksNav).forEach(a => {
        const label = a.textContent.trim();
        const href = a.href;
        if (label && href && !href.includes('myLinks') && !href.endsWith('google.com/')) {
          links.push({ label, href });
        }
      });
    }

    if (links.length === 0) {
      return el('div', {}); // empty placeholder
    }

    const listEl = el('ul', { class: 'tc-section-list' });
    links.forEach(link => {
      const li = el('a', { class: 'tc-section-item', href: link.href });
      li.append(el('span', { class: 'tc-section-title' }, link.label));
      li.append(el('span', { class: 'tc-section-arrow' }, '›'));
      listEl.append(li);
    });

    return card('My Links', PORTAL + '/cms/myLinks', 'Edit →', listEl);
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE: TIMETABLE
  ═══════════════════════════════════════════════════════════ */
  function buildTimetablePage(wrap) {
    wrap.append(el('div', { class: 'tc-page-title' }, 'My Timetable'));

    const data = extractFullTimetable();
    if (!data) {
      wrap.append(card('Timetable', null, null, el('div', { class: 'tc-empty' }, 'Timetable data could not be extracted. Please wait for the page to load fully.')));
      return;
    }

    const { days, periods, cells } = data;

    // Build grid
    const grid = el('div', { class: 'tc-card' });
    const gridBody = el('div', { class: 'tc-timetable-grid', style: `grid-template-columns: 70px repeat(${days.length}, 1fr)` });

    // Header row: time cell + day headers
    const timeCorner = el('div', { class: 'tc-tt-header', style: 'background:#111827' });
    gridBody.append(timeCorner);

    const today = new Date().getDay(); // 0=Sun, 1=Mon...
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    days.forEach((day, i) => {
      const isToday = day.isToday;
      const hdr = el('div', { class: 'tc-tt-header' + (isToday ? ' today' : '') }, day.label);
      gridBody.append(hdr);
    });

    // Period rows
    periods.forEach((period, pi) => {
      const isBreak = /recess|lunch|break/i.test(period.label);
      
      // ── CHG: Add active-period class if this row is currently running
      const timeCellClass = 'tc-tt-time' + (period.isCurrent ? ' active-period' : '');
      const timeCell = el('div', { class: timeCellClass }, period.label);
      gridBody.append(timeCell);

      days.forEach((day, di) => {
        const cellData = cells[pi]?.[di];
        const isToday = day.isToday;
        let cellClass = 'tc-tt-cell' + (isToday ? ' today-col' : '');

        // ── CHG: Determine if this exact block is active right now
        const isCurrentBlock = cellData?.isActiveCell || (isToday && period.isCurrent);
        if (isCurrentBlock) {
          cellClass += ' active-block';
        }

        if (isBreak) {
          const breakCell = el('div', { class: cellClass + ' recess' });
          if (di === 0) breakCell.append(el('div', { class: 'tc-tt-subj' }, period.label));
          gridBody.append(breakCell);
        } else if (cellData && cellData.subject) {
          const cell = el('div', { class: cellClass });
          cell.append(el('div', { class: 'tc-tt-subj' }, cellData.subject));
          if (cellData.room) cell.append(el('div', { class: 'tc-tt-room' }, cellData.room));
          if (cellData.teacher) cell.append(el('div', { class: 'tc-tt-teacher' }, cellData.teacher));
          gridBody.append(cell);
        } else {
          gridBody.append(el('div', { class: cellClass + ' free' }));
        }
      });
    });

    grid.append(gridBody);
    wrap.append(grid);
  }

  function extractFullTimetable() {
    const ttTable = qs('table.timetable');
    if (!ttTable) return null;

    // Use the fix from before to only get headers inside the thead
    const headerRow = qsa('thead th', ttTable);
    if (headerRow.length === 0) return null;

    // Determine columns (days)
    const days = [];
    headerRow.forEach(th => {
      if (th.textContent.trim()) {
        days.push({
          label: th.textContent.trim(),
          isToday: th.classList.contains('timetable-day-active') || th.classList.contains('today'),
        });
      }
    });

    const rows = qsa('tbody tr, tr', ttTable);
    const periods = [];
    const cells = [];

    rows.forEach(row => {
      const tds = qsa('td', row);
      const th = qs('th', row);
      if (tds.length === 0) return;

      const periodLabel = th?.textContent?.trim() || qs('td:first-child', row)?.textContent?.trim() || '';
      const startCol = th ? 0 : 1;
      const periodCells = th ? tds : tds.slice(1);

      if (periodLabel) {
        // ── CHG: Detect if this row/period is active in original Schoolbox
        const isCurrent = row.classList.contains('timetable-period-active') || 
                          th?.classList.contains('timetable-period-active') || 
                          row.classList.contains('active');

        periods.push({ label: periodLabel, isCurrent }); // Save row active status
        
        const rowCells = periodCells.map(td => {
          const subjectEl = qs('[data-timetable-subject]', td);
          if (!subjectEl) return null;
          const nameEl = qs('.timetable-subject-name, [class*="name"]', subjectEl);
          const subject = nameEl?.textContent?.trim() || subjectEl.textContent?.trim() || '';
          const room = qs('[class*="location"], [class*="room"]', subjectEl)?.textContent?.trim() || '';
          const teacher = qs('[class*="teacher"]', subjectEl)?.textContent?.trim() || '';
          
          // ── CHG: Detect if this specific cell is directly flagged active
          const isActiveCell = td.classList.contains('timetable-active') || 
                               td.classList.contains('active') || 
                               qs('.timetable-subject-active', td) !== null;

          return subject ? { subject, room, teacher, isActiveCell } : null;
        });
        cells.push(rowCells);
      }
    });

    return days.length > 0 ? { days, periods, cells } : null;
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE: CALENDAR
  ═══════════════════════════════════════════════════════════ */
  function buildCalendarPage(wrap) {
    wrap.append(el('div', { class: 'tc-page-title' }, 'School Calendar'));

    const nav = el('div', { style: 'display:flex;gap:12px;margin-bottom:16px;align-items:center' });
    nav.append(el('a', { href: PORTAL + '/calendar/week', class: 'tc-link-btn', style: 'text-decoration:none' }, '← Week'));
    nav.append(el('a', { href: PORTAL + '/calendar/month', class: 'tc-link-btn', style: 'text-decoration:none' }, 'Month →'));
    wrap.append(nav);

    // Show the original Schoolbox calendar embedded but restyled
    const origCal = qs('[data-fullcalendar], .fc, #calendar-content, .calendar-view');
    if (origCal) {
      const container = el('div', { class: 'tc-card' });
      const hdr = el('div', { class: 'tc-card-header' });
      hdr.append(el('h2', {}, 'Calendar'));
      container.append(hdr);

      // Clone the calendar into our layout
      const calClone = origCal.cloneNode(true);
      calClone.style.cssText = 'padding: 16px;';
      container.append(calClone);
      wrap.append(container);
    } else {
      wrap.append(card('Calendar', PORTAL + '/calendar', 'Open calendar →',
        el('div', { class: 'tc-empty' }, 'Calendar is loading. If it doesn\'t appear, try refreshing.')));
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE: SUBJECT / HOMEPAGE
     Layout:
       ┌─────────────────────────┬──────────────────┐
       │ Unit Resources (pinned) │  Sidebar:        │
       │ (folder cards grid)     │  Teachers        │
       ├─────────────────────────│  Class List      │
       │ Accordion sections:     │  Countdown timers│
       │  Weekly Planner         │  etc.            │
       │  Course Assessments     │                  │
       │  VCAA Study Design      │                  │
       │  Reports …              │                  │
       └─────────────────────────┴──────────────────┘
  ═══════════════════════════════════════════════════════════ */
  function buildSubjectPage(wrap) {
    const h1 = qs('h1.t-restrict-length, h1, .page-title h1');
    const title = h1?.textContent?.trim() || 'Subject';

    const headerEl = el('div', { class: 'tc-subject-header' });
    headerEl.append(el('div', { class: 'tc-page-title', style: 'margin:0' }, title));
    headerEl.append(el('span', { class: 'tc-subject-badge' }, 'VCE'));
    wrap.append(headerEl);

    const { accordion: accordionSections, sidebarGroups } = classifySubjectComponents();

    // ── Two-column layout: left (accordion) and right (sidebar)
    const layout = el('div', { class: 'tc-subject-layout' });
    const mainCol = el('div', { class: 'tc-subject-main' });
    const sideCol = el('div', { class: 'tc-subject-side' });

    // ── LEFT: accordion sections in order (Timetable → Unit Resources → Dropbox → Other)
    if (accordionSections.length > 0) {
      const accordion = el('div', { class: 'tc-accordion' });
      accordionSections.forEach(sec => accordion.append(buildAccordionItem(sec)));
      mainCol.append(accordion);
    }

    // ── SOCIAL STREAMS: one card per stream component on this page.
    // Automatically suppressed when window.schoolboxUser.impersonated is true.
    qsa('.Component_Homepage_SocialStreamController').forEach(sc => {
      const titleEl = qs('[data-test^="homepage-component-titlebar-name"]', sc)
        || qs('.component-titlebar h2 span', sc)
        || qs('.component-titlebar h2', sc);
      const label = titleEl?.textContent?.trim() || 'Social Stream';
      const streamCard = buildSocialStreamCard(sc, label);
      if (streamCard) mainCol.append(streamCard);
    });

    // ── RIGHT: sidebar in order:
    //   Countdowns → Files → News → Course outline → Reports → Teachers → Students

    // Countdowns + Files
    ['countdown', 'files'].forEach(key => {
      (sidebarGroups[key] || []).forEach(sec =>
        sideCol.append(buildSubjectSection(sec, sec.defaultOpen)));
    });

    // News — injected between Files and Course outline
    const newsContainer = qs('.Schoolbox_Comms_News_Component_Homepage_Controller, [class*="News_Component_Homepage"]');
    if (newsContainer) {
      const newsSlot = el('div', { class: 'tc-news-slot' });
      sideCol.append(newsSlot);
      buildNewsCard(newsSlot);
    }

    // Course outline → Reports → Teachers → Students
    ['courseOutline', 'reports', 'teachers', 'students'].forEach(key => {
      (sidebarGroups[key] || []).forEach(sec =>
        sideCol.append(buildSubjectSection(sec, sec.defaultOpen)));
    });

    layout.append(mainCol, sideCol);
    wrap.append(layout);
  }

  // Renders a plain (non-accordion) section card
  function buildSubjectSection(sec, open) {
    const c = el('div', { class: 'tc-card tc-subject-card' });
    const hdr = el('div', { class: 'tc-card-header' });
    hdr.append(el('h2', {}, sec.title));
    c.append(hdr);

    const body = el('div', { class: 'tc-card-body tc-subject-content' });
    if (sec.contentNode) {
      const clone = sec.contentNode.cloneNode(true);
      cleanClone(clone);
      body.append(clone);
      // Drive any countdown timers after they land in the DOM
      scheduleCountdowns(body);
    } else {
      body.append(el('div', { class: 'tc-empty' }, 'No content.'));
    }
    c.append(body);
    return c;
  }

  // Renders one collapsible accordion item
  function buildAccordionItem(sec) {
    const startOpen = sec.defaultOpen;
    const item = el('div', { class: 'tc-accordion-item' + (startOpen ? ' open' : '') });

    const hdr = el('button', { class: 'tc-accordion-hdr', type: 'button' });
    hdr.append(el('span', { class: 'tc-accordion-title' }, sec.title));
    hdr.append(el('span', { class: 'tc-accordion-chevron' }, startOpen ? '▲' : '▼'));

    const body = el('div', { class: 'tc-accordion-body' });
    body.style.display = startOpen ? '' : 'none';

    const inner = el('div', { class: 'tc-accordion-inner tc-subject-content' });
    if (sec.contentNode) {
      const clone = sec.contentNode.cloneNode(true);
      cleanClone(clone);
      inner.append(clone);
      // Drive any countdown timers after they land in the DOM
      scheduleCountdowns(inner);
    } else {
      inner.append(el('div', { class: 'tc-empty' }, 'No content.'));
    }
    body.append(inner);

    hdr.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      body.style.display = isOpen ? '' : 'none';
      hdr.querySelector('.tc-accordion-chevron').textContent = isOpen ? '▲' : '▼';
      // Activate any countdowns that were hidden and are now revealed
      if (isOpen) scheduleCountdowns(inner);
    });

    item.append(hdr, body);
    return item;
  }

  // Remove Schoolbox edit UI and inline scripts from a cloned node
  function cleanClone(clone) {
    qsa('[data-component-panel], .editPanel, [data-collapser], .immersive-reader-button, .reorder_form, .component-action, .toast, a[data-collapser]', clone)
      .forEach(n => n.remove());
    qsa('script', clone).forEach(n => n.remove());
  }

  // Drive countdown timers inside a container that were injected via cleanClone.
  // Schoolbox's own countdown.js is stripped by cleanClone, so we re-implement
  // the tick logic here.
  //
  // Guards against double-activation via __tcActivated flag — safe to call
  // multiple times (rAF + setTimeout fallback, accordion open handler, etc.).
  function activateCountdowns(container) {
    // Schoolbox structure: a wrapper element carries data-target-date, and
    // inside it a [data-countdown="elements"] or .countdown-timer <ul> holds
    // the individual [data-weeks], [data-days], etc. child spans.
    //
    // Strategy: find all wrapper elements that have data-target-date and
    // contain a countdown timer descendant, OR find countdown timers that
    // themselves carry data-target-date (some versions inline it).
    const wrappers = [
      // Wrappers with data-target-date that contain a countdown timer child
      ...container.querySelectorAll('[data-target-date]'),
      // Timers that directly carry data-target-date (inline variant)
      ...container.querySelectorAll('[data-countdown="elements"]'),
      ...container.querySelectorAll('.countdown-timer'),
    ].filter(el => !el.__tcActivated);

    if (wrappers.length === 0) return;

    // Resolve each wrapper to a { timerEl, targetDate } pair
    const activations = [];
    const seen = new Set();

    wrappers.forEach(wrapper => {
      // Find the actual countdown timer element: may be the wrapper itself
      // or a descendant ul[data-countdown] / .countdown-timer
      let timerEl = wrapper;
      if (!wrapper.hasAttribute('data-target-date')) {
        // This is a timer element; find data-target-date on an ancestor
        timerEl = wrapper;
        let ancestor = wrapper.parentElement;
        while (ancestor && ancestor !== container) {
          if (ancestor.dataset.targetDate) break;
          ancestor = ancestor.parentElement;
        }
        if (!ancestor || !ancestor.dataset.targetDate) return;
        wrapper = ancestor; // reuse 'wrapper' as the date-holder
      } else {
        // wrapper has data-target-date — find the timer descendant (or itself)
        const inner = wrapper.querySelector('[data-countdown="elements"], .countdown-timer');
        if (inner) timerEl = inner;
      }

      // Deduplicate by the timer element
      if (seen.has(timerEl) || timerEl.__tcActivated) return;
      seen.add(timerEl);

      const rawDate = wrapper.dataset.targetDate || wrapper.getAttribute('data-target-date');
      const targetMs = new Date(rawDate).getTime();
      if (isNaN(targetMs)) return;

      timerEl.__tcActivated = true;
      activations.push({ timerEl, targetMs });
    });

    if (activations.length === 0) return;

    function tick() {
      const now = Date.now();
      activations.forEach(({ timerEl, targetMs }) => {
        const diff = Math.max(0, targetMs - now);

        const totalSecs  = Math.floor(diff / 1000);
        const secs  = totalSecs % 60;
        const totalMins  = Math.floor(totalSecs / 60);
        const mins  = totalMins % 60;
        const totalHours = Math.floor(totalMins / 60);
        const hours = totalHours % 24;
        const totalDays  = Math.floor(totalHours / 24);
        const days  = totalDays % 7;
        const weeks = Math.floor(totalDays / 7);

        const map = { weeks, days, hours, minutes: mins, seconds: secs };
        for (const [unit, val] of Object.entries(map)) {
          let span = timerEl.querySelector(`[data-${unit}]`);
          if (!span) {
            // The cloned HTML is missing this unit — build a <li> with count + label
            const li = document.createElement('li');
            span = document.createElement('span');
            span.className = 'count';
            span.setAttribute(`data-${unit}`, '');
            const label = document.createElement('span');
            label.className = 'labels';
            label.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            li.append(span, label);
            timerEl.append(li);
          }
          span.textContent = val;
        }
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    // Stop ticking when container leaves the DOM
    const obs = new MutationObserver(() => {
      if (!document.contains(container)) {
        clearInterval(interval);
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // Schedule countdown activation: try immediately (elements may already be
  // cloned in), then retry after the next paint + 150 ms to cover any timing
  // edge cases in content-script rAF scheduling.
  function scheduleCountdowns(container) {
    activateCountdowns(container);
    requestAnimationFrame(() => {
      activateCountdowns(container);
      setTimeout(() => activateCountdowns(container), 150);
    });
  }

  // Builds a news card, polling until the AJAX-loaded news list populates.
  // Schoolbox loads news items asynchronously into #news-container-{id}, so we
  // poll for article links inside those containers.
  function buildNewsCard(slot) {
    // Show a loading placeholder straight away
    slot.append(card('News', PORTAL + '/news', 'All news →',
      el('div', { class: 'tc-empty' }, '⏳ Loading news…')));

    let attempts = 0;
    function poll() {
      const newsContainers = qsa('[id^="news-container-"]');

      // Empty-state means AJAX returned and there's no news — resolve immediately
      const emptyState = newsContainers.some(c => qs('.empty-state', c));

      // Only count real article links — exclude archive/feed/action links
      const articleLinks = newsContainers.flatMap(c =>
        qsa('a[href*="/news/"]', c).filter(a =>
          !a.href.includes('/archive') &&
          !a.href.includes('/feed/') &&
          !a.href.includes('news-component-actions')
        )
      );

      if (emptyState || articleLinks.length > 0 || attempts >= 20) {
        slot.innerHTML = '';
        slot.append(buildNewsCardContent(newsContainers, articleLinks));
        return;
      }
      attempts++;
      setTimeout(poll, 500);
    }
    poll();
  }

  function buildNewsCardContent(containers, articleLinks) {
    const listEl = el('ul', { class: 'tc-due-list' });

    if (articleLinks.length === 0) {
      listEl.append(el('li', { class: 'tc-empty' }, 'No news at this time.'));
    } else {
      // Deduplicate by base article URL (strip fragments and ?ref=... query params),
      // then limit to 5 most recent
      const seen = new Set();
      const deduped = articleLinks.filter(link => {
        const base = link.href.split('#')[0].replace(/[?&]ref=[^&]*/, '');
        if (seen.has(base)) return false;
        seen.add(base);
        return true;
      }).slice(0, 5);
      deduped.forEach(link => {

        const li = el('li', { class: 'tc-due-item', style: 'cursor:pointer' });
        li.addEventListener('click', () => { window.location.href = link.href; });
        li.addEventListener('mouseenter', () => { li.style.background = 'var(--bg)'; });
        li.addEventListener('mouseleave', () => { li.style.background = ''; });

        // Try to get title from the link or nearest heading
        const container = link.closest('article, li, .list-item, .news-item') || link.parentElement;
        const headingEl = container ? (qs('h2, h3, h4', container) || link) : link;
        const title = headingEl.textContent.trim() || link.textContent.trim();

        // Date
        const timeEl = container ? qs('time', container) : null;
        const dateStr = timeEl?.textContent?.trim() || '';

        const info = el('div', {});
        info.append(el('div', { class: 'tc-due-title' },
          (() => { const a = el('a', { href: link.href }, title); return a; })()
        ));
        if (dateStr) info.append(el('div', { class: 'tc-due-subject' }, dateStr));
        li.append(info);
        listEl.append(li);
      });
    }

    return card('News', PORTAL + '/news', 'All news →', listEl);
  }


  /* ═══════════════════════════════════════════════════════════
     SOCIAL STREAM
  ═══════════════════════════════════════════════════════════ */

  // Parse <li data-socialstream-row> items from any scope element.
  function extractSocialStreamPosts(scope) {
    const posts = [];
    qsa('li[data-socialstream-row]', scope).forEach(row => {
      // Author link and portrait
      const authorLink    = qs('div.list-item a[href*="search/user"]', row);
      const authorImg     = qs('div.list-item img', row);
      const authorName    = authorImg?.alt
        || authorLink?.querySelector('p')?.childNodes[0]?.textContent?.trim()
        || 'Unknown';
      const authorHref    = authorLink?.href || null;
      // Extract user ID from href so we can build a live portrait URL
      const userId        = authorHref?.match(/search\/user\/(\d+)/)?.[1] || null;

      // Timestamp
      const tsEl          = qs('span.pipe.meta', row);
      const timestampFull = tsEl?.getAttribute('title') || '';
      const timestampRel  = tsEl?.textContent?.trim() || '';

      // Body text (collect all <p> inside article[data-body])
      const article = qs('article[data-body]', row);
      const bodyText = article
        ? Array.from(article.querySelectorAll('p'))
            .map(p => p.textContent.trim()).filter(Boolean).join('\n')
        : '';

      // Attachment
      const attachEl    = qs('.socialstream-attachment a[href]', row);
      const attachHref  = attachEl?.href || null;
      const attachLabel = attachEl?.querySelector('p')?.textContent?.trim()
        || attachEl?.textContent?.trim() || null;

      posts.push({ authorName, authorHref, userId, timestampFull, timestampRel,
                   body: bodyText, attachHref, attachLabel });
    });
    return posts;
  }

  // Build a single post <li> element.
  function renderStreamPost(post) {
    const li = el('li', { class: 'tc-stream-post' });

    // Meta: avatar + name + timestamp
    const meta   = el('div', { class: 'tc-stream-meta' });
    const avatar = el('div', { class: 'tc-stream-avatar' });

    // Use live portrait URL when we have a userId; fall back to initials
    if (post.userId) {
      const img = el('img', {
        src: `${PORTAL}/portrait.php?id=${post.userId}&size=square192`,
        alt: post.authorName,
      });
      img.onerror = () => {
        img.remove();
        avatar.textContent = post.authorName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
      };
      avatar.append(img);
    } else {
      avatar.textContent = post.authorName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    }
    meta.append(avatar);

    const info = el('div', {});
    const nameEl = post.authorHref
      ? el('a', { class: 'tc-stream-author', href: post.authorHref }, post.authorName)
      : el('span', { class: 'tc-stream-author' }, post.authorName);
    info.append(nameEl);
    if (post.timestampFull || post.timestampRel) {
      info.append(el('div', { class: 'tc-stream-time' }, post.timestampFull || post.timestampRel));
    }
    meta.append(info);
    li.append(meta);

    // Body
    if (post.body) {
      const bodyEl = el('div', { class: 'tc-stream-body' });
      post.body.split('\n').forEach((line, i) => {
        if (i > 0) bodyEl.append(el('br', {}));
        bodyEl.append(document.createTextNode(line));
      });
      li.append(bodyEl);
    }

    // Attachment
    if (post.attachHref) {
      const isYouTube = /youtu\.?be/i.test(post.attachHref);
      const icon  = isYouTube ? '▶' : '📎';
      const label = post.attachLabel || post.attachHref;
      const att = el('a', { class: 'tc-stream-attachment', href: post.attachHref,
                            target: '_blank', rel: 'noopener' });
      att.append(el('span', { style: 'flex-shrink:0' }, icon));
      att.append(el('span', {}, label));
      li.append(att);
    }

    return li;
  }

  // Build a styled social stream card for one .Component_Homepage_SocialStreamController.
  // Returns null if impersonated or if the instanceId/homepageId can't be found.
  function buildSocialStreamCard(container, label) {
    // Never show while staff are impersonating a student
    const liveUser = (window.schoolboxUser && typeof window.schoolboxUser === 'object')
      ? window.schoolboxUser : {};
    if (liveUser.impersonated) return null;

    // Extract instanceId and homepageId
    const ssDiv      = qs('.discussion[id^="socialstream-"]', container);
    const instanceId = ssDiv?.id?.replace('socialstream-', '') || null;
    const homepageId = qs('input[name="homepageId"]', container)?.value || null;
    if (!instanceId || !homepageId) return null;

    // Parse posts already in the DOM (Schoolbox pre-renders the first batch)
    const initialPosts = extractSocialStreamPosts(container);

    // Build card
    const cardEl = el('div', { class: 'tc-card' });
    const hdr    = el('div', { class: 'tc-card-header' });
    hdr.append(el('h2', {}, label || 'Social Stream'));
    cardEl.append(hdr);

    const body = el('div', { class: 'tc-card-body', style: 'padding-bottom:8px' });
    const list = el('ul', { class: 'tc-stream-list' });

    if (initialPosts.length === 0) {
      list.append(el('li', { class: 'tc-empty' }, 'No posts yet.'));
    } else {
      initialPosts.forEach(p => list.append(renderStreamPost(p)));
    }
    body.append(list);

    // "Load More" — fetches the threads API (same-origin) and appends new posts
    let offset = initialPosts.length;
    const loadMoreBtn = el('button', { class: 'tc-stream-load-more', type: 'button' }, '⬇ Load more');

    loadMoreBtn.addEventListener('click', async () => {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = '⏳ Loading…';
      try {
        const url = `${PORTAL}/socialstream/threads/threads.php?instanceId=${instanceId}&homepageId=${homepageId}&start=${offset}&offset=5`;
        const resp = await fetch(url, { credentials: 'same-origin' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();

        // Parse the HTML fragment in a throw-away <ul>
        const tmp = document.createElement('ul');
        tmp.innerHTML = html;
        const newPosts = extractSocialStreamPosts(tmp);

        if (newPosts.length === 0) {
          loadMoreBtn.textContent = '✓ All posts loaded';
          return; // stay disabled
        }

        // Remove the "no posts" empty state if present
        list.querySelectorAll('.tc-empty').forEach(e => e.remove());
        newPosts.forEach(p => list.append(renderStreamPost(p)));
        offset += newPosts.length;

        if (newPosts.length < 5) {
          loadMoreBtn.textContent = '✓ All posts loaded';
        } else {
          loadMoreBtn.disabled = false;
          loadMoreBtn.textContent = '⬇ Load more';
        }
      } catch (err) {
        console.warn('MyTintern: social stream load-more failed', err);
        loadMoreBtn.textContent = '⚠ Failed — tap to retry';
        loadMoreBtn.disabled = false;
      }
    });

    body.append(loadMoreBtn);
    cardEl.append(body);
    return cardEl;
  }

  function classifySubjectComponents() {
    // ── LEFT column (accordion), top → bottom ──────────────────────────────
    //   Timetable → Unit Resources → Dropbox → Other
    const LEFT_ORDER = ['timetable', 'unitResources', 'dropbox', 'other'];

    // ── RIGHT column (sidebar), top → bottom ──────────────────────────────
    //   Countdowns → Files → [News injected here] → Course outline → Reports → Teachers → Students
    const RIGHT_ORDER = ['countdown', 'files', 'courseOutline', 'reports', 'teachers', 'students'];

    // Explicit right-column class → category mapping
    const RIGHT_CLASS_MAP = {
      'Component_Homepage_CountdownController':                    'countdown',
      'Component_Homepage_TeachersController':                     'teachers',
      'Component_Homepage_ClassListController':                    'students',
      // File-list variants across Schoolbox versions
      'Schoolbox_Resource_File_Component_Homepage_Controller':     'files',
      'Schoolbox_Resource_Files_Component_Homepage_Controller':    'files',
      'Component_Homepage_FilesController':                        'files',
      'Schoolbox_Resource_FileList_Component_Homepage_Controller': 'files',
    };

    // Explicit left-column class → category mapping
    const LEFT_CLASS_MAP = {
      'Component_Homepage_FolderListController':                             'unitResources',
      // Dropbox / file-submission variants
      'Schoolbox_Learning_Assessment_Component_Homepage_DropboxController': 'dropbox',
      'Schoolbox_Learning_Assessment_Component_Homepage_Dropbox_Controller':'dropbox',
      'Component_Homepage_DropboxController':                               'dropbox',
      'Schoolbox_Content_Dropbox_Component_Homepage_Controller':            'dropbox',
    };

    // Skip entirely — news is handled separately via buildNewsCard
    const SKIP_CLASSES = [
      'Schoolbox_Tile_Component_HomepageTileController',
      'Schoolbox_Comms_News_Component_Homepage_Controller',
      // Social stream is handled by buildSocialStreamCard
      'Component_Homepage_SocialStreamController',
    ];

    // Initialise buckets
    const left  = {};
    LEFT_ORDER.forEach(k  => { left[k]  = []; });
    const right = {};
    RIGHT_ORDER.forEach(k => { right[k] = []; });

    const containers = qsa('.component-container');

    containers.forEach(container => {
      if (SKIP_CLASSES.some(c => container.classList.contains(c))) return;

      const titleEl = qs('[data-test^="homepage-component-titlebar-name"]', container)
        || qs('.component-titlebar h2 span', container)
        || qs('.component-titlebar h2', container);
      const title = titleEl?.textContent?.trim()
        || qs('h2[title]', container)?.getAttribute('title')
        || '';
      if (!title) return;

      const contentRow = qs('[data-collapsable="true"]', container);
      const collapseState = contentRow?.getAttribute('data-collapse-state') || 'uncollapsed';
      const defaultOpen = collapseState !== 'collapsed';

      const contentNode = contentRow
        ? (qs('.island section', contentRow) || qs('section', contentRow) || qs('.island', contentRow) || contentRow)
        : null;

      const sec = { title, contentNode, defaultOpen };

      // 1. Explicit right-column class match
      for (const [cls, cat] of Object.entries(RIGHT_CLASS_MAP)) {
        if (container.classList.contains(cls)) {
          right[cat].push(sec);
          return;
        }
      }

      // 2. Assessment Outline Controller → courseOutline or reports (by title)
      if (container.classList.contains('Schoolbox_Learning_Assessment_Component_Homepage_Outline_Controller')) {
        const cat = /report/i.test(title) ? 'reports' : 'courseOutline';
        right[cat].push(sec);
        return;
      }

      // 3. Explicit left-column class match
      for (const [cls, cat] of Object.entries(LEFT_CLASS_MAP)) {
        if (container.classList.contains(cls)) {
          left[cat].push(sec);
          return;
        }
      }

      // 4. Textbox → timetable (if title suggests it) or other
      if (container.classList.contains('Schoolbox_Resource_Textbox_Component_Homepage_Controller')) {
        const cat = /timetable|planner|weekly|schedule/i.test(title) ? 'timetable' : 'other';
        left[cat].push(sec);
        return;
      }

      // 5. Fallback: everything else goes to the left 'other' bucket
      left['other'].push(sec);
    });

    return {
      pinned: null,
      accordion: LEFT_ORDER.flatMap(k => left[k]),
      sidebarGroups: right,
    };
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE: CLASSES LIST
  ═══════════════════════════════════════════════════════════ */
  function buildClassesPage(wrap) {
    wrap.append(el('div', { class: 'tc-page-title' }, 'My Classes'));

    const classes = extractClasses();
    const grid = el('div', { class: 'tc-grid tc-grid-2', style: 'gap:12px' });

    if (classes.length === 0) {
      wrap.append(card('Classes', null, null, el('div', { class: 'tc-empty' }, 'No classes found. Make sure you\'re logged in.')));
      return;
    }

    classes.forEach(cls => {
      const c = el('a', {
        href: cls.href || '#',
        style: 'display:block;text-decoration:none',
      });
      const cardEl = el('div', { class: 'tc-card', style: 'cursor:pointer;transition:box-shadow .15s' });
      cardEl.addEventListener('mouseenter', () => { cardEl.style.boxShadow = '0 2px 8px rgba(0,37,122,.12)'; });
      cardEl.addEventListener('mouseleave', () => { cardEl.style.boxShadow = 'var(--shadow)'; });

      const body = el('div', { class: 'tc-card-body' });
      body.append(el('div', { style: 'font-size:15px;font-weight:600;color:var(--white);font-family:var(--sans);margin-bottom:4px' }, cls.name));
      if (cls.teacher) body.append(el('div', { style: 'font-size:12px;color:var(--muted);font-family:var(--mono)' }, cls.teacher));
      if (cls.code) body.append(el('div', { style: 'font-size:11px;color:var(--muted);font-family:var(--mono);margin-top:6px' }, cls.code));
      cardEl.append(body);
      c.append(cardEl);
      grid.append(c);
    });

    wrap.append(grid);
  }

  function extractClasses() {
    const classes = [];

    // Strategy 1: Target the confirmed Schoolbox class card structure.
    // Each class is a div.v-card > div.card-content.classes > div.list-item with:
    //   <h3><a href="/homepage/..." title="Full Name (code)">Display Name</a></h3>
    //   <p class="meta">code<br>Category</p>
    // Use the full name from the title attribute (more complete than link text).
    const cardItems = qsa('div.card-content.classes div.list-item');
    cardItems.forEach(node => {
      const link = qs('h3 a', node);
      if (!link) return;
      const href = link.href || null;
      // title attr has "Full Name (codes)" — use it for the display name if present
      const titleAttr = link.getAttribute('title') || '';
      // Strip the trailing " (codes)" part from the title to get the clean name
      const name = titleAttr.replace(/\s*\([^)]+\)\s*$/, '').trim() || link.textContent.trim();
      // Code is the text node before the <br> in p.meta
      const metaEl = qs('p.meta', node);
      const code = metaEl ? (metaEl.childNodes[0]?.textContent?.trim() || '') : '';
      if (name) classes.push({ name, href, teacher: '', code });
    });

    if (classes.length > 0) return classes;

    // Fallback: broader selectors, still scoped away from nav/sidebar
    const fallbackSelectors = [
      '.class-list li',
      '[data-component*="class"] li',
      '.tileList li[data-tile]',
      '.class-tile',
    ];
    for (const sel of fallbackSelectors) {
      const nodes = qsa(sel);
      if (nodes.length > 0) {
        nodes.forEach(node => {
          const link = qs('a', node);
          const href = link?.href || null;
          const name = link?.getAttribute('title')?.replace(/\s*\([^)]+\)\s*$/, '').trim()
            || link?.textContent?.trim() || '';
          const code = qs('p.meta', node)?.childNodes[0]?.textContent?.trim() || '';
          if (name) classes.push({ name, href, teacher: '', code });
        });
        break;
      }
    }

    return classes;
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE: DUE WORK
  ═══════════════════════════════════════════════════════════ */
  function buildDuePage(wrap) {
    wrap.append(el('div', { class: 'tc-page-title' }, 'Due Work'));

    // Placeholder while Schoolbox's JS finishes rendering the list
    const slot = el('div');
    slot.append(card('Due Work', PORTAL + '/learning/due', 'Open in Schoolbox →',
      el('div', { class: 'tc-empty' }, '⏳ Loading…')));
    wrap.append(slot);

    // Poll until real assessment items appear (max ~5 s), then swap in the real card.
    // We check for a.title links specifically — not just any extractDueWork result —
    // to avoid rendering immediately when only sidebar/notification links exist.
    let attempts = 0;
    function poll() {
      const hasRealItems = qs('ul.action-list a.title[href*="/learning/assessments/"]') !== null;
      if (hasRealItems || attempts >= 10) {
        slot.innerHTML = '';
        slot.append(buildDueCard(0));
        return;
      }
      attempts++;
      setTimeout(poll, 500);
    }
    poll();
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE: LEARNING ACTIVITIES
  ═══════════════════════════════════════════════════════════ */
  function buildActivitiesPage(wrap) {
    wrap.append(el('div', { class: 'tc-page-title' }, 'Learning Activities'));

    // Placeholder while Schoolbox's JS finishes rendering the list
    const slot = el('div');
    slot.append(card('Learning Activities', PORTAL + '/learning/activities', 'Open in Schoolbox →',
      el('div', { class: 'tc-empty' }, '⏳ Loading…')));
    wrap.append(slot);

    // Poll until items appear (max ~5 s), then swap in the real card
    let attempts = 0;
    function poll() {
      const items = extractActivities();
      if (items.length > 0 || attempts >= 10) {
        slot.innerHTML = '';
        slot.append(buildActivitiesCard());
        return;
      }
      attempts++;
      setTimeout(poll, 500);
    }
    poll();
  }

  function buildActivitiesCard() {
    const items = extractActivities();

    const TYPE_META = {
      project:    { label: 'Project',      color: 'rgb(50,114,226)',  icon: '📁' },
      task:       { label: 'Task',         color: 'rgb(101,168,101)', icon: '✅' },
      quiz:       { label: 'Quiz',         color: 'rgb(244,213,86)',  icon: '❓' },
      lessonPlan: { label: 'Lesson Plan',  color: 'rgb(171,148,242)', icon: '📖' },
      dueWork:    { label: 'Due Work',     color: 'rgb(248,150,30)',  icon: '📋' },
      other:      { label: 'Activity',     color: 'rgb(90,90,90)',    icon: '📌' },
    };

    const wrap = el('div');

    if (items.length === 0) {
      wrap.append(el('div', { class: 'tc-empty' }, 'No learning activities found on this page. Make sure you\'re on the Learning Activities page.'));
      return card('Learning Activities', PORTAL + '/learning/activities', 'Open page →', wrap);
    }

    // Group by type
    const grouped = {};
    items.forEach(item => {
      const key = item.type || 'other';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    Object.entries(grouped).forEach(([type, group]) => {
      const meta = TYPE_META[type] || TYPE_META.other;

      // Section heading
      const heading = el('div', {
        style: `display:flex;align-items:center;gap:8px;margin:16px 0 8px;font-family:var(--sans);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)`
      });
      heading.append(el('span', {}, `${meta.icon} ${meta.label}s`));
      const count = el('span', {
        style: `margin-left:auto;background:${meta.color};color:#fff;border-radius:999px;padding:1px 8px;font-size:11px`
      }, String(group.length));
      heading.append(count);
      wrap.append(heading);

      // Items
      const listEl = el('ul', { class: 'tc-due-list' });
      group.forEach(item => {
        const li = el('li', { class: 'tc-due-item', style: 'cursor:pointer;transition:box-shadow .15s' });
        li.addEventListener('mouseenter', () => { li.style.boxShadow = '0 2px 8px rgba(0,37,122,.12)'; });
        li.addEventListener('mouseleave', () => { li.style.boxShadow = ''; });
        if (item.href) li.addEventListener('click', () => { window.location.href = item.href; });

        // Days-left badge
        const daysLeft = item.daysLeft ?? 999;
        let badgeClass, badgeText;
        if (daysLeft < 0) {
          badgeClass = 'urgent'; badgeText = 'OVRD';
        } else if (daysLeft === 0) {
          badgeClass = 'urgent'; badgeText = 'DUE';
        } else if (daysLeft === 1) {
          badgeClass = 'urgent'; badgeText = 'TMRW';
        } else if (daysLeft <= 5) {
          badgeClass = 'soon'; badgeText = `${daysLeft}d`;
        } else if (daysLeft < 999) {
          badgeClass = 'later'; badgeText = `${daysLeft}d`;
        } else {
          badgeClass = 'later'; badgeText = '—';
        }
        li.append(el('span', { class: `tc-due-badge ${badgeClass}` }, badgeText));

        const info = el('div', {});
        const titleEl = el('div', { class: 'tc-due-title' });
        if (item.href) {
          titleEl.append(el('a', { href: item.href }, item.title));
        } else {
          titleEl.textContent = item.title;
        }
        info.append(titleEl);

        const metaLine = [];
        if (item.subject) metaLine.push(item.subject);
        if (item.dateStr) metaLine.push(item.dateStr);
        if (metaLine.length > 0) {
          info.append(el('div', { class: 'tc-due-subject' }, metaLine.join(' · ')));
        }

        li.append(info);
        listEl.append(li);
      });
      wrap.append(listEl);
    });

    return card('Learning Activities', PORTAL + '/learning/activities', 'Open in Schoolbox →', wrap);
  }

  function extractActivities() {
    const results = [];
    const seen = new Set();

    const typeMap = {
      'project':    'project',
      'due-work':   'dueWork',
      'task':       'task',
      'quiz':       'quiz',
      'lesson-plan':'lessonPlan',
    };

    function inferType(node) {
      const rawType = node.dataset?.assessmentType || node.dataset?.type || '';
      const iconEl  = node.querySelector('[class*="icon-"]');
      const cls     = rawType + ' ' + (iconEl?.className || '') + ' ' + node.className;
      for (const [key, val] of Object.entries(typeMap)) {
        if (cls.includes(key)) return val;
      }
      return 'other';
    }

    // ── Strategy 1: URL-pattern match — same reliable pattern as extractDueWork.
    const assessmentLinks = qsa('a[href*="/learning/assessments/"]');
    assessmentLinks.forEach(link => {
      const href = link.href;
      if (seen.has(href)) return;
      seen.add(href);
      const title = link.textContent.trim();
      if (!title || title.length < 3) return;

      const container = link.closest('tr, li, article, [class*="item"], [class*="card"], [class*="assessment"], .list-item, .compact');
      const type    = container ? inferType(container) : 'other';
      // Use specific class selectors for subject to avoid matching date elements.
      const subject = container
        ? (qs('[class*="class-name"], [class*="subject-name"], [class*="unit-name"]', container)?.textContent?.trim()
          || qs('[class*="class"], [class*="subject"], [class*="unit"]', container)?.textContent?.trim()
          || '')
        : '';
      // Prefer datetime attribute over visible text to avoid confusing date text with subject.
      const dateEl  = container ? qs('time, [class*="due-date"], [class*="dueDate"]', container) : null;
      const dateStr = dateEl?.getAttribute('datetime') || dateEl?.getAttribute('title') || dateEl?.textContent?.trim() || '';
      const daysLeft = parseDaysLeft(dateStr);

      results.push({ title, href, subject, dateStr, daysLeft, type });
    });

    if (results.length > 0) {
      results.sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999) || a.title.localeCompare(b.title));
      return results;
    }

    // ── Strategy 2: CSS selector fallback.
    const fallbackSelectors = [
      '[data-assessment-type]',
      '[data-component="due-work"] li',
      '.assessment-list tr',
      '[class*="activity"] li',
      '[class*="learning-activity"]',
      '.due-work-list li',
      'tr[data-assessment-id]',
      '[class*="assessment-item"]',
      '.list-item',
    ];

    for (const sel of fallbackSelectors) {
      const nodes = qsa(sel);
      if (nodes.length === 0) continue;
      nodes.forEach(node => {
        const link  = qs('a', node);
        const href  = link?.href || null;
        const title = link?.textContent?.trim() || qs('[class*="title"]', node)?.textContent?.trim() || '';
        if (!title || title.length < 3 || seen.has(title)) return;
        seen.add(title);
        const type    = inferType(node);
        const subject = qs('[class*="class"], [class*="subject"]', node)?.textContent?.trim() || '';
        const dateEl  = qs('time, [class*="date"], [class*="due"]', node);
        const dateStr = dateEl?.getAttribute('datetime') || dateEl?.textContent?.trim() || '';
        const daysLeft = parseDaysLeft(dateStr);
        results.push({ title, href, subject, dateStr, daysLeft, type });
      });
      if (results.length > 0) break;
    }

    results.sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999) || a.title.localeCompare(b.title));
    return results;
  }
  /* ═══════════════════════════════════════════════════════════
     PAGE: GENERIC / PASSTHROUGH
     For pages we haven't specifically handled, show a clean
     wrapper with the original page content inside.
  ═══════════════════════════════════════════════════════════ */
  function buildGenericPage(wrap) {
    const title = qs('h1, .page-title')?.textContent?.trim() || 'MyTintern';
    wrap.append(el('div', { class: 'tc-page-title' }, title));

    const orig = qs('#tc-original-content');
    if (orig) {
      const c = el('div', { class: 'tc-card' });
      const hdr = el('div', { class: 'tc-card-header' });
      hdr.append(el('h2', {}, 'Page Content'));
      c.append(hdr);

      const clone = orig.cloneNode(true);
      clone.removeAttribute('id');
      clone.style.display = '';
      clone.style.padding = '20px';
      clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));

      c.append(clone);
      wrap.append(c);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN INIT
  ═══════════════════════════════════════════════════════════ */
  function init() {
    // ── Impersonation guard ──────────────────────────────────────────────────
    // If a staff member is impersonating a student account, abort entirely so
    // the portal behaves exactly as Schoolbox normally would.  This protects
    // against staff accidentally acting as a student while clean mode is active.
    const _sbUser = (window.schoolboxUser && typeof window.schoolboxUser === 'object')
      ? window.schoolboxUser : {};
    if (_sbUser.impersonated) {
      console.info('MyTintern: impersonation active — clean mode suppressed.');
      return;
    }

    // Activate clean mode
    document.body.classList.add('tintern-clean');

    // Inject accordion + subject content styles (once per page load)
    if (!qs('#tc-accordion-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'tc-accordion-styles';
      styleEl.textContent = `
        :root {
          --content-ui-submit-background: white;
        }

        /* ── Subject page two-column layout ── */
        .tc-subject-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 800px) {
          .tc-subject-layout { grid-template-columns: 1fr; }
        }
        .tc-subject-main { display: flex; flex-direction: column; gap: 12px; }
        .tc-subject-side { display: flex; flex-direction: column; gap: 12px; }

        /* ── Pinned card (Unit Resources) ── */
        .tc-subject-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        /* ── Accordion wrapper ── */
        .tc-accordion {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .component-titlebar {
          background-color: #37364d;
        }

        /* ── Accordion item ── */
        .tc-accordion-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        /* ── Accordion header button ── */
        .tc-accordion-hdr {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--muted);
          text-align: left;
          transition: background .15s, color .15s;
          border-bottom: 1px solid transparent;
        }
        .tc-accordion-item.open .tc-accordion-hdr {
          border-bottom-color: var(--border);
          color: var(--text);
        }
        .tc-accordion-hdr:hover { background: rgba(255,255,255,.03); color: var(--text); }

        .tc-accordion-chevron {
          font-size: 10px;
          color: var(--muted);
          flex-shrink: 0;
          margin-left: 12px;
        }

        /* ── Accordion body ── */
        .tc-accordion-inner { padding: 16px 20px 20px; }

        /* ── Subject content: Schoolbox internals styled dark ── */
        .tc-subject-content { color: var(--text); font-family: var(--sans); }

        /* Reset Foundation grid — negative margins break layout inside our cards */
        .tc-subject-content .row {
          margin-left: 0 !important;
          margin-right: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
        }
        .tc-subject-content .island {
          padding: 0 !important;
        }
        /* Reset .small-12 padding that Foundation adds */
        .tc-subject-content .small-12 {
          padding-left: 0 !important;
          padding-right: 0 !important;
          width: 100% !important;
          float: none !important;
        }
        /* Reset Foundation column padding on ALL .columns inside subject content.
           Foundation's .row normally uses a compensating negative margin to offset
           the ~15px padding-left it adds to every .columns child. Because we zero
           out .row's negative margin above, that padding is no longer cancelled —
           it pushes Teachers, Students, Course Outline, Reports, etc. to the right
           and crops them. Resetting padding here on every .columns (not just those
           inside lists) fixes the shift across all components. */
        .tc-subject-content .columns {
          padding-left: 0 !important;
          padding-right: 0 !important;
          float: none !important;
        }

        /* images */
        .tc-subject-content img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          display: block;
        }

        /* folder/resource card grid — only wrap when there are column children */
        .tc-subject-content section {
          display: block;
        }
        .tc-subject-content section:has(.columns) {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tc-subject-content .columns {
          flex: 1 1 140px;
          max-width: 200px;
          min-width: 120px;
          box-sizing: border-box;
        }
        .tc-subject-content .v-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color .15s;
        }
        .tc-subject-content .v-card:hover { border-color: var(--accent); }
        .tc-subject-content .card-class-image {
          width: 100%;
          height: 80px;
          background-size: cover;
          background-position: center;
        }
        .tc-subject-content .card-content { padding: 8px 10px; }
        .tc-subject-content .card-content h3 {
          font-size: 12px;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
        }
        .tc-subject-content .card-content h3 a {
          color: var(--text);
          text-decoration: none;
        }
        .tc-subject-content .card-content h3 a:hover { color: var(--accent); }

        /* assessment/information lists */
        .tc-subject-content ul.information-list,
        .tc-subject-content ul.action-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        /* course outline list items — fix overextension from .actions-small-1 */
        .tc-subject-content .actions-small-1 {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        .tc-subject-content .actions-small-1 .list-item {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        .tc-subject-content .compact.card,
        .tc-subject-content .card.small-12 {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 0;
        }
        .tc-subject-content .compact.card a,
        .tc-subject-content .compact.card p {
          display: block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tc-subject-content ul.information-list > li,
        .tc-subject-content ul.action-list > li {
          border-bottom: 1px solid var(--border);
          padding: 10px 0;
        }
        .tc-subject-content ul.information-list > li:last-child,
        .tc-subject-content ul.action-list > li:last-child { border-bottom: none; }
        .tc-subject-content h3 { font-size: 13px; font-weight: 600; margin: 0 0 3px; color: var(--text); padding: 0 1rem; }
        .tc-subject-content h3 a { color: var(--text); text-decoration: none; }
        .tc-subject-content h3 a:hover { color: var(--accent); }
        .tc-subject-content p.meta { font-size: 11px; color: var(--muted); margin: 2px 0; font-family: var(--mono); padding: 0 1rem; }
        .tc-subject-content p.meta a { color: var(--muted); text-decoration: none; }
        .tc-subject-content p.meta a:hover { color: var(--accent); }

        .card img {
          margin: 0px;
        }

        /* unit group headers in course outline */
        .tc-subject-content .card.small-12 > h3 {
          font-size: 13px;
          font-weight: 700;
          color: var(--accent);
          padding: 8px 0 4px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 6px;
        }

        /* completion tick */
        .tc-subject-content .progress-tick { display: none; }
        /* gradient span labels */
        .tc-subject-content [class*="gradient-"] { color: var(--amber) !important; font-size: 11px; }

        /* countdown timer */
        .tc-subject-content .countdown-timer {
          display: flex;
          gap: 16px;
          list-style: none;
          padding: 8px 0;
          margin: 0;
          align-items: baseline;
          flex-wrap: wrap;
        }
        .tc-subject-content .countdown-timer li { text-align: center; }
        .tc-subject-content .countdown-timer .count {
          background: black;
          font-size: 30px;
          font-weight: 800;
          color: var(--text);
          font-family: var(--mono);
          display: block;
        }

        .news-post .detail h1 {
          color: white;
    }
        .tc-subject-content .countdown-timer .labels {
          font-size: 10px;
          color: var(--muted);
          background: black;
          text-transform: uppercase;
          letter-spacing: .06em;
          display: block;
          font-family: var(--mono);
        }

        /* teacher photo cards */
        .tc-subject-content .grid { list-style: none; padding: 0; margin: 0; }
        .tc-subject-content .grid li { margin-bottom: 8px; }
        .tc-subject-content .grid li .card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
        }
        /* hide "Secondary Students" role label in class list */
        .tc-subject-content .grid li .card p.meta { display: none; }
        .tc-subject-content .grid li .card img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 2px solid var(--border);
        }
        .tc-subject-content .grid li .card p {
          font-size: 13px;
          font-weight: 600;
          padding: 0 10px;
          color: var(--text);
          margin: 0;
        }
        .tc-subject-content .grid li .card p.meta { color: var(--muted); font-weight: 400; }
        .tc-subject-content .grid li .card a { text-decoration: none; color: inherit; width: 100%; }

        /* textbox article content */
        .tc-subject-content article { color: var(--text); }
        .tc-subject-content article p { margin: 0 0 10px; font-size: 14px; line-height: 1.6; }
        .tc-subject-content article a { color: var(--accent); }
        .tc-subject-content article strong { color: #fff; }

        /* success callout (e.g. Weekly Planner announcement box) */
        .tc-subject-content .sb-ck-callout--success {
          background: rgba(76,175,130,.12);
          border-left: 3px solid var(--green);
          border-radius: 4px;
          padding: 10px 14px;
          margin-bottom: 12px;
          font-size: 13px;
        }

        /* file drop box — ensure form and dzone fill the full card width */
        .tc-subject-content form { width: 100%; box-sizing: border-box; }
        .tc-subject-content form label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: .04em;
          font-family: var(--mono);
        }
        .tc-subject-content form input[type="text"] {
          display: block;
          width: 100%;
          box-sizing: border-box;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 13px;
          padding: 8px 10px;
          margin-bottom: 10px;
        }
        .tc-subject-content form input[type="text"]:focus {
          outline: none;
          border-color: var(--accent);
        }
        .tc-subject-content .attachzone,
        .tc-subject-content #dropzbox-zone {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        .tc-subject-content .dzone {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
          min-height: 80px;
          border: 2px dashed var(--border);
          border-radius: 6px;
          color: var(--muted);
          font-size: 13px;
          font-family: var(--sans);
          cursor: pointer;
          transition: border-color .15s, color .15s;
        }
        .tc-subject-content .dzone:hover {
          border-color: var(--accent);
          color: var(--text);
        }
        .tc-subject-content form input[type="submit"] {
          margin-top: 10px;
          background: var(--accent-lt);
          color: var(--accent);
          border: 1px solid var(--accent);
          border-radius: 4px;
          padding: 7px 16px;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background .15s;
        }
        .tc-subject-content form input[type="submit"]:hover {
          background: var(--accent);
          color: var(--navy);
        }

        /* component-titlebar meta (course link above assessment list) */
        .tc-subject-content .component-titlebar.meta {
          font-size: 12px;
          color: var(--muted);
          font-family: var(--mono);
          margin-bottom: 8px;
          display: block;
        }
        .tc-subject-content .component-titlebar.meta a { color: var(--muted); text-decoration: none; }
        .tc-subject-content .component-titlebar.meta a:hover { color: var(--accent); }

        /* sortable/task list subtitles */
        .tc-subject-content .card.small-12 > p { font-size: 11px; color: var(--muted); margin: 2px 0 0; }

        /* hide all Schoolbox edit/chrome junk */
        .tc-subject-content .editPanel,
        .tc-subject-content [data-component-panel],
        .tc-subject-content .immersive-reader-button,
        .tc-subject-content .reorder_form,
        .tc-subject-content .component-action,
        .tc-subject-content .toast,
        .tc-subject-content a[data-collapser],
        .tc-subject-content nav { display: none !important; }

        /* expand-link arrows in course outline — hide the icon but keep the text link */
        .tc-subject-content a.expand-link { display: none !important; }
      `;
      document.head.append(styleEl);
    }

    // Build persistent chrome
    // Skip the nav bar on file-fetch pages — they just serve a raw file and
    // the nav sits over the content with no useful purpose there.
    if (window.location.pathname !== '/storage/fetch.php') {
      buildNav();
      buildToggle();
    }
    wrapOriginal();

    // Build the clean page container
    const page = el('div', { id: 'tc-clean-page' });
    document.body.append(page);

    // Auto-lightify every .tc-card added to the clean page.
    // Covers both synchronous cards (built immediately in the switch below)
    // and async ones (e.g. due-work slots rebuilt after polling).
    var _lightifyObs = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList && node.classList.contains('tc-card')) {
            lightifyCard(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('.tc-card').forEach(lightifyCard);
          }
        });
      });
    });
    _lightifyObs.observe(page, { childList: true, subtree: true });

    //document.body.style.setProperty('background-image', `url(${chrome.runtime.getURL('background.jpg')})`, 'important');

    // Route to the appropriate page builder
    const pageType = detectPage();

    switch (pageType) {
      case 'dashboard': buildDashboard(page); break;
      case 'timetable': buildTimetablePage(page); break;
      case 'calendar':  buildCalendarPage(page); break;
      case 'subject':   buildSubjectPage(page); break;
      case 'classes':   buildClassesPage(page); break;
      case 'due':       buildDuePage(page); break;
      case 'activities':buildActivitiesPage(page); break;
      default:          buildGenericPage(page); break;
    }
  }

  // Run after DOM is ready (document_end ensures this)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run on SPA navigations (Schoolbox uses history API)
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    const newPath = window.location.pathname;
    if (newPath !== lastPath) {
      lastPath = newPath;
      const existingPage = qs('#tc-clean-page');
      const existingNav = qs('#tc-clean-nav');
      const existingBtn = qs('#tc-toggle-btn');
      if (existingPage) existingPage.remove();
      if (existingNav) existingNav.remove();
      if (existingBtn) existingBtn.remove();
      document.body.classList.remove('tintern-clean');
      init();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();

}

// ─── IFRAME BOOTSTRAP ─────────────────────────────────────────────────────────
// If the script runs inside any iframe (detected via window !== window.top),
// call injectCleanMode() and stop — never create a nested iframe.
// This is synchronously reliable unlike __TC_FRAME__ which was set async and
// caused cascading iframes when the script ran before the load event fired.

if (window !== window.top) {
  injectCleanMode();
  return;
}

// ── Create the full-screen iframe ───────────────────────────────────────────
// ── Create the full-screen iframe ───────────────────────────

// Mark the root window as active now. Any subsequent bookmarklet click on the
// parent page will be caught by the guard at the top of this IIFE before it
// can create a second iframe.
window.__TC_ACTIVE__ = true;

var _tcFrame = document.createElement('iframe');

_tcFrame.id = 'tc-wrapper-frame';
_tcFrame.style.cssText = [
  'position:fixed',
  'top:0',
  'left:0',
  'width:100%',
  'height:100%',
  'border:none',
  'z-index:2147483647',
  'background:#0f1117',
  'opacity:0',
  'transition:opacity .15s ease'
].join(';');

_tcFrame.src = location.href;

// Parent loading screen
var _tcLoader = document.createElement('div');
_tcLoader.id = 'tc-loader';
_tcLoader.innerHTML = `
  <div style="
    color:white;
    font:600 18px system-ui;
    text-align:center;
  ">
    <div style="margin-bottom:12px">MyTintern</div>
    <div style="opacity:.6;font-size:14px">Loading...</div>
  </div>
`;

_tcLoader.style.cssText = [
  'position:fixed',
  'inset:0',
  'background:#0f1117',
  'display:flex',
  'align-items:center',
  'justify-content:center',
  'z-index:2147483646'
].join(';');

function _showFrame() {
  _tcLoader.remove();
  _tcFrame.style.opacity = '1';
}

function _tcReinject() {
  try {
    var iwin = _tcFrame.contentWindow;
    var idoc = _tcFrame.contentDocument;

    var s = idoc.createElement('script');

    s.textContent = `
      (${injectCleanMode.toString()})();

      requestAnimationFrame(() => {
        parent.postMessage({
          type: 'tc-ready'
        }, '*');
      });
    `;

    (idoc.head || idoc.documentElement).appendChild(s);

  } catch(e) {
    console.warn('[MyTintern] frame inject failed:', e);
  }
}

window.addEventListener('message', function(e) {
  if (e.data?.type === 'tc-ready') {
    _showFrame();
  }
});

_tcFrame.addEventListener('load', function() {
  _tcFrame.style.opacity = '0';

  if (!document.getElementById('tc-loader')) {
    document.body.appendChild(_tcLoader);
  }

  _tcReinject();
});

document.body.innerHTML = '';
document.body.style.cssText =
  'margin:0;padding:0;overflow:hidden;background:#0f1117';

document.body.appendChild(_tcLoader);
document.body.appendChild(_tcFrame);

window.addEventListener('message', function(e) {

  if (e.data?.type === 'tc-navigate') {

    if (!document.getElementById('tc-loader')) {
      document.body.appendChild(_tcLoader);
    }

    _tcFrame.style.opacity = '0';

    _tcFrame.src = e.data.href;
  }

});

})();
