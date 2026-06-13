// ===== DOM Elements =====
const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regConfirmPassword = document.getElementById('regConfirmPassword');
const toggleRegPassword = document.getElementById('toggleRegPassword');
const toggleRegConfirmPassword = document.getElementById('toggleRegConfirmPassword');
const passwordRequirements = document.getElementById('passwordRequirements');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const errorMsg = document.getElementById('regErrorMsg');
const successMsg = document.getElementById('regSuccessMsg');
const themeBtn = document.getElementById('themeBtn');

// ===== Theme Management =====
function setTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
  
  const icon = themeBtn.querySelector('.toggle__icon');
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

themeBtn.addEventListener('click', function() {
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

[regName, regEmail, regPassword, regConfirmPassword].forEach(input => {
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

setupPasswordToggle(toggleRegPassword, regPassword);
setupPasswordToggle(toggleRegConfirmPassword, regConfirmPassword);

// ===== Password Requirements Configuration =====
const requirements = {
  length: {
    icon: document.getElementById('req-length-icon'),
    test: (pwd) => pwd.length >= 8,
    required: true
  },
  number: {
    icon: document.getElementById('req-number-icon'),
    test: (pwd) => /\d/.test(pwd),
    required: true
  },
  letter: {
    icon: document.getElementById('req-letter-icon'),
    test: (pwd) => /[a-z]/i.test(pwd),
    required: true
  },
  uppercase: {
    icon: document.getElementById('req-uppercase-icon'),
    test: (pwd) => /[A-Z]/.test(pwd),
    required: false
  },
  special: {
    icon: document.getElementById('req-special-icon'),
    test: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
    required: false
  }
};

// ===== Update Requirements Display =====
function updateRequirements(password) {
  let allRequired = true;
  
  Object.entries(requirements).forEach(([key, req]) => {
    if (!req.icon) return;
    
    const isMet = req.test(password);
    const item = req.icon.closest('.req-item');
    
    if (isMet) {
      item.classList.add('met');
      req.icon.textContent = '✓';
    } else {
      item.classList.remove('met');
      req.icon.textContent = '○';
      if (req.required) {
        allRequired = false;
      }
    }
  });
  
  return allRequired;
}

// ===== Calculate Password Strength =====
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?\":{}|<>]/.test(password)) score += 1;
  
  return score;
}

// ===== Update Password Strength Display =====
function updatePasswordStrength(password) {
  const score = calculatePasswordStrength(password);
  const percentage = (score / 6) * 100;
  
  let color = '#ff6b6b';
  let text = 'Very Weak';
  
  if (score >= 1) { color = '#ffa94d'; text = 'Weak'; }
  if (score >= 2) { color = '#74c0fc'; text = 'Medium'; }
  if (score >= 4) { color = '#4ade80'; text = 'Strong'; }
  if (score >= 5) { color = '#51cf66'; text = 'Very Strong'; }
  
  strengthBar.style.width = percentage + '%';
  strengthBar.style.background = `linear-gradient(90deg, #ff6b6b, #ffa94d, #74c0fc, ${color})`;
  strengthText.textContent = text;
  strengthText.style.color = color;
  
  updateRequirements(password);
}

// ===== Register Password Input Handler =====
regPassword.addEventListener('focus', function () {
  passwordRequirements.classList.add('show');
});

regPassword.addEventListener('blur', function () {
  if (!this.value && passwordRequirements) {
    passwordRequirements.classList.remove('show');
    Object.entries(requirements).forEach(([key, req]) => {
      if (!req.icon) return;
      const item = req.icon.closest('.req-item');
      item.classList.remove('met');
      req.icon.textContent = '○';
    });
  }
});

regPassword.addEventListener('input', function () {
  if (this.value) {
    updatePasswordStrength(this.value);
  } else {
    strengthBar.style.width = '0%';
    strengthText.textContent = '';
    
    Object.entries(requirements).forEach(([key, req]) => {
      if (!req.icon) return;
      const item = req.icon.closest('.req-item');
      item.classList.remove('met');
      req.icon.textContent = '○';
    });
  }
});

// ===== Show/Hide Messages =====
function showError(message) {
  errorMsg.innerHTML = message;
  errorMsg.classList.add('show');
  successMsg.classList.remove('show');
  // Scroll to error
  errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showSuccess(message) {
  successMsg.textContent = message;
  successMsg.classList.add('show');
  errorMsg.classList.remove('show');
}

function clearMessages() {
  errorMsg.classList.remove('show');
  errorMsg.innerHTML = '';
  successMsg.classList.remove('show');
  successMsg.textContent = '';
}

// ===== Form Validation =====
function validateForm() {
  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();
  const confirmPassword = regConfirmPassword.value.trim();

  if (!name) {
    showError('❌ Please enter your full name');
    return false;
  }

  if (!email) {
    showError('❌ Please enter your email');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('❌ Please enter a valid email address');
    return false;
  }

  if (!password) {
    showError('❌ Please enter a password');
    return false;
  }

  if (password.length < 8) {
    showError('❌ Password must be at least 8 characters');
    return false;
  }

  if (!/\d/.test(password)) {
    showError('❌ Password must contain at least one number (0-9)');
    return false;
  }

  if (!/[a-z]/i.test(password)) {
    showError('❌ Password must contain at least one letter (a-z)');
    return false;
  }

  if (!confirmPassword) {
    showError('❌ Please confirm your password');
    return false;
  }

  if (password !== confirmPassword) {
    showError('❌ Passwords do not match');
    return false;
  }

  const strength = calculatePasswordStrength(password);
  if (strength < 2) {
    showError('❌ Password is too weak. Use uppercase, numbers, or special characters');
    return false;
  }

  return true;
}

// ===== Form Submit =====
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  clearMessages();

  if (!validateForm()) {
    return;
  }

  const captchaResponse = hcaptcha.getResponse();
  if (!captchaResponse) {
    showError('❌ Please verify the captcha');
    return;
  }

  registerBtn.disabled = true;
  registerBtn.innerHTML = '<span class="button-text">Creating Account...</span>';

  try {
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    // Add your registration logic here
    // Example with Supabase:
    // const { data, error } = await supabase.auth.signUp({
    //   email: email,
    //   password: password,
    //   options: {
    //     data: {
    //       full_name: name
    //     }
    //   }
    // });
    
    // if (error) throw error;

    showSuccess('✓ Account created successfully! Redirecting to login...');

    setTimeout(() => {
      window.location.href = '../Login/Login.html';
    }, 2000);

  } catch (error) {
    const errorMessage = error.message || 'Registration failed. Please try again.';
    showError('❌ ' + errorMessage);
    console.error('Registration error:', error);
  } finally {
    registerBtn.disabled = false;
    registerBtn.innerHTML = '<span class="button-text">Create Account</span>';
    hcaptcha.reset();
  }
});

// ===== Animate Title =====
setTimeout(() => {
  const title = document.querySelector('.form__title');
  if (title) {
    title.innerHTML = 'REGISTER'
      .split('')
      .map((char, i) => `<span class="title-char" style="animation-delay: ${i * 0.06}s">${char}</span>`)
      .join('');
  }
}, 100);