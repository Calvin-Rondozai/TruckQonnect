(function () {
  function updateClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleString('en-ZW', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function initAdminShell() {
    if (!document.body.classList.contains('tq-admin-shell')) return;

    const title = document.body.dataset.pageTitle || 'Dashboard';
    if (window.TQLayout) {
      TQLayout.init(title);
      document.dispatchEvent(new Event('tq:layout-ready'));
    }

    updateClock();
    setInterval(updateClock, 1000);

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      new bootstrap.Tooltip(el);
    });
  }

  document.addEventListener('DOMContentLoaded', initAdminShell);
})();
