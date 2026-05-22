(function () {
  const KEY = 'tq-admin-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = theme === 'light' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(KEY) || 'dark';
    applyTheme(saved);

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      localStorage.setItem(KEY, next);
      applyTheme(next);
    });
  }

  document.addEventListener('DOMContentLoaded', initTheme);
  document.addEventListener('tq:layout-ready', initTheme);
})();
