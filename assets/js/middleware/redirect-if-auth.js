async function redirectIfAuth() {
    const token = localStorage.getItem('token');

    if (!token) return; // If no token, do nothing and allow access to the page.

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

        if (data.is_admin) {
            window.location.href = '/pages/admin';
        } else {
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', redirectIfAuth);
