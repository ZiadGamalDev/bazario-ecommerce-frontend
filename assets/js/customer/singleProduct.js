document.addEventListener("DOMContentLoaded", () => {
  loadPartial("footer", "../../../pages/components/footer.html");
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

const productImg = document.querySelector(".product-img");
const productTitle = document.querySelector(".product-title");
const productRate = document.querySelector(".stars");
const productPrice = document.querySelector(".price .primary-color");
const discountPercentage = document.querySelector(".price .second-color");
const productCategory = document.querySelector(".product-category");
const productStock = document.querySelector(".product-stock");
const ratingNum = document.querySelector(".rating span");
const productDiscription = document.querySelector(".product-discription");
const extraLink = document.querySelector(".extra-link2");
const relatedProductRow = document.querySelector(".section-products-row");
var reviewList = document.getElementById("reviews-list");
var submitReviewButton = document.getElementById("submit-review-btn");
var reviewText = document.getElementById("review-text");
var ratingStarsContainer = document.getElementById("rating-stars");
var errorMessege = document.querySelector(".submit-review span");
var userRating = 0;
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");

// Fetch product details
function fetchProductDetails(id) {
  fetch(`${baseUrl}/api/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      return response.json();
    })
    .then((product) => {
      const productData = product.data;
      displayProductDetails(productData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Display product details
function displayProductDetails(product) {
  productImg.innerHTML = `<img src="${product.image}" alt="" class="productImage">`;
  productTitle.textContent = product.name;
  ratingNum.classList.add("ratingNum");
  ratingNum.textContent = product.rating.toFixed(1);
  productPrice.innerHTML = `${product.price} LE`;
  productDiscription.innerHTML = `<p>${product.description}</p>`;
  productCategory.innerHTML = `<strong>Category: </strong>${product.category.name}.`;
  productStock.innerHTML = `<strong>In Stock: </strong>${product.stock_quantity}`;

  extraLink.innerHTML = `
    ${product.is_in_cart
      ? ``
      : `<button class="btn1" onclick="addToCartList(${product.id})">
            <i class="fal fa-shopping-cart cart"></i>
            Add to Cart
          </button>`
    }
    
    <a href="/pages/customer/checkout.html?productId=${product.id
    }" class="btn1">
        <i class="fa-solid fa-credit-card"></i>
        Puy Now
    </a>
    <button class="btn2" data-wishlist-id="${product.id
    }" onclick="addToWishList(${product.id})">
        ${product.is_in_wishlist
      ? `<i style="color: red;" class="fa-solid fa-heart heart"></i>`
      : `<i class="fa-regular fa-heart heart"></i>`
    }
    </button>
    `;

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.includes(product.id)) {
    updateWishlistButtonStyle(product.id, true);
  }

  updateStars(document.querySelector(".stars"), product.rating);

  fetchRelatedProducts(product.category.id, product.id);

  displayReviews(product.id);
}

//* Add Reviews
function displayReviews(productId) {
  fetch(`${baseUrl}/api/products/${productId}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    })
    .then((data) => {
      // console.log( data.data);

      const product = data.data;
      // console.log(product);
      const reviewList = document.getElementById("reviews-list");
      reviewList.innerHTML = "";

      if (product.reviews.length === 0) {
        reviewList.innerHTML = `<p>No reviews yet. Be the first to review this product!</p>`;
        return;
      }

      product.reviews.forEach((review) => {
        // fill review form
        if (review.user.id === JSON.parse(localStorage.getItem("userData")).user.id) {
          fillReviewForm(review);
        }
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review-item");
        reviewDiv.innerHTML = `
                    <div class="review-rating">${`<i class="fa fa-star"></i>`.repeat(
          review.rating
        )}</div>
                    <small>Submitted on: ${review.created_at}</small>
                    <p>${review.feedback}</p>
                `;
        reviewList.appendChild(reviewDiv);
      });
    })
    .catch((error) => console.error("Error fetching reviews:", error));
}

function fillReviewForm(review) {
  reviewText.value = review.feedback;
  userRating = review.rating;
  updateStars(ratingStarsContainer, userRating);
  submitReviewButton.textContent = "Update Review";
  submitReviewButton.setAttribute("data-review-id", review.id);
}

submitReviewButton.addEventListener("click", () => {
  const reviewTextValue = reviewText.value.trim();
  const tokenUrl = localStorage.getItem("token");
  const reviewId = submitReviewButton.getAttribute("data-review-id");

  if (reviewId) {
    fetch(`${baseUrl}/api/reviews/${reviewId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenUrl}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _method: "PUT",
        product_id: productId,
        feedback: reviewTextValue,
        rating: userRating,
      }),
    })
      .then(handleResponse)
      .then(() => {
        window.location.reload();
      });
  } else {

    if (!tokenUrl) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to make a review!",
        icon: "warning",
      });
      return;
    }

    if (reviewTextValue && userRating > 0) {
      // console.log("Request Data:", { product_id: productId, rating: userRating, feedback: reviewTextValue });

      fetch(`${baseUrl}/api/reviews`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${tokenUrl}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          rating: userRating,
          feedback: reviewTextValue,
        }),
      })
        .then(response => {
          // console.log(response);

          if (!response.ok)
            errorMessege.textContent = "You already make a review.";
          return response.json();
        })
        .then((data) => {
          // console.log(data.data);

          reviewText.value = "";
          userRating = 0;
          updateStars(ratingStarsContainer, userRating);

          const newReview = data.data;
          const reviewDiv = document.createElement("div");
          reviewDiv.classList.add("review-item");
          reviewDiv.innerHTML = `
                    <div class="review-rating">${`<i class="fa fa-star"></i>`.repeat(parseInt(newReview.rating, 10))}</div>
                    <small>Submitted on: ${newReview.created_at}</small>
                    <p>${newReview.feedback}</p>
                `;
          const reviewList = document.getElementById("reviews-list");
          reviewList.prepend(reviewDiv);
        })
        .catch((error) => console.error("Error submitting review:", error));
    } else {
      errorMessege.textContent = "Please complete your data to make a review.";
    }
  }
});

if (ratingStarsContainer) {
  ratingStarsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-star")) {
      userRating = parseInt(event.target.getAttribute("data-value"));
      updateStars(ratingStarsContainer, userRating);
    }
  });
}

// Fetch related products
function fetchRelatedProducts(categoryId, currentProductId) {
  fetch(`${baseUrl}/api/products?category_id=${categoryId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch related products");
      }
      return response.json();
    })
    .then((products) => {
      const relatedProducts = products.data.filter(
        (product) => product.id !== currentProductId
      );
      displayRelatedProducts(relatedProducts);
    })
    .catch((error) => {
      console.error("Error fetching related products:", error);
    });
}

// Display related products
function displayRelatedProducts(products) {
  relatedProductRow.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "related-product-card";
    productCard.setAttribute("data-id", product.id);

    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="related-product-description">
                <h2>${product.name}</h2>
                <div class="star">
                    <i class="fa fa-star" data-value="1"></i>
                    <i class="fa fa-star" data-value="2"></i>
                    <i class="fa fa-star" data-value="3"></i>
                    <i class="fa fa-star" data-value="4"></i>
                    <i class="fa fa-star" data-value="5"></i>
                    <span>${product.rating.toFixed(1)}</span>
                </div>
                <h4>${product.price} LE</h4>
            </div>
            <button onclick="addToCartList(${product.id
      })"><i class="fal fa-shopping-cart cart"></i></button>
            <button data-wishlist-id="${product.id}" onclick="addToWishList(${product.id
      })"><i class="fa-regular fa-heart"></i></button>
        `;

    relatedProductRow.appendChild(productCard);

    updateStars(productCard.querySelector(".star"), product.rating);

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(product.id)) {
      updateWishlistButtonStyle(product.id, true);
    }

    productCard.addEventListener("click", (event) => {
      if (!event.target.closest("button")) {
        window.location.href = `singleProduct.html?productId=${product.id}`;
      }
    });
  });
}

// Update stars based on the rating
function updateStars(starContainer, rating) {
  const roundedRating = Math.round(rating);
  const stars = starContainer.querySelectorAll(".fa-star");

  stars.forEach((star) => {
    const starValue = parseInt(star.getAttribute("data-value"), 10);
    if (starValue <= roundedRating) {
      star.classList.add("filled");
    } else {
      star.classList.remove("filled");
    }
  });
}

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
      Authorization: `Bearer ${tokenUrl}`,
    },
    body: JSON.stringify({ product_id: id }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === "Product added to cart") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Item Added successfully to the cart",
          showConfirmButton: false,
          timer: 1500,
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
        position: "top-end",
        icon: "error",
        title: "Something went wrong while adding item to the cart",
        showConfirmButton: false,
        timer: 1500,
      });
    });
};

// * Add to wishList
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
          position: "top-end",
          icon: "success",
          title: "Item Added successfully to the whitelist",
          showConfirmButton: false,
          timer: 1500,
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
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Error ${error.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    });
};

function updateWishlistButtonStyle(productId, isAdded) {
  const wishlistButton = document.querySelector(
    `[data-wishlist-id="${productId}"]`
  );
  if (wishlistButton) {
    if (isAdded) {
      wishlistButton.innerHTML = `<i class="fa-solid fa-heart"></i>`;
      wishlistButton.classList.add("wishlist-added");
    } else {
      wishlistButton.innerHTML = `<i class="fa-regular fa-heart"></i>`;
      wishlistButton.classList.remove("wishlist-added");
    }
  }
}

//* Related Products Swipper
let currentIndex = 0;

function moveSlide(direction) {
  const track = document.querySelector(".section-products-row");
  const slides = document.querySelectorAll(".related-product-card");
  const slideWidth = slides[0].offsetWidth + 20;
  const totalSlides = slides.length;

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = totalSlides - 1;
  if (currentIndex >= totalSlides) currentIndex = 0;

  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProductDetails(productId);
});
