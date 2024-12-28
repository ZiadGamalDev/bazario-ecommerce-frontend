const userList = document.getElementById('user-list');
const addUserModal = document.getElementById('addUserModal');
const closeAddModal = document.getElementById('closeAddModal');
const openAddModal = document.getElementById('openAddModal');
const addUserForm = document.getElementById('addUserForm');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');


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
        // console.log(data);
        
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

    // Open Add User modal
    openAddModal.addEventListener('click', () => {
        addUserModal.style.display = 'block';
    });

    // Close Add User modal
    closeAddModal.addEventListener('click', () => {
        addUserModal.style.display = 'none';
    });

     addUserForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const userName = document.getElementById('UserName').value;
        const userImage = document.getElementById('userImage').files[0];
        const emailUser = document.getElementById('emailUser').value;
    
        // console.log(userName ,userImage ,emailUser);
        
        const formData = new FormData();
        formData.append('name', userName);
        formData.append('image', userImage);
        formData.append('email', emailUser);

        // Send the form data to the API
        fetch(`${baseUrl}/api/admin/users`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            }
        })
        .then(response => response.json())
        .then(() => {
            addUserModal.style.display = 'none';
            location.reload(); 
        })
        .catch(error => console.error('Error adding user:', error));
    });
});