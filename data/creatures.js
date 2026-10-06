// Whisker Lake · creatures. Edit the values below; keep the first line as it is.
DATA.creatures =
{
 "_about": "Every creature and piece of trash. ORDER MATTERS: save codes count catches in this order, so only ever add new ones at the END. Depths (min, max, minBed) and len are in world pixels (50 px = 1 m). To use your own drawing for a creature, add \"image\": \"assets/creatures/<name>.png\" (drawn facing right; its width becomes the creature length). fade: the creature turns see-through now and then (it can't see the bait or be reeled in while see-through). shy: lower = slower to notice the bait. heavy: slow to reel in. sprite: an animated sprite sheet (used instead of image once it has loaded): cols x rows cells of w x h pixels, played left to right then top to bottom at fps; faces = which way the art looks; snout = the snout point in every cell (frames are lined up on it); len = body length in sheet pixels, which becomes the creature length; centre (optional) = the middle of the body in a cell, if it isn't level with the snout.",
 "items": [
  {
   "id": "minnow",
   "name": "Minnow",
   "min": 30,
   "max": 260,
   "len": 26,
   "speed": 70,
   "pts": 5,
   "count": 9,
   "pull": 25,
   "thrash": [
    0.3,
    0.6
   ],
   "tired": [
    1,
    1.6
   ],
   "area": "whisker"
  },
  {
   "id": "sardine",
   "name": "Sardine",
   "min": 60,
   "max": 380,
   "len": 34,
   "speed": 95,
   "pts": 10,
   "count": 12,
   "school": 4,
   "pull": 35,
   "thrash": [
    0.4,
    0.7
   ],
   "tired": [
    1,
    1.5
   ],
   "area": "whisker"
  },
  {
   "id": "perch",
   "name": "Sunny Perch",
   "min": 120,
   "max": 480,
   "len": 44,
   "speed": 55,
   "pts": 20,
   "count": 5,
   "pull": 55,
   "thrash": [
    0.5,
    0.9
   ],
   "tired": [
    0.9,
    1.4
   ],
   "area": "whisker"
  },
  {
   "id": "mackerel",
   "name": "Mackerel",
   "min": 220,
   "max": 640,
   "len": 54,
   "speed": 125,
   "pts": 30,
   "count": 4,
   "pull": 85,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.8,
    1.3
   ],
   "area": "whisker"
  },
  {
   "id": "puffer",
   "name": "Pufferfish",
   "min": 280,
   "max": 720,
   "len": 40,
   "speed": 35,
   "pts": 40,
   "count": 4,
   "pull": 60,
   "thrash": [
    0.5,
    0.9
   ],
   "tired": [
    0.9,
    1.4
   ],
   "area": "whisker"
  },
  {
   "id": "salmon",
   "name": "Salmon",
   "min": 380,
   "max": 860,
   "len": 68,
   "speed": 85,
   "pts": 60,
   "count": 4,
   "pull": 110,
   "thrash": [
    0.7,
    1.2
   ],
   "tired": [
    0.8,
    1.3
   ],
   "area": "whisker"
  },
  {
   "id": "eel",
   "name": "River Eel",
   "min": 640,
   "max": 1060,
   "len": 96,
   "speed": 50,
   "pts": 80,
   "count": 3,
   "pull": 120,
   "thrash": [
    0.8,
    1.3
   ],
   "tired": [
    0.8,
    1.2
   ],
   "area": "whisker"
  },
  {
   "id": "swordfish",
   "name": "Swordfish",
   "min": 760,
   "max": 1200,
   "len": 104,
   "speed": 150,
   "pts": 150,
   "count": 2,
   "pull": 165,
   "thrash": [
    0.9,
    1.4
   ],
   "tired": [
    0.7,
    1.1
   ],
   "area": "whisker"
  },
  {
   "id": "angler",
   "name": "Anglerfish",
   "min": 1080,
   "max": 1400,
   "len": 62,
   "speed": 28,
   "pts": 200,
   "count": 2,
   "pull": 130,
   "thrash": [
    0.8,
    1.3
   ],
   "tired": [
    0.8,
    1.2
   ],
   "area": "whisker"
  },
  {
   "id": "koi",
   "name": "Golden Koi",
   "min": 150,
   "max": 1300,
   "len": 60,
   "speed": 65,
   "pts": 500,
   "count": 0,
   "rare": true,
   "pull": 150,
   "thrash": [
    0.9,
    1.4
   ],
   "tired": [
    0.7,
    1.1
   ],
   "area": "whisker"
  },
  {
   "id": "shrimp",
   "name": "Shrimp",
   "min": 150,
   "max": 700,
   "len": 30,
   "speed": 55,
   "pts": 15,
   "count": 6,
   "move": "jerk",
   "pull": 20,
   "thrash": [
    0.3,
    0.5
   ],
   "tired": [
    1,
    1.6
   ],
   "area": "whisker"
  },
  {
   "id": "jelly",
   "name": "Jellyfish",
   "min": 80,
   "max": 900,
   "len": 40,
   "speed": 12,
   "pts": 25,
   "count": 5,
   "move": "drift",
   "inert": true,
   "snag": 24,
   "area": "whisker"
  },
  {
   "id": "clam",
   "name": "Clam",
   "len": 26,
   "pts": 35,
   "count": 9,
   "move": "static",
   "inert": true,
   "snag": 20,
   "area": "whisker"
  },
  {
   "id": "oyster",
   "name": "Oyster",
   "len": 30,
   "pts": 70,
   "count": 5,
   "move": "static",
   "inert": true,
   "snag": 20,
   "minBed": 550,
   "area": "whisker"
  },
  {
   "id": "shark",
   "name": "Shark",
   "min": 140,
   "max": 1300,
   "len": 132,
   "speed": 80,
   "pts": 300,
   "count": 2,
   "shark": true,
   "pull": 210,
   "thrash": [
    1,
    1.6
   ],
   "tired": [
    0.6,
    1
   ],
   "area": "whisker"
  },
  {
   "id": "turtle1",
   "name": "Hatchling Turtle",
   "min": 40,
   "max": 520,
   "len": 36,
   "speed": 30,
   "pts": 45,
   "count": 2,
   "turtle": true,
   "pull": 45,
   "thrash": [
    0.4,
    0.8
   ],
   "tired": [
    1,
    1.5
   ],
   "area": "whisker"
  },
  {
   "id": "turtle2",
   "name": "Green Sea Turtle",
   "min": 100,
   "max": 850,
   "len": 64,
   "speed": 36,
   "pts": 90,
   "count": 2,
   "turtle": true,
   "pull": 95,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.9,
    1.3
   ],
   "area": "whisker"
  },
  {
   "id": "turtle3",
   "name": "Leatherback Turtle",
   "min": 200,
   "max": 1150,
   "len": 104,
   "speed": 42,
   "pts": 180,
   "count": 1,
   "turtle": true,
   "pull": 150,
   "thrash": [
    0.8,
    1.3
   ],
   "tired": [
    0.7,
    1.2
   ],
   "area": "whisker"
  },
  {
   "id": "squid",
   "name": "Squid",
   "min": 200,
   "max": 1150,
   "len": 72,
   "speed": 55,
   "pts": 260,
   "count": 3,
   "squid": true,
   "move": "jerk",
   "sizes": [
    0.6,
    1.5
   ],
   "pull": 120,
   "thrash": [
    0.6,
    1.1
   ],
   "tired": [
    0.8,
    1.3
   ],
   "area": "whisker",
   "thief": {
    "speed": 92,
    "range": 260,
    "giveUp": 300,
    "time": 9,
    "name": "squid"
   },
   "images": [
    "assets/creatures/squid_pink.png",
    "assets/creatures/squid_purple.png",
    "assets/creatures/squid_aqua.png"
   ]
  },
  {
   "id": "lobster",
   "name": "Lobster",
   "len": 58,
   "speed": 22,
   "pts": 120,
   "count": 3,
   "move": "crawl",
   "minBed": 650,
   "pull": 100,
   "thrash": [
    0.7,
    1.2
   ],
   "tired": [
    0.8,
    1.3
   ],
   "area": "whisker"
  },
  {
   "id": "boot",
   "name": "Old Boot",
   "len": 34,
   "pts": -20,
   "count": 3,
   "move": "static",
   "trash": true,
   "inert": true,
   "snag": 22,
   "areas": [
    "whisker",
    "maple",
    "frozen",
    "ducky"
   ]
  },
  {
   "id": "can",
   "name": "Tin Can",
   "len": 22,
   "pts": -10,
   "count": 4,
   "move": "static",
   "trash": true,
   "inert": true,
   "snag": 18,
   "areas": [
    "whisker",
    "maple",
    "frozen",
    "ducky"
   ]
  },
  {
   "id": "tire",
   "name": "Old Tire",
   "len": 46,
   "pts": -30,
   "count": 2,
   "move": "static",
   "trash": true,
   "inert": true,
   "heavy": true,
   "snag": 28,
   "minBed": 450,
   "areas": [
    "whisker",
    "maple"
   ]
  },
  {
   "id": "bottle",
   "name": "Plastic Bottle",
   "min": 20,
   "max": 600,
   "len": 30,
   "speed": 10,
   "pts": -15,
   "count": 3,
   "move": "drift",
   "trash": true,
   "inert": true,
   "snag": 20,
   "areas": [
    "whisker",
    "ducky"
   ]
  },
  {
   "id": "bag",
   "name": "Plastic Bag",
   "min": 40,
   "max": 900,
   "len": 34,
   "speed": 12,
   "pts": -15,
   "count": 3,
   "move": "drift",
   "trash": true,
   "inert": true,
   "snag": 24,
   "areas": [
    "whisker",
    "ducky"
   ]
  },
  {
   "id": "browntrout",
   "area": "maple",
   "name": "Brown Trout",
   "min": 40,
   "max": 450,
   "len": 46,
   "speed": 60,
   "pts": 35,
   "count": 5,
   "pull": 60,
   "thrash": [
    0.5,
    0.9
   ],
   "tired": [
    0.9,
    1.4
   ],
   "look": {
    "shape": "trout",
    "top": "#7a5b2c",
    "belly": "#f1d99a",
    "fin": "#8a6a35",
    "pat": "spots",
    "patCol": "#3a2412",
    "pat2": "#d4472c"
   }
  },
  {
   "id": "rainbow",
   "area": "maple",
   "name": "Rainbow Trout",
   "min": 60,
   "max": 500,
   "len": 50,
   "speed": 70,
   "pts": 45,
   "count": 4,
   "pull": 75,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.8,
    1.3
   ],
   "look": {
    "shape": "trout",
    "top": "#5f7a52",
    "belly": "#eef0e4",
    "fin": "#7d8f66",
    "pat": "stripe",
    "patCol": "rgba(226,92,120,.75)",
    "pat2": "#2b3324"
   }
  },
  {
   "id": "grayling",
   "area": "maple",
   "name": "Arctic Grayling",
   "min": 80,
   "max": 520,
   "len": 44,
   "speed": 65,
   "pts": 55,
   "count": 3,
   "pull": 65,
   "thrash": [
    0.5,
    0.9
   ],
   "tired": [
    0.9,
    1.4
   ],
   "look": {
    "shape": "trout",
    "top": "#6b6f7c",
    "belly": "#e3e3ea",
    "fin": "#7d5a8a",
    "sail": true,
    "pat": "speckle",
    "patCol": "#2b2d36"
   }
  },
  {
   "id": "pike",
   "area": "maple",
   "name": "Northern Pike",
   "min": 150,
   "max": 600,
   "len": 86,
   "speed": 90,
   "pts": 110,
   "count": 2,
   "pull": 130,
   "thrash": [
    0.7,
    1.2
   ],
   "tired": [
    0.8,
    1.2
   ],
   "look": {
    "shape": "pike",
    "top": "#4e6a3a",
    "belly": "#e8e6c4",
    "fin": "#8a7a3a",
    "pat": "beans",
    "patCol": "#d8d6a0"
   }
  },
  {
   "id": "sculpin",
   "area": "maple",
   "name": "River Sculpin",
   "len": 30,
   "speed": 16,
   "pts": 25,
   "count": 4,
   "move": "crawl",
   "minBed": 300,
   "pull": 30,
   "thrash": [
    0.4,
    0.7
   ],
   "tired": [
    1,
    1.5
   ],
   "look": {
    "shape": "sculpin",
    "top": "#6a6452",
    "belly": "#c9bf9c",
    "fin": "#5d574a",
    "pat": "mottle",
    "patCol": "#3b382e"
   }
  },
  {
   "id": "crayfish",
   "area": "maple",
   "name": "Crayfish",
   "len": 34,
   "speed": 18,
   "pts": 30,
   "count": 4,
   "move": "crawl",
   "minBed": 250,
   "pull": 35,
   "thrash": [
    0.4,
    0.7
   ],
   "tired": [
    1,
    1.5
   ]
  },
  {
   "id": "mussel",
   "area": "maple",
   "name": "River Mussel",
   "len": 24,
   "pts": 40,
   "count": 6,
   "move": "static",
   "inert": true,
   "snag": 18
  },
  {
   "id": "sturgeon",
   "area": "maple",
   "name": "Lake Sturgeon",
   "min": 430,
   "max": 640,
   "len": 130,
   "speed": 30,
   "pts": 350,
   "count": 1,
   "pull": 190,
   "thrash": [
    1,
    1.5
   ],
   "tired": [
    0.7,
    1
   ],
   "look": {
    "shape": "sturgeon",
    "top": "#5c5a4e",
    "belly": "#d9d4c0",
    "fin": "#4f4c42",
    "pat": "plates",
    "patCol": "#e6e0c8"
   }
  },
  {
   "id": "cavefish",
   "area": "cave",
   "name": "Blind Cavefish",
   "len": 34,
   "speed": 50,
   "pts": 60,
   "count": 2,
   "hole": true,
   "pull": 45,
   "thrash": [
    0.4,
    0.8
   ],
   "tired": [
    1,
    1.5
   ],
   "look": {
    "shape": "small",
    "top": "#e9c9c4",
    "belly": "#f8ece8",
    "fin": "#efd4cf",
    "blind": true,
    "alpha": 0.95
   }
  },
  {
   "id": "loach",
   "area": "cave",
   "name": "Lantern Loach",
   "len": 40,
   "speed": 45,
   "pts": 80,
   "count": 2,
   "hole": true,
   "pull": 55,
   "thrash": [
    0.5,
    0.8
   ],
   "tired": [
    1,
    1.4
   ],
   "glow": "#7ff7ff",
   "look": {
    "shape": "catfish",
    "top": "#2f6f7a",
    "belly": "#bff3f0",
    "fin": "#3d8c96",
    "pat": "dots",
    "patCol": "#9ffcff"
   }
  },
  {
   "id": "ghostcat",
   "area": "cave",
   "name": "Ghost Catfish",
   "len": 62,
   "speed": 40,
   "pts": 120,
   "count": 2,
   "hole": true,
   "pull": 95,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.9,
    1.3
   ],
   "look": {
    "shape": "catfish",
    "top": "#cfd8e4",
    "belly": "#f2f6fa",
    "fin": "#dfe7f0",
    "alpha": 0.7,
    "blind": true
   }
  },
  {
   "id": "olm",
   "area": "cave",
   "name": "Olm",
   "len": 50,
   "speed": 30,
   "pts": 150,
   "count": 1,
   "hole": true,
   "pull": 70,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.9,
    1.3
   ]
  },
  {
   "id": "gloweel",
   "area": "cave",
   "name": "Glow Eel",
   "len": 96,
   "speed": 45,
   "pts": 180,
   "count": 1,
   "hole": true,
   "pull": 125,
   "thrash": [
    0.8,
    1.3
   ],
   "tired": [
    0.8,
    1.2
   ],
   "glow": "#9dff8a"
  },
  {
   "id": "crystalshrimp",
   "area": "cave",
   "name": "Crystal Shrimp",
   "min": 300,
   "max": 1300,
   "len": 28,
   "speed": 45,
   "pts": 40,
   "count": 5,
   "move": "jerk",
   "pull": 20,
   "thrash": [
    0.3,
    0.5
   ],
   "tired": [
    1,
    1.6
   ],
   "glow": "#a8f0ff"
  },
  {
   "id": "glowjelly",
   "area": "cave",
   "name": "Starlight Jellyfish",
   "min": 200,
   "max": 1250,
   "len": 40,
   "speed": 10,
   "pts": 50,
   "count": 4,
   "move": "drift",
   "inert": true,
   "snag": 24,
   "glow": "#d6a8ff"
  },
  {
   "id": "mooncrab",
   "area": "cave",
   "name": "Moonstone Crab",
   "len": 40,
   "speed": 16,
   "pts": 90,
   "count": 3,
   "move": "crawl",
   "minBed": 800,
   "pull": 70,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.9,
    1.3
   ],
   "glow": "#bcd8ff"
  },
  {
   "id": "cisco",
   "area": "frozen",
   "name": "Cisco",
   "min": 60,
   "max": 450,
   "len": 32,
   "speed": 80,
   "pts": 30,
   "count": 9,
   "school": 3,
   "pull": 35,
   "thrash": [
    0.4,
    0.7
   ],
   "tired": [
    1,
    1.5
   ],
   "look": {
    "shape": "small",
    "top": "#5f7f96",
    "belly": "#eef3f6",
    "fin": "#a9bccb",
    "pat": "none"
   }
  },
  {
   "id": "whitefish",
   "area": "frozen",
   "name": "Lake Whitefish",
   "min": 150,
   "max": 700,
   "len": 50,
   "speed": 55,
   "pts": 50,
   "count": 4,
   "pull": 65,
   "thrash": [
    0.5,
    0.9
   ],
   "tired": [
    0.9,
    1.4
   ],
   "look": {
    "shape": "trout",
    "top": "#8a98a3",
    "belly": "#f4f6f7",
    "fin": "#c3ccd2",
    "pat": "none"
   }
  },
  {
   "id": "char",
   "area": "frozen",
   "name": "Arctic Char",
   "min": 200,
   "max": 850,
   "len": 56,
   "speed": 65,
   "pts": 70,
   "count": 3,
   "pull": 85,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.8,
    1.3
   ],
   "look": {
    "shape": "trout",
    "top": "#4f6070",
    "belly": "#e8583c",
    "fin": "#d9533a",
    "finEdge": "#fff",
    "pat": "spots",
    "patCol": "#f2d6c8"
   }
  },
  {
   "id": "icefish",
   "area": "frozen",
   "name": "Icefish",
   "min": 300,
   "max": 950,
   "len": 48,
   "speed": 40,
   "pts": 90,
   "count": 3,
   "pull": 60,
   "thrash": [
    0.5,
    0.9
   ],
   "tired": [
    0.9,
    1.4
   ],
   "look": {
    "shape": "icefish",
    "top": "#cfe8f2",
    "belly": "#f4fbff",
    "fin": "#e3f4fb",
    "alpha": 0.62
   }
  },
  {
   "id": "burbot",
   "area": "frozen",
   "name": "Burbot",
   "min": 500,
   "max": 980,
   "len": 76,
   "speed": 35,
   "pts": 100,
   "count": 2,
   "pull": 100,
   "thrash": [
    0.7,
    1.1
   ],
   "tired": [
    0.8,
    1.3
   ],
   "look": {
    "shape": "catfish",
    "top": "#6a5a36",
    "belly": "#d8cc9c",
    "fin": "#5f5232",
    "pat": "mottle",
    "patCol": "#3a311c",
    "long": true
   }
  },
  {
   "id": "laketrout",
   "area": "frozen",
   "name": "Lake Trout",
   "min": 400,
   "max": 950,
   "len": 80,
   "speed": 60,
   "pts": 140,
   "count": 2,
   "pull": 130,
   "thrash": [
    0.8,
    1.2
   ],
   "tired": [
    0.8,
    1.2
   ],
   "look": {
    "shape": "trout",
    "top": "#4b5a5a",
    "belly": "#e9ecea",
    "fin": "#6a7a74",
    "pat": "worms",
    "patCol": "#d8e2dc"
   }
  },
  {
   "id": "stickleback",
   "area": "ducky",
   "name": "Stickleback",
   "min": 20,
   "max": 200,
   "len": 22,
   "speed": 60,
   "pts": 10,
   "count": 8,
   "pull": 20,
   "thrash": [
    0.3,
    0.5
   ],
   "tired": [
    1,
    1.6
   ],
   "look": {
    "shape": "small",
    "top": "#6a7f3e",
    "belly": "#e8e0b8",
    "fin": "#7d8c4c",
    "pat": "bars",
    "patCol": "rgba(40,50,20,.5)",
    "spines": true
   }
  },
  {
   "id": "shiner",
   "area": "ducky",
   "name": "Golden Shiner",
   "min": 30,
   "max": 250,
   "len": 30,
   "speed": 75,
   "pts": 20,
   "count": 9,
   "school": 3,
   "pull": 28,
   "thrash": [
    0.3,
    0.6
   ],
   "tired": [
    1,
    1.5
   ],
   "look": {
    "shape": "small",
    "top": "#b39a3c",
    "belly": "#f8eab0",
    "fin": "#e0a640",
    "pat": "none"
   }
  },
  {
   "id": "chub",
   "area": "ducky",
   "name": "Creek Chub",
   "min": 40,
   "max": 300,
   "len": 38,
   "speed": 60,
   "pts": 25,
   "count": 5,
   "pull": 40,
   "thrash": [
    0.4,
    0.7
   ],
   "tired": [
    1,
    1.5
   ],
   "look": {
    "shape": "small",
    "top": "#6b6a5a",
    "belly": "#efe8d8",
    "fin": "#b78a6a",
    "pat": "stripe",
    "patCol": "rgba(50,45,40,.55)"
   }
  },
  {
   "id": "bluegill",
   "area": "ducky",
   "name": "Bluegill",
   "min": 60,
   "max": 320,
   "len": 36,
   "speed": 45,
   "pts": 30,
   "count": 4,
   "pull": 45,
   "thrash": [
    0.4,
    0.8
   ],
   "tired": [
    0.9,
    1.4
   ],
   "look": {
    "shape": "deep",
    "top": "#4d6a5c",
    "belly": "#f0b45a",
    "fin": "#5a7a68",
    "pat": "bars",
    "patCol": "rgba(30,50,60,.35)",
    "earSpot": "#1d2a40"
   }
  },
  {
   "id": "catfish",
   "area": "ducky",
   "name": "Channel Catfish",
   "min": 180,
   "max": 370,
   "len": 70,
   "speed": 30,
   "pts": 90,
   "count": 2,
   "pull": 100,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.9,
    1.3
   ],
   "look": {
    "shape": "catfish",
    "top": "#6c7480",
    "belly": "#e6e8ea",
    "fin": "#5d636c",
    "pat": "dots",
    "patCol": "#2b3038"
   }
  },
  {
   "id": "frog",
   "area": "ducky",
   "name": "Frog",
   "min": 15,
   "max": 200,
   "len": 34,
   "speed": 40,
   "pts": 40,
   "count": 3,
   "move": "jerk",
   "pull": 35,
   "thrash": [
    0.4,
    0.7
   ],
   "tired": [
    1,
    1.5
   ],
   "thief": {
    "speed": 72,
    "range": 200,
    "giveUp": 260,
    "time": 7,
    "name": "frog"
   }
  },
  {
   "id": "snail",
   "area": "ducky",
   "name": "Pond Snail",
   "len": 18,
   "pts": 15,
   "count": 6,
   "move": "static",
   "inert": true,
   "snag": 16
  },
  {
   "id": "duck",
   "area": "ducky",
   "name": "Duck",
   "critter": true,
   "move": "surface",
   "len": 44,
   "speed": 28,
   "count": 3
  },
  {
   "id": "otter",
   "area": "ducky",
   "name": "Otter",
   "critter": true,
   "min": 20,
   "max": 300,
   "len": 72,
   "speed": 70,
   "count": 2,
   "thief": {
    "speed": 125,
    "range": 300,
    "giveUp": 330,
    "time": 5,
    "name": "otter"
   }
  },
  {
   "id": "lotuskoi",
   "area": "guardian",
   "name": "Lotus Koi",
   "min": 60,
   "max": 600,
   "len": 58,
   "speed": 55,
   "pts": 120,
   "count": 3,
   "pull": 100,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.8,
    1.3
   ],
   "look": {
    "shape": "carp",
    "top": "#f6f1ec",
    "belly": "#ffffff",
    "fin": "#f7d5dc",
    "pat": "koi",
    "patCol": "#e9607a"
   }
  },
  {
   "id": "blossomtrout",
   "area": "guardian",
   "name": "Blossom Trout",
   "min": 80,
   "max": 700,
   "len": 50,
   "speed": 65,
   "pts": 80,
   "count": 4,
   "pull": 80,
   "thrash": [
    0.6,
    1
   ],
   "tired": [
    0.8,
    1.3
   ],
   "look": {
    "shape": "trout",
    "top": "#6a7f8a",
    "belly": "#fbe6ec",
    "fin": "#e7a6b8",
    "pat": "spots",
    "patCol": "#f39ab5"
   }
  },
  {
   "id": "jadeperch",
   "area": "guardian",
   "name": "Jade Perch",
   "min": 150,
   "max": 800,
   "len": 44,
   "speed": 50,
   "pts": 90,
   "count": 4,
   "pull": 70,
   "thrash": [
    0.5,
    0.9
   ],
   "tired": [
    0.9,
    1.4
   ],
   "look": {
    "shape": "deep",
    "top": "#2f8a6a",
    "belly": "#cff0dc",
    "fin": "#3aa27c",
    "pat": "bars",
    "patCol": "rgba(10,60,40,.35)"
   }
  },
  {
   "id": "mooncarp",
   "area": "guardian",
   "name": "Moon Carp",
   "min": 500,
   "max": 1300,
   "len": 70,
   "speed": 45,
   "pts": 160,
   "count": 2,
   "pull": 130,
   "thrash": [
    0.7,
    1.1
   ],
   "tired": [
    0.8,
    1.2
   ],
   "glow": "#e8f0ff",
   "look": {
    "shape": "carp",
    "top": "#b9c4d6",
    "belly": "#f6f8fc",
    "fin": "#d6dcea",
    "pat": "scales",
    "patCol": "rgba(255,255,255,.5)"
   }
  },
  {
   "id": "dragon",
   "area": "guardian",
   "name": "Guardian Dragon",
   "min": 700,
   "max": 1450,
   "len": 230,
   "speed": 70,
   "pts": 5000,
   "count": 0,
   "legend": true,
   "pull": 210,
   "thrash": [
    1.1,
    1.7
   ],
   "tired": [
    0.7,
    1
   ]
  },
  {
   "id": "axolotl",
   "area": "cave",
   "name": "Crystal Axolotl",
   "min": 650,
   "max": 1300,
   "len": 125,
   "speed": 32,
   "pts": 760,
   "count": 1,
   "pull": 110,
   "thrash": [
    0.9,
    1.4
   ],
   "tired": [
    0.7,
    1.0
   ],
   "glow": "#a8f4ff",
   "fade": true,
   "shy": 0.4,
   "image": "assets/creatures/crystal_axolotl.png",
   "sprite": {
    "image": "assets/creatures/crystal_axolotl_swim.png",
    "cols": 4,
    "rows": 2,
    "frames": 8,
    "fps": 10,
    "faces": "left",
    "w": 348,
    "h": 198,
    "snout": [16.2, 108.6],
    "len": 313
   }
  },
  {
   "id": "sunfish",
   "area": "cave",
   "name": "Crystal Sunfish",
   "min": 350,
   "max": 1000,
   "len": 110,
   "speed": 24,
   "pts": 400,
   "count": 2,
   "pull": 115,
   "heavy": true,
   "thrash": [
    0.9,
    1.4
   ],
   "tired": [
    0.8,
    1.2
   ],
   "glow": "#bfe0ff",
   "sprite": {
    "image": "assets/creatures/crystal_sunfish_swim.png",
    "cols": 4,
    "rows": 2,
    "frames": 8,
    "fps": 10,
    "faces": "left",
    "w": 264,
    "h": 294,
    "snout": [15.6, 162.6],
    "len": 227,
    "centre": [129.1, 146.1]
   }
  }
 ]
}
;
