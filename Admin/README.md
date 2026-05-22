# TruckQonnect Admin Dashboard

Premium logistics operations console — **frontend only** (mock data).

## Quick start

```bash
cd admin
npx serve .
# or open login.html directly in Chrome/Edge
```

1. Open **http://localhost:3000/login.html** (or `login.html` from disk)
2. Sign in with any credentials → **dashboard.html**
3. Use the sidebar to explore all modules

## Stack

- HTML5 + CSS3 (custom design system)
- Bootstrap 5.3 + Bootstrap Icons
- Chart.js 4
- Vanilla JavaScript modules in `assets/js/`

## Features

- Collapsible light sidebar · live clock · system status
- KPI dashboard with charts, activity feed, and map placeholder
- Searchable tables, modals, verification queues, fraud alerts
- Split-screen auth with animated hero panel

## File map

| Path | Role |
|------|------|
| `login.html` | Entry point |
| `dashboard.html` | Operations overview |
| `assets/css/style.css` | Design tokens & layout |
| `assets/css/animations.css` | Motion |
| `assets/js/layout.js` | Sidebar & topbar |
| `assets/js/mock-data.js` | Zimbabwe logistics mock data |

Logo: `assets/images/logo.png.jpeg` (bundled with the admin site in `Admin/assets/images/`).
