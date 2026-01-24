(function () {
  const toggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function isDark() {
    const saved = root.getAttribute("data-theme");
    if (saved) return saved === "dark";
    return prefersDark.matches;
  }

  function updateIcon() {
    toggle.classList.toggle("is-dark", isDark());
  }

  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
  updateIcon();

  toggle.addEventListener("click", function () {
    const newTheme = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon();
  });

  prefersDark.addEventListener("change", updateIcon);
})();
