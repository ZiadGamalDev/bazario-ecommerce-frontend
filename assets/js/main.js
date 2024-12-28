document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "pages/components/header-index.html");
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
// const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
// const loginLink = document.getElementById("login-link");
// const registerLink = document.getElementById("register-link");
// const dashboardLink = document.getElementById("dashboard-link");
// const logoutBtn = document.getElementById("logout-btn");

// if (loggedInUser) {
//   loginLink.style.display = "none";
//   registerLink.style.display = "none";

//   dashboardLink.style.display = "inline";
//   dashboardLink.textContent =
//     loggedInUser.role === "admin"
//       ? `Hi, ${loggedInUser.username} > Dashboard`
//       : `Hi, ${loggedInUser.username} > Dashboard`;
//   dashboardLink.href =
//     loggedInUser.role === "admin"
//       ? "../../admin/adminDashboard.html"
//       : "../../Customer/UserDashboard.html";

//   logoutBtn.style.display = "inline";
// } else {
//   dashboardLink.style.display = "none";
//   logoutBtn.style.display = "none";
// }

// logoutBtn.addEventListener("click", () => {
//   localStorage.removeItem("loggedInUser");
//   window.location.reload();
// });

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

  try {
    const response = await fetch(`https://ecommerce.ershaad.net/api/products`);
    const data = await response.json();
    console.log(data);

    if (data.data) {
      const featuredProducts = data.data.slice(0, 4);

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
            <span class="product-catagory">${product.category.name}</span>
            <h4>
              <a href="../../Products/SingleCategory.html?categoryId=${product.category.id}">
                ${product.name}
              </a>
            </h4>
            <p>${product.description}</p>
            <div class="product-bottom-details">
              <div class="product-price">${product.price}$</div>
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
      productList.innerHTML = `<p>Sorry, no products found.</p>`;
    }
  } catch (e) {
    console.error("Error fetching products:", e);
    productList.innerHTML = `<p>There was an error fetching the products.</p>`;
  }
};


fetchProducts();

//      *Get Categories name in home
const fetchCategories = async () => {
  const hmove = document.querySelector(".hmove");

  try {
    const response = await fetch(`https://ecommerce.ershaad.net/api/categories`);
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


//        * Add to cart
const addToCartList = (id) => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    Swal.fire({
      title: "Login Required",
      text: "Please login to add items to your cart!",
      icon: "warning",
    });
    return;
  }

  let cart = JSON.parse(localStorage.getItem(`${loggedInUser}-cart`)) || [];
  if (!cart.includes(id)) {
    cart.push(id);
    localStorage.setItem(`${loggedInUser}-cart`, JSON.stringify(cart));
    Swal.fire({
      title: "Added!",
      text: "Product has been added to your cart.",
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Already in cart",
      text: "This product is already in your cart.",
      icon: "info",
    });
  }
};


//          * Add to Wish List
const addToWishList = (id) => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    Swal.fire({
      title: "Login Required",
      text: "Please login to add items to your whish List!",
      icon: "warning",
    });
    return;
  }

  let wishList = JSON.parse(localStorage.getItem("wishList")) || [];
  if (!wishList.includes(id)){
    wishList.push(id);
    localStorage.setItem(`${loggedInUser}-wishlist`, JSON.stringify(wishList));
    Swal.fire({
      title: "Added!",
      text: "Product has been added to your wishlist.",
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Already in cart",
      text: "This product is already in your wishlist.",
      icon: "info",
    });
  }
}