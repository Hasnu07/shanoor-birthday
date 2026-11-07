(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const tilts = ['tilt-l', 'tilt-r', 'tilt-l2', 'tilt-r2'];

  // ---- fill text from config ----
  $$('[data-fill]').forEach(el => {
    const key = el.dataset.fill;
    const val = CONFIG[key];
    if (val === undefined || val === '') { if (key === 'age') el.hidden = true; return; }
    el.textContent = val;
  });
  document.title = 'Happy Birthday ' + CONFIG.name;

  // ---- headline: letters pop in one by one ----
  const headline = $('#headline');
  let li = 0;
  CONFIG.headline.split(' ').forEach((word, wi, words) => {
    const w = document.createElement('span');
    w.className = 'word';
    word.split('').forEach(ch => {
      const s = document.createElement('span');
      s.className = 'ltr';
      s.textContent = ch;
      s.style.animationDelay = (li++ * 0.04) + 's';
      w.appendChild(s);
    });
    headline.appendChild(w);
    if (wi < words.length - 1) headline.appendChild(document.createTextNode(' '));
  });

  // ---- ribbon ----
  const ribbon = $('#ribbon');
  ribbon.textContent = (CONFIG.ribbon + ' ').repeat(6);

  // ---- height report table ----
  const report = $('#report');
  CONFIG.report.forEach(([k, v]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>${k}</th><td>${v}</td>`;
    report.appendChild(tr);
  });

  // ---- sticker gallery ----
  const grid = $('#stickerGrid');
  CONFIG.stickers.forEach((s, i) => {
    const fig = document.createElement('figure');
    fig.className = 'sticker-card ' + tilts[i % tilts.length];
    fig.style.setProperty('--i', i);
    fig.innerHTML = `
      <span class="tape tape-top small"></span>
      <img src="${s.img}" alt="" class="sticker-img" onerror="this.closest('figure').classList.add('missing')">
      <figcaption class="hand">${s.caption}</figcaption>`;
    fig.addEventListener('click', e => {
      fig.classList.remove('tickle'); void fig.offsetWidth; fig.classList.add('tickle');
      burst(e.clientX, e.clientY);
    });
    grid.appendChild(fig);
  });

  // ---- taller than list ----
  const ol = $('#tallerList');
  CONFIG.taller.forEach(t => {
    const li = document.createElement('li');
    li.className = 'hand';
    li.textContent = t;
    ol.appendChild(li);
  });

  // ---- film strip (photos 2-6) ----
  const frames = $('#filmFrames');
  for (let i = 2; i <= 6; i++) {
    const d = document.createElement('div');
    d.className = 'frame';
    d.innerHTML = `<img src="photos/${i}.jpg" alt="" onerror="this.parentNode.classList.add('missing')">`;
    frames.appendChild(d);
  }

  // ---- polaroid wall (all photos) ----
  const wall = $('#polaroidWall');
  CONFIG.photoCaptions.forEach((cap, i) => {
    const p = document.createElement('div');
    p.className = 'polaroid wall-item ' + tilts[(i * 3) % tilts.length];
    p.style.setProperty('--i', i);
    p.innerHTML = `
      <span class="tape ${i % 2 ? 'tape-tl' : 'tape-tr'} small"></span>
      <img src="photos/${i + 1}.jpg" alt="" loading="lazy" onerror="this.parentNode.classList.add('missing')">
      <span class="hand cap">${cap}</span>`;
    wall.appendChild(p);
  });

  // ---- video memories ----
  const vwall = $('#videoWall');
  (CONFIG.videos || []).forEach((v, i) => {
    const card = document.createElement('figure');
    card.className = 'tv ' + tilts[(i + 1) % tilts.length];
    card.innerHTML = `
      <span class="tape ${i % 2 ? 'tape-tr' : 'tape-tl'} small"></span>
      <div class="screen">
        <video src="${v.file}" preload="metadata" playsinline controls></video>
        <span class="rec">● REC</span>
        <button class="play-btn" aria-label="Play video">▶</button>
      </div>
      <figcaption class="hand">${v.caption}</figcaption>`;
    vwall.appendChild(card);

    const video = card.querySelector('video');
    const btn = card.querySelector('.play-btn');
    btn.addEventListener('click', () => video.play());
    video.addEventListener('play', () => {
      card.classList.add('playing');
      $$('#videoWall video').forEach(o => { if (o !== video) o.pause(); });
    });
    video.addEventListener('pause', () => card.classList.remove('playing'));
    video.addEventListener('ended', () => card.classList.remove('playing'));
    video.addEventListener('error', () => card.classList.add('missing'));
  });

  // ---- candle ----
  const candle = $('#candle');
  const candleText = $('#candleText');
  candleText.textContent = CONFIG.candleHint;
  candle.addEventListener('click', e => {
    if (candle.classList.contains('out')) {
      candle.classList.remove('out');
      candleText.textContent = CONFIG.candleHint;
      return;
    }
    candle.classList.add('out');
    candleText.textContent = CONFIG.candleDone;
    const r = candle.getBoundingClientRect();
    bigBurst(r.left + r.width / 2, r.top);
  });

  // ---- growth experiment ----
  const growImg = $('#growImg');
  const growMsg = $('#growMsg');
  const growCount = $('#growCount');
  let attempts = 0;
  $('#growBtn').addEventListener('click', () => {
    attempts++;
    growImg.classList.remove('grow'); void growImg.offsetWidth; growImg.classList.add('grow');
    growMsg.textContent = '';
    setTimeout(() => { growMsg.textContent = pick(CONFIG.growFails); }, 650);
    growCount.textContent = `attempts to make Shanoor taller: ${attempts}` + (attempts >= 5 ? ' · please stop' : '');
  });

  const shorterOut = $('#shorterOut');
  let last = '';
  $('#shorterBtn').addEventListener('click', e => {
    let item; do { item = pick(CONFIG.shorterThan); } while (item === last && CONFIG.shorterThan.length > 1);
    last = item;
    shorterOut.classList.remove('pop'); void shorterOut.offsetWidth; shorterOut.classList.add('pop');
    shorterOut.textContent = 'today Shanoor is shorter than… ' + item;
    burst(e.clientX, e.clientY);
  });

  // ---- hidden tiny Shanoor hunt ----
  const pages = $$('.page');
  const spots = [
    { page: 1, style: 'left:6px; bottom:8px;' },
    { page: 4, style: 'right:10px; top:10px;' },
    { page: 6, style: 'left:50%; bottom:4px;' },
  ];
  let found = 0;
  const huntCount = $('#huntCount');
  const hunt = $('#hunt');
  spots.forEach((s, i) => {
    const pg = pages[s.page] || pages[pages.length - 1];
    const b = document.createElement('button');
    b.className = 'tiny';
    b.style.cssText = s.style;
    b.setAttribute('aria-label', 'A tiny hidden Shanoor');
    b.innerHTML = `<img src="clipart/portrait.png" alt="">`;
    b.addEventListener('click', e => {
      if (b.classList.contains('found')) return;
      b.classList.add('found');
      found++;
      huntCount.textContent = found;
      hunt.classList.add('bump'); setTimeout(() => hunt.classList.remove('bump'), 500);
      burst(e.clientX, e.clientY);
      if (found === spots.length) {
        hunt.classList.add('done');
        hunt.querySelector('span').textContent = CONFIG.huntDone;
        bigBurst(window.innerWidth / 2, window.innerHeight / 2);
      }
    });
    pg.appendChild(b);
  });

  // ---- sparkle bursts ----
  const burstColors = ['#e2574f', '#f4b942', '#7bb3a8', '#e88fb0', '#6b8fd6', '#fff'];
  function burst(x, y, n = 8, big = false) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      s.textContent = pick(['✦', '★', '✧', '•']);
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.color = pick(burstColors);
      const a = (Math.PI * 2 * i) / n + Math.random() * .5;
      const d = (big ? 120 : 60) + Math.random() * 40;
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', Math.sin(a) * d - (big ? 60 : 20) + 'px');
      s.style.fontSize = (big ? 22 : 14) + Math.random() * 10 + 'px';
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }
  }
  function bigBurst(x, y) { burst(x, y, 24, true); }

  // ---- cover open ----
  const cover = $('#cover');
  const book = $('#book');
  $('#openBtn').addEventListener('click', () => {
    cover.classList.add('opening');
    book.hidden = false;
    document.body.classList.add('open');
    setTimeout(() => { cover.hidden = true; }, 900);
    window.scrollTo({ top: 0 });
    bigBurst(window.innerWidth / 2, window.innerHeight / 2);
    tryPlay();
  });

  // ---- confetti on cover ----
  const conf = $('.confetti');
  const colors = ['#e2574f', '#f4b942', '#7bb3a8', '#e88fb0', '#6b8fd6'];
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('i');
    s.style.left = Math.random() * 100 + '%';
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = Math.random() * 6 + 's';
    s.style.animationDuration = 5 + Math.random() * 5 + 's';
    s.style.transform = `rotate(${Math.random() * 360}deg)`;
    conf.appendChild(s);
  }

  // ---- twinkling stars in the background ----
  const tw = $('.twinkles');
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('i');
    s.textContent = i % 3 ? '✦' : '★';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 4 + 's';
    s.style.fontSize = 10 + Math.random() * 14 + 'px';
    tw.appendChild(s);
  }

  // ---- reveal on scroll ----
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  // ---- music ----
  const song = $('#song');
  const cassette = $('#cassette');
  let playing = false;
  if (CONFIG.music) song.src = CONFIG.music; else cassette.style.display = 'none';
  if (CONFIG.musicLabel) cassette.querySelector('.cm').textContent = CONFIG.musicLabel;

  function tryPlay() {
    if (!CONFIG.music || playing) return;
    song.play().then(() => setPlaying(true)).catch(() => {});
  }
  function setPlaying(v) {
    playing = v;
    cassette.classList.toggle('playing', v);
    cassette.querySelector('.cm').textContent = v ? (CONFIG.musicPlaying || 'playing… (click to pause)') : (CONFIG.musicLabel || 'click me!');
  }
  cassette.addEventListener('click', () => {
    if (playing) { song.pause(); setPlaying(false); }
    else song.play().then(() => setPlaying(true)).catch(() => {
      cassette.querySelector('.cm').textContent = 'add music.mp3 to the folder 🎵';
    });
  });
  song.addEventListener('error', () => { if (CONFIG.music) cassette.querySelector('.cm').textContent = 'add music.mp3 to the folder 🎵'; });
})();
