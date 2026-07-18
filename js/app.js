/**
 * app.js — Find Words application logic
 * Fetches the word bank from the wordlist.js component and drives the
 * random word generator: filters, tile-flip reveal animation,
 * pronunciation, copy-to-clipboard, favorites, recent history,
 * FAQ accordion and scroll-reveal.
 */
(function () {
  "use strict";

  var STORAGE_FAVORITES = "findwords.favorites.v1";
  var STORAGE_SOUND = "findwords.sound.v1";

  var state = {
    bank: [],
    filtered: [],
    current: null,
    history: [],
    favorites: loadFavorites(),
    soundOn: loadSoundPref()
  };

  var els = {};

  document.addEventListener("DOMContentLoaded", function () {
    cacheEls();
    bindFilterEvents();
    bindActionEvents();
    bindFaq();
    bindScrollReveal();
    bindYear();

    var words = loadWordBank();
    if (!words.length) {
      showLoadError();
      return;
    }

    state.bank = words;
    applyFilters(false);
    renderFavorites();
    renderWordCard(pickRandom(state.filtered) || words[0], { silent: true });

    var statCount = document.getElementById("stat-count");
    if (statCount) statCount.textContent = words.length + "+";
  });

  function cacheEls() {
    els.card = document.getElementById("word-card");
    els.wordDisplay = document.getElementById("word-display");
    els.wordLen = document.getElementById("word-len");
    els.wordDiff = document.getElementById("word-diff");
    els.generateBtn = document.getElementById("generate-btn");
    els.speakBtn = document.getElementById("speak-btn");
    els.copyBtn = document.getElementById("copy-btn");
    els.favBtn = document.getElementById("fav-btn");
    els.soundBtn = document.getElementById("sound-btn");
    els.copyToast = document.getElementById("copy-toast");
    els.countLabel = document.getElementById("result-count");
    els.historyList = document.getElementById("history-list");
    els.favoritesList = document.getElementById("favorites-list");
    els.favoritesEmpty = document.getElementById("favorites-empty");
    els.lengthSelect = document.getElementById("filter-length");
    els.diffSelect = document.getElementById("filter-difficulty");
    els.letterSelect = document.getElementById("filter-letter");
  }

  /* ---------------------------- Word bank ---------------------------- */

  /**
   * Reads the word data component (js/wordlist.js), which exposes a flat
   * array of strings on window.WORDLIST, e.g. const WORDLIST = ["water", "words"].
   * Normalizes casing/whitespace and drops empty or duplicate entries.
   */
  function loadWordBank() {
    var raw = window.WORDLIST;
    if (!Array.isArray(raw)) return [];

    var seen = Object.create(null);
    var bank = [];
    raw.forEach(function (item) {
      if (typeof item !== "string") return;
      var word = item.trim().toLowerCase();
      if (!word || seen[word]) return;
      seen[word] = true;
      bank.push(word);
    });
    return bank;
  }

  /* ---------------------------- Filtering ---------------------------- */

  function classifyDifficulty(word) {
    if (word.length <= 5) return "easy";
    if (word.length <= 8) return "medium";
    return "hard";
  }

  function applyFilters(regenerate) {
    var lenVal = els.lengthSelect.value;
    var diffVal = els.diffSelect.value;
    var letterVal = els.letterSelect.value;

    state.filtered = state.bank.filter(function (word) {
      var difficulty = classifyDifficulty(word);

      if (diffVal !== "any" && difficulty !== diffVal) return false;
      if (letterVal !== "any" && word.charAt(0).toLowerCase() !== letterVal) return false;

      if (lenVal !== "any") {
        if (lenVal === "short" && !(word.length <= 5)) return false;
        if (lenVal === "medium" && !(word.length >= 6 && word.length <= 8)) return false;
        if (lenVal === "long" && !(word.length >= 9)) return false;
      }
      return true;
    });

    if (els.countLabel) {
      els.countLabel.textContent = state.filtered.length === 0
        ? "No words match these filters yet"
        : state.filtered.length + " word" + (state.filtered.length === 1 ? "" : "s") + " match your filters";
    }

    if (regenerate) {
      generateWord();
    }
  }

  function bindFilterEvents() {
    [els.lengthSelect, els.diffSelect, els.letterSelect].forEach(function (select) {
      if (select) select.addEventListener("change", function () { applyFilters(true); });
    });
  }

  /* ---------------------------- Generation ---------------------------- */

  function pickRandom(list) {
    if (!list || list.length === 0) return null;
    var i = Math.floor(Math.random() * list.length);
    return list[i];
  }

  function generateWord() {
    var pool = state.filtered.length ? state.filtered : state.bank;
    var word = pickRandom(pool);
    if (!word) {
      showLoadError();
      return;
    }
    renderWordCard(word);
    playTick();
  }

  function renderWordCard(word, opts) {
    opts = opts || {};
    if (!word) return;
    state.current = word;

    var difficulty = classifyDifficulty(word);

    // Tile-flip reveal: rebuild letter tiles and animate them in.
    els.wordDisplay.innerHTML = "";
    word.split("").forEach(function (letter, index) {
      var span = document.createElement("span");
      span.className = "letter-tile";
      span.style.animationDelay = (index * 0.05) + "s";
      span.textContent = letter;
      els.wordDisplay.appendChild(span);
    });

    els.wordLen.textContent = word.length + " letters";
    els.wordDiff.textContent = difficulty;
    els.wordDiff.className = "chip chip-diff chip-diff-" + difficulty;

    els.card.classList.remove("pop");
    // force reflow so the animation can restart on repeated clicks
    void els.card.offsetWidth;
    els.card.classList.add("pop");

    updateFavButton();

    if (!opts.silent) {
      pushHistory(word);
    }
  }

  function bindActionEvents() {
    if (els.generateBtn) els.generateBtn.addEventListener("click", generateWord);

    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        generateWord();
      }
    });

    if (els.speakBtn) {
      els.speakBtn.addEventListener("click", function () {
        speakCurrent();
      });
    }

    if (els.copyBtn) {
      els.copyBtn.addEventListener("click", function () {
        copyCurrent();
      });
    }

    if (els.favBtn) {
      els.favBtn.addEventListener("click", function () {
        toggleFavorite();
      });
    }

    if (els.soundBtn) {
      updateSoundButton();
      els.soundBtn.addEventListener("click", function () {
        state.soundOn = !state.soundOn;
        saveSoundPref(state.soundOn);
        updateSoundButton();
      });
    }
  }

  function speakCurrent() {
    if (!state.current) return;
    if (!("speechSynthesis" in window)) {
      flashToast(els.copyToast, "Pronunciation isn't supported in this browser");
      return;
    }
    var utter = new SpeechSynthesisUtterance(state.current);
    utter.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function copyCurrent() {
    if (!state.current) return;
    var word = state.current;
    var done = function () { flashToast(els.copyToast, "Copied \u201c" + word + "\u201d"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(word).then(done).catch(function () { fallbackCopy(word, done); });
    } else {
      fallbackCopy(word, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
    done();
  }

  function flashToast(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(el._timer);
    el._timer = setTimeout(function () {
      el.classList.remove("is-visible");
    }, 1800);
  }

  /* ---------------------------- History ---------------------------- */

  function pushHistory(word) {
    state.history.unshift(word);
    state.history = state.history.slice(0, 8);
    renderHistory();
  }

  function renderHistory() {
    if (!els.historyList) return;
    els.historyList.innerHTML = "";
    if (state.history.length === 0) {
      var li = document.createElement("li");
      li.className = "history-empty";
      li.textContent = "Your recent words will show up here.";
      els.historyList.appendChild(li);
      return;
    }
    state.history.forEach(function (word) {
      var li = document.createElement("li");
      li.className = "history-chip";
      li.textContent = word;
      li.addEventListener("click", function () { renderWordCard(word, { silent: true }); });
      els.historyList.appendChild(li);
    });
  }

  /* ---------------------------- Favorites ---------------------------- */

  function loadFavorites() {
    try {
      var raw = window.localStorage.getItem(STORAGE_FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveFavorites() {
    try {
      window.localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(state.favorites));
    } catch (e) { /* storage unavailable */ }
  }

  function toggleFavorite() {
    if (!state.current) return;
    var word = state.current;
    var idx = state.favorites.indexOf(word);
    if (idx > -1) {
      state.favorites.splice(idx, 1);
    } else {
      state.favorites.unshift(word);
      state.favorites = state.favorites.slice(0, 30);
    }
    saveFavorites();
    updateFavButton();
    renderFavorites();
  }

  function updateFavButton() {
    if (!els.favBtn || !state.current) return;
    var isFav = state.favorites.indexOf(state.current) > -1;
    els.favBtn.classList.toggle("is-active", isFav);
    els.favBtn.setAttribute("aria-pressed", isFav ? "true" : "false");
    els.favBtn.querySelector(".btn-label").textContent = isFav ? "Saved" : "Save word";
  }

  function renderFavorites() {
    if (!els.favoritesList) return;
    els.favoritesList.innerHTML = "";
    var hasFavs = state.favorites.length > 0;
    if (els.favoritesEmpty) els.favoritesEmpty.hidden = hasFavs;

    state.favorites.forEach(function (word) {
      var li = document.createElement("li");
      li.className = "favorite-chip";

      var wordBtn = document.createElement("button");
      wordBtn.type = "button";
      wordBtn.className = "favorite-word";
      wordBtn.textContent = word;
      wordBtn.addEventListener("click", function () { renderWordCard(word, { silent: true }); scrollToGenerator(); });

      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "favorite-remove";
      removeBtn.setAttribute("aria-label", "Remove " + word + " from saved words");
      removeBtn.textContent = "\u00d7";
      removeBtn.addEventListener("click", function () {
        state.favorites = state.favorites.filter(function (f) { return f !== word; });
        saveFavorites();
        updateFavButton();
        renderFavorites();
      });

      li.appendChild(wordBtn);
      li.appendChild(removeBtn);
      els.favoritesList.appendChild(li);
    });
  }

  function scrollToGenerator() {
    var target = document.getElementById("generator");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------------------- Sound ---------------------------- */

  function loadSoundPref() {
    try {
      var raw = window.localStorage.getItem(STORAGE_SOUND);
      return raw === null ? true : raw === "1";
    } catch (e) { return true; }
  }

  function saveSoundPref(val) {
    try { window.localStorage.setItem(STORAGE_SOUND, val ? "1" : "0"); } catch (e) { /* noop */ }
  }

  function updateSoundButton() {
    if (!els.soundBtn) return;
    els.soundBtn.classList.toggle("is-muted", !state.soundOn);
    els.soundBtn.setAttribute("aria-pressed", state.soundOn ? "true" : "false");
    els.soundBtn.setAttribute("aria-label", state.soundOn ? "Mute sound" : "Unmute sound");
  }

  var audioCtx = null;
  function playTick() {
    if (!state.soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(720, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(360, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { /* audio unavailable, ignore */ }
  }

  /* ---------------------------- FAQ ---------------------------- */

  function bindFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (other) {
          other.classList.remove("is-open");
          var q = other.querySelector(".faq-question");
          if (q) q.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------------------------- Scroll reveal ---------------------------- */

  function bindScrollReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (t) { observer.observe(t); });
  }

  function bindYear() {
    var el = document.getElementById("copyright-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function showLoadError() {
    if (els.wordDisplay) {
      els.wordDisplay.innerHTML = '<span class="letter-tile">!</span>';
    }
    if (els.countLabel) {
      els.countLabel.textContent = "Word data failed to load — please refresh the page.";
    }
  }
})();
