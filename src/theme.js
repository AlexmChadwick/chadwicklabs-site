// Optional theme toggle. The default follows prefers-color-scheme.
(function () {
  var root = document.documentElement;
  var KEY = "theme";
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {}

  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    var label = btn.querySelector(".theme-toggle__label");
    function sync() {
      var now = current();
      btn.setAttribute("aria-pressed", now === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", "Colour theme, currently " + now);
      label.textContent = now === "dark" ? "Dark" : "Light";
    }
    btn.hidden = false;
    sync();
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      sync();
    });
  });
})();
