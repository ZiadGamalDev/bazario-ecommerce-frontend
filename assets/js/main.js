document.addEventListener("DOMContentLoaded", () => {
  loadPartial(".lastSection", "pages/components/footer.html");
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
      userData.is_admin === 1
        ? `Dashboard`
        : `Profile`;

    dashboardLink.href =
      userData.is_admin === 1
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

// * swiper
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

document.querySelector(".next").addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlidePosition();
});

document.querySelector(".prev").addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlidePosition();
});

function updateSlidePosition() {
  const slider = document.querySelector(".slider");
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlidePosition();
}, 2500);

// *    Get Some Products
const fetchProducts = async () => {
  const productList = document.getElementById("product-list");

  if (!productList) {
    console.error("Element with ID 'product-list' not found!");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/products?limit=7`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    productList.innerHTML = "";

    if (data.data && data.data.length > 0) {
      const featuredProducts = data.data;

      featuredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
          <div class="product-tumb">
            <a href="/pages/customer/singleProduct.html?productId=${
              product.id
            }">
              <img src="${product.image}" alt="${product.name}">
            </a>
          </div>
          <div class="product-details">
            <span class="product-catagory">${product.category?.name}</span>
            <h4>${product.name}</h4>
            <p>${product.description || "No description available."}</p>
            <div class="product-bottom-details">
              <div class="product-price">${
                product.price ? `${product.price}$` : "Price not available"
              }</div>
              <div class="product-links">
                <button class="cart-button" onclick="addToCartList(${product.id})">
                  ${
                    product.is_in_cart
                      ? ``
                      : `<i class="fal fa-shopping-cart cart"></i>`
                  }
                </button>
                <button class="wishlist-button" onclick="addToWishList(${product.id})">
                  ${
                    product.is_in_wishlist
                      ? `<i style="color: red;" class="fa-solid fa-heart heart"></i>`
                      : `<i class="fa-regular fa-heart heart"></i>`
                  }
                </button>
              </div>
            </div>
          </div>
        `;

        productList.appendChild(productCard);
      });
    } else {
      productList.innerHTML = `<p>No products found.</p>`;
    }
  } catch (e) {
    console.error("Error fetching products:", e.message);
    productList.innerHTML = `<p>There was an error fetching the products. Please try again later.</p>`;
  }
};

fetchProducts();

//      *Get Categories name in home
const fetchCategories = async () => {
  const hmove = document.querySelector(".hmove");

  try {
    const response = await fetch(`${baseUrl}/api/categories`);
    const data = await response.json();

    if (data.data) {
      // Iterate through categories and create HTML for each one
      data.data.forEach((category) => {
        const categoryItem = document.createElement("div");
        categoryItem.className = "hitem";

        // Create image element
        const categoryImage = document.createElement("img");
        categoryImage.src = category.image;
        categoryImage.alt = category.name;

        // Create heading element for the category name
        const categoryName = document.createElement("h3");
        categoryName.textContent = category.name;

        // Append the image and name to the category item
        categoryItem.appendChild(categoryImage);
        categoryItem.appendChild(categoryName);

        // Append the category item to the container
        hmove.appendChild(categoryItem);
      });
    } else {
      hmove.innerHTML = `<p>Sorry, no categories found.</p>`;
    }
  } catch (e) {
    hmove.innerHTML = `<p>There was an error fetching the categories.</p>`;
  }
};

fetchCategories();

// * Add or Remove from Cart
const addToCartList = (id) => {
  const tokenUrl = localStorage.getItem("token");

  if (!tokenUrl) {
    Swal.fire({
      title: "Login Required",
      text: "Please login to manage your cart!",
      icon: "warning",
    });
    return;
  }

  fetch(`${baseUrl}/api/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUrl}`,
    },
    body: JSON.stringify({ product_id: id }),
  })
    .then((response) => response.json())
    .then((result) => {
      const button = document.querySelector(
        `.cart-button[onclick="addToCartList(${id})"]`
      );

      if (result.message === "Product added to cart") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product added to cart!",
          showConfirmButton: false,
          timer: 1500,
        });

        button.innerHTML = ``;
        fetchProducts();
      } else if (result.message === "Product removed from cart") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Product removed from cart!",
          showConfirmButton: false,
          timer: 1500,
        });

        button.innerHTML = `<i class="fal fa-shopping-cart cart"></i>`;
        fetchProducts();
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to update cart.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Error ${error.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    });
};


// * Add to Wishlist
const addToWishList = (id) => {
  const tokenUrl = localStorage.getItem("token");

  if (!tokenUrl) {
    Swal.fire({
      title: "Login Required",
      text: "Please login to add items to your wishlist!",
      icon: "warning",
    });
    return;
  }

  fetch(`${baseUrl}/api/wishlist/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUrl}`,
    },
    body: JSON.stringify({ product_id: id }),
  })
    .then((response) => response.json())
    .then((result) => {
      const button = document.querySelector(
        `.wishlist-button[onclick="addToWishList(${id})"]`
      );

      if (result.message === "Product added to wishlist") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product added to wishlist!",
          showConfirmButton: false,
          timer: 1500,
        });

        button.innerHTML = `<i style="color: red;" class="fa-solid fa-heart heart"></i>`;
        fetchProducts();
      } else if (result.message === "Product removed from wishlist") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Product removed from wishlist!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Change the icon back to regular heart
        button.innerHTML = `<i class="fa-regular fa-heart heart"></i>`;
        fetchProducts();
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to update wishlist.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Error ${error.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    });
};
