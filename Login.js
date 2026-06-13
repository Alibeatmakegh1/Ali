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

function hideErrorMessage(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
    element.classList.remove('show');
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

// ===== Password Toggle =====
function setupPasswordToggle(toggle, input) {
  if (!toggle || !input) return;
  
  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    toggle.classList.toggle('active');
  });
}

const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
if (togglePassword && passwordInput) {
  setupPasswordToggle(togglePassword, passwordInput);
}

// ===== Login Form Handler =====
const authForm = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const emailInput = document.querySelector('input[name="email"]');

if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showErrorMessage('errorMsg', 'Please fill in all fields');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
      // Add your authentication logic here
      // Example with Supabase:
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: email,
      //   password: password,
      // });
      
      // if (error) throw error;
      
      showSuccessMessage('successMsg', 'Login successful! Redirecting...');
      
      // Redirect after 1 second
      setTimeout(() => {
        // window.location.href = '/dashboard';
      }, 1000);

    } catch (error) {
      showErrorMessage('errorMsg', error.message || 'Login failed');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

// ===== Animate Title =====
setTimeout(() => {
  const title = document.getElementById('hackTitle');
  if (title) {
    title.innerHTML = 'LOGIN'
      .split('')
      .map((char, i) => `<span class="title-char" style="animation-delay: ${i * 0.06}s">${char}</span>`)
      .join('');
  }
}, 100);