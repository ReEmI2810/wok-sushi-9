(function () {
  const STORAGE_KEY = 'A11Y_PREFS_V1';
  const $html = document.documentElement;

  const defaults = {
    contrast: false,
    underlineLinks: false,
    fontScale: 1,       // 1 = רגיל
    focusOutline: false // מסגרת צהובה רק בפוקוס (נפרד מניגודיות)
  };

  function load() {
    try {
      return Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch (e) {
      return { ...defaults };
    }
  }

  function save(prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }

  function apply(prefs) {
    // כיתות
    toggleClass('a11y-contrast', !!prefs.contrast);
    toggleClass('a11y-underline-links', !!prefs.underlineLinks);

    // סקייל טקסט
    $html.style.setProperty('--a11y-font-scale', clamp(prefs.fontScale, 0.8, 1.6));

    // קווי פוקוס צהובים בלבד
    if (prefs.focusOutline) {
      $html.style.setProperty('--a11y-focus-outline', '3px solid #FFD400');
    } else {
      $html.style.setProperty('--a11y-focus-outline', 'none');
    }

    function toggleClass(cls, on) {
      $html.classList.toggle(cls, !!on);
    }
    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }
  }

  const prefs = load();
  apply(prefs);

  // חשיפה לשימוש מ-accessibility.html
  window.A11Y = {
    get: () => ({ ...prefs }),
    set: (key, val) => {
      if (!(key in prefs)) return;
      prefs[key] = val;
      save(prefs);
      apply(prefs);
    },
    incFont: (step = 0.05) => {
      prefs.fontScale = +(prefs.fontScale + step).toFixed(2);
      save(prefs);
      apply(prefs);
    },
    decFont: (step = 0.05) => {
      prefs.fontScale = +(prefs.fontScale - step).toFixed(2);
      save(prefs);
      apply(prefs);
    },
    resetFont: () => {
      prefs.fontScale = 1;
      save(prefs);
      apply(prefs);
    }
  };
})();
