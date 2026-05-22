/**
 * Sidebar + topbar layout injection
 */
(function () {
  const LOGO = 'assets/images/logo.png.png';
  const MENU = [
    { section: 'Operations' },
    { href: 'dashboard.html', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { href: 'users.html', icon: 'bi-people-fill', label: 'Users' },
    { href: 'drivers.html', icon: 'bi-truck', label: 'Drivers' },
    { href: 'cargo-owners.html', icon: 'bi-box-seam-fill', label: 'Cargo Owners' },
    { href: 'loads.html', icon: 'bi-layers-fill', label: 'Loads' },
    { href: 'trips.html', icon: 'bi-signpost-split-fill', label: 'Trips' },
    { href: 'tracking.html', icon: 'bi-geo-alt-fill', label: 'Tracking' },
    { section: 'Finance' },
    { href: 'payments.html', icon: 'bi-wallet2', label: 'Payments' },
    { href: 'reports.html', icon: 'bi-file-earmark-bar-graph-fill', label: 'Reports' },
    { href: 'disputes.html', icon: 'bi-shield-exclamation', label: 'Disputes' },
    { href: 'analytics.html', icon: 'bi-graph-up-arrow', label: 'Analytics' },
    { section: 'Platform' },
    { href: 'notifications.html', icon: 'bi-bell-fill', label: 'Notifications' },
    { href: 'reviews.html', icon: 'bi-star-fill', label: 'Reviews' },
    { href: 'trucks.html', icon: 'bi-truck-front-fill', label: 'Trucks' },
    { href: 'verification-center.html', icon: 'bi-patch-check-fill', label: 'Verification Center' },
    { href: 'fraud-monitoring.html', icon: 'bi-radar', label: 'Fraud Monitoring' },
    { section: 'System' },
    { href: 'settings.html', icon: 'bi-gear-fill', label: 'Settings' },
    { href: 'admin-management.html', icon: 'bi-person-badge-fill', label: 'Admin Management' },
    { href: 'system-logs.html', icon: 'bi-journal-text', label: 'System Logs' },
    { href: 'support-center.html', icon: 'bi-headset', label: 'Support Center' },
  ];

  function currentPage() {
    const path = window.location.pathname.split('/').pop() || 'dashboard.html';
    return path;
  }

  window.TQLayout = {
    renderSidebar(container) {
      const page = currentPage();
      let nav = '';
      MENU.forEach((item) => {
        if (item.section) {
          nav += `<div class="tq-nav-section">${item.section}</div>`;
          return;
        }
        const active = page === item.href ? ' active' : '';
        nav += `<a class="tq-nav-link${active}" href="${item.href}"><i class="bi ${item.icon}"></i><span class="tq-nav-label">${item.label}</span></a>`;
      });

      container.innerHTML = `
        <div class="tq-sidebar-header">
          <a href="dashboard.html" class="tq-sidebar-brand text-decoration-none">
            <img src="${LOGO}" alt="TruckQonnect" onerror="this.style.display='none'">
            <span>Truck<span style="color:var(--tq-yellow)">Q</span>onnect</span>
          </a>
        </div>
        <nav class="tq-nav">${nav}</nav>
        <div class="p-3 border-top tq-sidebar-footer">
          <a href="login.html" class="tq-nav-link text-danger"><i class="bi bi-box-arrow-left"></i><span class="tq-nav-label">Sign out</span></a>
        </div>`;
    },

    renderTopbar(container, title) {
      container.innerHTML = `
        <button class="tq-icon-btn d-lg-none" type="button" id="sidebarToggle" aria-label="Menu"><i class="bi bi-list"></i></button>
        <button class="tq-icon-btn d-none d-lg-inline-flex" type="button" id="sidebarCollapse" aria-label="Collapse"><i class="bi bi-layout-sidebar"></i></button>
        <div class="tq-topbar-search d-none d-md-block">
          <i class="bi bi-search"></i>
          <input type="search" placeholder="Search users, loads, trips…" aria-label="Search">
        </div>
        <span class="tq-status-pill d-none d-sm-inline-flex"><span>Systems operational</span></span>
        <span class="tq-time-widget d-none d-xl-inline" id="liveClock">--:--</span>
        <div class="tq-topbar-actions">
          <a href="notifications.html" class="tq-icon-btn text-decoration-none"><i class="bi bi-bell"></i><span class="badge-dot"></span></a>
          <div class="dropdown">
            <button class="tq-icon-btn dropdown-toggle border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" alt="" class="tq-avatar" style="width:32px;height:32px;border-radius:8px">
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Calvin Admin</h6></li>
              <li><a class="dropdown-item" href="settings.html"><i class="bi bi-gear me-2"></i>Settings</a></li>
              <li><a class="dropdown-item" href="admin-management.html"><i class="bi bi-shield me-2"></i>Admins</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="login.html">Sign out</a></li>
            </ul>
          </div>
        </div>`;
    },

    init(pageTitle) {
      const sidebar = document.getElementById('tqSidebar');
      const topbar = document.getElementById('tqTopbar');
      if (sidebar) this.renderSidebar(sidebar);
      if (topbar) this.renderTopbar(topbar, pageTitle);
    },
  };
})();
