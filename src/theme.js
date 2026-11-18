// Optional theme toggle. Dark is the default; light is opt-in and remembered.
(function () {
  var root = document.documentElement;
  var KEY = "theme";
  try {
    if (localStorage.getItem(KEY) === "light") root.setAttribute("data-theme", "light");
  } catch (e) {}

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    function sync() {
      btn.setAttribute("aria-pressed", current() === "dark" ? "true" : "false");
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", current() === "dark" ? "#05060b" : "#f2f2ee");
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
