document.addEventListener("DOMContentLoaded", () => {
  loadPartial("footer", "../../../pages/components/footer.html");
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
const checkbox = document.querySelector('.hamburger .checkbox');
const closeButton = document.querySelector('.close-btn');

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


const productsSection = document.getElementById("product-container");
const sortBySelect = document.getElementById("sort-by-select");
const categoriesContainer = document.querySelector(".categories ul");

let currentProducts = [];

// ** Fetch Products **
function fetchAllProducts() {
  const tokenUrl = localStorage.getItem("token");

  fetch(`${baseUrl}/api/products`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenUrl}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    })
    .then((product) => {
      currentProducts = product.data;
      displayAllProducts(currentProducts);
    })
    .catch((error) => console.error(error));
}

// ** Fetch Categories **
async function fetchCategories() {
  try {
    const response = await fetch(`${baseUrl}/api/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");

    const categories = await response.json();
    categoriesContainer.innerHTML = "";

    categories.data.forEach((category) => {
      const listItem = document.createElement("li");
      const heading = document.createElement("h3");
      const categoryImage = document.createElement("img");

      heading.textContent = category.name;
      categoryImage.src = category.image;
      categoryImage.alt = category.name;

      heading.addEventListener("click", () => getByCategory(category.id));

      listItem.appendChild(categoryImage);
      listItem.appendChild(heading);
      categoriesContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

//** Sort products based on the selected option **
function sortProducts(products, sortBy) {
  switch (sortBy) {
    case "alphabetical-sort":
      return products.sort((a, b) => a.name.localeCompare(b.name));
    case "alphabetical-reverse":
      return products.sort((a, b) => b.name.localeCompare(a.name));
    case "high-price":
      return products.sort((a, b) => b.price - a.price);
    case "low-price":
      return products.sort((a, b) => a.price - b.price);
    case "high-rating":
      return products.sort((a, b) => b.rating - a.rating);
    case "low-rating":
      return products.sort((a, b) => a.rating - b.rating);
    default:
      return products;
  }
}

// Handle sorting
sortBySelect.addEventListener("change", () => {
  const selectedOption = sortBySelect.value;
  const sortedProducts = sortProducts([...currentProducts], selectedOption);
  displayAllProducts(sortedProducts);
});

// ** Display Products **
function displayAllProducts(products) {
  productsSection.innerHTML = "";

  products.forEach((product) => {
    const productsCard = document.createElement("div");
    productsCard.className = "product";
    productsCard.setAttribute("data-id", product.id);
    productsCard.innerHTML = `
            <a href="/pages/customer/singleProduct.html?productId=${
              product.id
            }">
              <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="description">
                <h5>${product.name}</h5>
                <div class="star" data-rating="${product.rating}">
                    <i class="fa fa-star" data-value="1"></i>
                    <i class="fa fa-star" data-value="2"></i>
                    <i class="fa fa-star" data-value="3"></i>
                    <i class="fa fa-star" data-value="4"></i>
                    <i class="fa fa-star" data-value="5"></i>
                    <span>${product.rating.toFixed(1)}</span>
                </div>
                <h4>${product.price}LE</h4>
            </div>
            <button class="cart-button" onclick="addToCartList(${
              product.id
            })">${
      product.is_in_cart ? `` : `<i class="fal fa-shopping-cart cart"></i>`
    }</button>
            <button class="wishlist-button" onclick="addToWishList(${
              product.id
            })">${
      product.is_in_wishlist
        ? `<i style="color: red;" class="fa-solid fa-heart heart"></i>`
        : `<i class="fa-regular fa-heart heart"></i>`
    }</button>
        `;

    productsSection.appendChild(productsCard);

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(product.id)) {
      updateWishlistButtonStyle(product.id, true);
    }
  });
  updateProductStars();
}

//** Update product stars based on ratings **
function updateProductStars() {
  var starContainers = document.querySelectorAll(".star");
  starContainers.forEach((container) => {
    const rating = parseFloat(container.getAttribute("data-rating"));
    const stars = container.querySelectorAll(".fa-star");

    stars.forEach((star) => {
      if (parseFloat(star.getAttribute("data-value")) <= rating) {
        star.classList.add("active-star");
      } else {
        star.classList.remove("active-star");
      }
    });
  });
}

//** Filter products by category **
function getByCategory(categoryId) {
  fetch(`${baseUrl}/api/products`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    })
    .then((response) => {
      const filteredProducts = response.data.filter((product) => {
        if (!product.category) {
          console.warn("Skipping product due to missing category:", product);
          return false;
        }
        return product.category.id === categoryId;
      });
      currentProducts = filteredProducts;
      displayAllProducts(currentProducts);
    })
    .catch((error) =>
      console.error("Error fetching products by category:", error)
    );
}

// ** Filter Products by Price **
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const applyPriceFilterButton = document.getElementById("apply-price-filter");

function filterByPrice(products, minPrice, maxPrice) {
  return products.filter((product) => {
    const price = parseFloat(product.price);
    return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
  });
}

applyPriceFilterButton.addEventListener("click", () => {
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  const filteredProducts = filterByPrice(currentProducts, minPrice, maxPrice);
  displayAllProducts(filteredProducts);
});

// ** Search Products **
const searchInput = document.querySelector(".search");
searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();

  const endpoint = value
    ? `${baseUrl}/api/products?search=${encodeURIComponent(value)}`
    : `${baseUrl}/api/products`;

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to search products");
      return response.json();
    })
    .then((data) => {
      currentProducts = data.data || [];
      displayAllProducts(currentProducts);
    })
    .catch((error) => console.error("Error searching products:", error));
});

// ** Initialize Products **
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchAllProducts();
});

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
      Authorization: `Bearer ${tokenUrl}`,
    },
    body: JSON.stringify({ product_id: id }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "Product added to cart") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product has been added successfully to cart",
          showConfirmButton: false,
          timer: 1500,
        });

        fetchAllProducts();
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
      console.log("Wishlist API Response:", result);
      if (result.message === "Product added to wishlist") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product has been added successfully to wishlist",
          showConfirmButton: false,
          timer: 1500,
        });

        fetchAllProducts();
      } else {
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to add item to wishlist.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `Error ${error.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    });
};
