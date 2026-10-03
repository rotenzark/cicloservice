/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'cicloservice',
    /* il loro WhatsApp, dichiarato sulla Pagina Facebook («+39 331 869 7892 · WhatsApp»): lo stesso numero della scheda Google */
    whatsapp: { number: '393318697892', message: 'Ciao Cicloservice! Vorrei un\'informazione sulla mia bici.', ids: ['waMenu', 'waHero', 'waOrari', 'waBar'] },
    /* la scheda Google (2/10/2026): lunedì–venerdì 9–12:30 e 15–19:30, sabato 9–12:30 e 15–18, domenica chiuso */
    hours: {
      0: [],
      1: [['09:00', '12:30'], ['15:00', '19:30']], 2: [['09:00', '12:30'], ['15:00', '19:30']], 3: [['09:00', '12:30'], ['15:00', '19:30']],
      4: [['09:00', '12:30'], ['15:00', '19:30']], 5: [['09:00', '12:30'], ['15:00', '19:30']], 6: [['09:00', '12:30'], ['15:00', '18:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Cicloservice: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.centratura": "The O",
      "n.officina": "Workshop",
      "n.negozio": "Shop",
      "n.lavori": "Work",
      "n.recensioni": "Reviews",
      "n.orari": "Hours",
      "t.chiama": "Call",
      "t.whatsapp": "Message us on WhatsApp",
      "t.wa": "WhatsApp",
      "t.indicazioni": "Directions",
      "t.orari": "Hours",
      "h.occhio": "Viale Corsica 86 · by Forlanini station",
      "h.titolo": "Bicycle sales and repairs.",
      "h.frase": "A neighbourhood workshop and shop. We repair and sell every kind of bike: city, road, mountain, children’s and electric. From the amateur to the professional.",
      "h.n": "4.4",
      "h.voto": "on Google, 127 reviews",
      "a.vetrina": "Our shop window on Viale Corsica: the frame of bicycle stickers around the glass, the Riparazioni biciclette banner with the shield, the open door onto the row of bikes, and in front the bike with the bamboo frame.",
      "h.fvetrina": "The shop window, with the bamboo-frame bike just finished (April 2016)",
      "c.occhio": "The O is a wheel",
      "c.titolo": "Trued, spoke by spoke",
      "c.intro": "On our sign, the O in CICLO is a twenty-spoke wheel. Here we have put it on the truing stand: it spins, the dial gauge shows where the rim goes off line, and the spoke key tightens the nipples one at a time until the needle is back at zero.",
      "c.cit": "on Google, 2021",
      "c.titoloSvg": "Truing: the wheel of our O on the truing stand",
      "c.desc": "The twenty-spoke wheel of the O in Cicloservice, mounted on the truing stand and drawn in line. It spins: the dial gauge on top marks the point where the rim hops. The wheel stops with the fault under the gauge, the spoke key tightens three nipples one after the other, the tightened spokes turn blue, the needle goes back to zero and the wheel spins round again. In the second mode the wheel is seen from the front and the rim wobbles sideways.",
      "c.d0": "From the side: the rim hops. The wheel spins, the gauge marks the high spot, the key tightens three spokes and the rim is round again.",
      "c.d1": "From the front: the rim wobbles to one side. The wheel spins, the gauge marks the wobble, the key tightens three spokes on the opposite side and the rim runs straight again.",
      "c.modi": "How to look at the wheel",
      "c.b0": "From the side",
      "c.b1": "From the front",
      "o.occhio": "In the workshop",
      "o.titolo": "From the amateur to the professional",
      "o.intro": "Repairs and servicing for every kind of bike: the one you ride to work, the road bike, the mountain bike, the electric one, the one that has been waiting in the cellar for years.",
      "o.v1": "Punctures and tyres",
      "o.v1t": "Inner tubes, tyres, valves.",
      "o.v2": "Brakes",
      "o.v2t": "Brake pads, cables and adjustment.",
      "o.v3": "Gears",
      "o.v3t": "Adjusting the derailleur and the shifters.",
      "o.v4": "Wheels and spokes",
      "o.v4t": "Truing the rim, spokes to tension or replace.",
      "o.v5": "Drivetrain",
      "o.v5t": "Chain, sprockets, cassette and chainset.",
      "o.v6": "Shock absorbers",
      "o.v6t": "Servicing mountain bike shocks.",
      "o.v7": "Road and mountain bikes",
      "o.v7t": "Road bikes, mountain bikes, downhill too.",
      "o.v8": "Electric bikes",
      "o.v8t": "E-bikes too.",
      "o.v9": "Vintage bikes",
      "o.v9t": "Older bikes, to get back on the road.",
      "o.v10": "Builds",
      "o.v10t": "Like our bamboo-frame bike, put together piece by piece.",
      "o.nota": "Bring your bike to the shop during opening hours, or call us first on 331 869 7892.",
      "ng.occhio": "In the shop",
      "ng.titolo": "Every kind of bike",
      "ng.testo": "City bikes, road bikes, mountain bikes, children’s and electric bikes; plus helmets, accessories and spare parts, hanging on our yellow pegboard.",
      "ng.a1": "City",
      "ng.a2": "Road",
      "ng.a3": "Mountain bike",
      "ng.a4": "Children",
      "ng.a5": "Electric",
      "ng.a6": "Helmets",
      "ng.a7": "Accessories",
      "ng.a8": "Spare parts",
      "ng.nota": "Looking for a particular model or part? Call us first and we will tell you if we have it.",
      "a.negozio": "Inside the shop: the row of city bikes, the bikes hanging from the ceiling, the yellow pegboard with coloured saddles and spare parts, the rainbow jersey hanging at the door.",
      "ng.ffoto": "Inside: the row of bikes, the yellow pegboard with the saddles and the rainbow jersey at the door (September 2015)",
      "l.occhio": "From our page",
      "l.titolo": "Work on the bench",
      "l.intro": "A few photos we posted on our Facebook page, with the date. The words in quotation marks are from our posts.",
      "a.bamboo": "The bamboo frame on the workshop stand, among the shelves of spare parts.",
      "l.f1": "“Build your own bike, with a bamboo frame.”",
      "l.d1": "31 March 2016",
      "a.puntine": "A tyre with coloured drawing pins stuck in the tread, on our studded rubber floor.",
      "l.f2": "The tyre with the drawing pins.",
      "l.d2": "1 October 2015",
      "a.epoca": "A red steel road bike from the Sixties, in front of the glass cabinets of spare parts.",
      "l.f3": "A 1960s road bike, in steel.",
      "l.d3": "18 October 2017",
      "a.ammortizzatore": "A shock absorber taken apart, held in the blue vice on the bench.",
      "l.f4": "Servicing a shock absorber.",
      "l.d4": "28 April 2017",
      "a.cassetta": "The rear cassette with its big sprockets, the chain and the derailleur, close up.",
      "l.f5": "“11-42”: the cassette, from 11 to 42 teeth.",
      "l.d5": "2 May 2017",
      "l.nota": "We blurred the brands in the photos.",
      "r.occhio": "Reviews",
      "r.titolo": "People who bring us their bikes",
      "r.g18": "Google, 2018",
      "r.g22": "Google, 2022",
      "r.g25": "Google, 2025",
      "r.g26": "Google, 2026",
      "r.nota": "From the reviews on Google, as they were written (in Italian, one in English); […] where we shortened them. The one in English is from a cycle tourist who had just landed at Linate.",
      "r.tutte": "All the reviews on Google",
      "w.occhio": "Hours and directions",
      "w.titolo": "By Forlanini station",
      "w.orario": "Opening hours",
      "w.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "w.nota": "Hours from our Google listing (October 2026).",
      "w.dove": "Where",
      "w.dovev": "Viale Corsica 86, 20137 Milan",
      "w.tram": "Tram",
      "w.tramv": "the 12 and the 27, Stazione Forlanini M4 stop, about 100 metres away",
      "w.bus": "Bus",
      "w.busv": "the 45 and the 175, at the same stop",
      "w.metro": "Metro and rail",
      "w.metrov": "M4 Stazione Forlanini, about 300 metres away; Milano Forlanini railway station, about 350 metres away",
      "w.tel": "Phone",
      "w.telwa": "(WhatsApp too)",
      "w.mappa": "Map: Cicloservice, Viale Corsica 86, Milan",
      "q.occhio": "Questions",
      "q.titolo": "Before you drop by",
      "q.d1": "Do I need an appointment?",
      "q.r1": "You can come by with your bike during opening hours. If you want to know first when we can look at it, call or message us on 331 869 7892.",
      "q.d2": "Do you repair electric bikes too?",
      "q.r2": "Yes, electric bikes too, as well as city bikes, road bikes, mountain bikes and vintage bikes.",
      "q.d3": "Do you sell bicycles?",
      "q.r3": "Yes: city, road, mountain, children’s and electric bikes, plus helmets, accessories and spare parts. If you are looking for a particular model or part, call us first.",
      "q.d4": "Can I message you on WhatsApp?",
      "q.r4": "Yes, on 331 869 7892: it is the same number as the phone.",
      "q.d5": "When are you open?",
      "q.r5": "Monday to Friday <span class=\"intero\">9am–12:30pm</span> and <span class=\"intero\">3pm–7:30pm</span>, Saturday <span class=\"intero\">9am–12:30pm</span> and <span class=\"intero\">3pm–6pm</span>. We are closed on Sundays.",
      "q.d6": "How do I get there?",
      "q.r6": "We are at Viale Corsica 86. Trams 12 and 27 and buses 45 and 175 stop at Stazione Forlanini M4, about 100 metres away; the M4 metro station Stazione Forlanini is about 300 metres away.",
      "f.orario": "<span class=\"intero\">Monday–Friday 9am–12:30pm</span> and <span class=\"intero\">3pm–7:30pm</span> · Saturday <span class=\"intero\">9am–12:30pm</span> and <span class=\"intero\">3pm–6pm</span> · Sunday closed",
      "f.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, rating and reviews from the Google listing (October 2026); photos from our Facebook page (2015–2017, brands blurred). We redrew the shield, the sign and the truing.",
      "f.su": "Back to top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ CICLOSERVICE — vendita e riparazione di biciclette, Viale Corsica 86 ══════════
     la FIRMA — «la centratura»: la ruota della O del loro logo sul centraruote. Gira, il comparatore segna il difetto, la ruota si
     ferma col difetto sotto il comparatore, la chiave per raggi tira tre nippli, la ruota rigira dritta. Lo stato è M (Di lato /
     Di fronte), T (0…1) e V (0 al suo posto; fino a 1 la scena sale di poco e si spegne; da −1 a 0 arriva la prossima, storta).
     Senza JS e alla fine: Di lato, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la ruota storta. Reduced-motion: tutto
     subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma
     dov'è. */
  var DATI = {"vb":[600,600],"via":-14,"c":[300,300],"R":190,"tw":16,"Rr":168,"rh":14,"N":20,"flangia":24,"dialR":26,"dial0":[300,52],"dial1":[506,142.4],"psiG1":30,"agoK":58,"riposo":[92,549],"chiaveGiro":240,"modi":[{"nome":"Di lato","tipo":"lato","beta":180,"largo":46,"passi":[18,9,3.5,0],"tirati":[10,9,11],"phiS":540,"phiF":1080,"giro1":[0.03,0.24],"muovi":[[0.3,0.06],[0.45,0.04],[0.58,0.04],[0.71,0.07]],"tiri":[[0.37,0.07],[0.5,0.07],[0.63,0.07]],"giro2":[0.8,0.2]},{"nome":"Di fronte","tipo":"fronte","beta":108,"largo":46,"passi":[26,13,5,0],"tirati":[6,4,8],"phiS":642,"phiF":1080,"giro1":[0.03,0.24],"muovi":[[0.3,0.06],[0.45,0.04],[0.58,0.04],[0.71,0.07]],"tiri":[[0.37,0.07],[0.5,0.07],[0.63,0.07]],"giro2":[0.8,0.2]}],"tempi":{"inizio":300,"centra":7000,"servi":420,"arriva":480,"centraV":6000}};
  /* la centratura a (M, T, V) — una sola fonte: la usano _cls_firma.mjs (l'HTML allo stato finale e l'attesa), main.js (via
     cls_main.cjs) e la prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa.
     La ruota della O del loro logo (20 raggi) sul centraruote. M = 0 «Di lato»: il cerchio ha un salto (radiale); M = 1 «Di
     fronte»: il cerchio sbanda (laterale). La ruota gira (il comparatore segna l'errore quando passa), si ferma col punto storto
     sotto il comparatore, la chiave per raggi tira tre nippli uno alla volta (i raggi tirati diventano azzurri e l'errore cala),
     torna a posto, la ruota rigira dritta. Col V la scena sale di poco e si spegne; la prossima arriva, di nuovo storta. */
  function creaCentra(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { var x = Math.round(n * 10) / 10; return x === 0 ? 0 : x; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var uno = function (cl, m, k) { return q('.' + cl + '[data-m="' + m + '"]' + (k === undefined ? '' : '[data-k="' + k + '"]')); };
    var CX = D.c[0], CY = D.c[1], R = D.R, TW = D.tw, RR = D.Rr, RH = D.rh, N = D.N, PASSO = 360 / N, G = Math.PI / 180;
    /* il difetto: una gobba liscia larga ±w gradi attorno a beta, nel giro della ruota */
    var gobba = function (d, w) { d = ((d % 360) + 540) % 360 - 180; return Math.abs(d) >= w ? 0 : Math.pow(Math.cos(Math.PI * d / (2 * w)), 2); };
    var pezzi = D.modi.map(function (M, m) {
      return {
        gomma: uno('cs-gomma', m), lontano: uno('cs-lontano', m), raggi: uno('cs-raggi', m), raggiL: uno('cs-raggi-l', m),
        tirati: M.tirati.map(function (_, k) { return uno('cs-tirato', m, k); }),
        ruota: uno('cs-ruota', m), ago: uno('cs-ago', m), asta: uno('cs-asta', m), chiave: uno('cs-chiave', m)
      };
    });
    /* lo stato meccanico a T: il giro della ruota, l'errore, i raggi tirati, la chiave */
    function meccanica(M, t) {
      var g1 = dolce(fase(t, M.giro1)), g2 = dolce(fase(t, M.giro2));
      var phi = M.phiS * g1 + (M.phiF - M.phiS) * g2;
      var A = M.passi[0], tir = [], giro = 0, i;
      for (i = 0; i < 3; i++) { var u = dolce(fase(t, M.tiri[i])); A -= (M.passi[i] - M.passi[i + 1]) * u; tir.push(u); giro += u; }
      return { phi: phi, A: A, tir: tir, rot: -D.chiaveGiro * giro, mv: M.muovi.map(function (w) { return dolce(fase(t, w)); }) };
    }
    function difetto(M, A, psiRuota) { return A * gobba(psiRuota - M.beta, M.largo); }
    /* dove sta il nipplo del raggio k a schermo (la chiave ci va sopra) */
    function nipplo(M, s, k) {
      var psiR = M.tirati[k] * PASSO, psi = psiR + s.phi, e = difetto(M, s.A, psiR);
      if (M.tipo === 'lato') { var r = R + e - TW - 7; return [CX + r * Math.sin(psi * G), CY - r * Math.cos(psi * G)]; }
      return [CX + e - 2, CY - (RR - 10) * Math.cos(psi * G)];
    }
    function chiave(M, s) {
      var P = [D.riposo, nipplo(M, s, 0), nipplo(M, s, 1), nipplo(M, s, 2), D.riposo], x = P[0][0], y = P[0][1];
      for (var i = 0; i < 4; i++) { x += (P[i + 1][0] - P[i][0]) * s.mv[i]; y += (P[i + 1][1] - P[i][1]) * s.mv[i]; }
      var rot = ((s.rot % 360) + 360) % 360;
      return 'translate(' + r1(x) + ' ' + r1(y) + ') rotate(' + r1(rot === 360 ? 0 : rot) + ')';
    }
    var punto = function (x, y) { return r1(x) + ' ' + r1(y); };
    /* DI LATO: tutto nel giro della ruota (il gruppo ruota di phi) */
    function lato(M, s) {
      var d = '', inn = '', a, rr, k;
      for (a = 0; a < 360; a += 5) { rr = R + difetto(M, s.A, a); d += (a ? 'L' : 'M') + punto(CX + rr * Math.sin(a * G), CY - rr * Math.cos(a * G)); }
      for (a = 360; a > 0; a -= 5) { rr = R - TW + difetto(M, s.A, a); inn += (a < 360 ? 'L' : 'M') + punto(CX + rr * Math.sin(a * G), CY - rr * Math.cos(a * G)); }
      var raggio = function (k) { var p = k * PASSO, re = R - TW + 2 + difetto(M, s.A, p); return 'M' + punto(CX + RH * Math.sin(p * G), CY - RH * Math.cos(p * G)) + 'L' + punto(CX + re * Math.sin(p * G), CY - re * Math.cos(p * G)); };
      var tutti = ''; for (k = 0; k < N; k++) tutti += raggio(k);
      var phi = ((s.phi % 360) + 360) % 360;
      var top = R + difetto(M, s.A, -s.phi);
      return {
        gomma: d + 'Z' + inn + 'Z', raggi: tutti, tirati: M.tirati.map(raggio),
        ruota: 'rotate(' + r1(phi === 360 ? 0 : phi) + ' ' + CX + ' ' + CY + ')',
        asta: 'M' + punto(D.dial0[0], D.dial0[1] + D.dialR) + 'V' + r1(CY - top), ago: 'rotate(' + r1(D.agoK * (top - R) / M.passi[0]) + ' ' + D.dial0[0] + ' ' + D.dial0[1] + ')'
      };
    }
    /* DI FRONTE: la ruota vista di taglio; il punto al giro psi (0 in cima) sta a y = CY − R·cos psi, spostato di lato del difetto */
    function fronte(M, s) {
      var vic = '', lon = '', a, k, Rm = R - TW / 2;
      for (a = 0; a <= 180; a += 5) vic += (a ? 'L' : 'M') + punto(CX + difetto(M, s.A, a - s.phi), CY - Rm * Math.cos(a * G));
      for (a = 180; a <= 360; a += 5) lon += (a > 180 ? 'L' : 'M') + punto(CX + difetto(M, s.A, a - s.phi), CY - Rm * Math.cos(a * G));
      var raggio = function (k) {
        var psi = k * PASSO + s.phi, fx = CX + (k % 2 ? D.flangia : -D.flangia);
        return 'M' + punto(fx, CY) + 'L' + punto(CX + difetto(M, s.A, k * PASSO), CY - RR * Math.cos(psi * G));
      };
      var vicini = '', lontani = '';
      for (k = 0; k < N; k++) { var sn = Math.sin((k * PASSO + s.phi) * G); if (sn > 1e-9 || (Math.abs(sn) <= 1e-9 && Math.cos((k * PASSO + s.phi) * G) > 0)) vicini += raggio(k); else lontani += raggio(k); }
      var e = difetto(M, s.A, D.psiG1 - s.phi);
      return {
        gomma: vic, lontano: lon, raggi: vicini, raggiL: lontani, tirati: M.tirati.map(raggio),
        asta: 'M' + punto(D.dial1[0] - D.dialR, D.dial1[1]) + 'H' + r1(CX + TW / 2 + e), ago: 'rotate(' + r1(D.agoK * e / M.passi[0]) + ' ' + D.dial1[0] + ' ' + D.dial1[1] + ')'
      };
    }
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m], s = meccanica(M, t), g = M.tipo === 'lato' ? lato(M, s) : fronte(M, s), k;
      P.gomma.setAttribute('d', g.gomma);
      P.raggi.setAttribute('d', g.raggi);
      if (M.tipo === 'lato') P.ruota.setAttribute('transform', g.ruota);
      else { P.lontano.setAttribute('d', g.lontano); P.raggiL.setAttribute('d', g.raggiL); }
      for (k = 0; k < P.tirati.length; k++) { P.tirati[k].setAttribute('d', g.tirati[k]); P.tirati[k].setAttribute('opacity', r3(s.tir[k])); }
      P.asta.setAttribute('d', g.asta);
      P.ago.setAttribute('transform', g.ago);
      P.chiave.setAttribute('transform', chiave(M, s));
      /* col V la scena sale di poco e si spegne; la prossima arriva */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P, m) {
      var lato = D.modi[m].tipo === 'lato';
      return P.gomma && P.raggi && P.asta && P.ago && P.chiave && P.tirati.every(Boolean) && (lato ? !!P.ruota : !!(P.lontano && P.raggiL));
    });
    return { disegna: disegna, pezzi: pezzi, completo: completo, meccanica: meccanica };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('centra-firma'), svgF = prendi('centraSvg'), leggiF = prendi('centraLeggi');
  var CENTRA = svgF ? creaCentra(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.centra__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.centra__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    CENTRA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) CENTRA.disegna(k, 1, 0); });
    CENTRA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la ruota storta */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la ruota storta */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.centra, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.centra });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.centraV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && CENTRA && CENTRA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaCentra); } catch (e) {}
    window.__centra = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__centra.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la ruota storta */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__centra.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
