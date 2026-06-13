// ===== Utility Functions =====
function showErrorMessage(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = message;
    element.classList.remove('show');
    void element.offsetWidth;
    element.classList.add('show');
  }
}

function showSuccessMessage(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = message;
    element.classList.remove('show');
    void element.offsetWidth;
    element.classList.add('show');
  }
}

// ===== Theme Management =====
function setTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
  
  const icon = document.getElementById("themeBtn").querySelector('.toggle__icon');
  if (theme === 'light') {
    icon.textContent = '☀️';
  } else {
    icon.textContent = '🌙';
  }
}

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
});

document.getElementById("themeBtn").addEventListener('click', function() {
  const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

// ===== Handle Floating Labels =====
function setupFloatingLabel(input) {
  const label = input.closest('.styled-input').querySelector('.styled-input__label');
  
  if (!label) return;

  if (input.value.trim()) {
    label.classList.add('active');
  }

  input.addEventListener('focus', () => {
    label.classList.add('active');
  });

  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      label.classList.remove('active');
    }
  });

  input.addEventListener('input', () => {
    if (input.value.trim()) {
      label.classList.add('active');
    } else {
      label.classList.remove('active');
    }
  });
}

const allInputs = document.querySelectorAll('.styled-input__input');
allInputs.forEach(input => {
  setupFloatingLabel(input);
});

// ===== Reset Password Form Handler =====
const resetForm = document.getElementById('resetForm');
const resetBtn = document.getElementById('resetBtn');
const resetEmail = document.getElementById('resetEmail');

if (resetBtn) {
  resetBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = resetEmail.value.trim();

    if (!email) {
      showErrorMessage('resetErrorMsg', 'Please enter your email');
      return;
    }

    resetBtn.disabled = true;
    resetBtn.textContent = 'Sending...';

    try {
      // Add your password reset logic here
      // Example with Supabase:
      // const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: `${window.location.origin}/update-password`,
      // });
      
      // if (error) throw error;
      
      showSuccessMessage('resetSuccessMsg', 'Reset link sent to your email! Check your inbox.');
      
      setTimeout(() => {
        resetEmail.value = '';
      }, 2000);

    } catch (error) {
      showErrorMessage('resetErrorMsg', error.message || 'Failed to send reset link');
    } finally {
      resetBtn.disabled = false;
      resetBtn.textContent = 'Send Reset Link';
    }
  });
}

// ===== Animate Title =====
setTimeout(() => {
  const title = document.getElementById('hackTitle');
  if (title) {
    title.innerHTML = 'RESET'
      .split('')
      .map((char, i) => `<span class="title-char" style="animation-delay: ${i * 0.06}s">${char}</span>`)
      .join('');
  }
}, 100);