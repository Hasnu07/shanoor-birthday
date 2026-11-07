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

Drop a file called `music.mp3` next to `index.html` and the cassette at the bottom plays it
(it also tries to start when the card is opened). Set `music: ""` in `config.js` to disable.

## Put it online

The whole folder is static. Drag it onto [Netlify Drop](https://app.netlify.com/drop), or push it to
GitHub and enable GitHub Pages, and share the link.
