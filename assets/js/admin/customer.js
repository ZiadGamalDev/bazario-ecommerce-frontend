const userList = document.getElementById('user-list');

// Fetch all users from the API
document.addEventListener('DOMContentLoaded', () => {
    // Make the fetch request
    fetch(`${baseUrl}/api/admin/users`, {
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Log the data to inspect its structure
        const customers = data.data;

        if (Array.isArray(customers) && customers.length > 0) {
            customers.forEach(customer => {
                const customerRow = document.createElement('tr');

                customerRow.innerHTML = `
                    <td>${customer.id}</td>
                    <td><img src="${customer.image}" alt="${customer.name}"></td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                `;
                userList.appendChild(customerRow);
            });
        } else {
            console.log('No customers found or data format is incorrect');
        }
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
});
