// ✏️  EDIT THIS FILE to change the text on the site.
// Everything in quotes can be changed. Keep the commas!

const CONFIG = {
  name: "Shanoor",
  from: "your (much taller) friend",   // who the site is from
  age: "",                              // e.g. "21" — leave "" to hide the number

  // Cover page
  coverLine: "a very small birthday card for a very small person",
  coverHint: "click me!",

  // Scrolling ribbon at the top of the book
  ribbon: "✨ happy birthday shanoor ✨ tiny but mighty ✨ handle with care ✨ may contain small person ✨",

  // Page 1 – the big greeting
  headline: "Happy Birthday Shanoor!",
  subline: "Another year older. Still not another inch taller. ✨",
  candleHint: "blow out the candle (click it)",
  candleDone: "wish made! we hope it was \"be taller\" 🤞",

  // Height report card
  reportTitle: "Official Height Report",
  report: [
    ["Height", "pending (ruler ran out of patience)"],
    ["Travel size", "yes, fits in carry-on"],
    ["Fits inside", "a drum, a teacup, a pocket"],
    ["Reach", "top shelf: no. everyone's good side: yes"],
    ["Energy", "stadium-sized. unclear where she keeps it"],
  ],

  // Captions under the clipart stickers
  stickers: [
    { img: "clipart/drum.png",     caption: "found her. she was in the drum." },
    { img: "clipart/teacup.png",   caption: "bath time ☕" },
    { img: "clipart/cupcake.png",  caption: "the candle is taller. sorry." },
    { img: "clipart/ruler.png",    caption: "tiptoes don't count, Shanoor." },
    { img: "clipart/pocket.png",   caption: "pocket edition 🧥" },
    { img: "clipart/balloon.png",  caption: "one balloon = flight risk" },
    { img: "clipart/matchbox.png", caption: "king size bed 🛏️" },
  ],

  // The growth experiment
  labTitle: "The Growth Experiment",
  labNote: "science has been trying for years",
  growButton: "make her taller",
  growFails: [
    "nope.",
    "still small.",
    "the ruler laughed.",
    "she bounced back.",
    "limited edition size. cannot be changed.",
    "error 404: height not found",
    "it's a feature, not a bug.",
  ],
  shorterButton: "what is Shanoor shorter than today?",
  shorterThan: [
    "a traffic cone (the big kind)",
    "a stack of four pizza boxes",
    "a golden retriever standing on two legs",
    "a standing fan on medium",
    "a shopping trolley with the child seat up",
    "a two-ball snowman",
    "a dustbin on a brick",
    "the queue at the bakery",
    "her own shadow at 5pm",
    "a microwave on a counter",
    "a birthday balloon that's a bit tired",
  ],

  // "Things taller than Shanoor" list
  tallerTitle: "Things taller than Shanoor",
  taller: [
    "a drum",
    "a birthday candle",
    "the font on this website",
    "her own confidence",
    "the list of reasons she's the best",
  ],

  // Real photo polaroid captions (photos/1.jpg … photos/10.jpg)
  photosTitle: "Evidence that she exists at real size",
  photosNote: "(all photos zoomed in 400% for visibility)",
  photoCaptions: [
    "horse: large. rider: small.",
    "sunflowers were taller too",
    "smelling flowers her own height",
    "peace ✌️ + a bit of mischief",
    "found a plant to hide behind",
    "the group photo (spot the smol)",
    "sunglasses: full size",
    "helmet squad",
    "night walk, mini edition",
    "grass nap 🌱",
  ],

  // Video memories (videos/1.mp4 … 4.mp4). Add more lines for more videos.
  videosTitle: "Video memories",
  videosNote: "(press play · warning: may contain tiny person)",
  videos: [
    { file: "videos/1.mp4", caption: "tape no. 1 · chaos" },
    { file: "videos/2.mp4", caption: "tape no. 2 · more chaos" },
    { file: "videos/3.mp4", caption: "tape no. 3 · the good one" },
    { file: "videos/4.mp4", caption: "tape no. 4 · director's cut" },
  ],

  // Hidden game: three tiny Shanoors are hidden on the page
  huntTitle: "tiny Shanoors found",
  huntDone: "you found all of her! she's still small though. 🎉",

  // The sincere part
  letterTitle: "Okay, serious now (for one paragraph)",
  letter: "Shanoor, you may be small enough to lose in a group photo, but somehow you're the one everyone looks for first. You show up when it matters, you laugh the loudest, and you turn boring days into funny ones and hard days into lighter ones. Honestly, we're lucky to have you around. Happy birthday to the tiniest person with the biggest presence. Stay exactly as you are. Maybe just stand on a chair for photos.",
  signoff: "sincerely (for once),",

  // Footer
  footer: "made for Shanoor · 100% real, 0% tall",

  // Birthday tune that starts when the site is launched (the "click me!" on the cover).
  // Leave "" for none.
  intro: "intro.mp3",
  introFadeIn: 2.5,      // seconds to fade the tune in
  introLoop: true,       // keep looping while she scrolls

  // The cassette song. Plays ONLY when the tape is clicked; the birthday tune
  // pauses while it plays and comes back when the tape is paused.
  music: "music.mp3",
  musicStartAt: 0,       // seconds into the song to start from (e.g. 32 to skip the intro)
  musicLabel: "the only song you know",       // text under the cassette
  musicPlaying: "the only song you know (playing · click to pause)",

  // Sound effects (pops, whooshes, chimes). Set false to turn them off.
  sfx: true,
};
