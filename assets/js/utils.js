const baseUrl = "https://ecommerce.ershaad.net";
const token = localStorage.getItem("token");
const adminToken = localStorage.getItem("token");

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
  fetch(`${baseUrl}/api/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/pages/auth/login.html";
      } else {
        throw new Error("Failed to logout");
      }
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
}

function handleResponse(response) {
  if (!response.ok) {
      switch (response.status) {
          case 401:
              window.location.href = '/pages/errors/unauthorized.html';
              break;
          case 403:
              window.location.href = '/pages/errors/forbidden.html';
              break;
          case 404:
              window.location.href = '/pages/errors/not-found.html';
              break;
          case 500:
              window.location.href = '/pages/errors/server-error.html';
              break;
          default:
              window.location.href = '/pages/errors/index.html';
      }
  }
  return response.json();
}
