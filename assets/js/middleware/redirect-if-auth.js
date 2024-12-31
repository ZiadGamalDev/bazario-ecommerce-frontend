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
            // Redirect to the admin dashboard if the user is authenticated as an admin.
            window.location.href = '/pages/admin';
        } else {
            // Redirect to a user-specific dashboard or home page if they are not an admin.
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error(error); // Log the error for debugging.
        // Do nothing to allow access to the current page (e.g., login or signup).
    }
}

document.addEventListener('DOMContentLoaded', redirectIfAuth);
