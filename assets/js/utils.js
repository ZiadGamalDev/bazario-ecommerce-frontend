// const baseUrl = 'http://127.0.0.1:8000';
const baseUrl = "https://ecommerce.ershaad.net";
const token = "customer-static-token";
const adminToken = "admin-static-token";

function loadPartial(selector, filePath, callback) {
  const element = document.querySelector(selector);
  if (element) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        return response.text();
      })
      .then((html) => {
        element.innerHTML = html;
        if (callback) callback();
      })
      .catch((error) => console.error(error));
  }
}

function logout() {
  const logoutUrl = `${baseUrl}/api/logout`;
  const adminToken = localStorage.getItem('admin');
console.log(logoutUrl);
  fetch(logoutUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      if (data.sucess) {
        localStorage.removeItem("adminToken");
        window.location.href = "/pages/auth/login.html";
        console.log("sucess");
      } else {
        console.error("Logout failed:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
}
