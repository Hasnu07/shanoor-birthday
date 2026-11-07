(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const tilts = ['tilt-l', 'tilt-r', 'tilt-l2', 'tilt-r2'];

  // ============================================================
  // SOUND EFFECTS (synthesized, no files needed)
  // ============================================================
  let actx = null;
  let sfxOn = CONFIG.sfx !== false;
  try { if (localStorage.getItem('sfx') === 'off') sfxOn = false; } catch (e) {}

  function ctx() {
    if (!sfxOn) return null;
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, dur, { type = 'sine', vol = .25, slide = 0, delay = 0 } = {}) {
    const c = ctx(); if (!c) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .01);
    g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + .05);
  }
  function noise(dur, { vol = .2, delay = 0, lp = 1200 } = {}) {
    const c = ctx(); if (!c) return;
    const t = c.currentTime + delay;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp;
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t);
  }
  const SFX = {
    pop()    { tone(520, .09, { type: 'square', vol: .12, slide: 300 }); },
    squeak() { tone(900, .12, { type: 'triangle', vol: .15, slide: 500 }); tone(1400, .1, { type: 'triangle', vol: .1, slide: -400, delay: .08 }); },
    ding()   { tone(1320, .35, { vol: .12 }); tone(1980, .3, { vol: .06, delay: .02 }); },
    whoosh() { noise(.5, { vol: .35, lp: 900 }); },
    boing()  { tone(180, .45, { type: 'sawtooth', vol: .12, slide: 420 }); },
    buzz()   { tone(110, .25, { type: 'square', vol: .1 }); tone(104, .25, { type: 'square', vol: .1, delay: .02 }); },
    click()  { tone(300, .04, { type: 'square', vol: .1 }); },
    tada()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, .35, { type: 'triangle', vol: .14, delay: i * .09 })); tone(1319, .6, { type: 'triangle', vol: .14, delay: .4 }); },
  };

  // mute button
  const sfxBtn = document.createElement('button');
  sfxBtn.className = 'sfx-toggle';
  sfxBtn.title = 'sound effects';
  function paintSfx() { sfxBtn.textContent = sfxOn ? '🔊' : '🔇'; sfxBtn.setAttribute('aria-label', sfxOn ? 'Mute sound effects' : 'Unmute sound effects'); }
  paintSfx();
  sfxBtn.addEventListener('click', () => {
    sfxOn = !sfxOn; paintSfx();
    try { localStorage.setItem('sfx', sfxOn ? 'on' : 'off'); } catch (e) {}
    if (sfxOn) SFX.ding();
  });
  document.body.appendChild(sfxBtn);

  // ============================================================
  // CONTENT
  // ============================================================
  $$('[data-fill]').forEach(el => {
    const key = el.dataset.fill;
    const val = CONFIG[key];
    if (val === undefined || val === '') { if (key === 'age') el.hidden = true; return; }
    el.textContent = val;
  });
  document.title = 'Happy Birthday ' + CONFIG.name;

  // headline: letters pop in one by one (grouped by word so words never split)
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

  // ribbon
  $('#ribbon').textContent = (CONFIG.ribbon + ' ').repeat(6);

  // height report table
  const report = $('#report');
  CONFIG.report.forEach(([k, v]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>${k}</th><td>${v}</td>`;
    report.appendChild(tr);
  });

  // sticker gallery
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
      SFX.squeak();
    });
    grid.appendChild(fig);
  });

  // taller than list
  const ol = $('#tallerList');
  CONFIG.taller.forEach(t => {
    const li = document.createElement('li');
    li.className = 'hand';
    li.textContent = t;
    ol.appendChild(li);
  });

  // film strip (photos 2-6)
  const frames = $('#filmFrames');
  for (let i = 2; i <= 6; i++) {
    const d = document.createElement('div');
    d.className = 'frame';
    d.innerHTML = `<img src="photos/${i}.jpg" alt="" onerror="this.parentNode.classList.add('missing')">`;
    frames.appendChild(d);
  }

  // polaroid wall (all photos)
  const wall = $('#polaroidWall');
  CONFIG.photoCaptions.forEach((cap, i) => {
    const p = document.createElement('div');
    p.className = 'polaroid wall-item ' + tilts[(i * 3) % tilts.length];
    p.style.setProperty('--i', i);
    p.innerHTML = `
      <span class="tape ${i % 2 ? 'tape-tl' : 'tape-tr'} small"></span>
      <img src="photos/${i + 1}.jpg" alt="" loading="lazy" onerror="this.parentNode.classList.add('missing')">
      <span class="hand cap">${cap}</span>`;
    p.addEventListener('click', () => SFX.click());
    wall.appendChild(p);
  });

  // video memories
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
    btn.addEventListener('click', () => { SFX.click(); video.play(); });
    video.addEventListener('play', () => {
      card.classList.add('playing');
      $$('#videoWall video').forEach(o => { if (o !== video) o.pause(); });
      duckSong(true);
    });
    const unduck = () => { card.classList.remove('playing'); if (!$$('#videoWall video').some(o => !o.paused)) duckSong(false); };
    video.addEventListener('pause', unduck);
    video.addEventListener('ended', unduck);
    video.addEventListener('error', () => card.classList.add('missing'));
  });

  // candle
  const candle = $('#candle');
  const candleText = $('#candleText');
  candleText.textContent = CONFIG.candleHint;
  candle.addEventListener('click', () => {
    if (candle.classList.contains('out')) {
      candle.classList.remove('out');
      candleText.textContent = CONFIG.candleHint;
      SFX.click();
      return;
    }
    candle.classList.add('out');
    candleText.textContent = CONFIG.candleDone;
    const r = candle.getBoundingClientRect();
    SFX.whoosh();
    setTimeout(SFX.tada, 350);
    bigBurst(r.left + r.width / 2, r.top);
  });

  // growth experiment
  const growImg = $('#growImg');
  const growMsg = $('#growMsg');
  const growCount = $('#growCount');
  let attempts = 0;
  $('#growBtn').addEventListener('click', () => {
    attempts++;
    growImg.classList.remove('grow'); void growImg.offsetWidth; growImg.classList.add('grow');
    growMsg.textContent = '';
    SFX.boing();
    setTimeout(() => { growMsg.textContent = pick(CONFIG.growFails); SFX.buzz(); }, 650);
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
    SFX.pop();
  });

  // hidden tiny Shanoor hunt
  const pages = $$('.page');
  const spots = [
    { page: 1, style: 'left:6px; bottom:8px;' },
    { page: 4, style: 'right:10px; top:10px;' },
    { page: 6, style: 'left:50%; bottom:4px;' },
  ];
  let found = 0;
  const huntCount = $('#huntCount');
  const hunt = $('#hunt');
  spots.forEach(s => {
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
      SFX.ding();
      if (found === spots.length) {
        hunt.classList.add('done');
        hunt.querySelector('span').textContent = CONFIG.huntDone;
        bigBurst(window.innerWidth / 2, window.innerHeight / 2);
        setTimeout(SFX.tada, 200);
      }
    });
    pg.appendChild(b);
  });

  // sparkle bursts
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

  // ============================================================
  // MUSIC
  //   intro = birthday tune, starts when the site is launched (cover click)
  //   song  = the cassette, plays ONLY when the tape is clicked
  // ============================================================
  const intro = $('#intro');
  const song = $('#song');
  const cassette = $('#cassette');
  let playing = false;      // cassette song playing?
  let introOn = false;      // birthday tune playing?
  const fades = new Map();

  if (CONFIG.intro) { intro.src = CONFIG.intro; intro.loop = CONFIG.introLoop !== false; }
  if (CONFIG.music) song.src = CONFIG.music; else cassette.style.display = 'none';
  if (CONFIG.musicLabel) cassette.querySelector('.cm').textContent = CONFIG.musicLabel;

  function fadeTo(el, target, secs, then) {
    clearInterval(fades.get(el));
    const steps = Math.max(1, Math.round(secs * 20));
    const start = el.volume; let n = 0;
    const id = setInterval(() => {
      n++; el.volume = Math.min(1, Math.max(0, start + (target - start) * (n / steps)));
      if (n >= steps) { clearInterval(id); if (then) then(); }
    }, 50);
    fades.set(el, id);
  }
  function duckSong(on) {
    if (playing) fadeTo(song, on ? .15 : 1, .6);
    if (introOn) fadeTo(intro, on ? .15 : 1, .6);
  }

  // birthday tune at launch
  function launchIntro() {
    if (!CONFIG.intro || introOn) return;
    intro.volume = 0;
    intro.play().then(() => { introOn = true; fadeTo(intro, 1, Number(CONFIG.introFadeIn) || 2); }).catch(() => {});
  }
  function pauseIntro() {
    if (!introOn) return;
    fadeTo(intro, 0, .8, () => { intro.pause(); });
    introOn = false;
  }
  function resumeIntro() {
    if (!CONFIG.intro || introOn || intro.ended) return;
    intro.volume = 0;
    intro.play().then(() => { introOn = true; fadeTo(intro, 1, 1.2); }).catch(() => {});
  }

  // the cassette
  function setPlaying(v) {
    playing = v;
    cassette.classList.toggle('playing', v);
    cassette.querySelector('.cm').textContent = v ? (CONFIG.musicPlaying || 'playing… (click to pause)') : (CONFIG.musicLabel || 'click me!');
  }
  cassette.addEventListener('click', () => {
    SFX.click();
    if (playing) {
      song.pause(); setPlaying(false);
      resumeIntro();
      return;
    }
    const startAt = Number(CONFIG.musicStartAt) || 0;
    const begin = () => {
      try { if (startAt > 0 && song.currentTime < 1) song.currentTime = startAt; } catch (e) {}
      song.volume = 1;
      song.play().then(() => { setPlaying(true); pauseIntro(); }).catch(() => {
        cassette.querySelector('.cm').textContent = 'add music.mp3 to the folder 🎵';
      });
    };
    if (song.readyState >= 1 || startAt === 0) begin();
    else { song.addEventListener('loadedmetadata', begin, { once: true }); song.load(); }
  });
  song.addEventListener('error', () => { if (CONFIG.music) cassette.querySelector('.cm').textContent = 'add music.mp3 to the folder 🎵'; });

  // ============================================================
  // COVER → LAUNCH
  // ============================================================
  const cover = $('#cover');
  const book = $('#book');
  $('#openBtn').addEventListener('click', () => {
    ctx(); // unlock audio on this user gesture
    cover.classList.add('opening');
    book.hidden = false;
    document.body.classList.add('open');
    setTimeout(() => { cover.hidden = true; }, 900);
    window.scrollTo({ top: 0 });
    bigBurst(window.innerWidth / 2, window.innerHeight / 2);
    SFX.pop();
    setTimeout(SFX.tada, 150);
    launchIntro();
  });

  // confetti on cover
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

  // twinkling stars in the background
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

  // reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));
})();
