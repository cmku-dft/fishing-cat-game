// Whisker Lake · cats. Edit the values below; keep the first line as it is.
DATA.cats =
{
 "_about": "The five cats. mods: talent multipliers (reel, tension, boat, notice, rare). poses: the 5 fishing faces; anchor = boat centre and keel, rodTip = end of the rod, both in pixels of the pose picture. anims (optional): sprite-sheet animations that replace a pose: idle (waiting, calm), fight (fish on the line), catch (plays once after a catch), sleepy (no input for 9+ s), shocked (shark, bear, thief, jellyfish), paddle (rowing with the line reeled in; rodTips copy the idle rod tip because there is no rod; front = paddle-only overlay drawn in front of the hull, dips = blade tip per frame for splashes). Any anim may have \"scale\" (default 1): extra size factor around the anchor, used to match the waiting size. One row of cells w x h; anchor is the same in every cell; rodTips = rod end per frame; seq = optional frame order; head = shift of the mood effects.",
 "items": [
  {
   "id": "sapstar",
   "name": "Sapstar",
   "clan": "ThunderClan",
   "rank": "Leader",
   "perk": "Leader's patience",
   "perkText": "Reels in 25% faster",
   "mods": {
    "reel": 1.25
   },
   "image": "assets/cats/sapstar.png",
   "poses": {
    "happy": {
     "image": "assets/poses/sapstar_happy.png",
     "w": 304,
     "h": 213,
     "anchor": [
      172.0,
      205
     ],
     "rodTip": [
      24,
      51
     ]
    },
    "sad": {
     "image": "assets/poses/sapstar_sad.png",
     "w": 299,
     "h": 198,
     "anchor": [
      169.0,
      190
     ],
     "rodTip": [
      20,
      31
     ]
    },
    "tired": {
     "image": "assets/poses/sapstar_tired.png",
     "w": 288,
     "h": 213,
     "anchor": [
      155.5,
      205
     ],
     "rodTip": [
      19,
      48
     ]
    },
    "excited": {
     "image": "assets/poses/sapstar_excited.png",
     "w": 287,
     "h": 276,
     "anchor": [
      164.0,
      206
     ],
     "rodTip": [
      21,
      38
     ]
    },
    "focused": {
     "image": "assets/poses/sapstar_focused.png",
     "w": 291,
     "h": 201,
     "anchor": [
      168.5,
      194
     ],
     "rodTip": [
      22,
      34
     ]
    }
   },
   "anims": {
    "idle": {
     "image": "assets/poses/sapstar_idle.png",
     "cols": 4,
     "frames": 4,
     "fps": 4,
     "loop": true,
     "w": 262,
     "h": 297,
     "anchor": [
      158,
      293
     ],
     "rodTips": [
      [
       8.6,
       134.5
      ],
      [
       8.8,
       134.7
      ],
      [
       9.6,
       134.9
      ],
      [
       9.8,
       134.9
      ]
     ],
     "head": [
      9,
      -20
     ],
     "seq": [
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      2,
      3
     ]
    },
    "fight": {
     "image": "assets/poses/sapstar_fight.png",
     "cols": 4,
     "frames": 4,
     "fps": 8,
     "loop": true,
     "w": 262,
     "h": 297,
     "anchor": [
      158,
      293
     ],
     "rodTips": [
      [
       7.8,
       192.6
      ],
      [
       26.8,
       211.4
      ],
      [
       20.0,
       196.5
      ],
      [
       19.0,
       153.9
      ]
     ],
     "head": [
      16,
      -16
     ]
    },
    "catch": {
     "image": "assets/poses/sapstar_catch.png",
     "cols": 4,
     "frames": 4,
     "fps": 6,
     "loop": false,
     "w": 262,
     "h": 297,
     "anchor": [
      158,
      293
     ],
     "rodTips": [
      [
       31.9,
       36.2
      ],
      [
       34.0,
       9.4
      ],
      [
       53.8,
       10.4
      ],
      [
       54.0,
       9.4
      ]
     ],
     "head": [
      11,
      -30
     ]
    },
    "sleepy": {
     "image": "assets/poses/sapstar_sleepy.png",
     "cols": 4,
     "frames": 4,
     "fps": 3.0,
     "loop": true,
     "w": 247,
     "h": 214,
     "anchor": [
      154,
      210
     ],
     "rodTips": [
      [
       10.8,
       59.7
      ],
      [
       7.7,
       62.7
      ],
      [
       5.6,
       62.5
      ],
      [
       11.8,
       59.5
      ]
     ],
     "head": [
      2,
      -13
     ],
     "seq": [
      0,
      1,
      2,
      2,
      2,
      3
     ]
    },
    "shocked": {
     "image": "assets/poses/sapstar_shocked.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 249,
     "h": 199,
     "anchor": [
      149,
      195
     ],
     "rodTips": [
      [
       5.8,
       38.4
      ],
      [
       10.9,
       16.6
      ],
      [
       6.7,
       36.1
      ],
      [
       8.8,
       39.1
      ]
     ],
     "head": [
      12,
      -8
     ]
    },
    "paddle": {
     "image": "assets/poses/sapstar_paddle.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 282,
     "h": 244,
     "anchor": [
      140,
      240
     ],
     "rodTips": [
      [
       -9.400000000000006,
       81.5
      ],
      [
       -9.400000000000006,
       81.5
      ],
      [
       -9.400000000000006,
       81.5
      ],
      [
       -9.400000000000006,
       81.5
      ]
     ],
     "head": [
      9,
      -20
     ],
     "front": "assets/poses/sapstar_paddlefront.png",
     "dips": [
      [
       15.8,
       222
      ],
      [
       118.5,
       234
      ],
      [
       195.4,
       231
      ],
      null
     ],
     "scale": 0.9
    }
   }
  },
  {
   "id": "leafpelt",
   "name": "Leafpelt",
   "clan": "ShadowClan",
   "rank": "Warrior",
   "perk": "Battle-scarred",
   "perkText": "Line tension builds 35% slower",
   "mods": {
    "tension": 0.65
   },
   "image": "assets/cats/leafpelt.png",
   "poses": {
    "happy": {
     "image": "assets/poses/leafpelt_happy.png",
     "w": 305,
     "h": 198,
     "anchor": [
      166.5,
      190
     ],
     "rodTip": [
      23,
      42
     ]
    },
    "sad": {
     "image": "assets/poses/leafpelt_sad.png",
     "w": 293,
     "h": 188,
     "anchor": [
      162.5,
      180
     ],
     "rodTip": [
      21,
      27
     ]
    },
    "tired": {
     "image": "assets/poses/leafpelt_tired.png",
     "w": 285,
     "h": 199,
     "anchor": [
      161.0,
      191
     ],
     "rodTip": [
      22,
      36
     ]
    },
    "excited": {
     "image": "assets/poses/leafpelt_excited.png",
     "w": 291,
     "h": 198,
     "anchor": [
      164.0,
      190
     ],
     "rodTip": [
      22,
      24
     ]
    },
    "focused": {
     "image": "assets/poses/leafpelt_focused.png",
     "w": 297,
     "h": 197,
     "anchor": [
      170.0,
      190
     ],
     "rodTip": [
      22,
      33
     ]
    }
   },
   "anims": {
    "idle": {
     "image": "assets/poses/leafpelt_idle.png",
     "cols": 4,
     "frames": 4,
     "fps": 4,
     "loop": true,
     "w": 244,
     "h": 286,
     "anchor": [
      143,
      282
     ],
     "rodTips": [
      [
       11.8,
       132.9
      ],
      [
       10.9,
       133.0
      ],
      [
       9.7,
       132.6
      ],
      [
       8.9,
       134.2
      ]
     ],
     "head": [
      37,
      -14
     ],
     "seq": [
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      2,
      3
     ]
    },
    "fight": {
     "image": "assets/poses/leafpelt_fight.png",
     "cols": 4,
     "frames": 4,
     "fps": 8,
     "loop": true,
     "w": 244,
     "h": 286,
     "anchor": [
      143,
      282
     ],
     "rodTips": [
      [
       7.9,
       224.6
      ],
      [
       20.8,
       235.9
      ],
      [
       12.7,
       222.6
      ],
      [
       18.0,
       192.3
      ]
     ],
     "head": [
      49,
      -6
     ]
    },
    "catch": {
     "image": "assets/poses/leafpelt_catch.png",
     "cols": 4,
     "frames": 4,
     "fps": 6,
     "loop": false,
     "w": 244,
     "h": 286,
     "anchor": [
      143,
      282
     ],
     "rodTips": [
      [
       6.0,
       63.9
      ],
      [
       24.9,
       7.9
      ],
      [
       24.9,
       8.0
      ],
      [
       26.0,
       7.6
      ]
     ],
     "head": [
      39,
      -20
     ]
    },
    "sleepy": {
     "image": "assets/poses/leafpelt_sleepy.png",
     "cols": 4,
     "frames": 4,
     "fps": 3.0,
     "loop": true,
     "w": 231,
     "h": 210,
     "anchor": [
      142,
      206
     ],
     "rodTips": [
      [
       12.9,
       63.1
      ],
      [
       7.0,
       66.8
      ],
      [
       7.1,
       68.2
      ],
      [
       15.7,
       60.2
      ]
     ],
     "head": [
      27,
      -13
     ],
     "seq": [
      0,
      1,
      2,
      2,
      2,
      3
     ]
    },
    "shocked": {
     "image": "assets/poses/leafpelt_shocked.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 237,
     "h": 190,
     "anchor": [
      131,
      186
     ],
     "rodTips": [
      [
       7.1,
       33.4
      ],
      [
       15.8,
       16.0
      ],
      [
       11.0,
       45.1
      ],
      [
       8.9,
       33.3
      ]
     ],
     "head": [
      44,
      -3
     ]
    },
    "paddle": {
     "image": "assets/poses/leafpelt_paddle.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 237,
     "h": 228,
     "anchor": [
      142,
      224
     ],
     "rodTips": [
      [
       10.800000000000011,
       74.9
      ],
      [
       10.800000000000011,
       74.9
      ],
      [
       10.800000000000011,
       74.9
      ],
      [
       10.800000000000011,
       74.9
      ]
     ],
     "head": [
      37,
      -14
     ],
     "front": "assets/poses/leafpelt_paddlefront.png",
     "dips": [
      [
       17.4,
       210
      ],
      [
       120.3,
       217
      ],
      [
       199.1,
       217
      ],
      null
     ],
     "scale": 0.935
    }
   }
  },
  {
   "id": "haretail",
   "name": "Haretail",
   "clan": "WindClan",
   "rank": "Warrior",
   "perk": "Swift as wind",
   "perkText": "Rows the boat 40% faster",
   "mods": {
    "boat": 1.4
   },
   "image": "assets/cats/haretail.png",
   "poses": {
    "happy": {
     "image": "assets/poses/haretail_happy.png",
     "w": 304,
     "h": 208,
     "anchor": [
      170.5,
      200
     ],
     "rodTip": [
      25,
      44
     ]
    },
    "sad": {
     "image": "assets/poses/haretail_sad.png",
     "w": 296,
     "h": 191,
     "anchor": [
      170.5,
      183
     ],
     "rodTip": [
      18,
      31
     ]
    },
    "tired": {
     "image": "assets/poses/haretail_tired.png",
     "w": 295,
     "h": 205,
     "anchor": [
      159.5,
      198
     ],
     "rodTip": [
      22,
      39
     ]
    },
    "excited": {
     "image": "assets/poses/haretail_excited.png",
     "w": 289,
     "h": 263,
     "anchor": [
      164.5,
      207
     ],
     "rodTip": [
      21,
      39
     ]
    },
    "focused": {
     "image": "assets/poses/haretail_focused.png",
     "w": 301,
     "h": 206,
     "anchor": [
      167.5,
      198
     ],
     "rodTip": [
      21,
      44
     ]
    }
   },
   "anims": {
    "idle": {
     "image": "assets/poses/haretail_idle.png",
     "cols": 4,
     "frames": 4,
     "fps": 4,
     "loop": true,
     "w": 275,
     "h": 296,
     "anchor": [
      152,
      292
     ],
     "rodTips": [
      [
       7.8,
       152.7
      ],
      [
       7.8,
       152.8
      ],
      [
       6.8,
       153.8
      ],
      [
       7.6,
       152.8
      ]
     ],
     "head": [
      14,
      -15
     ],
     "seq": [
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      2,
      3
     ]
    },
    "fight": {
     "image": "assets/poses/haretail_fight.png",
     "cols": 4,
     "frames": 4,
     "fps": 8,
     "loop": true,
     "w": 275,
     "h": 296,
     "anchor": [
      152,
      292
     ],
     "rodTips": [
      [
       15.0,
       241.9
      ],
      [
       23.1,
       252.2
      ],
      [
       20.1,
       241.0
      ],
      [
       30.2,
       215.7
      ]
     ],
     "head": [
      31,
      -10
     ]
    },
    "catch": {
     "image": "assets/poses/haretail_catch.png",
     "cols": 4,
     "frames": 4,
     "fps": 6,
     "loop": false,
     "w": 275,
     "h": 296,
     "anchor": [
      152,
      292
     ],
     "rodTips": [
      [
       40.0,
       45.5
      ],
      [
       41.0,
       8.0
      ],
      [
       48.0,
       33.8
      ],
      [
       48.8,
       34.0
      ]
     ],
     "head": [
      23,
      -18
     ]
    },
    "sleepy": {
     "image": "assets/poses/haretail_sleepy.png",
     "cols": 4,
     "frames": 4,
     "fps": 3.0,
     "loop": true,
     "w": 243,
     "h": 221,
     "anchor": [
      150,
      217
     ],
     "rodTips": [
      [
       8.8,
       76.8
      ],
      [
       7.8,
       76.3
      ],
      [
       6.8,
       79.2
      ],
      [
       7.7,
       75.8
      ]
     ],
     "head": [
      9,
      -17
     ],
     "seq": [
      0,
      1,
      2,
      2,
      2,
      3
     ]
    },
    "shocked": {
     "image": "assets/poses/haretail_shocked.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 250,
     "h": 201,
     "anchor": [
      144,
      197
     ],
     "rodTips": [
      [
       8.7,
       44.2
      ],
      [
       12.9,
       44.7
      ],
      [
       6.8,
       42.2
      ],
      [
       10.7,
       44.7
      ]
     ],
     "head": [
      22,
      -2
     ]
    },
    "paddle": {
     "image": "assets/poses/haretail_paddle.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 253,
     "h": 252,
     "anchor": [
      145,
      248
     ],
     "rodTips": [
      [
       0.8000000000000114,
       108.69999999999999
      ],
      [
       0.8000000000000114,
       108.69999999999999
      ],
      [
       0.8000000000000114,
       108.69999999999999
      ],
      [
       0.8000000000000114,
       108.69999999999999
      ]
     ],
     "head": [
      14,
      -15
     ],
     "front": "assets/poses/haretail_paddlefront.png",
     "dips": [
      [
       19.2,
       235
      ],
      [
       115.6,
       243
      ],
      [
       188.0,
       243
      ],
      null
     ],
     "scale": 0.895
    }
   }
  },
  {
   "id": "eelfur",
   "name": "Eelfur",
   "clan": "RiverClan",
   "rank": "Deputy",
   "perk": "River-born",
   "perkText": "Fish notice the hook from farther away · thick mane: never freezes on the ice",
   "mods": {
    "notice": 1.5
   },
   "image": "assets/cats/eelfur.png",
   "poses": {
    "happy": {
     "image": "assets/poses/eelfur_happy.png",
     "w": 322,
     "h": 212,
     "anchor": [
      176.0,
      204
     ],
     "rodTip": [
      28,
      49
     ]
    },
    "sad": {
     "image": "assets/poses/eelfur_sad.png",
     "w": 294,
     "h": 196,
     "anchor": [
      168.0,
      188
     ],
     "rodTip": [
      18,
      32
     ]
    },
    "tired": {
     "image": "assets/poses/eelfur_tired.png",
     "w": 281,
     "h": 212,
     "anchor": [
      157.0,
      204
     ],
     "rodTip": [
      18,
      41
     ]
    },
    "excited": {
     "image": "assets/poses/eelfur_excited.png",
     "w": 294,
     "h": 211,
     "anchor": [
      167.0,
      203
     ],
     "rodTip": [
      36,
      43
     ]
    },
    "focused": {
     "image": "assets/poses/eelfur_focused.png",
     "w": 305,
     "h": 210,
     "anchor": [
      174.0,
      203
     ],
     "rodTip": [
      23,
      35
     ]
    }
   },
   "anims": {
    "idle": {
     "image": "assets/poses/eelfur_idle.png",
     "cols": 4,
     "frames": 4,
     "fps": 4,
     "loop": true,
     "w": 315,
     "h": 318,
     "anchor": [
      184,
      314
     ],
     "rodTips": [
      [
       10.0,
       134.2
      ],
      [
       10.9,
       134.8
      ],
      [
       10.8,
       135.0
      ],
      [
       10.0,
       134.2
      ]
     ],
     "head": [
      -28,
      -15
     ],
     "seq": [
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      2,
      3
     ]
    },
    "fight": {
     "image": "assets/poses/eelfur_fight.png",
     "cols": 4,
     "frames": 4,
     "fps": 8,
     "loop": true,
     "w": 315,
     "h": 318,
     "anchor": [
      184,
      314
     ],
     "rodTips": [
      [
       6.1,
       286.1
      ],
      [
       42.0,
       292.6
      ],
      [
       23.0,
       289.1
      ],
      [
       32.0,
       289.1
      ]
     ],
     "head": [
      40,
      -5
     ]
    },
    "catch": {
     "image": "assets/poses/eelfur_catch.png",
     "cols": 4,
     "frames": 4,
     "fps": 6,
     "loop": false,
     "w": 315,
     "h": 318,
     "anchor": [
      184,
      314
     ],
     "rodTips": [
      [
       19.0,
       79.6
      ],
      [
       25.8,
       10.1
      ],
      [
       12.1,
       10.5
      ],
      [
       27.0,
       9.9
      ]
     ],
     "head": [
      -7,
      -30
     ]
    },
    "sleepy": {
     "image": "assets/poses/eelfur_sleepy.png",
     "cols": 4,
     "frames": 4,
     "fps": 3.0,
     "loop": true,
     "w": 271,
     "h": 221,
     "anchor": [
      177,
      217
     ],
     "rodTips": [
      [
       7.8,
       32.7
      ],
      [
       7.8,
       30.7
      ],
      [
       6.8,
       31.4
      ],
      [
       10.0,
       30.4
      ]
     ],
     "head": [
      -20,
      -15
     ],
     "seq": [
      0,
      1,
      2,
      2,
      2,
      3
     ]
    },
    "shocked": {
     "image": "assets/poses/eelfur_shocked.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 287,
     "h": 229,
     "anchor": [
      173,
      225
     ],
     "rodTips": [
      [
       14.9,
       8.0
      ],
      [
       13.8,
       9.5
      ],
      [
       6.0,
       15.8
      ],
      [
       23.0,
       7.8
      ]
     ],
     "head": [
      15,
      -15
     ]
    },
    "paddle": {
     "image": "assets/poses/eelfur_paddle.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 287,
     "h": 256,
     "anchor": [
      156,
      248
     ],
     "rodTips": [
      [
       -18.0,
       68.19999999999999
      ],
      [
       -18.0,
       68.19999999999999
      ],
      [
       -18.0,
       68.19999999999999
      ],
      [
       -18.0,
       68.19999999999999
      ]
     ],
     "head": [
      -28,
      -15
     ],
     "front": "assets/poses/eelfur_paddlefront.png",
     "dips": [
      [
       33.7,
       241
      ],
      [
       122.5,
       246
      ],
      [
       176.2,
       245
      ],
      null
     ],
     "scale": 0.925
    }
   }
  },
  {
   "id": "squirrelstripe",
   "name": "Squirrelstripe",
   "clan": "RiverClan",
   "rank": "Deputy",
   "perk": "Long ears",
   "perkText": "Hears rare fish: Golden Koi appear 3× as often",
   "mods": {
    "rare": 3
   },
   "image": "assets/cats/squirrelstripe.png",
   "poses": {
    "happy": {
     "image": "assets/poses/squirrelstripe_happy.png",
     "w": 304,
     "h": 217,
     "anchor": [
      168.0,
      209
     ],
     "rodTip": [
      23,
      49
     ]
    },
    "sad": {
     "image": "assets/poses/squirrelstripe_sad.png",
     "w": 298,
     "h": 205,
     "anchor": [
      166.0,
      197
     ],
     "rodTip": [
      20,
      34
     ]
    },
    "tired": {
     "image": "assets/poses/squirrelstripe_tired.png",
     "w": 297,
     "h": 218,
     "anchor": [
      162.0,
      211
     ],
     "rodTip": [
      21,
      52
     ]
    },
    "excited": {
     "image": "assets/poses/squirrelstripe_excited.png",
     "w": 291,
     "h": 218,
     "anchor": [
      168.0,
      211
     ],
     "rodTip": [
      43,
      51
     ]
    },
    "focused": {
     "image": "assets/poses/squirrelstripe_focused.png",
     "w": 308,
     "h": 222,
     "anchor": [
      174.0,
      214
     ],
     "rodTip": [
      22,
      44
     ]
    }
   },
   "anims": {
    "idle": {
     "image": "assets/poses/squirrelstripe_idle.png",
     "cols": 4,
     "frames": 4,
     "fps": 4,
     "loop": true,
     "w": 279,
     "h": 291,
     "anchor": [
      151,
      287
     ],
     "rodTips": [
      [
       7.5,
       137.5
      ],
      [
       12.8,
       136.9
      ],
      [
       18.4,
       138.4
      ],
      [
       18.5,
       137.5
      ]
     ],
     "head": [
      10,
      -18
     ],
     "seq": [
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      2,
      3
     ]
    },
    "fight": {
     "image": "assets/poses/squirrelstripe_fight.png",
     "cols": 4,
     "frames": 4,
     "fps": 8,
     "loop": true,
     "w": 279,
     "h": 291,
     "anchor": [
      151,
      287
     ],
     "rodTips": [
      [
       14.0,
       223.5
      ],
      [
       43.1,
       250.7
      ],
      [
       36.0,
       232.3
      ],
      [
       20.9,
       196.0
      ]
     ],
     "head": [
      19,
      2
     ]
    },
    "catch": {
     "image": "assets/poses/squirrelstripe_catch.png",
     "cols": 4,
     "frames": 4,
     "fps": 6,
     "loop": false,
     "w": 279,
     "h": 291,
     "anchor": [
      151,
      287
     ],
     "rodTips": [
      [
       33.7,
       20.5
      ],
      [
       44.7,
       8.3
      ],
      [
       74.9,
       8.1
      ],
      [
       53.9,
       14.2
      ]
     ],
     "head": [
      21,
      -16
     ]
    },
    "sleepy": {
     "image": "assets/poses/squirrelstripe_sleepy.png",
     "cols": 4,
     "frames": 4,
     "fps": 3.0,
     "loop": true,
     "w": 228,
     "h": 231,
     "anchor": [
      133,
      227
     ],
     "rodTips": [
      [
       7.6,
       82.9
      ],
      [
       6.8,
       83.9
      ],
      [
       6.7,
       85.0
      ],
      [
       7.5,
       83.0
      ]
     ],
     "head": [
      -2,
      -8
     ],
     "seq": [
      0,
      1,
      2,
      2,
      2,
      3
     ]
    },
    "shocked": {
     "image": "assets/poses/squirrelstripe_shocked.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 247,
     "h": 207,
     "anchor": [
      136,
      203
     ],
     "rodTips": [
      [
       8.9,
       52.2
      ],
      [
       20.5,
       35.7
      ],
      [
       6.8,
       56.5
      ],
      [
       10.6,
       52.5
      ]
     ],
     "head": [
      10,
      1
     ]
    },
    "paddle": {
     "image": "assets/poses/squirrelstripe_paddle.png",
     "cols": 4,
     "frames": 4,
     "fps": 8.0,
     "loop": true,
     "w": 260,
     "h": 260,
     "anchor": [
      152,
      256
     ],
     "rodTips": [
      [
       8.5,
       106.5
      ],
      [
       8.5,
       106.5
      ],
      [
       8.5,
       106.5
      ],
      [
       8.5,
       106.5
      ]
     ],
     "head": [
      10,
      -18
     ],
     "front": "assets/poses/squirrelstripe_paddlefront.png",
     "dips": [
      [
       24.1,
       243
      ],
      [
       126.0,
       250
      ],
      [
       188.7,
       250
      ],
      null
     ],
     "scale": 0.94
    }
   }
  }
 ]
}
;
