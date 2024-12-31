document.addEventListener("DOMContentLoaded", () => {
    loadPartial("header", "../../../pages/components/header.html");
    loadPartial("footer", "../../../pages/components/footer.html");

    if (!token) {
        console.error("Authorization token is missing or invalid.");
        const errorMessage = document.querySelector("#error-message");
        errorMessage.textContent = "Authentication failed. Please log in again.";
        return;
    }

    fetchUserProfile();

    fetchUserOrders();

    document.getElementById("save-profile-btn").addEventListener("click", saveUserProfile);
    document.getElementById("profile-picture-upload").addEventListener("change", handleImageUpload);
});


function fetchUserProfile() {
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {
        const user = JSON.parse(storedUser);
        displayUserProfile(user);
    } 
}

function displayUserProfile(user) {
    document.getElementById("profile-name").value = user.name;
    document.getElementById("profile-email").value = user.email;
    document.getElementById("profile-phone").value = user.phone || "No phone number added";
    document.getElementById("profile-address").value = user.address || "No address added";

    const profilePicture = document.getElementById("profile-picture");
    profilePicture.src = user.image || "https://ecommerce.ershaad.net/storage/images/default/customer.png";
}

function saveUserProfile() {
    const name = document.getElementById("profile-name").value.trim();
    const email = document.getElementById("profile-email").value.trim();
    const phone = document.getElementById("profile-phone").value.trim();
    const address = document.getElementById("profile-address").value.trim();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);

    const profilePictureUpload = document.getElementById("profile-picture-upload").files[0];
    if (profilePictureUpload) {
        formData.append("image", profilePictureUpload);
    }

    formData.append("_method", "PUT");
    fetch(`${baseUrl}/api/profile`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
    .then(handleResponse)
    .then(data => {
        const updatedUser = data.data;
        console.log(updatedUser)

        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        displayUserProfile(updatedUser);

        alert("Profile updated successfully!");
    })
    .catch(error => {
        console.error("Error saving profile:", error);
        alert("Failed to update profile.");
    });
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profile-picture").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// function displayUserProfile(user) {
//     const username = document.createElement("p");
//     username.classList.add('username');
//     username.textContent = `@${user.name.split(' ').join("-")}`;

//     const img = document.createElement('img');
//     img.src = user.image;
//     img.alt = "User Image";

//     const name = document.createElement('h3');
//     name.textContent = `Name: ${user.name}`;

//     const email = document.createElement('h3');
//     email.textContent = `Email: ${user.email}`;

//     const phone = document.createElement('h3');
//     phone.textContent = `Phone: ${user.phone}`;

//     const address = document.createElement('h3');
//     address.textContent = `Address: ${user.address}`;

//     const userCard = document.querySelector('.user-card');
//     const userImg = document.querySelector('.user-img');
//     const userInfo = document.querySelector('.user-info');

//     userImg.appendChild(img);
//     userCard.appendChild(username);
//     userInfo.appendChild(name);
//     userInfo.appendChild(email);
//     userInfo.appendChild(phone);
//     userInfo.appendChild(address);
// }

function fetchUserOrders() {
    const ordersTable = document.querySelector("#orders-table");
    const ordersTableBody = document.querySelector("#orders-table tbody");
    const ordersContainer = document.querySelector("#orders-container"); 
    const userData = JSON.parse(localStorage.getItem("userData")); 
    const userId = userData.user.id;

    fetch(`${baseUrl}/api/orders`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${adminToken}`,
        },
    })
    .then(handleResponse)
    .then(data => {
        const orders = data.data.filter(order => order.user.id.toString() === userId);
        ordersTableBody.innerHTML = "";

        if (orders.length === 0) {
            ordersTable.style.display = "none";
            const noOrdersMessage = document.createElement("p");
            noOrdersMessage.textContent = "You have no orders yet.";
            noOrdersMessage.classList.add("no-orders-message"); 
            ordersContainer.appendChild(noOrdersMessage);
        } else {
            ordersTable.style.display = ""; 
            document.querySelector(".no-orders-message")?.remove(); 

            orders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.status}</td>
                    <td>$${order.total_price}</td>
                    <td>${order.created_at}</td>
                    <td>
                        ${order.status === "pending"
                            ? `<button class="cancel-btn" data-id="${order.id}">Cancel</button>`
                            : `<button class="details-btn" data-id="${order.id}">View Details</button>`}
                    </td>
                `;
                ordersTableBody.appendChild(row);
            });

            addEventListenersToButtons(orders);
        }
    })
    .catch(error => console.error("Error fetching orders:", error));
}


function addEventListenersToButtons(orders) {
    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const orderId = button.dataset.id;
            const order = orders.find(o => o.id == orderId);
            viewOrderDetails(order);
        });
    });

    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", () => {
            const orderId = button.dataset.id;
            if (confirm("Are you sure you want to cancel this order?")) {
                cancelOrder(orderId);
            }
        });
    });
}


function cancelOrder(orderId) {
    fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to cancel order");
        return response.json();
    })
    .then(() => {
        alert("Order canceled successfully!");
        fetchUserOrders(); 
    })
    .catch(error => console.error("Error canceling order:", error));
}


function viewOrderDetails(order) {
    const orderDetailsDiv = document.getElementById("order-details");
    const orderDetailsTableBody = document.querySelector("#order-details-table tbody");

    orderDetailsTableBody.innerHTML = "";
    order.items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td><img src="${item.product.image}" alt="${item.product.name}" width="50" /></td>
        `;
        orderDetailsTableBody.appendChild(row);
    });

    orderDetailsDiv.style.display = "block";
}

document.getElementById("close-details-btn").addEventListener("click", () => {
    document.getElementById("order-details").style.display = "none";
});