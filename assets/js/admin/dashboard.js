//  to show new date
function displayCurrentDay() {
    const today = new Date();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   const dayOfWeek = daysOfWeek[today.getDay()];

    const dayOfMonth = today.getDate();
   const month = today.getMonth() + 1;  
   const year = today.getFullYear();
   const formattedDate = `${month}/${dayOfMonth}/${year}`;

    const currentDayElement = document.getElementById("currentDay");
   currentDayElement.textContent = `Today's Day: ${dayOfWeek}, Date: ${formattedDate}`;
}
window.onload = displayCurrentDay;
// //////////////////////////////////////////////////////////////////
 

document.addEventListener('DOMContentLoaded', () => {
     const apiUrl = `${baseUrl}/api/admin/dashboard/statistics`;

     fetch(apiUrl, {
        method: 'GET',
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
         console.log('API Data:', data);

         if (data && data.total_sales !== undefined && data.users_count !== undefined && data.products_count !== undefined) {
             document.querySelector('.total_sales').innerText = data.total_sales;
            document.querySelector('.users_count').innerText = data.users_count;
            document.querySelector('.products_count').innerText = data.products_count;
        } else {
            console.error('Invalid data format:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});


// ///////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    // URL for the API
    const ordersUrl = `${baseUrl}/api/admin/orders`;

    // Fetch the orders from the API
    fetch(ordersUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data) {
             const recentOrders = data.data.slice(-4);   

             const ordersTableBody = document.getElementById('recent-orders-body');

             recentOrders.forEach(order => {
                 const row = document.createElement('tr');

                 const productNameCell = document.createElement('td');
                 productNameCell.textContent = order.items[0]?.product.name || 'N/A'; 
                 row.appendChild(productNameCell);

                const productNumberCell = document.createElement('td');
                productNumberCell.textContent = order.items[0]?.product.id || 'N/A'; 
                 row.appendChild(productNumberCell);

                const paymentStatusCell = document.createElement('td');
                paymentStatusCell.textContent = order.items[0]?.price || 'N/A';  
                 row.appendChild(paymentStatusCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = order.status || 'N/A'; 
                row.appendChild(statusCell);

                // Append the row to the table body
                ordersTableBody.appendChild(row);
            });
        } else {
            console.error('Invalid data format or no orders found', data);
        }
    })
    .catch(error => {
        console.error('Error fetching orders:', error);
    });
});

