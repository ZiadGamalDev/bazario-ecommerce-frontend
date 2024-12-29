const orderList = document.getElementById('order-list');
const editorderModal = document.getElementById('editorderModal');
const deleteorderModal = document.getElementById('deleteorderModal');
const closeEditModal = document.getElementById('closeEditModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const rejectOrderBtn = document.getElementById('rejectOrderBtn');
const editOrderId = document.getElementById('editOrderId');
const editOrderName = document.getElementById('editOrderName');
const deleteorderId = document.getElementById('deleteorderId'); 

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${baseUrl}/api/admin/orders`, {
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        const orders = data.data;
        
        // Loop through orders
        orders.forEach(order => {
            const orderRow = document.createElement('tr');
            
            // Prepare product details for the order
            let productDetails = '';
            order.items.forEach(item => {
                const product = item.product;
                productDetails += `
                     <div class="product-details">
                        <div class="product-info">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <span class="product-name">${product.name}</span>
                        </div>
                        <p class="quantity-info">Quantity: <span>${item.quantity}</span></p>
                        <p class="stock-info">Stock Quantity: <span>  ${product.stock_quantity} </span></p>
                       
                    </div>
                `;
            });

              
            let Delet_Con=`<div class="action-btns">
                        <button class="edit-btn" onclick="confirmOrder(${order.id})">Confirm</button>
                        <button class="delete-btn" onclick="rejectOrder(${order.id})">Reject</button>
                    </div>`

                
                let actionButtons = ''; 
                
 
                if (order.status === 'pending') {
                    actionButtons = Delet_Con; 
                } else {
                    let statusColor = '';
                    if (order.status === 'confirmed') {
                        statusColor = 'green';  
                    } else if (order.status === 'rejected') {
                        statusColor = 'red';  
                    }

                    actionButtons = `<p style="color: ${statusColor};">${order.status}</p>`;
                }
             orderRow.innerHTML = `
                <td>${order.id}</td>
                <td>${order.status}</td>
                <td>${order.total_price}</td>
                <td>${order.created_at}</td>
                <td>
                    ${productDetails}
                </td>
                <td>
                    ${actionButtons}
                 </td>
            `;

            // Append the order row to the order list
            orderList.appendChild(orderRow);
        });
    })
    .catch(error => console.error('Error fetching orders:', error));

    // Cancel deleting order
    cancelDeleteBtn.addEventListener('click', () => {
        deleteorderModal.style.display = 'none';
    });

    // Confirm delete order
    confirmDeleteBtn.addEventListener('click', () => {
        fetch(`${baseUrl}/api/admin/orders/${deleteorderId.value}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            }
        })
        .then(response => response.json())
        .then(() => {
            deleteorderModal.style.display = 'none';
            location.reload();
        })
        .catch(error => console.error('Error deleting order:', error));
    });
});

// Confirm Order (PUT request)
function confirmOrder(orderId) {
     fetch(`${baseUrl}/api/admin/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
    
    .then(response => response.json())
    .then(() => {
        location.reload();
    })
    
    .catch(error => console.error('Error confirming order:', error));
     
}

// Reject Order (DELETE request)
function rejectOrder(orderId) {
     
    fetch(`${baseUrl}/api/admin/orders/${orderId}/reject`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
    .then(response => response.json())
    .then(() => {
        location.reload();
    })
    .catch(error => console.error('Error rejecting order:', error));
}
