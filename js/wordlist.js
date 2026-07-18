/**
 * wordlist.js
 * ------------------------------------------------------------------
 * Data component for Find Words — Random English Word Generator.
 * Exposes a static in-browser English word bank that the generator
 * (js/app.js) fetches from at runtime. Kept as a plain global so the
 * site runs from a static file host (GitHub Pages) with zero build
 * step and zero network requests.
 *
 * Shape: { w: "word", t: "noun|verb|adjective|adverb" }
 * Difficulty (easy/medium/hard) and starting letter are derived from
 * the word itself at runtime — see getWordBank() / classifyDifficulty()
 * in app.js — so this file only has to carry the raw words.
 * ------------------------------------------------------------------
 */

(function (global) {
  "use strict";

  var WORDS = [
    // A
    { w: "apple", t: "noun" }, { w: "arrow", t: "noun" }, { w: "amber", t: "adjective" },
    { w: "avid", t: "adjective" }, { w: "ask", t: "verb" }, { w: "achieve", t: "verb" },
    { w: "anchor", t: "noun" }, { w: "ancient", t: "adjective" }, { w: "amuse", t: "verb" },
    { w: "abrupt", t: "adjective" }, { w: "acorn", t: "noun" }, { w: "author", t: "noun" },
    { w: "awkward", t: "adjective" }, { w: "absolute", t: "adjective" }, { w: "adventure", t: "noun" },
    { w: "always", t: "adverb" }, { w: "already", t: "adverb" }, { w: "align", t: "verb" },

    // B
    { w: "breeze", t: "noun" }, { w: "bold", t: "adjective" }, { w: "build", t: "verb" },
    { w: "bright", t: "adjective" }, { w: "basket", t: "noun" }, { w: "beacon", t: "noun" },
    { w: "blend", t: "verb" }, { w: "brave", t: "adjective" }, { w: "burrow", t: "noun" },
    { w: "bounce", t: "verb" }, { w: "boundary", t: "noun" }, { w: "briefly", t: "adverb" },
    { w: "butterfly", t: "noun" }, { w: "blossom", t: "noun" }, { w: "bicycle", t: "noun" },
    { w: "brilliant", t: "adjective" }, { w: "badge", t: "noun" }, { w: "barely", t: "adverb" },

    // C
    { w: "candle", t: "noun" }, { w: "clever", t: "adjective" }, { w: "climb", t: "verb" },
    { w: "coral", t: "noun" }, { w: "curious", t: "adjective" }, { w: "compass", t: "noun" },
    { w: "create", t: "verb" }, { w: "crisp", t: "adjective" }, { w: "cabin", t: "noun" },
    { w: "cascade", t: "noun" }, { w: "cheerful", t: "adjective" }, { w: "carefully", t: "adverb" },
    { w: "century", t: "noun" }, { w: "collide", t: "verb" }, { w: "constant", t: "adjective" },
    { w: "canyon", t: "noun" }, { w: "chuckle", t: "verb" }, { w: "crimson", t: "adjective" },

    // D
    { w: "dawn", t: "noun" }, { w: "dizzy", t: "adjective" }, { w: "drift", t: "verb" },
    { w: "delta", t: "noun" }, { w: "dazzle", t: "verb" }, { w: "distant", t: "adjective" },
    { w: "denim", t: "noun" }, { w: "doubt", t: "verb" }, { w: "durable", t: "adjective" },
    { w: "daringly", t: "adverb" }, { w: "dolphin", t: "noun" }, { w: "delicate", t: "adjective" },
    { w: "discover", t: "verb" }, { w: "destiny", t: "noun" }, { w: "drowsy", t: "adjective" },

    // E
    { w: "ember", t: "noun" }, { w: "eager", t: "adjective" }, { w: "echo", t: "noun" },
    { w: "explore", t: "verb" }, { w: "elegant", t: "adjective" }, { w: "endure", t: "verb" },
    { w: "eclipse", t: "noun" }, { w: "eventually", t: "adverb" }, { w: "energy", t: "noun" },
    { w: "enormous", t: "adjective" }, { w: "escape", t: "verb" }, { w: "easily", t: "adverb" },
    { w: "empire", t: "noun" }, { w: "exact", t: "adjective" },

    // F
    { w: "feather", t: "noun" }, { w: "fierce", t: "adjective" }, { w: "flicker", t: "verb" },
    { w: "forest", t: "noun" }, { w: "fragile", t: "adjective" }, { w: "float", t: "verb" },
    { w: "fable", t: "noun" }, { w: "frosty", t: "adjective" }, { w: "fumble", t: "verb" },
    { w: "freedom", t: "noun" }, { w: "fondly", t: "adverb" }, { w: "fountain", t: "noun" },
    { w: "furious", t: "adjective" }, { w: "flourish", t: "verb" }, { w: "frequent", t: "adjective" },

    // G
    { w: "galaxy", t: "noun" }, { w: "gentle", t: "adjective" }, { w: "glimmer", t: "verb" },
    { w: "garden", t: "noun" }, { w: "genuine", t: "adjective" }, { w: "gather", t: "verb" },
    { w: "glacier", t: "noun" }, { w: "gradually", t: "adverb" }, { w: "grateful", t: "adjective" },
    { w: "gravity", t: "noun" }, { w: "glide", t: "verb" }, { w: "golden", t: "adjective" },
    { w: "grumble", t: "verb" }, { w: "gigantic", t: "adjective" },

    // H
    { w: "harbor", t: "noun" }, { w: "hollow", t: "adjective" }, { w: "hover", t: "verb" },
    { w: "horizon", t: "noun" }, { w: "humble", t: "adjective" }, { w: "hurry", t: "verb" },
    { w: "habit", t: "noun" }, { w: "hazy", t: "adjective" }, { w: "hastily", t: "adverb" },
    { w: "harmony", t: "noun" }, { w: "honest", t: "adjective" }, { w: "hesitate", t: "verb" },
    { w: "history", t: "noun" }, { w: "huge", t: "adjective" },

    // I
    { w: "island", t: "noun" }, { w: "ideal", t: "adjective" }, { w: "imagine", t: "verb" },
    { w: "ivory", t: "noun" }, { w: "instant", t: "adjective" }, { w: "inspire", t: "verb" },
    { w: "icicle", t: "noun" }, { w: "immense", t: "adjective" }, { w: "instantly", t: "adverb" },
    { w: "insight", t: "noun" }, { w: "invent", t: "verb" }, { w: "intricate", t: "adjective" },

    // J
    { w: "journey", t: "noun" }, { w: "jolly", t: "adjective" }, { w: "juggle", t: "verb" },
    { w: "jungle", t: "noun" }, { w: "joyful", t: "adjective" }, { w: "jostle", t: "verb" },
    { w: "jasmine", t: "noun" }, { w: "jagged", t: "adjective" },

    // K
    { w: "kettle", t: "noun" }, { w: "keen", t: "adjective" }, { w: "kindle", t: "verb" },
    { w: "kingdom", t: "noun" }, { w: "kindly", t: "adverb" }, { w: "knapsack", t: "noun" },

    // L
    { w: "lantern", t: "noun" }, { w: "lively", t: "adjective" }, { w: "linger", t: "verb" },
    { w: "legacy", t: "noun" }, { w: "lucid", t: "adjective" }, { w: "launch", t: "verb" },
    { w: "labyrinth", t: "noun" }, { w: "loyal", t: "adjective" }, { w: "loosely", t: "adverb" },
    { w: "lagoon", t: "noun" }, { w: "lighten", t: "verb" }, { w: "luminous", t: "adjective" },

    // M
    { w: "meadow", t: "noun" }, { w: "mellow", t: "adjective" }, { w: "murmur", t: "verb" },
    { w: "mystery", t: "noun" }, { w: "modest", t: "adjective" }, { w: "migrate", t: "verb" },
    { w: "mountain", t: "noun" }, { w: "mighty", t: "adjective" }, { w: "mostly", t: "adverb" },
    { w: "marble", t: "noun" }, { w: "mingle", t: "verb" }, { w: "magnetic", t: "adjective" },

    // N
    { w: "nectar", t: "noun" }, { w: "narrow", t: "adjective" }, { w: "nestle", t: "verb" },
    { w: "nebula", t: "noun" }, { w: "noble", t: "adjective" }, { w: "notice", t: "verb" },
    { w: "nurture", t: "verb" }, { w: "nimble", t: "adjective" }, { w: "nearly", t: "adverb" },

    // O
    { w: "oasis", t: "noun" }, { w: "opaque", t: "adjective" }, { w: "observe", t: "verb" },
    { w: "orchard", t: "noun" }, { w: "orbit", t: "noun" }, { w: "obvious", t: "adjective" },
    { w: "occasionally", t: "adverb" }, { w: "outline", t: "verb" }, { w: "ordinary", t: "adjective" },

    // P
    { w: "pebble", t: "noun" }, { w: "playful", t: "adjective" }, { w: "ponder", t: "verb" },
    { w: "prairie", t: "noun" }, { w: "patient", t: "adjective" }, { w: "polish", t: "verb" },
    { w: "puzzle", t: "noun" }, { w: "peculiar", t: "adjective" }, { w: "promptly", t: "adverb" },
    { w: "pinnacle", t: "noun" }, { w: "ponder", t: "verb" }, { w: "prosper", t: "verb" },

    // Q
    { w: "quartz", t: "noun" }, { w: "quiet", t: "adjective" }, { w: "quiver", t: "verb" },
    { w: "quest", t: "noun" }, { w: "quaint", t: "adjective" }, { w: "quickly", t: "adverb" },

    // R
    { w: "ripple", t: "noun" }, { w: "radiant", t: "adjective" }, { w: "roam", t: "verb" },
    { w: "riddle", t: "noun" }, { w: "rustic", t: "adjective" }, { w: "rescue", t: "verb" },
    { w: "rhythm", t: "noun" }, { w: "rigid", t: "adjective" }, { w: "rarely", t: "adverb" },
    { w: "reservoir", t: "noun" }, { w: "restore", t: "verb" }, { w: "resilient", t: "adjective" },

    // S
    { w: "shadow", t: "noun" }, { w: "serene", t: "adjective" }, { w: "sparkle", t: "verb" },
    { w: "summit", t: "noun" }, { w: "steady", t: "adjective" }, { w: "shelter", t: "verb" },
    { w: "silhouette", t: "noun" }, { w: "spontaneous", t: "adjective" }, { w: "silently", t: "adverb" },
    { w: "solstice", t: "noun" }, { w: "soothe", t: "verb" }, { w: "sturdy", t: "adjective" },
    { w: "sanctuary", t: "noun" }, { w: "scatter", t: "verb" },

    // T
    { w: "thunder", t: "noun" }, { w: "tender", t: "adjective" }, { w: "tumble", t: "verb" },
    { w: "treasure", t: "noun" }, { w: "tranquil", t: "adjective" }, { w: "travel", t: "verb" },
    { w: "twilight", t: "noun" }, { w: "thorough", t: "adjective" }, { w: "truly", t: "adverb" },
    { w: "tapestry", t: "noun" }, { w: "tangle", t: "verb" }, { w: "timid", t: "adjective" },

    // U
    { w: "umbrella", t: "noun" }, { w: "unique", t: "adjective" }, { w: "unfold", t: "verb" },
    { w: "utopia", t: "noun" }, { w: "urgent", t: "adjective" }, { w: "unravel", t: "verb" },
    { w: "usually", t: "adverb" }, { w: "unwind", t: "verb" }, { w: "upright", t: "adjective" },

    // V
    { w: "valley", t: "noun" }, { w: "vivid", t: "adjective" }, { w: "vanish", t: "verb" },
    { w: "voyage", t: "noun" }, { w: "vast", t: "adjective" }, { w: "venture", t: "verb" },
    { w: "velvet", t: "noun" }, { w: "verdant", t: "adjective" }, { w: "vaguely", t: "adverb" },

    // W
    { w: "whisper", t: "verb" }, { w: "wander", t: "verb" }, { w: "wistful", t: "adjective" },
    { w: "waterfall", t: "noun" }, { w: "wholesome", t: "adjective" }, { w: "wisdom", t: "noun" },
    { w: "wildflower", t: "noun" }, { w: "warmly", t: "adverb" }, { w: "wobble", t: "verb" },
    { w: "wilderness", t: "noun" },

    // X / rare starters
    { w: "xylophone", t: "noun" },

    // Y
    { w: "yearn", t: "verb" }, { w: "youthful", t: "adjective" }, { w: "yonder", t: "adverb" },
    { w: "yield", t: "verb" }, { w: "yearly", t: "adverb" },

    // Z
    { w: "zephyr", t: "noun" }, { w: "zealous", t: "adjective" }, { w: "zigzag", t: "verb" },
    { w: "zenith", t: "noun" }, { w: "zesty", t: "adjective" }
  ];

  /**
   * getWordBank
   * Returns the full word bank. Mimics an async data-fetch signature
   * (Promise) so the app can later be pointed at a real API or a
   * larger remote wordlist.json without changing call sites.
   */
  function getWordBank() {
    return Promise.resolve(WORDS);
  }

  global.WordListComponent = {
    getWordBank: getWordBank,
    count: WORDS.length
  };
})(window);
