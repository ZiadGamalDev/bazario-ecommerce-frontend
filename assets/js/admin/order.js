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
        orders.forEach(order => {
            const orderRow = document.createElement('tr');
            orderRow.innerHTML = `
                <td>${order.id}</td>
                <td>${order.status}</td>
                <td>${order.total_price}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit-btn" onclick="confirmOrder(${order.id})">Confirm</button>
                        <button class="delete-btn" onclick="rejectOrder(${order.id})">Reject</button>
                    </div>
                </td>
            `;
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
            // location.reload(); 
        })
        .catch(error => console.error('Error deleting order:', error));
    });
});

// Confirm Order (PUT request)
function confirmOrder(orderId) {
    fetch(`${baseUrl}/${orderId}/confirm`, {
        method: 'PUT',
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
        method: 'DELETE',
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

 