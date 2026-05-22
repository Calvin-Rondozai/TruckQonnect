(function () {
  document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(btn.dataset.togglePassword);
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.querySelector('i')?.classList.toggle('bi-eye');
      btn.querySelector('i')?.classList.toggle('bi-eye-slash');
    });
  });

  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Signing in…';
    }
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 700);
  });

  document.getElementById('otpForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = 'dashboard.html';
  });

  document.getElementById('forgotForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Reset link sent (demo). Check reset-password.html');
    window.location.href = 'reset-password.html';
  });

  document.getElementById('resetForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = 'login.html';
  });

  document.getElementById('unlockForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = 'dashboard.html';
  });
})();
