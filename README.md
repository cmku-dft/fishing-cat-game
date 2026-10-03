# Whisker Lake 🎣🐱

A small fishing game you play in the browser. Pick one of five clan cats, row your boat across the lake and try to catch all 10 kinds of fish.

**▶ Play it here: https://cmku-dft.github.io/fishing-cat-game/**

![Sapstar reeling in a Sunny Perch](screenshot.png)

## How to play

| Action | Keyboard | Phone / tablet |
| --- | --- | --- |
| Row the boat | ← → or A D | ◀ ▶ buttons |
| Drop the line | ↓ or S | **Drop** button |
| Reel in | ↑, W or Space | **Reel** button |

When a fish bites, it switches between two moods:

- **Thrashing** (red): stop reeling and wait. If you reel now, the line gets tight and can snap.
- **Tired** (green): reel in fast!

Pull the fish up to the surface to catch it. The fish log keeps track of every kind you've found.

## The cats

Every cat has a fishing talent.

| Cat | Clan | Talent |
| --- | --- | --- |
| Sapstar | ThunderClan leader | Reels in 25% faster |
| Leafpelt | ShadowClan warrior | Line tension builds 35% slower |
| Haretail | WindClan warrior | Rows the boat 40% faster |
| Eelfur | RiverClan deputy | Fish notice the hook from farther away |
| Squirrelstripe | RiverClan deputy | Golden Koi show up 3× as often |

## The fish

| Fish | Depth | Points |
| --- | --- | --- |
| Minnow | 1–5 m | 5 |
| Sardine | 1–8 m | 10 |
| Sunny Perch | 2–10 m | 20 |
| Mackerel | 4–13 m | 30 |
| Pufferfish | 6–14 m | 40 |
| Salmon | 8–17 m | 60 |
| River Eel | 13–21 m | 80 |
| Swordfish | 15–24 m | 150 |
| Anglerfish | 22–28 m | 200 |
| Golden Koi | Anywhere (rare!) | 500 |

The water gets dark below about 9 m, so look for the light around your hook.

## How it's made

The whole game is one `index.html` file using HTML5 Canvas and plain JavaScript. It needs no game engine and no install, and it runs on GitHub Pages.

## Credits

- Cat characters and artwork: original drawings by the creator of this repo.
- Game code: built with help from Claude.
