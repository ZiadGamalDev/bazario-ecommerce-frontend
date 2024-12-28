const registerForm = document.getElementById("register-form");

if (registerForm) {
  const nameInput = document.getElementById("reg-name");
  const emailInput = document.getElementById("reg-email");
  const passwordInput = document.getElementById("reg-password");
  const confirmPasswordInput = document.getElementById(
    "reg-password-confirmation"
  );

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );

  const namePattern = /^[a-zA-Z\s]{3,}$/; // اسم مكون من 3 أحرف أو أكثر
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // بريد إلكتروني صالح
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // 8 أحرف على الأقل، حرف كبير ورقم

  function validateName() {
    if (!namePattern.test(nameInput.value.trim())) {
      nameError.textContent = "Name must be at least 3 characters.";
      return false;
    } else {
      nameError.textContent = "";
      return true;
    }
  }

  function validateEmail() {
    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Invalid email address.";
      return false;
    } else {
      emailError.textContent = "";
      return true;
    }
  }

  function validatePassword() {
    if (!passwordPattern.test(passwordInput.value.trim())) {
      passwordError.textContent =
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number.";
      return false;
    } else {
      passwordError.textContent = "";
      return true;
    }
  }

  function validateConfirmPassword() {
    if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
      confirmPasswordError.textContent = "Passwords do not match.";
      return false;
    } else {
      confirmPasswordError.textContent = "";
      return true;
    }
  }

  nameInput.addEventListener("blur", validateName);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
  confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        password_confirmation: confirmPasswordInput.value.trim(),
      };

      console.log("Sending data to API:", data);

      fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          console.log("Response from API:", result);
          if (result.data) {
            alert("Registration successful!");
            localStorage.setItem("token", result.data.token);
            window.location.href = "/pages/auth/login.html";
          } else {
            alert("Registration failed: " + result.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });      
    }
  });
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 30 * 1000;

let loginAttempts = JSON.parse(localStorage.getItem("loginAttempts")) || {
  count: 0,
  lockoutTime: null,
};

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error-msg");

    if (loginAttempts.lockoutTime && Date.now() < loginAttempts.lockoutTime) {
      errorMsg.textContent =
        "Too many failed attempts. Try again after 30 seconds!";
      return;
    }

    fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          const user = result.data.user;
          const token = result.data.token;

          localStorage.setItem("loggedInUser", JSON.stringify(user));
          localStorage.setItem("token", token);

          alert("Login successful!");
          if (user.role === "admin") {
            window.location.href = "../../admin/dashboard.html";
          } else {
            window.location.href = "../../index.html";
          }
        } else {
          errorMsg.textContent = "Invalid email or password.";
          
          loginAttempts.count += 1;

          if (loginAttempts.count >= MAX_ATTEMPTS) {
            loginAttempts.lockoutTime = Date.now() + LOCKOUT_TIME;
            errorMsg.textContent =
              "Too many failed attempts. You are locked out for 30 seconds!";
          }

          localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  });
}
