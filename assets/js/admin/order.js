document.addEventListener('DOMContentLoaded', loadOrders);

function loadOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    fetch(`${baseUrl}/api/admin/orders`, {
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
        .then(handleResponse)
        .then(data => {
            const orders = data.data;

            orders.forEach(order => {
                const orderRow = document.createElement('tr');

                let actionButtons = '';

                if (order.status === 'pending') {
                    actionButtons = `
                    <div class="action-btns">
                        <button class="edit-btn" onclick="confirmOrder(${order.id})">Confirm</button>
                        <button class="delete-btn" onclick="rejectOrder(${order.id})">Reject</button>
                    </div>`;
                } else {
                    const statusColor = order.status === 'confirmed' 
                        ? 'green' 
                        : order.status === 'canceled'
                            ? 'orange'
                            : 'red';
                    actionButtons = `<p style="color: ${statusColor};">${order.status}</p>`;
                }

                orderRow.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.total_price}</td>
                    <td>${order.created_at}</td>
                    <td>${order.user.name}</td>
                    <td><a href="product.html?product_id=${order.id}" target="_blank">Details</a></td>
                    <td>${actionButtons}</td>
                `;

                orderList.appendChild(orderRow);
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function confirmOrder(orderId) {
    fetch(`${baseUrl}/api/admin/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
        .then(handleResponse)
        .then(loadOrders)
        .catch(error => console.error('Error confirming order:', error));
}

function rejectOrder(orderId) {
    fetch(`${baseUrl}/api/admin/orders/${orderId}/reject`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
        }
    })
        .then(handleResponse)
        .then(loadOrders)
        .catch(error => console.error('Error rejecting order:', error));
}
