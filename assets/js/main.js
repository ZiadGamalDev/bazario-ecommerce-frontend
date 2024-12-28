document.addEventListener("DOMContentLoaded", () => {
  // loadPartial("header", "pages/components/header-index.html");
  loadPartial(".lastSection", "pages/components/footer.html");
});


// // *reloader
// window.addEventListener("load", () => {
//   document.querySelector(".preloader").classList.add("preloader-deactivate");
// });

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

// //      * Logged User and Log out
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
    dashboardLink.textContent =
      userData.user.is_admin === 1
        ? `Hi, ${userData.user.name} > Admin Dashboard`
        : `Hi, ${userData.user.name} > User Dashboard`;

    dashboardLink.href =
      userData.user.is_admin === 1
        ? "../../admin/adminDashboard.html"
        : "../../Customer/UserDashboard.html";

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


//          * swiper
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.querySelector('.next').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlidePosition();
});

document.querySelector('.prev').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlidePosition();
});

function updateSlidePosition() {
  const slider = document.querySelector('.slider');
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlidePosition();
}, 2500);

const fetchProducts = async () => {
  const productList = document.getElementById("product-list");

  if (!productList) {
    console.error("Element with ID 'product-list' not found!");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/products?limit=10`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Products:", data);

    productList.innerHTML = "";

    if (data.data && data.data.length > 0) {
      const featuredProducts = data.data;

      featuredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
          <div class="product-tumb">
            <a href="../../Products/SingleProduct.html?productId=${product.id}">
              <img src="${product.image}" alt="${product.name}">
            </a>
          </div>
          <div class="product-details">
            <span class="product-catagory">${product.category?.name}</span>
            <h4>
              <a href="../../Products/SingleCategory.html?categoryId=${product.category?.id || "#"}">
                ${product.name}
              </a>
            </h4>
            <p>${product.description || "No description available."}</p>
            <div class="product-bottom-details">
              <div class="product-price">${product.price ? `${product.price}$` : "Price not available"}</div>
              <div class="product-links">
                <button onclick="addToWishList(${product.id})">
                  <i class="fal fa-heart"></i>
                </button>
                <button onclick="addToCartList(${product.id})">
                  <i class="fal fa-shopping-cart"></i>
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
    console.log(data);

    if (data.data) {
      const categories = [...new Set(data.data.map((product) => product.name))];

      categories.forEach((category) => {
        const categoryItem = document.createElement("div");
        categoryItem.className = "hitem";
        categoryItem.textContent = category;

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

// * Add to Cart
const addToCartList = (id) => {
  const tokenUrl = localStorage.getItem("token");

  if (!tokenUrl) {
    Swal.fire({
      title: "Login Required",
      text: "Please login to add items to your wishlist!",
      icon: "warning",
    });
    return;
  }

  fetch(`${baseUrl}/api/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenUrl}`,
    },
    body: JSON.stringify({ product_id: id }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Wishlist API Response:", result);
      if (result.message === "Product added to cart") {
        Swal.fire({
          title: "Added!",
          text: "Product has been added to your cart.",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to add item to cart.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while adding to cart.",
        icon: "error",
      });
    });  
};



//          * Add to Wish List
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
      "Authorization": `Bearer ${tokenUrl}`,
    },
    body: JSON.stringify({ product_id: id }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Wishlist API Response:", result);
      if (result.message === "Product added to wishlist") {
        Swal.fire({
          title: "Added!",
          text: "Product has been added to your wishlist.",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to add item to wishlist.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while adding to wishlist.",
        icon: "error",
      });
    });  
};