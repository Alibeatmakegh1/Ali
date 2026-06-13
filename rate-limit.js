let loginAttempts = 0;
const maxAttempts = 5;

let isLocked = false;

const loginForm = document.querySelector(".form");
const loginButton = document.querySelector(".styled-button");


const screenPulse = document.querySelector(".screen-pulse");

const errorMessage = document.querySelector(".error-message");



loginForm.addEventListener("submit", (e) => {

  e.preventDefault();

  if (isLocked) return;

  loginAttempts++;

  console.log("Attempts:", loginAttempts);

  if (loginAttempts >= maxAttempts) {

    isLocked = true;

    screenPulse.classList.remove("active");

    void screenPulse.offsetWidth;

    screenPulse.classList.add("active");


    loginButton.disabled = true;

    errorMessage.textContent =
    `Too many failed attempts.`;

    errorMessage.style.display = "block";

    let timeLeft = 30;

    loginButton.textContent = `WAIT ${timeLeft}s`;

    const interval = setInterval(() => {

      timeLeft--;

      loginButton.textContent = `WAIT ${timeLeft}s`;

      if (timeLeft <= 0) {

        clearInterval(interval);

        isLocked = false;

        loginAttempts = 0;

        loginButton.disabled = false;

        loginButton.textContent = "LOGIN";

        errorMessage.style.display = "none";
        
      }

    }, 1000);

  }

});



