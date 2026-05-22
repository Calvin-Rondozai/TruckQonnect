(function () {
  const gridColor = 'rgba(161, 161, 170, 0.15)';
  const yellow = '#F9C600';
  const textColor = '#a1a1aa';

  function baseOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Inter' } } },
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor } },
      },
    };
  }

  window.TQCharts = {
    initDashboard() {
      const rev = document.getElementById('chartRevenue');
      if (rev) {
        new Chart(rev, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue (USD)',
              data: [42, 58, 71, 89, 112, 128],
              borderColor: yellow,
              backgroundColor: 'rgba(249, 198, 0, 0.12)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            }],
          },
          options: baseOptions(),
        });
      }

      const del = document.getElementById('chartDeliveries');
      if (del) {
        new Chart(del, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Deliveries',
              data: [42, 38, 55, 48, 62, 28, 19],
              backgroundColor: yellow,
              borderRadius: 8,
            }],
          },
          options: { ...baseOptions(), plugins: { legend: { display: false } } },
        });
      }

      const growth = document.getElementById('chartUserGrowth');
      if (growth) {
        new Chart(growth, {
          type: 'line',
          data: {
            labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
            datasets: [
              { label: 'Cargo owners', data: [120, 145, 168, 190, 210, 238], borderColor: '#3b82f6', tension: 0.35 },
              { label: 'Drivers', data: [80, 95, 110, 128, 142, 165], borderColor: yellow, tension: 0.35 },
            ],
          },
          options: baseOptions(),
        });
      }

      const perf = document.getElementById('chartDriverPerf');
      if (perf) {
        new Chart(perf, {
          type: 'doughnut',
          data: {
            labels: ['On-time', 'Delayed', 'Cancelled'],
            datasets: [{ data: [78, 15, 7], backgroundColor: [yellow, '#3b82f6', '#ef4444'], borderWidth: 0 }],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } },
        });
      }

      const platform = document.getElementById('chartPlatform');
      if (platform) {
        new Chart(platform, {
          type: 'bar',
          data: {
            labels: ['Loads', 'Trips', 'Payouts', 'Disputes'],
            datasets: [{ label: 'This month', data: [420, 380, 310, 12], backgroundColor: ['#F9C600', '#22c55e', '#3b82f6', '#ef4444'], borderRadius: 6 }],
          },
          options: { ...baseOptions(), indexAxis: 'y', plugins: { legend: { display: false } } },
        });
      }
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    const hasChart = document.querySelector('canvas[id^="chart"]');
    if (hasChart) TQCharts.initDashboard();
  });
})();
