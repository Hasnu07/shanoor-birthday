# Shanoor's tiny birthday scrapbook 🎂

A one-page scrapbook-style birthday site. No build step, just open it.

## Run it

```bash
npx --yes http-server . -p 8765 -c-1
```

Then open http://localhost:8765 (opening `index.html` directly also works in most browsers).

## Change the words

Everything written on the site lives in **`config.js`** — name, jokes, the height report,
sticker captions, photo captions, the letter and the sign-off. Edit the text in quotes and refresh.

## Photos & clipart

- `photos/1.jpg … 10.jpg` — her real photos. Replace or reorder freely; captions are in `config.js` (`photoCaptions`).
- `clipart/*.png` — the tiny-Shanoor stickers (drum, teacup, cupcake, ruler, pocket, balloon, matchbox, portrait). Transparent PNGs.

## Fun bits (all text in `config.js`)

- **Candle** on the first page: click to blow it out.
- **The Growth Experiment**: "make her taller" button (it never works) and a random
  "what is Shanoor shorter than today?" generator. Add your own lines to `growFails` and `shorterThan`.
- **Hidden hunt**: three tiny Shanoor heads are hidden on the page. Finding all three sets off confetti.
- Stickers wobble when tapped; clicks throw sparkles.

## Music

- `intro.mp3` — the birthday tune. Starts (with a fade-in) the moment the cover is clicked and loops.
- `music.mp3` — the cassette song. Plays only when the tape is clicked; the birthday tune pauses
  while it plays and comes back when the tape is paused.

Set `intro: ""` or `music: ""` in `config.js` to turn either off. Sound effects are synthesized
(no files) and can be muted with the 🔊 button or `sfx: false`.

## Put it online

The whole folder is static. Drag it onto [Netlify Drop](https://app.netlify.com/drop), or push it to
GitHub and enable GitHub Pages, and share the link.
