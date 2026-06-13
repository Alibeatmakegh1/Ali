const supabaseUrl = "https://jitswbdnbpjluoiupntx.supabase.co";
const supabaseKey = "sb_publishable_6cEG1PMf2PRgIPoIz7TxQQ_HOT_mKab";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

console.log("✅ CHANGE PASSWORD PAGE CONNECTED TO SUPABASE");



async function checkResetSession() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  console.log("SESSION:", session);

  if (!session) {
    alert("❌ لینک تغییر پسورد نامعتبر یا منقضی شده");
  } else {
    console.log("✅ RESET SESSION FOUND");
  }
}

checkResetSession();




// ===== DOM Elements =====
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePassword1 = document.getElementById('togglePassword1');
const togglePassword2 = document.getElementById('togglePassword2');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');
const changePasswordForm = document.getElementById('changePasswordForm');
const submitBtn = document.getElementById('submitBtn');
const passwordRequirements = document.getElementById('passwordRequirements');
const themeBtn = document.getElementById('themeBtn');

// ===== Theme Management =====
function setTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
  
  // Update theme button icon
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

// Theme toggle button
themeBtn.addEventListener('click', function() {
  const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

// ===== Password Toggle (Eye Icon) =====
function setupPasswordToggle(toggle, input) {
  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    toggle.classList.toggle('active');
  });
}

setupPasswordToggle(togglePassword1, newPasswordInput);
setupPasswordToggle(togglePassword2, confirmPasswordInput);

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
    test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    required: false
  }
};

// ===== Input Validation (Only English Letters, Numbers and Special Chars) =====
function isValidPasswordChar(char) {
  // تنها کاراکترهای انگلیسی، اعداد و کاراکترهای خاص مجاز هستند
  // فاصله و کاراکترهای نامعقول مسدود هستند
  const validChars = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\-_=+\[\]{}\\;:'`~]$/;
  return validChars.test(char);
}

// Prevent non-English characters and invalid spaces
newPasswordInput.addEventListener('keypress', function (e) {
  const char = String.fromCharCode(e.which);
  
  // Prevent spaces and invalid characters
  if (!isValidPasswordChar(char)) {
    e.preventDefault();
    showError('Only English letters, numbers, and special characters allowed');
  }
});

confirmPasswordInput.addEventListener('keypress', function (e) {
  const char = String.fromCharCode(e.which);
  
  if (!isValidPasswordChar(char)) {
    e.preventDefault();
    showError('Only English letters, numbers, and special characters allowed');
  }
});

// ===== Update Requirements Display =====
function updateRequirements(password) {
  let allRequired = true;
  
  Object.entries(requirements).forEach(([key, req]) => {
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

// ===== Show/Hide Password Requirements on Focus =====
newPasswordInput.addEventListener('focus', function () {
  passwordRequirements.classList.add('show');
});

newPasswordInput.addEventListener('blur', function () {
  if (!this.value) {
    passwordRequirements.classList.remove('show');
    // Reset all requirement items to their initial state
    Object.entries(requirements).forEach(([key, req]) => {
      const item = req.icon.closest('.req-item');
      item.classList.remove('met');
      req.icon.textContent = '○';
    });
    errorMsg.classList.remove('show');
  }
});

// Reset requirements when password is cleared
newPasswordInput.addEventListener('input', function () {
  if (!this.value) {
    // Reset all requirement icons to initial state
    Object.entries(requirements).forEach(([key, req]) => {
      const item = req.icon.closest('.req-item');
      item.classList.remove('met');
      req.icon.textContent = '○';
    });
    strengthBar.style.width = '0%';
    strengthText.textContent = '';
  }
});

// ===== Calculate Password Strength =====
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
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
  
  // Update requirements
  updateRequirements(password);
}

newPasswordInput.addEventListener('input', function () {
  if (this.value) {
    updatePasswordStrength(this.value);
  } else {
    strengthBar.style.width = '0%';
    strengthText.textContent = '';
  }
  errorMsg.classList.remove('show');
  successMsg.classList.remove('show');
});

// ===== Validate Password and Return Error Messages =====
function validatePassword(password) {
  const errors = [];
  
  // Check length
  if (password.length < 8) {
    errors.push('At least 8 characters required');
  }
  
  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push('Must contain at least one number (0-9)');
  }
  
  // Check for letters
  if (!/[a-z]/i.test(password)) {
    errors.push('Must contain at least one letter (a-z)');
  }
  
  return errors;
}

// ===== Show/Hide Messages =====
function showError(message) {
  errorMsg.innerHTML = message;
  errorMsg.classList.add('show');
  successMsg.classList.remove('show');
}

function showSuccess(message) {
  successMsg.textContent = message;
  successMsg.classList.add('show');
  errorMsg.classList.remove('show');
}

// ===== Form Submission =====
changePasswordForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();
  
  errorMsg.classList.remove('show');
  successMsg.classList.remove('show');
  
  // Validation: Empty new password field
  if (!newPassword) {
    showError('Please enter a new password');
    return;
  }
  
  // Validation: Empty confirm password field
  if (!confirmPassword) {
    showError('Please confirm your password');
    return;
  }
  
  // Validation: Check password requirements
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    const errorText = passwordErrors.map(error => `• ${error}`).join('<br>');
    showError(errorText);
    return;
  }
  
  // Validation: Passwords match
  if (newPassword !== confirmPassword) {
    showError('Passwords do not match');
    confirmPasswordInput.parentNode.style.borderColor = 'rgba(255, 107, 107, 0.6)';
    
    setTimeout(() => {
      confirmPasswordInput.parentNode.style.borderColor = '';
    }, 600);
    return;
  }
  
  // Validation: Captcha
  const captchaResponse = hcaptcha.getResponse();
  if (!captchaResponse) {
    showError('Please verify the captcha');
    return;
  }
  
  // All validations passed - submit directly
  submitBtn.disabled = true;
  submitBtn.textContent = 'Changing...';
  
const { error } = await supabaseClient.auth.updateUser({
  password: newPassword
});

if (error) {
  showError(error.message);
  submitBtn.disabled = false;
  submitBtn.textContent = 'Change Password';
  return;
}

showSuccess('✓ Password changed successfully! Redirecting...');

setTimeout(() => {
  window.location.href = '../index.html';
}, 1800);
});
