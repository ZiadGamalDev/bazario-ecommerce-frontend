const registerForm = document.getElementById("register-form");

if (registerForm) {
  // const firstnameInput = document.getElementById("reg-firstname");
  // const lastnameInput = document.getElementById("reg-lastname");
  const usernameInput = document.getElementById("reg-username");
  const emailInput = document.getElementById("reg-email");
  const passwordInput = document.getElementById("reg-password");
  const confirmPasswordInput = document.getElementById("reg-ConfirmPassword");

  // const firstnameError = document.getElementById("firstname-error");
  // const lastnameError = document.getElementById("lastname-error");
  const usernameError = document.getElementById("username-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById("confirm-password-error");

  // Validation patterns
  const namePattern = /^[a-zA-Z]{3,}$/; // At least 3 letters
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 chars, 1 uppercase, 1 number

  let isValid = true;

  // Function to validate First Name
  // function validateFirstname() {
  //   if (!namePattern.test(firstnameInput.value.trim())) {
  //     firstnameError.textContent = "First name must be at least 3 letters.";
  //     isValid = false;
  //   } else {
  //     firstnameError.textContent = "";
  //   }
  // }

  // Function to validate Last Name
  // function validateLastname() {
  //   if (!namePattern.test(lastnameInput.value.trim())) {
  //     lastnameError.textContent = "Last name must be at least 3 letters.";
  //     isValid = false;
  //   } else {
  //     lastnameError.textContent = "";
  //   }
  // }

  // Function to validate Username
  function validateUsername() {
    if (!namePattern.test(usernameInput.value.trim())) {
      usernameError.textContent = "Username must be at least 3 characters.";
      isValid = false;
    } else {
      usernameError.textContent = "";
    }
  }

  // Function to validate Email
  function validateEmail() {
    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Invalid email address.";
      isValid = false;
    } else {
      emailError.textContent = "";
    }
  }

  // Function to validate Password
  function validatePassword() {
    if (!passwordPattern.test(passwordInput.value.trim())) {
      passwordError.textContent =
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number.";
      isValid = false;
    } else {
      passwordError.textContent = "";
    }
  }

  // Function to validate Confirm Password
  function validateConfirmPassword() {
    if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    } else {
      confirmPasswordError.textContent = "";
    }
  }

  // Add event listeners for blur (on losing focus)
  // firstnameInput.addEventListener("blur", validateFirstname);
  // lastnameInput.addEventListener("blur", validateLastname);
  usernameInput.addEventListener("blur", validateUsername);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
  confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

  // Form submission validation
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear isValid for final check
    isValid = true;

    // Run all validations
    // validateFirstname();
    // validateLastname();
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (isValid) {
      // Proceed with form submission logic
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some((user) => user.username === usernameInput.value.trim());

      if (userExists) {
        usernameError.textContent = "Username already exists!";
      } else {
        users.push({
          // firstname: firstnameInput.value.trim(),
          // lastname: lastnameInput.value.trim(),
          username: usernameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value.trim(),
          role: "user",
        });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful! You can now login.");
        window.location.href = "./login.html";
      }
    }
  });
}


// const loginForm = document.getElementById("login-form");
// if (loginForm) {
//   loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const username = document.getElementById("login-username").value;
//     const password = document.getElementById("login-password").value;
//     const errorMsg = document.getElementById("login-error-msg");

//     let users = JSON.parse(localStorage.getItem("users")) || [];

//     let user;

//     if (username === "Admin" && password === "Admin@123") {
//       user = { username: "Admin", role: "admin" };
//     } else {
//       user = users.find(
//         (u) => u.username === username && u.password === password
//       );
//     }

//     if (user) {
//       localStorage.setItem("loggedInUser", JSON.stringify(user));
//       alert("Login successful!");

//       if (user.role === "admin") {
//         window.location.href = "../../index.html"; 
//       } else {
//         window.location.href = "../../index.html";
//       }
//     } else {
//       errorMsg.textContent =
//         "You should register first || Invalid username or password!";
//     }
//   });
// }

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

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error-msg");

    if (loginAttempts.lockoutTime && Date.now() < loginAttempts.lockoutTime) {
      errorMsg.textContent =
        "Too many failed attempts. Try again after 30 seconds!";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user;

    if (username === "Admin" && password === "Admin@123") {
      user = { username: "Admin", role: "admin" };
    } else {
      user = users.find(
        (u) => u.username === username && u.password === password
      );
    }

    if (!user) {
      const existingUser = users.find((u) => u.username === username);
      if (!existingUser) {
        errorMsg.textContent = "Username does not exist!";
      } else {
        errorMsg.textContent =
          "Invalid password. Attempts left: " + (MAX_ATTEMPTS - loginAttempts.count);
      }
      loginAttempts.count += 1;

      if (loginAttempts.count >= MAX_ATTEMPTS) {
        loginAttempts.lockoutTime = Date.now() + LOCKOUT_TIME;
        errorMsg.textContent =
          "Too many failed attempts. You are locked out for 30 seconds!";
      }

      localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
      return;
    }

    loginAttempts = { count: 0, lockoutTime: null };
    localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");

    if (user.role === "admin") {
      window.location.href = "../../index.html";
    } else {
      window.location.href = "../../index.html";
    }
  });
}
