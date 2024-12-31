async function authenticateAdmin() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/pages/auth/login.html';
    return false;
  }

  try {
    const response = await fetch(`${baseUrl}/api/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to authenticate');

    const data = await response.json();

    if (!data.is_admin) {
      window.location.href = '/pages/errors/unauthorized.html';
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    window.location.href = '/pages/auth/login.html';
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const isAuthenticated = await authenticateAdmin();
  if (isAuthenticated) {
    console.log("Access granted!");
    const loader = document.querySelector(".preloader");
    loader.classList.add("preloader-deactivate");
  }
});
