import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const head = (title, charts = false) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — TruckQonnect Admin</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <link href="assets/css/style.css" rel="stylesheet">
  <link href="assets/css/animations.css" rel="stylesheet">
</head>
<body class="tq-admin-shell" data-page-title="${title}"${charts ? ' data-charts="analytics"' : ''}>
  <div class="tq-sidebar-overlay" id="sidebarOverlay"></div>
  <aside class="tq-sidebar" id="tqSidebar"></aside>
  <div class="tq-main">
    <header class="tq-topbar" id="tqTopbar"></header>
    <div class="tq-content">`;

const foot = (charts = false) => `
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  ${charts ? '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>' : ''}
  <script src="assets/js/mock-data.js"></script>
  <script src="assets/js/layout.js"></script>
  <script src="assets/js/sidebar.js"></script>
  <script src="assets/js/app.js"></script>
  <script src="assets/js/tables.js"></script>
  ${charts ? '<script src="assets/js/charts.js"></script>' : ''}
</body>
</html>`;

const header = (title, sub) => `
      <div class="tq-page-header tq-animate-in">
        <h1 class="tq-page-title">${title}</h1>
        <p class="tq-page-sub">${sub}</p>
      </div>`;

const pages = [
  {
    file: 'users.html',
    title: 'Users',
    sub: 'Manage cargo owners, drivers, and platform accounts',
    body: `
      <div class="tq-filter-bar">
        <input type="search" class="form-control" id="tableSearch" placeholder="Search users…" style="max-width:280px">
        <select class="form-select"><option>All roles</option><option>Cargo Owner</option><option>Driver</option></select>
        <select class="form-select"><option>All statuses</option><option>Active</option><option>Pending</option></select>
        <button class="btn btn-warning btn-sm fw-semibold text-dark ms-auto"><i class="bi bi-plus-lg"></i> Export</button>
      </div>
      <div class="tq-card">
        <div class="tq-table-wrap">
          <table class="tq-table" id="dataTable">
            <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr></thead>
            <tbody id="usersTableBody"></tbody>
          </table>
        </div>
      </div>`,
  },
  {
    file: 'drivers.html',
    title: 'Drivers',
    sub: 'Truck owners, verification, ratings, and earnings',
    body: `
      <div class="row g-3 mb-4">
        <div class="col-md-4"><div class="tq-kpi"><span class="tq-kpi-label">Total earnings (MTD)</span><div class="tq-kpi-value">$48.2k</div></div></div>
        <div class="col-md-4"><div class="tq-kpi"><span class="tq-kpi-label">Avg rating</span><div class="tq-kpi-value">4.78</div></div></div>
        <div class="col-md-4"><div class="tq-kpi"><span class="tq-kpi-label">On trip now</span><div class="tq-kpi-value">89</div></div></div>
      </div>
      <div class="tq-card">
        <div class="tq-card-header"><h3 class="tq-card-title">Driver registry</h3><button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#driverModal">View profile</button></div>
        <div class="tq-table-wrap"><table class="tq-table" id="dataTable"><thead><tr><th>ID</th><th>Driver</th><th>Truck</th><th>Rating</th><th>Trips</th><th>Earnings</th><th>Status</th><th></th></tr></thead><tbody id="driversBody"></tbody></table></div>
      </div>
      <div class="modal fade" id="driverModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Driver profile</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><p><strong>Tinashe Moyo</strong> · 4.9 ★ · Volvo 15T flatbed</p><p class="text-secondary small">Verified · 186 completed trips</p></div></div></div></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{const b=document.getElementById('driversBody');if(!b)return;b.innerHTML=TQMock.drivers.map(d=>'<tr><td><code>'+d.id+'</code></td><td><strong>'+d.name+'</strong></td><td>'+d.truck+'</td><td>'+d.rating+' ★</td><td>'+d.trips+'</td><td>$'+d.earnings.toLocaleString()+'</td><td>'+TQTables.statusBadge(d.status)+'</td><td><button class="btn btn-sm btn-outline-secondary">Actions</button></td></tr>').join('');TQTables.filterTable('tableSearch','dataTable');});`,
  },
  {
    file: 'cargo-owners.html',
    title: 'Cargo Owners',
    sub: 'Shippers posting loads and spend analytics',
    body: `
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table" id="dataTable"><thead><tr><th>ID</th><th>Name</th><th>Company</th><th>Loads</th><th>Spent</th><th>Rating</th><th>Status</th></tr></thead><tbody id="cargoBody"></tbody></table></div></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('cargoBody').innerHTML=TQMock.cargoOwners.map(c=>'<tr><td><code>'+c.id+'</code></td><td>'+c.name+'</td><td>'+c.company+'</td><td>'+c.loads+'</td><td>$'+c.spent.toLocaleString()+'</td><td>'+c.rating+'</td><td>'+TQTables.statusBadge(c.status)+'</td></tr>').join('');});`,
  },
  {
    file: 'loads.html',
    title: 'Loads',
    sub: 'Posted shipments, bids, and delivery status',
    body: `
      <div class="tq-filter-bar"><input type="search" class="form-control" id="tableSearch" placeholder="Search loads…" style="max-width:260px"><select class="form-select"><option>All statuses</option></select><button class="btn btn-warning btn-sm text-dark fw-semibold" data-bs-toggle="modal" data-bs-target="#loadModal">Load details</button></div>
      <div class="row g-3 mb-3" id="loadCards"></div>
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table" id="dataTable"><thead><tr><th>ID</th><th>Route</th><th>Cargo</th><th>Weight</th><th>Budget</th><th>Status</th><th>Posted</th></tr></thead><tbody id="loadsBody"></tbody></table></div></div>
      <div class="modal fade" id="loadModal"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Load L-9001</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><p>Harare, Workington → Bulawayo CBD · Building materials · 12 Ton</p><div class="tq-map-placeholder" style="min-height:160px"><i class="bi bi-map"></i> Route preview</div></div></div></div></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('loadsBody').innerHTML=TQMock.loads.map(l=>'<tr><td><code>'+l.id+'</code></td><td>'+l.route+'</td><td>'+l.cargo+'</td><td>'+l.weight+'</td><td>$'+l.budget+'</td><td>'+TQTables.statusBadge(l.status)+'</td><td>'+l.posted+'</td></tr>').join('');document.getElementById('loadCards').innerHTML=TQMock.loads.slice(0,3).map(l=>'<div class="col-md-4"><div class="tq-card tq-card-hover p-3"><div class="fw-bold">'+l.id+'</div><div class="text-secondary small">'+l.route+'</div><div class="mt-2">'+TQTables.statusBadge(l.status)+'</div></div></div>').join('');});`,
  },
  {
    file: 'trips.html',
    title: 'Trips',
    sub: 'Active deliveries, ETAs, and trip timelines',
    body: `
      <div class="row g-3" id="tripsGrid"></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('tripsGrid').innerHTML=TQMock.trips.map(t=>'<div class="col-lg-6"><div class="tq-card p-3"><div class="d-flex justify-content-between mb-2"><strong>'+t.id+'</strong>'+TQTables.statusBadge(t.status)+'</div><div class="text-secondary small">'+t.driver+' · '+t.route+'</div><div class="mt-3"><div class="d-flex justify-content-between small mb-1"><span>Progress</span><span>ETA '+t.eta+'</span></div><div class="progress" style="height:8px"><div class="progress-bar bg-warning" style="width:'+t.progress+'%"></div></div></div><div class="tq-timeline mt-3"><div class="tq-timeline-step done"><span class="small">En route to pickup</span></div><div class="tq-timeline-step done"><span class="small">In transit</span></div><div class="tq-timeline-step"><span class="small">Delivered</span></div></div><div class="tq-map-placeholder mt-3" style="min-height:100px;font-size:.8rem"><i class="bi bi-signpost-split"></i> Route preview</div></div></div>').join('');});`,
  },
  {
    file: 'tracking.html',
    title: 'Tracking',
    sub: 'Live fleet positions and delivery monitoring',
    body: `
      <div class="tq-card mb-3"><div class="tq-map-placeholder" style="min-height:420px"><i class="bi bi-geo-alt-fill fs-1 text-warning"></i><span>Live logistics map</span><small class="text-secondary">89 trucks reporting · Harare · Bulawayo · Mutare corridors</small></div></div>
      <div class="row g-3" id="truckCards"></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('truckCards').innerHTML=TQMock.trips.map(t=>'<div class="col-md-6"><div class="tq-card p-3 d-flex gap-3 align-items-center"><div class="tq-kpi-icon"><i class="bi bi-truck"></i></div><div><div class="fw-semibold">'+t.driver+'</div><div class="small text-secondary">'+t.route+' · '+t.eta+'</div>'+TQTables.statusBadge(t.status)+'</div></div></div>').join('');});`,
  },
  {
    file: 'payments.html',
    title: 'Payments',
    sub: 'Transactions, payouts, and refunds',
    body: `
      <div class="row g-3 mb-4"><div class="col-md-4"><div class="tq-kpi"><span class="tq-kpi-label">Revenue today</span><div class="tq-kpi-value">$12,840</div></div></div><div class="col-md-4"><div class="tq-kpi"><span class="tq-kpi-label">Pending payouts</span><div class="tq-kpi-value">$4,220</div></div></div><div class="col-md-4"><div class="tq-kpi"><span class="tq-kpi-label">Refunds</span><div class="tq-kpi-value">3</div></div></div></div>
      <div class="tq-card"><div class="tq-card-header"><h3 class="tq-card-title">Transactions</h3></div><div class="tq-table-wrap"><table class="tq-table"><thead><tr><th>ID</th><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody id="payBody"></tbody></table></div></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('payBody').innerHTML=TQMock.payments.map(p=>'<tr><td><code>'+p.id+'</code></td><td>'+p.user+'</td><td>'+p.type+'</td><td>$'+p.amount+'</td><td>'+TQTables.statusBadge(p.status)+'</td><td>'+p.date+'</td></tr>').join('');});`,
  },
  {
    file: 'reports.html',
    title: 'Reports',
    sub: 'Operational and financial report exports',
    body: `
      <div class="row g-3"><div class="col-md-4"><div class="tq-card p-4 tq-card-hover text-center"><i class="bi bi-file-earmark-pdf fs-2 text-warning"></i><h6 class="mt-2">Weekly operations</h6><button class="btn btn-sm btn-outline-secondary mt-2">Download</button></div></div><div class="col-md-4"><div class="tq-card p-4 tq-card-hover text-center"><i class="bi bi-graph-up fs-2 text-warning"></i><h6 class="mt-2">Revenue summary</h6><button class="btn btn-sm btn-outline-secondary mt-2">Generate</button></div></div><div class="col-md-4"><div class="tq-card p-4 tq-card-hover text-center"><i class="bi bi-people fs-2 text-warning"></i><h6 class="mt-2">User growth</h6><button class="btn btn-sm btn-outline-secondary mt-2">Export CSV</button></div></div></div>`,
  },
  {
    file: 'disputes.html',
    title: 'Disputes',
    sub: 'Complaints, evidence review, and resolutions',
    body: `
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table"><thead><tr><th>ID</th><th>Parties</th><th>Issue</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody id="dispBody"></tbody></table></div></div>
      <div class="modal fade" id="evidenceModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Evidence</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><div class="tq-map-placeholder" style="min-height:120px">Photos & chat logs placeholder</div></div></div></div></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('dispBody').innerHTML=TQMock.disputes.map(d=>'<tr><td><code>'+d.id+'</code></td><td>'+d.parties+'</td><td>'+d.issue+'</td><td>'+TQTables.statusBadge(d.priority)+'</td><td>'+TQTables.statusBadge(d.status)+'</td><td><button class="btn btn-sm btn-warning text-dark" data-bs-toggle="modal" data-bs-target="#evidenceModal">Review</button></td></tr>').join('');});`,
  },
  {
    file: 'analytics.html',
    title: 'Analytics',
    sub: 'Platform intelligence and performance metrics',
    charts: true,
    body: `
      <div class="row g-3 mb-4"><div class="col-lg-6"><div class="tq-card"><div class="tq-card-header"><h3 class="tq-card-title">User growth</h3></div><div class="tq-card-body"><div class="chart-container"><canvas id="chartUserGrowth"></canvas></div></div></div></div>
      <div class="col-lg-6"><div class="tq-card"><div class="tq-card-header"><h3 class="tq-card-title">Driver performance</h3></div><div class="tq-card-body"><div class="chart-container"><canvas id="chartDriverPerf"></canvas></div></div></div></div></div>
      <div class="tq-card"><div class="tq-card-header"><h3 class="tq-card-title">Platform metrics</h3></div><div class="tq-card-body"><div class="chart-container"><canvas id="chartPlatform"></canvas></div></div></div>`,
  },
  {
    file: 'notifications.html',
    title: 'Notifications',
    sub: 'Broadcasts, push campaigns, and history',
    body: `
      <div class="row g-3"><div class="col-lg-5"><div class="tq-card p-4"><h5 class="mb-3">Send broadcast</h5><input class="form-control mb-2" placeholder="Title"><textarea class="form-control mb-3" rows="3" placeholder="Message"></textarea><button class="tq-btn-primary" style="width:auto;padding:.5rem 1.5rem">Send push</button></div></div><div class="col-lg-7"><div class="tq-card"><div class="tq-card-header"><h3 class="tq-card-title">History</h3></div><div class="list-group list-group-flush"><div class="list-group-item bg-transparent border-secondary">System maintenance · May 18</div><div class="list-group-item bg-transparent border-secondary">New corridor: Mutare · May 15</div></div></div></div></div>`,
  },
  {
    file: 'reviews.html',
    title: 'Reviews',
    sub: 'Ratings, flagged content, and trust scores',
    body: `
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table"><thead><tr><th>From</th><th>To</th><th>Rating</th><th>Comment</th><th>Flag</th></tr></thead><tbody><tr><td>Rudo</td><td>Tinashe</td><td>5 ★</td><td>On time, professional</td><td>—</td></tr><tr><td>Chipo</td><td>Blessing</td><td>2 ★</td><td>Late pickup</td><td><span class="tq-badge tq-badge-danger">Flagged</span></td></tr></tbody></table></div></div>`,
  },
  {
    file: 'trucks.html',
    title: 'Trucks',
    sub: 'Fleet registry and capacity management',
    body: `
      <div class="row g-3" id="trucksGrid"></div>
      <div class="modal fade" id="truckModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Truck details</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><img src="https://images.unsplash.com/photo-1601584115929-48c62445b8f6?w=400" class="img-fluid rounded mb-3" alt=""><p>ABC 1234 ZW · Volvo flatbed · 15 Ton</p></div></div></div></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('trucksGrid').innerHTML=TQMock.trucks.map(t=>'<div class="col-md-6"><div class="tq-card p-3 tq-card-hover"><div class="d-flex justify-content-between"><strong>'+t.plate+'</strong>'+TQTables.statusBadge(t.status)+'</div><div class="small text-secondary">'+t.brand+' · '+t.type+' · '+t.capacity+'</div><div class="small mt-2">Driver: '+t.driver+'</div><button class="btn btn-sm btn-outline-secondary mt-2" data-bs-toggle="modal" data-bs-target="#truckModal">Details</button></div></div>').join('');});`,
  },
  {
    file: 'verification-center.html',
    title: 'Verification Center',
    sub: 'Document review and approval queue',
    body: `
      <div class="row g-3" id="verifyGrid"></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('verifyGrid').innerHTML=TQMock.verifications.map(v=>'<div class="col-md-6"><div class="tq-card p-3"><div class="fw-bold">'+v.name+'</div><div class="small text-secondary">'+v.doc+' · '+v.submitted+'</div><div class="mt-2">'+TQTables.statusBadge(v.status)+'</div><div class="d-flex gap-2 mt-3"><button class="btn btn-sm btn-success">Approve</button><button class="btn btn-sm btn-outline-danger">Reject</button><button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#docModal">Preview</button></div></div></div>').join('');});`,
  },
  {
    file: 'fraud-monitoring.html',
    title: 'Fraud Monitoring',
    sub: 'Risk signals and suspicious activity',
    body: `
      <div class="alert border-warning bg-warning bg-opacity-10 text-warning mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i>2 high-risk alerts require review</div>
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table"><thead><tr><th>ID</th><th>User</th><th>Risk</th><th>Reason</th><th>Time</th></tr></thead><tbody id="fraudBody"></tbody></table></div></div>`,
    extraScript: `document.addEventListener('DOMContentLoaded',()=>{document.getElementById('fraudBody').innerHTML=TQMock.fraudAlerts.map(f=>'<tr><td><code>'+f.id+'</code></td><td>'+f.user+'</td><td>'+TQTables.statusBadge(f.risk.toLowerCase())+'</td><td>'+f.reason+'</td><td>'+f.time+'</td></tr>').join('');});`,
  },
  {
    file: 'settings.html',
    title: 'Settings',
    sub: 'Branding, security, commissions, and platform config',
    body: `
      <div class="row g-3"><div class="col-lg-6"><div class="tq-card p-4"><h5>Branding</h5><label class="tq-form-label mt-2">Platform name</label><input class="tq-input" style="padding-left:1rem" value="TruckQonnect"><label class="tq-form-label mt-3">Primary color</label><input type="color" class="form-control form-control-color" value="#F9C600"></div></div>
      <div class="col-lg-6"><div class="tq-card p-4"><h5>Commissions</h5><label class="tq-form-label mt-2">Platform fee %</label><input class="tq-input" style="padding-left:1rem" value="8"><label class="tq-form-label mt-3">Driver payout delay (days)</label><input class="tq-input" style="padding-left:1rem" value="2"></div></div>
      <div class="col-12"><div class="tq-card p-4"><h5>Security</h5><div class="form-check form-switch"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Require 2FA for admins</label></div><div class="form-check form-switch mt-2"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Session timeout (30 min)</label></div></div></div></div>`,
  },
  {
    file: 'admin-management.html',
    title: 'Admin Management',
    sub: 'Roles, permissions, and team access',
    body: `
      <div class="d-flex justify-content-end mb-3"><button class="btn btn-warning text-dark fw-semibold" data-bs-toggle="modal" data-bs-target="#inviteModal"><i class="bi bi-person-plus"></i> Invite admin</button></div>
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Last active</th></tr></thead><tbody><tr><td>Calvin Admin</td><td>admin@truckqonnect.co.zw</td><td><span class="tq-badge tq-badge-warning">Super Admin</span></td><td>Now</td></tr><tr><td>Ops Lead</td><td>ops@truckqonnect.co.zw</td><td><span class="tq-badge tq-badge-info">Operations</span></td><td>2 hrs ago</td></tr></tbody></table></div></div>
      <div class="modal fade" id="inviteModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Invite admin</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><input class="tq-input mb-2" style="padding-left:1rem" placeholder="Email"><select class="form-select"><option>Operations</option><option>Finance</option><option>Support</option></select></div><div class="modal-footer"><button class="btn btn-warning text-dark">Send invite</button></div></div></div></div>`,
  },
  {
    file: 'system-logs.html',
    title: 'System Logs',
    sub: 'Audit trail, login history, and security events',
    body: `
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>IP</th></tr></thead><tbody><tr><td>May 20 10:02</td><td>Calvin Admin</td><td>Login success</td><td>196.*.*.12</td></tr><tr><td>May 20 09:44</td><td>System</td><td>Payout batch #882</td><td>—</td></tr><tr><td>May 20 08:12</td><td>Ops Lead</td><td>Approved verification V-12</td><td>41.*.*.88</td></tr></tbody></table></div></div>`,
  },
  {
    file: 'support-center.html',
    title: 'Support Center',
    sub: 'Tickets, FAQ, and customer assistance',
    body: `
      <div class="row g-3 mb-4"><div class="col-md-4"><div class="tq-card p-3 text-center tq-card-hover"><i class="bi bi-ticket-detailed fs-3 text-warning"></i><div class="fw-bold mt-2">24 open</div><div class="small text-secondary">Tickets</div></div></div><div class="col-md-4"><div class="tq-card p-3 text-center tq-card-hover"><i class="bi bi-chat-dots fs-3 text-warning"></i><div class="fw-bold mt-2">4.2h</div><div class="small text-secondary">Avg response</div></div></div><div class="col-md-4"><div class="tq-card p-3 text-center tq-card-hover"><i class="bi bi-patch-question fs-3 text-warning"></i><div class="fw-bold mt-2">18 articles</div><div class="small text-secondary">FAQ</div></div></div></div>
      <div class="tq-card"><div class="tq-table-wrap"><table class="tq-table"><thead><tr><th>Ticket</th><th>User</th><th>Subject</th><th>Status</th></tr></thead><tbody><tr><td>#T-441</td><td>Rudo</td><td>Payment not reflected</td><td><span class="tq-badge tq-badge-warning">Open</span></td></tr><tr><td>#T-440</td><td>Tinashe</td><td>App map issue</td><td><span class="tq-badge tq-badge-info">In progress</span></td></tr></tbody></table></div></div>`,
  },
];

for (const p of pages) {
  const html =
    head(p.title, p.charts) +
    header(p.title, p.sub) +
    p.body +
    foot(p.charts) +
    (p.extraScript ? `\n  <script>${p.extraScript}</script>` : '');
  fs.writeFileSync(path.join(root, p.file), html);
  console.log('Wrote', p.file);
}

// verification doc modal
const verify = fs.readFileSync(path.join(root, 'verification-center.html'), 'utf8');
if (!verify.includes('docModal')) {
  fs.writeFileSync(
    path.join(root, 'verification-center.html'),
    verify.replace('</body>', '<div class="modal fade" id="docModal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Document preview</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><div class="tq-map-placeholder" style="min-height:200px">ID / license scan</div></div></div></div></div></body>')
  );
}

console.log('Done.');
