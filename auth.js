/* ===== SwiftRoute Auth JS ===== */

// ── Toast ──────────────────────────────────────────────
function showToast(msg, type = 'info') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  const icons = { success: '✅', error: '❌', info: '💬' };
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || '💬'}</span><span>${msg}</span>`;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3600);
}

// ── Status Message ─────────────────────────────────────
function setStatus(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = `status-msg ${type}`;
}

// ── OTP Input Wiring ───────────────────────────────────
function wireOtpInputs(containerSelector) {
  const inputs = document.querySelectorAll(`${containerSelector} .otp-digit`);
  inputs.forEach((inp, i) => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && i > 0) {
        inputs[i - 1].focus();
        inputs[i - 1].classList.remove('filled');
      }
    });
    inp.addEventListener('input', e => {
      const v = e.target.value.replace(/\D/g, '').slice(-1);
      inp.value = v;
      inp.classList.toggle('filled', v !== '');
      if (v && i < inputs.length - 1) inputs[i + 1].focus();
    });
    inp.addEventListener('paste', e => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      [...text].forEach((ch, j) => {
        if (inputs[i + j]) {
          inputs[i + j].value = ch;
          inputs[i + j].classList.add('filled');
        }
      });
      const next = inputs[Math.min(i + text.length, inputs.length - 1)];
      if (next) next.focus();
    });
  });
}

// ── Get OTP Value ──────────────────────────────────────
function getOtpValue(containerSelector) {
  const inputs = document.querySelectorAll(`${containerSelector} .otp-digit`);
  return [...inputs].map(i => i.value).join('');
}

// ── Countdown Timer ────────────────────────────────────
function startCountdown(seconds, labelEl, spanEl, onDone) {
  let s = seconds;
  if (labelEl) labelEl.style.display = 'block';
  const tick = () => {
    if (!spanEl) return;
    spanEl.textContent = `Resend in ${s}s`;
    spanEl.className = 'inactive';
    if (s <= 0) {
      spanEl.textContent = 'Resend OTP';
      spanEl.className = '';
      if (onDone) onDone();
      return;
    }
    s--;
    setTimeout(tick, 1000);
  };
  tick();
}

// ── Email Validation ───────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ── Password Strength ──────────────────────────────────
function checkStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

function renderStrength(pw, barEl, labelEl) {
  if (!barEl) return;
  const segs = barEl.querySelectorAll('.strength-seg');
  const score = checkStrength(pw);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const cls = ['', 'w', 'w', 'm', 's'];
  segs.forEach((s, i) => {
    s.className = 'strength-seg';
    if (i < score) s.classList.add(cls[score]);
  });
  if (labelEl) labelEl.textContent = pw ? labels[score] : '';
}

// ── Simple OTP Mock (client-side demo) ─────────────────
// In production: replace with real backend / Supabase Auth
let _mockOtp = '';
function generateMockOtp() {
  _mockOtp = String(Math.floor(100000 + Math.random() * 900000));
  return _mockOtp;
}
function verifyMockOtp(code) {
  return code === _mockOtp;
}
