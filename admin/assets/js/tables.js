(function () {
  const statusBadge = (s) => {
    const map = {
      active: 'success',
      completed: 'success',
      on_trip: 'warning',
      in_transit: 'warning',
      open: 'info',
      pending: 'warning',
      suspended: 'danger',
      investigating: 'warning',
      available: 'success',
      assigned: 'info',
      processing: 'info',
      high: 'danger',
      medium: 'warning',
    };
    const tone = map[s] || 'muted';
    const label = String(s).replace(/_/g, ' ');
    return `<span class="tq-badge tq-badge-${tone}">${label}</span>`;
  };

  window.TQTables = {
    statusBadge,
    renderUsers(tbody) {
      if (!tbody || !window.TQMock) return;
      tbody.innerHTML = TQMock.users
        .map(
          (u) => `
        <tr>
          <td><code>${u.id}</code></td>
          <td><div class="tq-user-cell"><img class="tq-avatar" src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}" alt=""><strong>${u.name}</strong></div></td>
          <td>${u.phone}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>${statusBadge(u.status)}</td>
          <td>${u.joined}</td>
          <td><div class="dropdown"><button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Actions</button><ul class="dropdown-menu"><li><a class="dropdown-item" href="#">View</a></li><li><a class="dropdown-item" href="#">Suspend</a></li></ul></div></td>
        </tr>`
        )
        .join('');
    },
    filterTable(inputId, tableId) {
      const input = document.getElementById(inputId);
      const table = document.getElementById(tableId);
      if (!input || !table) return;
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        table.querySelectorAll('tbody tr').forEach((row) => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    TQTables.renderUsers(document.getElementById('usersTableBody'));
    TQTables.filterTable('tableSearch', 'dataTable');
  });
})();
