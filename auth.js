const supabaseUrl = "https://jitswbdnbpjluoiupntx.supabase.co";
const supabaseKey = "sb_publishable_6cEG1PMf2PRgIPoIz7TxQQ_HOT_mKab";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log("✅ SUPABASE CONNECTED");

// =====================
// 🛠️ HELPER FUNCTIONS
// =====================

function isValidPasswordChar(char) {
  const validChars = /^[a-zA-Z0-9!@#$%^&*(),.?\":{}|<>\-_=+\[\]{}\\;:'`~]$/;
  return validChars.test(char);
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters required');
  if (!/\d/.test(password)) errors.push('Must contain at least one number (0-9)');
  if (!/[a-z]/i.test(password)) errors.push('Must contain at least one letter (a-z)');
  return errors;
}

function hasNonEnglishChars(text) {
  return !/^[a-zA-Z0-9!@#$%^&*(),.?\":{}|<>\-_=+\[\]{}\\;:'`~]*$/.test(text);
}

// =====================
// 🔐 LOGIN FUNCTION
// =====================
document.addEventListener("DOMContentLoaded", function() {
  const authForm = document.getElementById("authForm");
  if (!authForm) return;

  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const loginContent = document.getElementById("loginContent");
    if (loginContent.classList.contains('hidden')) return;

    const emailInput = authForm.querySelector('input[name="email"]');
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("errorMsg");
    const successMsg = document.getElementById("successMsg");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // پاک کردن پیغام‌های قبلی
    if (errorMsg) {
      errorMsg.classList.remove('show');
      errorMsg.textContent = '';
    }
    if (successMsg) {
      successMsg.classList.remove('show');
      successMsg.textContent = '';
    }

    // بررسی مقادیر خالی
    if (!email || !password) {
      if (errorMsg) {
        errorMsg.textContent = "❌ Please fill all fields";
        errorMsg.classList.add('show');
      }
      return;
    }

    // بررسی ایمیل معتبر
    if (!email.includes("@")) {
      if (errorMsg) {
        errorMsg.textContent = "❌ Invalid email";
        errorMsg.classList.add('show');
      }
      return;
    }

    // بررسی کاراکتر‌های انگلیسی
    if (hasNonEnglishChars(password)) {
      if (errorMsg) {
        errorMsg.textContent = "❌ Password must contain only English characters";
        errorMsg.classList.add('show');
      }
      return;
    }

    console.log("🔐 Logging in...", email);
    submitBtn.disabled = true;
    submitBtn.querySelector('.button-text').textContent = "Signing in...";

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("❌ Login Error:", error.message);
        if (errorMsg) {
          errorMsg.textContent = `❌ ${error.message}`;
          errorMsg.classList.add('show');
        }
        submitBtn.disabled = false;
        submitBtn.querySelector('.button-text').textContent = "Sign In";
        return;
      }

      console.log("✅ Login Successful!", data);
      if (successMsg) {
        successMsg.textContent = "✅ Welcome! 🎉";
        successMsg.classList.add('show');
      }

      localStorage.setItem("user_session", JSON.stringify(data.session));
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_email", data.user.email);

      emailInput.value = "";
      passwordInput.value = "";

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (err) {
      console.error("❌ Unexpected Error:", err);
      if (errorMsg) {
        errorMsg.textContent = "❌ An unexpected error occurred";
        errorMsg.classList.add('show');
      }
      submitBtn.disabled = false;
      submitBtn.querySelector('.button-text').textContent = "Sign In";
    }
  });

  // پاک کردن پیغام خطا هنگام تایپ
  const emailInput = authForm.querySelector('input[name="email"]');
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("errorMsg");

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (errorMsg) {
        errorMsg.classList.remove('show');
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      if (errorMsg) {
        errorMsg.classList.remove('show');
      }
    });
  }

  // =====================
  // 📝 REGISTRATION FUNCTION
  // =====================
  const registerBtn = document.getElementById("registerBtn");
  if (!registerBtn) return;

  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const registerContent = document.getElementById("registerContent");
    if (registerContent.classList.contains('hidden')) return;

    const regName = document.getElementById("regName");
    const regEmail = document.getElementById("regEmail");
    const regPassword = document.getElementById("regPassword");
    const regConfirmPassword = document.getElementById("regConfirmPassword");
    const regErrorMsg = document.getElementById("regErrorMsg");
    const regSuccessMsg = document.getElementById("regSuccessMsg");

    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();
    const confirmPassword = regConfirmPassword.value.trim();

    // پاک کردن پیغام‌های قبلی
    if (regErrorMsg) {
      regErrorMsg.classList.remove('show');
      regErrorMsg.textContent = '';
    }
    if (regSuccessMsg) {
      regSuccessMsg.classList.remove('show');
      regSuccessMsg.textContent = '';
    }

    // بررسی مقادیر خالی
    if (!name || !email || !password || !confirmPassword) {
      if (regErrorMsg) {
        regErrorMsg.textContent = "❌ Please fill all fields";
        regErrorMsg.classList.add('show');
      }
      return;
    }

    // بررسی ایمیل معتبر
    if (!email.includes("@")) {
      if (regErrorMsg) {
        regErrorMsg.textContent = "❌ Invalid email";
        regErrorMsg.classList.add('show');
      }
      return;
    }

    // بررسی نام به انگلیسی
    if (hasNonEnglishChars(name)) {
      if (regErrorMsg) {
        regErrorMsg.textContent = "❌ Full name must contain only English characters";
        regErrorMsg.classList.add('show');
      }
      return;
    }

    // بررسی رمز عبور به انگلیسی
    if (hasNonEnglishChars(password)) {
      if (regErrorMsg) {
        regErrorMsg.textContent = "❌ Password must contain only English characters";
        regErrorMsg.classList.add('show');
      }
      return;
    }

    // بررسی شرایط رمز عبور
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      const errorText = passwordErrors.map(error => `• ${error}`).join('<br>');
      if (regErrorMsg) {
        regErrorMsg.innerHTML = errorText;
        regErrorMsg.classList.add('show');
      }
      return;
    }

    // بررسی تطابق رمز عبور
    if (password !== confirmPassword) {
      if (regErrorMsg) {
        regErrorMsg.textContent = "❌ Passwords do not match";
        regErrorMsg.classList.add('show');
      }
      regConfirmPassword.closest('.styled-input').style.borderColor = 'rgba(255, 107, 107, 0.6)';
      setTimeout(() => {
        regConfirmPassword.closest('.styled-input').style.borderColor = '';
      }, 600);
      return;
    }

    // بررسی کپچا
    const captchaResponse = hcaptcha.getResponse();
    if (!captchaResponse) {
      if (regErrorMsg) {
        regErrorMsg.textContent = "❌ Please verify the captcha";
        regErrorMsg.classList.add('show');
      }
      return;
    }

    console.log("📝 Registering...", name, email);
    registerBtn.disabled = true;
    registerBtn.querySelector('.button-text').textContent = "Creating Account...";

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            created_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        console.error("❌ Registration Error:", error.message);
        if (regErrorMsg) {
          regErrorMsg.textContent = `❌ ${error.message}`;
          regErrorMsg.classList.add('show');
        }
        registerBtn.disabled = false;
        registerBtn.querySelector('.button-text').textContent = "Create Account";
        return;
      }

      console.log("✅ Registration Successful!", data);

      if (data.user?.identities?.length === 0) {
        if (regSuccessMsg) {
          regSuccessMsg.innerHTML = "✅ Account created!<br>Please check your email and verify.";
          regSuccessMsg.classList.add('show');
        }
      } else {
        if (regSuccessMsg) {
          regSuccessMsg.innerHTML = "✅ Account created! 🎉<br>You can now sign in.";
          regSuccessMsg.classList.add('show');
        }
      }

      localStorage.setItem("user_email", email);
      localStorage.setItem("user_name", name);

      regName.value = "";
      regEmail.value = "";
      regPassword.value = "";
      regConfirmPassword.value = "";
      hcaptcha.reset();

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);

    } catch (err) {
      console.error("❌ Unexpected Error:", err);
      if (regErrorMsg) {
        regErrorMsg.textContent = "❌ An unexpected error occurred";
        regErrorMsg.classList.add('show');
      }
      registerBtn.disabled = false;
      registerBtn.querySelector('.button-text').textContent = "Create Account";
    }
  });

  // جلوگیری از کاراکتر‌های غیر انگلیسی در رمز عبور
  const regPasswordInput = document.getElementById("regPassword");
  const regConfirmPasswordInput = document.getElementById("regConfirmPassword");
  const regErrorMsg = document.getElementById("regErrorMsg");

  if (regPasswordInput) {
    regPasswordInput.addEventListener('keypress', function (e) {
      const char = String.fromCharCode(e.which);
      if (!isValidPasswordChar(char)) {
        e.preventDefault();
        if (regErrorMsg) {
          regErrorMsg.textContent = '❌ Only English letters, numbers, and special characters allowed';
          regErrorMsg.classList.add('show');
        }
      }
    });

    regPasswordInput.addEventListener('input', () => {
      if (regErrorMsg) {
        regErrorMsg.classList.remove('show');
      }
    });
  }

  if (regConfirmPasswordInput) {
    regConfirmPasswordInput.addEventListener('keypress', function (e) {
      const char = String.fromCharCode(e.which);
      if (!isValidPasswordChar(char)) {
        e.preventDefault();
        if (regErrorMsg) {
          regErrorMsg.textContent = '❌ Only English letters, numbers, and special characters allowed';
          regErrorMsg.classList.add('show');
        }
      }
    });

    regConfirmPasswordInput.addEventListener('input', () => {
      if (regErrorMsg) {
        regErrorMsg.classList.remove('show');
      }
    });
  }

  const regNameInput = document.getElementById("regName");
  if (regNameInput) {
    regNameInput.addEventListener('keypress', function (e) {
      const char = String.fromCharCode(e.which);
      if (!/^[a-zA-Z\s]$/.test(char)) {
        e.preventDefault();
        if (regErrorMsg) {
          regErrorMsg.textContent = '❌ Full name must contain only English letters';
          regErrorMsg.classList.add('show');
        }
      }
    });

    regNameInput.addEventListener('input', () => {
      if (regErrorMsg) {
        regErrorMsg.classList.remove('show');
      }
    });
  }

  const regEmailInput = document.getElementById("regEmail");
  if (regEmailInput) {
    regEmailInput.addEventListener('input', () => {
      if (regErrorMsg) {
        regErrorMsg.classList.remove('show');
      }
    });
  }

  // =====================
  // 🔄 RESET PASSWORD FUNCTION
  // =====================
  const resetBtn = document.getElementById("resetBtn");
  if (!resetBtn) return;

  resetBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const forgotSection = document.getElementById("forgotSection");
    if (forgotSection.classList.contains('hidden')) return;

    const resetEmail = document.getElementById("resetEmail");
    const resetErrorMsg = document.getElementById("resetErrorMsg");
    const resetSuccessMsg = document.getElementById("resetSuccessMsg");

    const email = resetEmail.value.trim();

    // پاک کردن پیغام‌های قبلی
    if (resetErrorMsg) {
      resetErrorMsg.classList.remove('show');
      resetErrorMsg.textContent = '';
    }
    if (resetSuccessMsg) {
      resetSuccessMsg.classList.remove('show');
      resetSuccessMsg.textContent = '';
    }

    // بررسی ایمیل خالی
    if (!email) {
      if (resetErrorMsg) {
        resetErrorMsg.textContent = "❌ Please enter your email";
        resetErrorMsg.classList.add('show');
      }
      return;
    }

    // بررسی ایمیل معتبر
    if (!email.includes("@")) {
      if (resetErrorMsg) {
        resetErrorMsg.textContent = "❌ Invalid email";
        resetErrorMsg.classList.add('show');
      }
      return;
    }

    // بررسی کپچا
    const captchaResponse = hcaptcha.getResponse();
    if (!captchaResponse) {
      if (resetErrorMsg) {
        resetErrorMsg.textContent = "❌ Please verify the captcha";
        resetErrorMsg.classList.add('show');
      }
      return;
    }

    console.log("🔄 Sending reset link to:", email);
    resetBtn.disabled = true;
    resetBtn.querySelector('.button-text').textContent = "Sending...";

    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: window.location.origin + "/auth/change-password.html",
        }
      );

      if (error) {
        console.error("❌ Reset Error:", error.message);
        if (resetErrorMsg) {
          resetErrorMsg.textContent = `❌ ${error.message}`;
          resetErrorMsg.classList.add('show');
        }
        resetBtn.disabled = false;
        resetBtn.querySelector('.button-text').textContent = "Send Reset Link";
        return;
      }

      console.log("✅ Reset Email Sent!", data);
      if (resetSuccessMsg) {
        resetSuccessMsg.innerHTML = "✅ Password reset link sent!<br>Please check your inbox.";
        resetSuccessMsg.classList.add('show');
      }

      resetEmail.value = "";
      hcaptcha.reset();

      setTimeout(() => {
        resetBtn.disabled = false;
        resetBtn.querySelector('.button-text').textContent = "Send Reset Link";
      }, 2000);

    } catch (err) {
      console.error("❌ Unexpected Error:", err);
      if (resetErrorMsg) {
        resetErrorMsg.textContent = "❌ An unexpected error occurred";
        resetErrorMsg.classList.add('show');
      }
      resetBtn.disabled = false;
      resetBtn.querySelector('.button-text').textContent = "Send Reset Link";
    }
  });

  const resetEmailInput = document.getElementById("resetEmail");
  if (resetEmailInput) {
    resetEmailInput.addEventListener('input', () => {
      const resetErrorMsg = document.getElementById("resetErrorMsg");
      if (resetErrorMsg) {
        resetErrorMsg.classList.remove('show');
      }
    });
  }
});

// =====================
// 🚪 LOGOUT FUNCTION
// =====================
async function logout() {
  console.log("🚪 Logging out...");

  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("❌ Logout Error:", error.message);
      alert(`❌ Error: ${error.message}`);
      return;
    }

    console.log("✅ Logout Successful!");

    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");

    window.location.href = "/";

  } catch (err) {
    console.error("❌ Unexpected Error:", err);
  }
}

// =====================
// 👤 GET CURRENT USER
// =====================
async function getCurrentUser() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.error("❌ Error getting user:", error.message);
      return null;
    }

    console.log("✅ Current User:", data.user);
    return data.user;

  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    return null;
  }
}

// =====================
// 🔒 CHECK AUTH STATUS
// =====================
async function checkAuthStatus() {
  const user = await getCurrentUser();

  if (user) {
    console.log("✅ User is authenticated:", user.email);
    return true;
  } else {
    console.log("❌ User is not authenticated");
    return false;
  }
}

// =====================
// 📊 LISTEN TO AUTH CHANGES
// =====================
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  console.log("🔄 Auth Event:", event);

  if (event === "SIGNED_IN") {
    console.log("✅ User signed in:", session.user.email);
    localStorage.setItem("user_session", JSON.stringify(session));
    localStorage.setItem("user_id", session.user.id);
    localStorage.setItem("user_email", session.user.email);
  }

  if (event === "SIGNED_OUT") {
    console.log("❌ User signed out");
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
  }

  if (event === "USER_UPDATED") {
    console.log("🔄 User updated:", session.user.email);
  }
});

// =====================
// Export functions for use elsewhere
// =====================
window.authFunctions = {
  logout,
  getCurrentUser,
  checkAuthStatus,
};