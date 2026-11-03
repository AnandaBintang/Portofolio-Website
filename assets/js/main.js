/* ==========================================================
   Ananda Bintang — "One Night Only" story portfolio
   ========================================================== */
(async () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) root.classList.remove("story");
  const story = root.classList.contains("story");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const scenes = $$(".scene");

  /* ---------------- content (edited through the CMS at /admin) ---------------- */
  const loadJSON = (url) => fetch(url, { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const [projectData, careerData] = await Promise.all([loadJSON("content/projects.json"), loadJSON("content/experience.json")]);
  const CAREER = ((careerData && careerData.experience) || []).slice().sort((a, b) => (a.start || "").localeCompare(b.start || ""));
  const MONTHS = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  };
  const TOUR_UI = {
    en: { now: "now", live: "On tour", played: "Played", first: "First gig", at: "at" },
    id: { now: "sekarang", live: "Sedang tur", played: "Selesai", first: "Gig pertama", at: "di" },
  };
  // "2023-03" + "2023-10" → "Mar – Oct 2023"; no end date → "Oct 2026 – now".
  const span = (job, l) => {
    const m = (v) => { const [y, mo] = (v || "").split("-"); return { y, mo: MONTHS[l][(+mo || 1) - 1] }; };
    const a = m(job.start);
    if (!job.end) return `${a.mo} ${a.y} – ${TOUR_UI[l].now}`;
    const b = m(job.end);
    return a.y === b.y ? `${a.mo} – ${b.mo} ${a.y}` : `${a.mo} ${a.y} – ${b.mo} ${b.y}`;
  };
  // One stop per job, oldest first, in front of the "Next stop" sign.
  const tourStops = CAREER.map((job) => {
    const li = document.createElement("li");
    li.className = `stop${job.end ? "" : " now"}`;
    li.innerHTML = '<div class="card"><p class="when"></p><h3></h3><p class="co"></p><p class="desc"></p><span class="stamp-s"></span></div><span class="post" aria-hidden="true"></span>';
    $("#route").insertBefore(li, $("#route .stop.next"));
    return li;
  });
  function fillCareer(l) {
    CAREER.forEach((job, i) => {
      const li = tourStops[i];
      $(".when", li).textContent = [span(job, l), job.place].filter(Boolean).join(" · ");
      $("h3", li).textContent = l === "id" ? job.role_id || job.role_en : job.role_en;
      $(".co", li).textContent = [job.company, job.client].filter(Boolean).join(" · ");
      $(".desc", li).textContent = l === "id" ? job.summary_id || job.summary_en : job.summary_en;
      const st = $(".stamp-s", li), kind = !job.end ? "live" : i === 0 ? "first" : "played";
      st.className = `stamp-s ${kind === "played" ? "" : kind}`;
      st.textContent = TOUR_UI[l][kind];
    });
    // The hero says where you're playing right now.
    const now = CAREER.filter((j) => !j.end).pop();
    if (now) {
      $("#nowRole").textContent = now.role_en;
      $("#nowAt").textContent = `${TOUR_UI[l].at} ${now.company}`;
      $("#nowCompany").textContent = now.company;
    }
  }

  /* ---------------- fluid layer: smooth scroll + scroll locks ---------------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const lenis = !reduced && window.Lenis ? new Lenis({ lerp: .1, smoothWheel: true }) : null;
  if (lenis) {
    if (window.gsap) { gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  const locks = new Set();
  const lock = (who, on) => {
    on ? locks.add(who) : locks.delete(who);
    root.classList.toggle("locked", locks.size > 0);
    root.classList.toggle("print-open", locks.has("print"));
    if (lenis) locks.size ? lenis.stop() : lenis.start();
  };
  const scrollToY = (y, immediate) => (lenis
    ? lenis.scrollTo(y, { immediate, force: true })
    : scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" }));

  /* ---------------- copy (EN lives in the HTML, ID lives here) ---------------- */
  const NAMES = {
    en: { sc1: "Doors open", sc2: "Soundcheck", sc3: "The lineup", sc4: "On the road", sc5: "Photo pit", sc6: "Backstage", sc7: "Encore" },
    id: { sc1: "Pintu dibuka", sc2: "Soundcheck", sc3: "Lineup", sc4: "Di perjalanan", sc5: "Area foto", sc6: "Belakang panggung", sc7: "Encore" },
  };
  const ID = {
    setlist: "Setlist", sound: "Suara", menu_head: "Program malam ini", menu_foot: "Esc untuk menutup",
    chalk1: "Pintu 18:30", chalk2: "Mulai 19:00",
    p_from: "Live dari Sidoarjo, Jawa Timur", p_once: "Satu malam saja", p_since: "Tur sejak 2022",
    p_kicker: "di Meda Technology",
    p_lede: "Saya membangun bagian aplikasi yang baru terasa kalau sedang rusak, dan saya ingin kamu tetap tidak pernah merasakannya.",
    p_note: "iya, kacamatanya nggak dilepas ↘",
    p_with: "Band pembuka", p_now: "Sedang manggung di", p_doors: "Pintu", p_doors_v: "Terbuka untuk kerjaan baru",
    p_free: "Masuk gratis",
    tk1_what: "Ananda Bintang, live dari Sidoarjo", tk1_info: "Pintu 18:30 · Mulai 19:00 · Masuk gratis", tk1_tear: "scroll terus untuk menyobek",
    cue: "Scroll untuk masuk",
    ck1: "Cek,", ck2: "satu,", ck3: "dua.",
    sl1: "Halo, saya Bintang. Saya menulis kode backend, sekarang kebanyakan pakai <mark>Go</mark>, dengan pengalaman panjang di Laravel dan Node.js sebelumnya.",
    sl2: "Sekarang saya magang sebagai backend engineer di Meda Technology, membangun <mark>Meda Billing dan Waras</mark>: billing sekolah untuk yayasan di Indonesia, dan aplikasi kesehatan tempat konsultasi pertamamu dilakukan dengan AI.",
    sl3: "Sebelumnya saya lebih dari setahun di Weekend Inc. mengerjakan platform AYO milik Sampoerna, setelah freelance dan jadi mentor di GDSC; saya sudah mengirim kode ke pengguna sungguhan sejak 2022.",
    sc_star: "Iya, namanya Bintang. Ekspektasi orang tua saya memang setinggi itu.",
    st1: "magang pertama: sistem absensi berbasis geofencing",
    st2: "pengguna di toko top-up game yang saya bangun sebagai freelancer",
    st3: "mahasiswa yang saya mentori di Google Developer Student Club",
    st4: "query N+1 yang sengaja saya tinggalkan di production",
    title_lu: "Lineup Malam Ini", lu_note: "alat yang memang saya pakai tiap hari",
    lu_t1: "Headliner", lu_t2: "Panggung utama", lu_t3: "Panggung samping",
    title_tour: "Jadwal Tur",
    tour_sub: "Semua persinggahan sejauh ini, dari yang paling awal. Scroll terus dan van-nya terus jalan.",
    now: "sekarang",
    r1: "Backend Engineer", r5: "Magang Backend Engineer", r2: "Web Developer", r3: "Asisten Mentor", r4: "Magang Full Stack",
    s_live: "Sedang tur", s_played: "Selesai", s_first: "Gig pertama",
    t1x: "Modul staf, coach, dan order untuk AYO Kasir dan AYO Qoncierge sebagai microservice Laravel, ditambah banyak perburuan query N+1 dan pipeline linting yang menjaga semua orang tetap jujur.",
    t6: "Service Go untuk Meda Billing dan Waras dengan Echo, PostgreSQL, dan Redis. Saya memasang Xendit untuk pembayaran, lalu memindahkan seluruh alurnya ke DOKU sendiri, dan ikut menentukan stack serta arsitektur kedua aplikasi.",
    t2b: "Toko top-up game yang tumbuh sampai lebih dari 1.000 pengguna, dengan webhook pembayaran yang mengecek duplikat sebelum menyentuh order.",
    t3a: "Membimbing 50+ mahasiswa belajar web development, kebanyakan lewat workshop yang selesai dengan sesuatu yang mereka bangun sendiri.",
    t4a: "Website company profile dan web app; saya duduk bareng desainer dan project manager untuk mengubah file Figma jadi halaman yang benar-benar jalan.",
    t5a: "Sistem absensi berbasis lokasi dengan geofencing. Proyek pertama saya yang dipakai orang sungguhan.",
    next: "Persinggahan berikutnya:", next_v: "tim kamu?",
    title_rel: "Lembar Kontak",
    rel_sub: "Lembar kontak dari fotografer malam ini. Setiap frame adalah sesuatu yang pernah saya rilis; klik salah satu untuk lihat cetakan lengkap, screenshot, dan link ke versi live-nya.",
    f_all: "Semua", f_work: "Kerja klien", f_free: "Freelance", f_personal: "Pribadi",
    more: "B-side lainnya ada di",
    m_about: "Tentang project", m_did: "Yang saya kerjakan", m_stack: "Stack", m_prev: "Sebelumnya", m_next: "Berikutnya",
    title_rider: "Rider",
    rider_sub: "Setiap band mengirim satu ke venue sebelum manggung. Yang ini lebih banyak soal orangnya daripada kodenya.",
    pass_hint: "ayo, coba ayunkan ↙", char_hi: "halo!", deck_hint: "Ketuk tumpukan untuk membalik",
    ri1h: "Headphone selalu dekat.", ri1: "Musik nyala hampir sepanjang hari, dan saya lebih jernih mikir kalau ada yang diputar, apalagi pas debugging.",
    ri2h: "Waktu buat olahraga.", ri2: "Minggu ini grupnya main apa, saya ikut. Nggak pilih-pilih, cuma kompetitif.",
    ri3h: "Ada orang di sekitar.", ri3: "Saya gampang diajak ngobrol dan cepat nyetel dengan tim baru, jadi taruh saya dekat PM dan anak frontend, jangan di pojokan.",
    ri4h: "Tiket yang jelas.", ri4: "Atau sepuluh menit dengan orang yang menulisnya. Dua-duanya oke.",
    ri5h: "Log yang jujur.", ri5: "Saya yang menulisnya; saya juga mau bisa membacanya.",
    tk_title: "Yuk, ngobrol.",
    tk_sub: "Punya backend yang butuh tangan yang tenang, atau tim yang masih punya satu kursi kosong? Ambil tiketnya.",
    tk_what: "Satu obrolan dengan Ananda Bintang",
    tk_venue: "Venue", tk_venue_v: "Email, WhatsApp, atau telepon",
    tk_date: "Tanggal", tk_date_v: "Kamu yang pilih",
    tk_price: "Harga", tk_price_v: "Satu masalah yang menarik",
    tk_tear: "Sobek di sini untuk menyalin email saya",
    cv: "Unduh CV",
    ft_big: "Sampai ketemu di show berikutnya",
    ft_top: "Putar ulang dari pintu ↺",
  };
  const UI = {
    en: { open: "Open the print", noShot: "No public screenshots yet", demo: "Open live demo ↗", source: "Source code ↗", copied: (e) => `Copied. ${e} is on your clipboard.`, here: (e) => `Here it is: ${e}` },
    id: { open: "Lihat cetakannya", noShot: "Belum ada screenshot publik", demo: "Buka demo live ↗", source: "Kode sumber ↗", copied: (e) => `Tersalin. ${e} sudah ada di clipboard kamu.`, here: (e) => `Ini dia: ${e}` },
  };
  const NOTES_ID = {
    "home base since my freelance days": "markas sejak zaman freelance",
    "my daily driver at Meda": "andalan harian di Meda",
    "sessions, cache and the job queue": "session, cache, dan antrean job",
    "two gateways, one migration": "dua gateway, satu migrasi",
    "when the service wants to be JavaScript": "kalau servisnya maunya JavaScript",
    "where I go hunting for slow queries": "tempat saya berburu query lambat",
    "works on my machine, and on yours": "jalan di laptop saya, dan di laptopmu",
    "the commit police": "polisi commit",
  };
  const EN = {};
  $$("[data-i18n]").forEach((el) => { EN[el.dataset.i18n] ??= el.innerHTML; });
  $$("[data-note]").forEach((el) => (el.dataset.noteEn = el.dataset.note));

  let lang = "en";
  const sceneName = (s) => NAMES[lang][s.dataset.name];
  const setLang = (l) => {
    if (l !== lang) window.track?.("language", { to: l });
    lang = l;
    root.lang = l;
    const dict = l === "id" ? ID : EN;
    $$("[data-i18n]").forEach((el) => {
      const v = dict[el.dataset.i18n] ?? EN[el.dataset.i18n];
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    $$("[data-note]").forEach((el) => (el.dataset.note = l === "id" ? NOTES_ID[el.dataset.noteEn] || el.dataset.noteEn : el.dataset.noteEn));
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
    renderSheetText();
    fillCareer(l);
    if (print.open) fillPrint(curProj);
    scenes.forEach((s) => { const k = $("[data-kicker]", s); if (k) k.innerHTML = `<b>${s.dataset.time}</b>${sceneName(s)}`; });
    buildMenu();
    store.set("lang", l);
    fitAll();
    hud(true);
  };
  const swapLang = (l) => {
    if (l === lang) return;
    if (reduced) { setLang(l); return; }
    root.classList.add("lang-out");
    setTimeout(() => {
      setLang(l);
      root.classList.replace("lang-out", "lang-in");
      setTimeout(() => root.classList.remove("lang-in"), 450);
    }, 170);
  };
  $$(".lang button").forEach((b) => b.addEventListener("click", () => swapLang(b.dataset.lang)));

  /* ---------------- generated decoration ---------------- */
  $$("[data-barcode]").forEach((bc) => {
    for (let i = 0; i < 26; i++) { const b = document.createElement("i"); b.style.width = `${Math.round(rand(1, 4))}px`; bc.appendChild(b); }
  });
  const wave = $("#wave");
  for (let i = 0; i < 22; i++) { const b = document.createElement("i"); b.style.setProperty("--i", i); b.style.setProperty("--h", rand(.35, 1).toFixed(2)); wave.appendChild(b); }
  const lights = $("#lights");
  for (let i = 0; i < 46; i++) {
    const d = document.createElement("i");
    d.style.left = `${rand(1, 99)}%`; d.style.bottom = `${rand(26, 95)}%`; d.style.setProperty("--i", i);
    lights.appendChild(d);
  }
  let crowd = "M0 160 V118";
  for (let x = 0; x < 1440;) {
    const w = rand(34, 56), h = rand(26, 52);
    crowd += ` Q${(x + w / 2).toFixed(0)} ${(118 - h * 1.7).toFixed(0)} ${(x + w).toFixed(0)} 118`;
    x += w;
  }
  $("#crowdPath").setAttribute("d", crowd + " V160 Z");

  /* ---------------- poster type that fills its box ---------------- */
  function fitAll() {
    const fits = $$("[data-fit]");
    fits.forEach((el) => {
      // ANANDA stops short so the character has a spot to sit on top of BINTANG.
      const box = el.parentElement.clientWidth * (el.classList.contains("wide") ? .62 : 1);
      el.style.fontSize = "100px";
      el.style.fontSize = `${Math.floor((box / (el.scrollWidth || 1)) * 100 * .99)}px`;
    });
    // On short screens the width-fitted name can crowd out the rest; shrink it until the column fits.
    // Heights come from offsetHeight so the intro's transforms don't count as overflow.
    const left = $(".poster-left"), cs = getComputedStyle(left), gap = parseFloat(cs.rowGap) || 0;
    const parts = [".poster-kicker", ".poster-name", ".poster-foot"].map((sel) => $(sel));
    const need = () => parts.reduce((h, el) => h + el.offsetHeight, 0) + gap * (parts.length - 1);
    for (let i = 0; i < 20 && need() > left.clientHeight; i++) {
      fits.forEach((el) => (el.style.fontSize = `${Math.floor(parseFloat(el.style.fontSize) * .94)}px`));
    }
    seatCharacter();
  }
  // The character sits on the flat top of the second N in BINTANG. Its seat line is 71.5% down the
  // drawing and its body is centred at 56.7% across; the legs hang over the front of the letter.
  let capCanvas;
  const capHeight = (px) => {
    capCanvas = capCanvas || document.createElement("canvas").getContext("2d");
    capCanvas.font = `900 ${px}px Archivo, sans-serif`;
    return capCanvas.measureText("N").actualBoundingBoxAscent || px * .7;
  };
  function seatCharacter() {
    const name = $(".poster-name"), narrow = $(".fit.narrow");
    if (!name || !narrow) return;
    const w = name.clientWidth, text = narrow.firstChild;
    let base = narrow.querySelector(".bl");
    if (!base) { base = document.createElement("i"); base.className = "bl"; narrow.appendChild(base); }
    const top = narrow.offsetTop + base.offsetTop - capHeight(parseFloat(narrow.style.fontSize) || 100);
    // The poster may be scaled by the scroll timeline, so convert screen pixels back to layout pixels.
    const nb = name.getBoundingClientRect(), scale = nb.width / (name.offsetWidth || 1) || 1;
    let cx = w * .8;
    const idx = text && text.nodeType === 3 ? text.textContent.toUpperCase().lastIndexOf("N") : -1;
    if (idx >= 0) {
      const range = document.createRange();
      range.setStart(text, idx); range.setEnd(text, idx + 1);
      const r = range.getBoundingClientRect();
      cx = (r.left + r.width / 2 - nb.left) / scale;
    }
    const narrowScreen = w < 520; // phones have room above the name, so the character can be bigger there
    const h = Math.max(110, Math.min(w * (narrowScreen ? .5 : .38) * 330 / 300, (top + (narrowScreen ? 170 : 100)) / .715));
    const cw = h * 300 / 330;
    cx = Math.min(cx, w - cw * .433); // keep the whole drawing inside the poster
    name.style.setProperty("--seat", `${top.toFixed(1)}px`);
    name.style.setProperty("--cx", `${cx.toFixed(1)}px`);
    name.style.setProperty("--ch", `${Math.round(h)}px`);
  }
  addEventListener("resize", fitAll);

  /* ---------------- interactions ---------------- */
  /* ---------------- contact sheet (projects) ---------------- */
  const PROJECTS = (projectData && projectData.projects) || [];
  const TYPE = {
    en: { work: "Client work", freelance: "Freelance", personal: "Personal" },
    id: { work: "Kerja klien", freelance: "Freelance", personal: "Pribadi" },
  };
  const pt = (p) => (lang === "id" ? p.id_ : p.en) || p.en;
  const pad = (n) => String(n).padStart(2, "0");
  const framesEl = $("#frames");
  const greasePath = '<svg class="grease" viewBox="0 0 300 260" preserveAspectRatio="none" aria-hidden="true"><path d="M44 28 C 130 4, 240 10, 282 42 C 300 110, 296 196, 264 234 C 182 258, 72 254, 26 224 C 4 160, 8 78, 52 22"/></svg>';
  PROJECTS.forEach((p, i) => {
    const f = document.createElement("button");
    f.type = "button"; f.className = "frame"; f.dataset.type = p.type; f.dataset.i = i;
    f.style.setProperty("--c", p.color);
    const shot = p.images[0]
      ? `<img src="${p.images[0]}" alt="" loading="lazy" />`
      : '<span class="cover"><b></b><small data-noshot></small></span>';
    f.innerHTML = `<span class="film"><span class="shot">${shot}</span><span class="edge"><span>${pad(i + 1)}A ▸</span><span>BINTANG 400</span></span></span>`
      + '<span class="cap"><b></b><small></small><span class="cap-sum"></span><span class="cap-open"></span></span>' + greasePath;
    f.addEventListener("click", () => openPrint(i, f));
    framesEl.appendChild(f);
  });
  function renderSheetText() {
    $$(".frame", framesEl).forEach((f) => {
      const p = PROJECTS[f.dataset.i], t = pt(p);
      $(".cap b", f).textContent = t.title;
      $(".cap small", f).textContent = `${p.year} · ${TYPE[lang][p.type]}`;
      $(".cap-sum", f).textContent = t.summary;
      $(".cap-open", f).textContent = UI[lang].open;
      const cover = $(".cover b", f), note = $("[data-noshot]", f);
      if (cover) cover.textContent = t.title;
      if (note) note.textContent = UI[lang].noShot;
      f.setAttribute("aria-label", `${t.title}. ${UI[lang].open}`);
    });
    $$(".chip").forEach((c) => {
      const k = c.dataset.filter;
      $("b", c).textContent = k === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.type === k).length;
    });
  }
  // Filters dim the other frames instead of removing them, so the scroll length never jumps.
  $$(".chip").forEach((c) => c.addEventListener("click", () => {
    const k = c.dataset.filter;
    $$(".chip").forEach((x) => { x.classList.toggle("on", x === c); x.setAttribute("aria-pressed", String(x === c)); });
    $$(".frame", framesEl).forEach((f) => f.classList.toggle("dim", k !== "all" && f.dataset.type !== k));
    if (!reduced) $$(".frame:not(.dim) .film", framesEl).forEach((el, n) => el.animate(
      [{ scale: 1 }, { scale: 1.045, rotate: "-.8deg" }, { scale: 1 }],
      { duration: 420, delay: n * 35, easing: "cubic-bezier(.3,1.4,.5,1)" },
    ));
  }));

  /* ---------------- project print (modal) ---------------- */
  const print = $("#print");
  let curProj = 0;
  function showImg(k) {
    const p = PROJECTS[curProj], t = pt(p), main = $("#galleryMain");
    main.style.setProperty("--c", p.color);
    main.innerHTML = p.images.length
      ? `<img src="${p.images[k]}" alt="${t.title}, screenshot ${k + 1}" /><figcaption>${k + 1} / ${p.images.length}</figcaption>`
      : `<span class="cover"><b>${t.title}</b><small>${UI[lang].noShot}</small></span>`;
    $("#thumbs").innerHTML = p.images.length > 1
      ? p.images.map((src, j) => `<button type="button" class="${j === k ? "on" : ""}" data-k="${j}" aria-label="Screenshot ${j + 1}"><img src="${src}" alt="" /></button>`).join("")
      : "";
  }
  function fillPrint(i) {
    curProj = i;
    const p = PROJECTS[i], t = pt(p);
    $("#printMeta").textContent = `${pad(i + 1)}A · ${TYPE[lang][p.type]} · ${p.year}`;
    $("#printTitle").textContent = t.title;
    $("#printRole").textContent = t.role;
    $("#printAbout").textContent = t.about;
    const did = $("#printDid");
    did.innerHTML = "";
    t.did.forEach((d) => { const li = document.createElement("li"); li.textContent = d; did.appendChild(li); });
    $("#printStack").innerHTML = p.stack.map((s) => `<li>${s}</li>`).join("");
    const links = $("#printLinks");
    links.innerHTML = "";
    if (p.demo) links.insertAdjacentHTML("beforeend", `<a class="btn primary" href="${p.demo}" target="_blank" rel="noopener">${UI[lang].demo}</a>`);
    if (p.source) links.insertAdjacentHTML("beforeend", `<a class="btn ghost" href="${p.source}" target="_blank" rel="noopener">${UI[lang].source}</a>`);
    if (!p.demo && t.noDemo) links.insertAdjacentHTML("beforeend", `<span class="no-demo">${t.noDemo}</span>`);
    $("#printCount").textContent = `${i + 1} / ${PROJECTS.length}`;
    showImg(0);
    print.scrollTop = 0;
  }
  // The print grows out of the frame you clicked, and shrinks away when closed.
  function openPrint(i, from) {
    window.track?.("project-open", { project: PROJECTS[i] && PROJECTS[i].id });
    fillPrint(i);
    print.showModal();
    lock("print", true);
    Mixtape.thud();
    if (reduced) return;
    const r = print.getBoundingClientRect(), f = from && $(".film", from).getBoundingClientRect();
    const start = f
      ? `translate(${(f.left + f.width / 2 - (r.left + r.width / 2)).toFixed(0)}px, ${(f.top + f.height / 2 - (r.top + r.height / 2)).toFixed(0)}px) scale(${Math.max(.18, f.width / r.width).toFixed(3)})`
      : "translateY(30px) scale(.96)";
    print.animate([{ transform: start, opacity: .3, borderRadius: "4px" }, { transform: "none", opacity: 1 }], { duration: 560, easing: "cubic-bezier(.2,.85,.25,1)" });
  }
  let closing = false;
  const closePrint = () => {
    if (!print.open || closing) return;
    if (reduced) { print.close(); return; }
    closing = true;
    print.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(26px) scale(.96)", opacity: 0 }], { duration: 220, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" });
    // A timer, not onfinish: the close must happen even if the animation gets skipped.
    setTimeout(() => {
      closing = false;
      print.getAnimations().forEach((a) => a.cancel());
      print.close();
    }, 220);
  };
  let stepping = false;
  const stepPrint = (d) => {
    const next = (curProj + d + PROJECTS.length) % PROJECTS.length;
    if (reduced) { fillPrint(next); return; }
    if (stepping) return;
    stepping = true;
    const parts = [$(".print-head > div", print), $(".print-body", print)];
    const outs = parts.map((el) => el.animate([{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: `${-d * 28}px 0` }], { duration: 150, easing: "ease-in", fill: "forwards" }));
    setTimeout(() => {
      fillPrint(next);
      outs.forEach((o) => o.cancel());
      parts.forEach((el) => el.animate([{ opacity: 0, translate: `${d * 28}px 0` }, { opacity: 1, translate: "0 0" }], { duration: 300, easing: "cubic-bezier(.2,.8,.2,1)" }));
      stepping = false;
    }, 150);
  };
  $("#thumbs").addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b) showImg(+b.dataset.k); });
  $("#printPrev").addEventListener("click", () => stepPrint(-1));
  $("#printNext").addEventListener("click", () => stepPrint(1));
  $("#printClose").addEventListener("click", closePrint);
  print.addEventListener("cancel", (e) => { e.preventDefault(); closePrint(); });
  print.addEventListener("close", () => lock("print", false));
  print.addEventListener("click", (e) => { if (e.target === print) closePrint(); });
  print.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") stepPrint(1);
    if (e.key === "ArrowLeft") stepPrint(-1);
  });

  /* ---------------- backstage pass: drag it, it swings ---------------- */
  const passSwing = $("#passSwing"), passEl = $("#pass");
  let ang = 0, vel = 0, drag = null, praf = 0;
  const renderPass = () => {
    passSwing.style.transform = `rotate(${ang.toFixed(2)}deg)`;
    passEl.style.setProperty("--sheen", `${(-30 + ang * 4).toFixed(1)}%`);
  };
  // A damped pendulum hanging from the lanyard; it sleeps once it has settled.
  const swingStep = () => {
    if (!drag) {
      vel += -ang * .02; vel *= .962; ang += vel;
      if (Math.abs(ang) > 38) { ang = Math.sign(ang) * 38; vel *= -.35; } // the lanyard only lets it go so far
    }
    renderPass();
    praf = drag || Math.abs(vel) > .004 || Math.abs(ang) > .02 ? requestAnimationFrame(swingStep) : 0;
  };
  const kickPass = (v) => {
    if (reduced) return;
    vel = Math.max(-5, Math.min(5, vel + v));
    if (!praf) praf = requestAnimationFrame(swingStep);
  };
  passEl.addEventListener("pointerdown", (e) => {
    if (reduced) return;
    drag = { x: e.clientX, lx: e.clientX, a: ang };
    passEl.setPointerCapture(e.pointerId);
    if (!praf) praf = requestAnimationFrame(swingStep);
  });
  passEl.addEventListener("pointermove", (e) => {
    if (!drag) return;
    // Pulling the card right swings it counter-clockwise around the lanyard.
    ang = Math.max(-40, Math.min(40, drag.a - (e.clientX - drag.x) * .15));
    vel = -(e.clientX - drag.lx) * .15;
    drag.lx = e.clientX;
  });
  const releasePass = () => { drag = null; vel = Math.max(-3.2, Math.min(3.2, vel)); };
  passEl.addEventListener("pointerup", releasePass);
  passEl.addEventListener("pointercancel", releasePass);
  passEl.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && !drag) kickPass(e.movementX > 0 ? -.9 : .9); });

  /* ---------------- rider deck: dealt on scroll, then flip through ---------------- */
  const deck = $("#deck"), dotsEl = $("#deckDots"), rcards = $$(".rcard");
  let order = rcards.map((_, i) => i); // bottom → top
  let deckTouched = false, flipping = false;
  rcards.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = i + 1; b.setAttribute("aria-label", `Rider item ${i + 1}`);
    b.addEventListener("click", (e) => { e.stopPropagation(); bringToTop(i); });
    dotsEl.appendChild(b);
  });
  const markDot = (top) => $$("button", dotsEl).forEach((b, i) => { b.classList.toggle("on", i === top); b.setAttribute("aria-pressed", String(i === top)); });
  const applyOrder = () => {
    order.forEach((ci, z) => (rcards[ci].style.zIndex = z + 1));
    markDot(order[order.length - 1]);
  };
  function bringToTop(i) {
    deckTouched = true;
    order = order.filter((x) => x !== i).concat(i);
    applyOrder();
    if (!reduced) $(".rc-inner", rcards[i]).animate([{ translate: "0 -16px", rotate: "-2deg" }, { translate: "0 0", rotate: "0deg" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
  }
  // The top card slides off to the right and tucks in at the bottom of the stack.
  const flipDeck = (dir = 1) => {
    if (flipping) return;
    deckTouched = true;
    if (reduced) { order = dir > 0 ? [order.at(-1), ...order.slice(0, -1)] : [...order.slice(1), order[0]]; applyOrder(); return; }
    if (dir < 0) { bringToTop(order[0]); return; }
    flipping = true;
    const top = order.at(-1), inner = $(".rc-inner", rcards[top]);
    const out = inner.animate([{ translate: "0 0", rotate: "0deg" }, { translate: "70% -4%", rotate: "9deg" }], { duration: 230, easing: "ease-in", fill: "forwards" });
    setTimeout(() => {
      order = [top, ...order.slice(0, -1)];
      applyOrder();
      out.cancel();
      inner.animate([{ translate: "70% -4%", rotate: "9deg" }, { translate: "0 0", rotate: "0deg" }], { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" });
      Mixtape.thud();
      flipping = false;
    }, 230);
  };
  deck.addEventListener("click", () => flipDeck(1));
  deck.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); flipDeck(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); flipDeck(-1); }
  });
  applyOrder();

  $("#stub").addEventListener("click", async (e) => {
    const email = e.currentTarget.dataset.email, msg = $("#copied");
    $("#ticket").classList.add("torn");
    try { await navigator.clipboard.writeText(email); msg.textContent = UI[lang].copied(email); }
    catch { msg.textContent = UI[lang].here(email); }
  });

  const clock = () => {
    const t = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date());
    $("#clock").textContent = `Sidoarjo · ${t} WIB`;
  };
  clock(); setInterval(clock, 30000);

  /* ---------------- soundtrack ---------------- */
  // "Chill Wave" by Kevin MacLeod (incompetech.com), licensed CC BY 4.0. Only fetched once sound is turned on.
  const Mixtape = (() => {
    let audio = null, ctx = null, on = false, fade = 0;
    const LEVEL = .5;
    const ramp = (to, ms, done) => {
      cancelAnimationFrame(fade);
      const from = audio.volume, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        audio.volume = from + (to - from) * k;
        if (k < 1) fade = requestAnimationFrame(step); else if (done) done();
      };
      fade = requestAnimationFrame(step);
    };
    return {
      get on() { return on; },
      start() {
        if (!audio) { audio = new Audio("assets/audio/chill-wave.m4a"); audio.loop = true; audio.volume = 0; }
        on = true;
        const playing = audio.play();
        if (playing && playing.catch) playing.catch(() => { on = false; syncSoundUI(); });
        ramp(LEVEL, 1400);
      },
      stop() {
        if (!audio) return;
        on = false;
        ramp(0, 450, () => { if (!on) audio.pause(); });
      },
      thud() { // a soft knock for stamps and cards, only while sound is on
        if (!on) return;
        try {
          ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
          const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
          o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(60, t + .09);
          g.gain.setValueAtTime(.16, t); g.gain.exponentialRampToValueAtTime(.001, t + .14);
          o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .16);
        } catch { /* no Web Audio here */ }
      },
    };
  })();
  function syncSoundUI() {
    document.body.classList.toggle("sound-on", Mixtape.on);
    $("#soundBtn").setAttribute("aria-pressed", String(Mixtape.on));
  }
  const setSound = (val) => {
    window.track?.("sound", { state: val ? "on" : "off" });
    val ? Mixtape.start() : Mixtape.stop();
    store.set("sound", val ? "on" : "off");
    syncSoundUI();
  };
  $("#soundBtn").addEventListener("click", () => setSound(!Mixtape.on));

  /* ---------------- scene geometry ---------------- */
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:0;height:100vh;width:1px;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  let VH = innerHeight, T = 0;
  const geo = [];
  let sheetTravel = 0;
  const sizeSheet = () => {
    if (!story) return;
    const view = $(".sheet-view"), vh = probe.offsetHeight || innerHeight;
    sheetTravel = Math.max(0, $("#sheet").offsetHeight - view.clientHeight);
    $("#releases").style.setProperty("--len", Math.round(400 + (sheetTravel / vh) * 140));
  };
  const measure = () => {
    VH = probe.offsetHeight || innerHeight;
    T = story ? VH * (parseFloat(getComputedStyle(root).getPropertyValue("--t")) || 80) / 100 : 0;
    scenes.forEach((s, i) => {
      const top = s.getBoundingClientRect().top + scrollY, h = s.offsetHeight;
      const last = i === scenes.length - 1;
      geo[i] = {
        top,
        inEnd: i ? top + T : top,
        start: i ? top + T : top,
        end: story ? top + h - VH - (last ? 0 : T) : top + h - VH * .5,
      };
    });
  };
  sizeSheet();
  measure();

  /* ---------------- HUD + setlist menu ---------------- */
  const hudNo = $("#hudNo"), hudName = $("#hudName"), hudClock = $("#hudClock"), hudFill = $("#hudFill");
  let current = -1;
  function hud(force) {
    let idx = 0;
    geo.forEach((g, i) => { if (scrollY + 2 >= (i ? g.top + T * .5 : 0)) idx = i; });
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    hudFill.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
    const g = geo[idx], bar = $$("#menuList .pbar")[idx];
    if (bar && g) bar.style.setProperty("--sp", Math.min(1, Math.max(0, (scrollY - g.top) / Math.max(1, g.end - g.top))).toFixed(3));
    if (idx === current && !force) return;
    current = idx;
    const s = scenes[idx];
    window.track?.("scene-view", { scene: s.dataset.name }, true);
    hudNo.textContent = String(idx + 1).padStart(2, "0");
    hudName.textContent = sceneName(s);
    hudClock.textContent = s.dataset.time;
    document.body.dataset.tone = s.dataset.tone;
    $$("#menuList button").forEach((b, i) => {
      b.classList.toggle("cur", i === idx);
      b.toggleAttribute("aria-current", i === idx);
    });
    if (window.gsap && !force) gsap.fromTo(hudClock, { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .35, ease: "back.out(2)" });
  }
  addEventListener("scroll", () => hud(), { passive: true });

  const menu = $("#menu"), menuBtn = $("#menuBtn");
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    lock("menu", open);
    if (open) { menu.classList.remove("closing"); menu.hidden = false; return; }
    if (menu.hidden) return;
    if (reduced) { menu.hidden = true; return; }
    menu.classList.add("closing");
    setTimeout(() => { if (menu.classList.contains("closing")) { menu.hidden = true; menu.classList.remove("closing"); } }, 220);
  };
  menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target === menu) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  function buildMenu() {
    $("#menuList").innerHTML = scenes.map((s, i) => `<li><button data-go="${i}"${i === current ? ' class="cur" aria-current="true"' : ""}><i>${String(i + 1).padStart(2, "0")}</i><span class="pn">${sceneName(s)}</span><span class="lead" aria-hidden="true"></span><time>${s.dataset.time}</time></button><span class="pbar" aria-hidden="true"></span></li>`).join("");
  }

  // Changing scene from the menu feels like turning a page: a quick blackout, then the new scene.
  const flash = $("#flash");
  const jumpTo = (i) => {
    setMenu(false);
    // Land partway into the scene so its story has already started, not on an empty stage.
    const target = i === 0 ? 0 : story ? geo[i].start + (geo[i].end - geo[i].start) * .4 : geo[i].start;
    if (!story) { scrollToY(target, false); return; }
    flash.classList.add("on");
    setTimeout(() => {
      scrollToY(target, true);
      setTimeout(() => flash.classList.remove("on"), 120);
    }, 300);
  };
  $("#menuList").addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) jumpTo(+b.dataset.go); });
  $$("[data-jump]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    jumpTo(scenes.findIndex((s) => s.id === a.dataset.jump));
  }));
  $(".skip").addEventListener("click", (e) => { e.preventDefault(); jumpTo(1); });

  /* ---------------- preloader: title cards, then the stage opens ---------------- */
  // A few big words cut on the beat while the page loads. When everything is in, the last card
  // splits into strips that slide away, the name fills with ink underneath, and the character drops in.
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const BEATS = {
    en: ["Live", "from", "Sidoarjo", "One night", "only"],
    id: ["Live", "dari", "Sidoarjo", "Satu malam", "saja"],
  };
  const LOOKS = [
    { wd: 125, bg: "#ff5a36", fg: "#161412" },
    { wd: 62, bg: "#efe7d6", fg: "#2f54eb" },
    { wd: 62, bg: "#2f54eb", fg: "#ffd23f" },
    { wd: 100, bg: "#ffd23f", fg: "#161412" },
    { wd: 125, bg: "#161412", fg: "#ff5a36" },
  ];
  const heroChar = $("#heroChar");
  const sayHi = () => {
    heroChar.classList.add("talk");
    clearTimeout(sayHi.t);
    sayHi.t = setTimeout(() => heroChar.classList.remove("talk"), 1600);
  };
  heroChar.addEventListener("click", () => { sayHi(); Mixtape.thud(); });
  function buildIntro() {
    if (!window.gsap || reduced) return null;
    return gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
      .from(".hero-char", { yPercent: -170, rotate: -10, duration: .75, ease: "bounce.out" }, .05)
      .from(".hero-char svg", { scaleY: .86, transformOrigin: "50% 72%", duration: .35, ease: "back.out(3)" }, .55)
      .call(sayHi, null, .85)
      .from(".poster-kicker", { opacity: 0, y: 10, duration: .5 }, .2)
      .from(".poster-foot > *", { opacity: 0, y: 14, duration: .6, stagger: .08 }, .3)
      .from(".poster-marquee", { yPercent: 100, duration: .6 }, .35)
      .from(".pin", { scale: 0, duration: .4, stagger: .06, ease: "back.out(3)" }, .5)
      .from(".wall", { opacity: 0, duration: .8, ease: "none" }, .2)
      .from(".hud-top > *", { opacity: 0, y: -10, duration: .5, stagger: .06 }, .45)
      .from(".hud-bottom", { opacity: 0, y: 10, duration: .5 }, .55);
  }
  function runPreloader() {
    const poster = $("#poster"), stage = $("#intro"), word = $("#introWord"), count = $("#introCount");
    window.__heroReady = true; // tells the inline failsafe in <head> that the script is in charge
    stage.classList.add("running");
    $$("[data-fit]").forEach((f) => (f.dataset.text = f.textContent.trim()));
    const heroIn = buildIntro();
    lock("pre", true);
    scrollTo(0, 0);
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });

    const paint = (p) => {
      poster.style.setProperty("--f1", Math.min(1, p * 1.9).toFixed(3));
      poster.style.setProperty("--f2", Math.min(1, Math.max(0, p * 1.9 - .9)).toFixed(3));
      poster.style.setProperty("--rule", p.toFixed(3));
    };
    paint(0);
    const reveal = () => {
      root.classList.remove("loading");
      lock("pre", false);
      if (heroIn) heroIn.play();
    };
    if (reduced || !window.gsap) { stage.classList.add("gone"); paint(1); reveal(); return; }

    // First visit gets the full run of cards; coming back in the same session gets just the last one.
    // Every visit gets the whole run of cards; coming back in the same session just runs it faster.
    const seen = session.get("seen");
    session.set("seen", "1");
    const words = BEATS[lang], looks = LOOKS, n = words.length;
    const BEAT = seen ? 300 : 460;

    const fitWord = (look) => {
      word.style.fontVariationSettings = `"wdth" ${look.wd}`;
      word.style.fontSize = "100px";
      const k = Math.min((innerWidth * .86) / (word.scrollWidth || 1), (innerHeight * .55) / 80);
      word.style.fontSize = `${Math.floor(100 * k)}px`;
    };
    let lastLook = null;
    // The first cards can show before the display font arrives; refit once it does.
    if (document.fonts) document.fonts.ready.then(() => { if (lastLook) fitWord(lastLook); });
    const showBeat = (i) => {
      const look = looks[i];
      stage.style.setProperty("--bg", look.bg);
      stage.style.setProperty("--fg", look.fg);
      word.textContent = words[i];
      lastLook = look;
      fitWord(look);
      word.animate(
        [{ transform: "translateY(-50%) scale(1.22) skewX(-8deg)", opacity: 0 }, { transform: "translateY(-50%) scale(1) skewX(0deg)", opacity: 1 }],
        { duration: 320, easing: "cubic-bezier(.2,.9,.2,1)" },
      );
    };

    // Loading progress (fonts, page load) shown in the corner, paced so it never jumps straight to 100.
    const tasks = [
      document.fonts ? document.fonts.ready : Promise.resolve(),
      document.readyState === "complete" ? Promise.resolve() : new Promise((r) => addEventListener("load", r, { once: true })),
    ];
    let done = 0;
    tasks.forEach((t) => t.then(() => { done++; if (done === tasks.length) fitAll(); }));
    const failsafe = setTimeout(() => { done = tasks.length; }, 6000);
    const t0 = performance.now(), minTime = n * BEAT;
    let beat = -1, shown = 0, last = t0, leaving = false, asked = false;

    // Last card: the visitor picks sound or no sound. The click is also the gesture browsers need for audio.
    const enter = $("#introEnter");
    const askSound = () => {
      const t = lang === "id" ? ["♪ Masuk dengan suara", "Masuk tanpa suara"] : ["♪ Enter with sound", "Enter quietly"];
      const [onBtn, offBtn] = $$("button", enter);
      onBtn.textContent = t[0]; offBtn.textContent = t[1];
      enter.hidden = false;
      enter.animate([{ opacity: 0, transform: "translate(-50%, 14px)" }, { opacity: 1, transform: "translate(-50%, 0)" }], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" });
      (store.get("sound") === "off" ? offBtn : onBtn).focus({ preventScroll: true });
    };
    enter.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sound]");
      if (!b || leaving) return;
      setSound(b.dataset.sound === "on");
      leave();
    });
    const leave = () => {
      if (leaving) return;
      leaving = true;
      enter.getAnimations().forEach((an) => { if (an.commitStyles) an.commitStyles(); an.cancel(); });
      clearTimeout(failsafe);
      count.textContent = "100";
      const strips = $$(".intro-slices i", stage);
      gsap.timeline({ onComplete: () => stage.classList.add("gone") })
        .to([word, enter, ...$$(".intro-c", stage)], { opacity: 0, duration: .2, ease: "power1.in" }, 0)
        .to(strips, { xPercent: (i) => (i % 2 ? 101 : -101), duration: 1.1, ease: "power4.inOut", stagger: .07 }, .15)
        .to({ p: 0 }, { p: 1, duration: 1.3, ease: "power2.inOut", onUpdate() { paint(this.targets()[0].p); } }, .6)
        .call(reveal, null, 1.85);
    };
    const tick = (now) => {
      const dt = Math.min(500, now - last);
      last = now;
      const goal = Math.min(done / tasks.length, (now - t0) / minTime, 1) * 100;
      shown = Math.min(goal, shown + (goal - shown) * (1 - Math.exp(-dt / 120)) + dt * .03);
      count.textContent = String(Math.round(shown)).padStart(3, "0");
      // Cycle the cards while things load; "only" is saved for the moment everything is in.
      const b = Math.floor((now - t0) / BEAT);
      const ready = shown >= 99.5 && b >= n - 1;
      const idx = ready ? n - 1 : b % (n - 1);
      if (idx !== beat) { beat = idx; showBeat(idx); }
      if (ready && !asked) { asked = true; askSound(); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- micro interactions ---------------- */
  const HOT = "a, button, .frame, [data-jump]";
  const COLORS = ["#ff5a36", "#ffd23f", "#2f54eb", "#1f9d6b"];
  const burstLayer = document.createElement("div");
  burstLayer.className = "bursts";
  burstLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(burstLayer);
  // A small ripple where you click; inside the modal it has to live in the dialog's top layer.
  const burst = (x, y, host, n = 5, reach = 26) => {
    const make = (cls, c) => {
      const p = document.createElement("i");
      p.className = `bp ${cls}`; p.style.left = `${x}px`; p.style.top = `${y}px`; p.style.setProperty("--c", c);
      host.appendChild(p);
      return p;
    };
    make("ring", COLORS[0]).animate(
      [{ transform: "translate(-50%,-50%) scale(.4)", opacity: .7 }, { transform: "translate(-50%,-50%) scale(2.4)", opacity: 0 }],
      { duration: 450, easing: "cubic-bezier(.2,.7,.3,1)" },
    ).onfinish = (e) => e.target.effect.target.remove();
    for (let k = 0; k < n; k++) {
      const a = (Math.PI * 2 * k) / n + rand(-.35, .35), d = reach * rand(.6, 1.25);
      const p = make("", COLORS[k % COLORS.length]);
      p.animate(
        [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
          { transform: `translate(calc(-50% + ${(Math.cos(a) * d).toFixed(1)}px), calc(-50% + ${(Math.sin(a) * d).toFixed(1)}px)) scale(.2)`, opacity: 0 }],
        { duration: rand(380, 520), easing: "cubic-bezier(.15,.75,.3,1)" },
      ).onfinish = () => p.remove();
    }
  };
  if (!reduced) {
    addEventListener("pointerdown", (e) => {
      const t = e.target.closest(HOT);
      if (!t) return;
      const big = t.matches(".stub");
      burst(e.clientX, e.clientY, t.closest("dialog") || burstLayer, big ? 14 : 5, big ? 70 : 26);
      t.animate([{ scale: 1 }, { scale: .97 }, { scale: 1 }], { duration: 220, easing: "ease-out" });
    }, { passive: true });
  }

  // The character's eyes follow the mouse while the hero is on screen.
  if (fine && !reduced) {
    const svg = $("#heroChar svg");
    let look = 0;
    addEventListener("pointermove", (e) => {
      if (look || !scenes[0].classList.contains("is-live")) return;
      look = requestAnimationFrame(() => {
        look = 0;
        const r = svg.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width * .567), dy = e.clientY - (r.top + r.height * .29);
        const d = Math.hypot(dx, dy) || 1, m = Math.min(3.2, d / 40);
        svg.style.setProperty("--px", `${((dx / d) * m).toFixed(2)}px`);
        svg.style.setProperty("--py", `${((dy / d) * m).toFixed(2)}px`);
      });
    }, { passive: true });
  }

  // A thin cursor ring, only for a real mouse.
  if (fine && !reduced) {
    const ring = document.createElement("div");
    ring.className = "cursor";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    let x = -100, y = -100, cx = x, cy = y, raf = 0;
    const follow = () => {
      cx += (x - cx) * .25; cy += (y - cy) * .25;
      ring.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > .3 ? requestAnimationFrame(follow) : 0;
    };
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (!ring.classList.contains("on")) { cx = x; cy = y; ring.classList.add("on"); }
      if (!raf) raf = requestAnimationFrame(follow);
      ring.classList.toggle("hot", !!e.target.closest(HOT));
    }, { passive: true });
    addEventListener("pointerdown", () => ring.classList.add("down"));
    addEventListener("pointerup", () => ring.classList.remove("down"));
    document.documentElement.addEventListener("mouseleave", () => ring.classList.remove("on"));
  }

  /* ---------------- start ---------------- */
  setLang(store.get("lang") || ((navigator.language || "").toLowerCase().startsWith("id") ? "id" : "en"));
  runPreloader();
  document.fonts && document.fonts.ready.then(() => { fitAll(); window.ScrollTrigger && ScrollTrigger.refresh(); });

  if (!story) {
    rcards.forEach((r) => r.classList.add("ok"));
    $$(".stop").forEach((s) => s.classList.add("on"));
    return;
  }

  /* ================= STORY TIMELINES ================= */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (lenis) lenis.on("scroll", ScrollTrigger.update);
  ScrollTrigger.addEventListener("refreshInit", () => { sizeSheet(); measure(); });
  const mm = gsap.matchMedia();
  const stageOf = (i) => $(".stage", scenes[i]);

  // Scene lifecycle: only scenes near the viewport keep their CSS loops running.
  scenes.forEach((s) => ScrollTrigger.create({ trigger: s, start: "top bottom", end: "bottom top", toggleClass: "is-live" }));

  // Scroll-scrubbed timeline for scene i: "in" covers the page change, "body" covers the story.
  const segment = (i, part, tl, scrub = .5, invalidateOnRefresh = false) => ScrollTrigger.create({
    animation: tl, scrub, invalidateOnRefresh,
    start: () => (part === "in" ? geo[i].top : geo[i].start),
    end: () => (part === "in" ? geo[i].inEnd : geo[i].end),
  });

  /* ----- page changes ----- */
  // 1 → 2: the ticket tears and the stage rises behind a ripped edge
  const torn = (p) => {
    const w = innerWidth, h = VH, y = (h + 40) * (1 - p) - 20, teeth = 28, pts = [`0px ${h}px`, `${w}px ${h}px`];
    for (let k = teeth; k >= 0; k--) pts.push(`${(w * k / teeth).toFixed(1)}px ${(y + (k % 2 ? 14 : -10)).toFixed(1)}px`);
    return `polygon(${pts.join(",")})`;
  };
  const s2stage = stageOf(1), tearState = { p: 0 };
  const applyTear = () => { s2stage.style.clipPath = tearState.p >= 1 ? "none" : torn(tearState.p); };
  applyTear();
  segment(1, "in", gsap.timeline().to(tearState, { p: 1, ease: "power1.inOut", onUpdate: applyTear }), true);
  addEventListener("resize", applyTear);

  // 2 → 3: the spotlight on the mic grows into the next scene
  segment(2, "in", gsap.timeline().fromTo(stageOf(2), { clipPath: "circle(0% at 22% 36%)" }, { clipPath: "circle(150% at 22% 36%)", ease: "power2.in" }));
  // 3 → 4: curtain up
  segment(3, "in", gsap.timeline().fromTo(stageOf(3), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" }));
  // 4 → 5: the merch stall shutters roll down
  segment(4, "in", gsap.timeline()
    .fromTo(".stripes i", { scaleY: 0 }, { scaleY: 1, stagger: .08, ease: "power2.out", duration: .6 })
    .fromTo(".s5-inner", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3 }, ">-.1"));
  // 5 → 6: the backstage door swings open from the middle
  segment(5, "in", gsap.timeline().fromTo(stageOf(5), { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" }));
  // 6 → 7: the house lights rise from the crowd
  segment(6, "in", gsap.timeline().fromTo(stageOf(6), { clipPath: "circle(0% at 50% 100%)" }, { clipPath: "circle(160% at 50% 100%)", ease: "power2.in" }));

  /* ----- 1 · doors open ----- */
  gsap.set("#ticket1", { xPercent: -50 });
  segment(0, "body", gsap.timeline({ defaults: { ease: "none" } })
    .to(".cue", { opacity: 0, y: 10, duration: .12 }, 0)
    .to("#poster", { scale: .74, rotate: -2.5, yPercent: -6, duration: .45, ease: "power1.inOut" }, 0)
    .fromTo(".chalk", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .2 }, .2)
    .fromTo("#ticket1", { yPercent: 160, rotate: 6 }, { yPercent: 0, rotate: -3, duration: .3, ease: "power2.out" }, .38)
    .to("#stub1", { rotate: 26, x: 50, y: 90, opacity: 0, duration: .22, ease: "power2.in" }, .76));

  /* ----- 2 · soundcheck ----- */
  const leds = $$(".led b[data-to]");
  const ledState = { v: 0 };
  const paintLeds = () => leds.forEach((b) => {
    const from = +(b.dataset.from || 0), to = +b.dataset.to, n = Math.round(from + (to - from) * ledState.v);
    b.textContent = (b.dataset.from ? String(n) : n.toLocaleString(lang === "id" ? "id-ID" : "en-US")) + (b.dataset.suffix || "");
  });
  segment(1, "body", gsap.timeline({ defaults: { ease: "none" } })
    .fromTo(".spot", { scaleX: .2, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .12 }, 0)
    .from(".mic-wrap", { yPercent: 25, opacity: 0, duration: .12 }, 0)
    .from(".s2 .kicker", { opacity: 0, y: 20, duration: .08 }, .04)
    .from(".check span", { yPercent: 110, rotate: 8, opacity: 0, stagger: .05, duration: .12, ease: "back.out(2)" }, .08)
    .fromTo(".said .line", { opacity: .1 }, { opacity: 1, stagger: .12, duration: .14 }, .28)
    .from(".s2-copy .scribble", { opacity: 0, x: -20, duration: .08 }, .62)
    .from(".led", { y: 40, opacity: 0, stagger: .04, duration: .1 }, .58)
    .fromTo(ledState, { v: 0 }, { v: 1, duration: .26, onUpdate: paintLeds }, .6)
    .to({}, { duration: .1 }));

  /* ----- 3 · lineup ----- */
  segment(2, "body", gsap.timeline({ defaults: { ease: "none" } })
    .from(".s3 .kicker, .s3 .title", { y: 50, opacity: 0, stagger: .04, duration: .12 }, 0)
    .from(".s3 .scribble", { opacity: 0, scale: .6, duration: .08 }, .1)
    .from(".tier-name", { opacity: 0, stagger: .2, duration: .06 }, .14)
    .from(".acts li", { rotateX: -100, opacity: 0, stagger: .035, duration: .1, ease: "back.out(1.6)" }, .16)
    .to({}, { duration: .12 }));

  /* ----- 4 · on the road ----- */
  const route = $("#route"), stops = $$(".stop");
  const routeEnd = () => {
    const next = $(".stop.next");
    return -(next.offsetLeft + next.offsetWidth / 2 - innerWidth * .62);
  };
  const markStops = () => {
    const focus = innerWidth * (innerWidth < 760 ? .5 : .42);
    stops.forEach((s) => {
      const r = s.getBoundingClientRect();
      s.classList.toggle("on", Math.abs(r.left + r.width / 2 - focus) < Math.max(r.width * .7, innerWidth * .2));
    });
  };
  // The wheels turn only as far as the road moves, so the van parks when the scrolling stops.
  const van = $("#van"), wheels = $$(".wheel", van);
  let wheelR = 16, lastX = 0, parked;
  const measureWheel = () => { wheelR = wheels[0].getBoundingClientRect().width / 2 || 16; };
  measureWheel();
  addEventListener("resize", measureWheel);
  const drive = () => {
    const x = gsap.getProperty(route, "x");
    const deg = (-x / wheelR) * (180 / Math.PI);
    wheels.forEach((w) => (w.style.transform = `rotate(${deg.toFixed(1)}deg)`));
    if (Math.abs(x - lastX) > .5) {
      van.classList.add("driving");
      clearTimeout(parked);
      parked = setTimeout(() => van.classList.remove("driving"), 160);
    }
    lastX = x;
  };
  segment(3, "body", gsap.timeline({ defaults: { ease: "none" }, onUpdate() { markStops(); drive(); } })
    .from(".s4-head", { opacity: 0, y: 30, duration: .05 }, 0)
    .fromTo(route, { x: 0 }, { x: routeEnd, duration: 1 }, 0)
    .to(".hills.far", { xPercent: -12, duration: 1 }, 0)
    .to(".hills.near", { xPercent: -26, duration: 1 }, 0)
    .to("#dash", { xPercent: -60, duration: 1 }, 0)
    .to(".cloud.c1", { x: -220, duration: 1 }, 0)
    .to(".cloud.c2", { x: -140, duration: 1 }, 0)
    .to(".sun2", { yPercent: 120, duration: 1 }, 0), .3, true);

  /* ----- 5 · photo pit ----- */
  segment(4, "body", gsap.timeline({ defaults: { ease: "none" } })
    .from(".s5-side > *", { x: -40, opacity: 0, stagger: .03, duration: .1 }, 0)
    .from(".sheet-view", { y: 70, rotate: 1.5, opacity: 0, duration: .12 }, .02)
    .from(".frame > .film, .frame > .cap", { y: 40, opacity: 0, stagger: { amount: .14 }, duration: .08 }, .08)
    .fromTo("#sheet", { y: 0 }, { y: () => -sheetTravel, duration: .62 }, .3)
    .to({}, { duration: .06 }), .4, true);

  /* ----- 6 · backstage ----- */
  // The pass drops in on its lanyard, then the five rider cards are dealt one by one and stamped as they land.
  const REST = [-3, 2.5, -1.5, 3, -.5];
  const DEAL = .28, GAP = .12;
  let lastP6 = 0;
  const s6tl = gsap.timeline({
    defaults: { ease: "none" },
    onUpdate() {
      const p = this.progress();
      if ((lastP6 < .17) !== (p < .17)) kickPass(p > lastP6 ? 3.2 : -2);
      lastP6 = p;
      const dealt = rcards.filter((c, k) => { const on = p > DEAL + k * GAP + .08; c.classList.toggle("ok", on); return p > DEAL + k * GAP + .05; }).length;
      if (!deckTouched && dealt) markDot(dealt - 1);
    },
  })
    .from(".pass-drop", { yPercent: -115, duration: .16, ease: "power2.in" }, 0)
    .from(".s6 .kicker, .s6 .title, .s6 .sub", { y: 40, opacity: 0, stagger: .03, duration: .1 }, .04)
    .from(".deck-nav", { opacity: 0, y: 10, duration: .08 }, .2)
    .from(".pass-hint", { opacity: 0, x: -10, duration: .06 }, .24);
  rcards.forEach((c, k) => s6tl.fromTo(c,
    { xPercent: 140, yPercent: -12, rotate: 24, opacity: 0 },
    { xPercent: 0, yPercent: 0, x: k * 3, y: -k * 3, rotate: REST[k], opacity: 1, duration: .09, ease: "power3.out" },
    DEAL + k * GAP));
  segment(5, "body", s6tl.to({}, { duration: .06 }));
  // Scrolling past nudges the pass, like walking by it.
  if (lenis) lenis.on("scroll", (l) => { if (scenes[5].classList.contains("is-live")) kickPass(Math.max(-.6, Math.min(.6, l.velocity * .012))); });

  /* ----- 7 · encore ----- */
  segment(6, "body", gsap.timeline({ defaults: { ease: "none" } })
    .from(".s7 .kicker", { opacity: 0, duration: .06 }, 0)
    .from(".encore", { scale: 1.35, opacity: 0, duration: .2, ease: "power2.out" }, 0)
    .from(".s7 .sub", { opacity: 0, y: 20, duration: .1 }, .14)
    .from("#ticket", { y: 140, rotate: 6, opacity: 0, duration: .22, ease: "power2.out" }, .22)
    .from(".contact-links li", { y: 24, opacity: 0, stagger: .03, duration: .08 }, .44)
    .to({}, { duration: .3 }));

  // footer line slides in as the night ends
  gsap.from(".footer-big", { xPercent: 10, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  ScrollTrigger.addEventListener("refresh", () => hud(true));
  addEventListener("load", () => { fitAll(); ScrollTrigger.refresh(); });
})();
