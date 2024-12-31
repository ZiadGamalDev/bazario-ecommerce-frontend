var productData = null;

// * Logged User and Log out
document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const dashboardLink = document.getElementById("dashboard-link");
  const logoutBtn = document.getElementById("logout-btn");

  if (userData) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";

    dashboardLink.style.display = "inline";
    var Uname = userData.user.name;
    var uname = Uname.split(" ");
    dashboardLink.textContent =
      userData.user.is_admin === 1
        ? `Dashboard`
        : `Profile`;

    dashboardLink.href =
      userData.user.is_admin === 1
        ? "/pages/admin/index.html"
        : "/pages/customer/userprofile.html";

    logoutBtn.style.display = "inline";
  } else {
    dashboardLink.style.display = "none";
    logoutBtn.style.display = "none";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    window.location.reload();
  });
});

const menuIcon = document.getElementById("menu-icon");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");
const checkbox = document.querySelector(".hamburger .checkbox");
const closeButton = document.querySelector(".close-btn");

// Toggle overlay and icon animation
menuIcon.addEventListener("click", (event) => {
  overlay.classList.toggle("active");
  menuIcon.classList.toggle("active");
  event.stopPropagation();
});

// Close overlay when clicking close button
closeBtn.addEventListener("click", (event) => {
  overlay.classList.remove("active");
  menuIcon.classList.remove("active");
  checkbox.checked = false;
  event.stopPropagation();
});

// Close overlay when clicking anywhere else
document.addEventListener("click", (event) => {
  if (overlay.classList.contains("active")) {
    overlay.classList.remove("active");
    menuIcon.classList.remove("active");
    checkbox.checked = false;
  }
});

// Prevent closing when clicking inside the overlay
overlay.addEventListener("click", (event) => {
  event.stopPropagation();
});
// *Header scroll
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", function () {
    var header = document.querySelector(".header");
    if (window.scrollY > 100) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });
});

// *window scroll
const toTop = document.querySelector(".backTop");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 200) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});

// Utility function to get query params
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadProductDetails() {
  const productId = getQueryParam("productId");
  if (!productId) {
    alert("No product selected!");
    return;
  }

  try {
    // Fetch product data
    const response = await fetch(`${baseUrl}/api/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product details.");
    const { data: product } = await response.json();
    productData = product;

    // Populate UI with product data
    document.getElementById("product-image").src =
      product.image || "default.jpg";
    document.getElementById("product-title").textContent =
      product.name || "Unknown Product";

    setRatingStars(product.rating || 0);

    document.getElementById("product-reviews").textContent = product.reviews
      ? `(${product.reviews.length} reviews)`
      : "(No reviews)";
    document.getElementById("product-category").textContent = `Category: ${product.category.name || "-"
      }`;
    document.getElementById(
      "product-description"
    ).textContent = `Description: ${product.description || "-"}`;
    document.getElementById("product-stock").textContent = `In Stock: ${product.stock_quantity || "-"
      }`;
    document.getElementById("product-summary").textContent =
      product.name || "-";

    // Price details
    const price = parseFloat(product.price) || 0;

    document.getElementById("product-price").textContent = `$${price.toFixed(
      2
    )}`;
    document.getElementById("total-price").textContent = `$${price.toFixed(
      2
    )}`;
  } catch (error) {
    console.error(error);
    alert("Error loading product details.");
  }
}

// Function to set rating stars
function setRatingStars(rating) {
  const ratingElement = document.getElementById("product-rating");
  const starsContainer = document.createElement("span");

  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  // Append full stars
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("span");
    star.classList.add("star", "full");
    star.innerHTML = "&#9733;";
    star.style.color = "#FDE16D";
    star.style.fontSize = "25px";
    starsContainer.appendChild(star);
  }

  // Append half star if needed
  if (halfStars) {
    const star = document.createElement("span");
    star.classList.add("star", "half");
    star.innerHTML = "&#9733;&#189;";
    star.style.color = "#FDE16D";
    star.style.fontSize = "25px";
    starsContainer.appendChild(star);
  }

  // Append empty stars
  for (let i = 0; i < emptyStars; i++) {
    const star = document.createElement("span");
    star.classList.add("star", "empty");
    star.innerHTML = "&#9734;";
    star.style.fontSize = "25px";
    starsContainer.appendChild(star);
  }

  ratingElement.innerHTML = "";
  ratingElement.appendChild(starsContainer);
}

// Call the function on page load
loadProductDetails();

// Handle booking request
async function placeOrder() {
  const productId = getQueryParam("productId");
  if (!productId) {
    alert("No product selected!");
    return;
  }

  const orderData = {
    items: [{ product_id: productId, quantity: 1 }],
  };

  const tokenUrl = localStorage.getItem("token");

  if (!tokenUrl) {
    alert("Please log in.");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/orders/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenUrl}`,
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Order Placed Successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to place the order",
        showConfirmButton: false,
        timer: 1500
      });
    }
  } catch (error) {
    console.error(error);
    alert("Error placing order.");
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  const bookButton = document.getElementById("book-button");
  if (bookButton) {
    bookButton.addEventListener("click", placeOrder);
  } else {
    console.error("Button with id 'book-button' not found.");
  }

  loadProductDetails();
});

paypal.Buttons({
  createOrder: function (data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: productData.price
        }
      }]
    });
  },
  onApprove: function (data, actions) {
    placeOrder();
    return actions.order.capture().then(function (details) {
      alert('Transaction completed by ' + details.payer.name.given_name);
    });
  }
}).render('#paypal-button-container');
