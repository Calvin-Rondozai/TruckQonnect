(function () {
  function initSidebar() {
    const sidebar = document.getElementById('tqSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar) return;

    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay?.classList.add('show');
    });

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });

    document.getElementById('sidebarCollapse')?.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem('tq-sidebar-collapsed', sidebar.classList.contains('collapsed'));
    });

    if (localStorage.getItem('tq-sidebar-collapsed') === 'true') {
      sidebar.classList.add('collapsed');
      document.body.classList.add('sidebar-collapsed');
    }
  }

  document.addEventListener('DOMContentLoaded', initSidebar);
  document.addEventListener('tq:layout-ready', initSidebar);
})();
