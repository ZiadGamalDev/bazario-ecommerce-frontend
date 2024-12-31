document.addEventListener("DOMContentLoaded", () => {
    loadPartial("header", "../../../pages/components/header.html");
    loadPartial("footer", "../../../pages/components/footer.html");
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
const extraLink = document.querySelector(".extra-link2")
const relatedProductRow = document.querySelector(".section-products-row");
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");

// Fetch product details
function fetchProductDetails(id) {
    fetch(`${baseUrl}/api/products/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        })
        .then(product => {
            const productData = product.data;
            displayProductDetails(productData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Display product details
function displayProductDetails(product) {
    productImg.innerHTML = `<img src="${product.image}" alt="" class="productImage">`;
    productTitle.textContent = product.name;
    // ratingNum.classList.add("ratingNum");
    // ratingNum.textContent = product.rating;
    productPrice.innerHTML = `${product.price} LE`;
    productDiscription.innerHTML = `<p>${product.description}</p>`;
    productCategory.innerHTML = `<strong>Category: </strong>${product.category.name}.`;
    productStock.innerHTML = `<strong>In Stock: </strong>${product.stock_quantity}`;

    extraLink.innerHTML = `
    <button class="btn1" onclick="addToCart(${product.id})">
        <i class="fal fa-shopping-cart cart"></i>
        Add to Cart
    </button>
    <button class="btn2" data-wishlist-id="${product.id}" onclick="addToWishList(${product.id})">
        <i class="fa-regular fa-heart"></i>
    </button>
    `;

    // Check if the product is already in the wishlist and update the style
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(product.id)) {
        updateWishlistButtonStyle(product.id, true);
    }

    // updateStars(document.querySelector(".stars"), product.rating);

    fetchRelatedProducts(product.category.id, product.id);

    // displayReviews(product.id);
}


//* Add Reviews
var reviewList = document.getElementById("reviews-list");
var submitReviewButton = document.getElementById("submit-review-btn");
var reviewText = document.getElementById("review-text");
var ratingStarsContainer = document.getElementById("rating-stars");
var errorMessege = document.querySelector(".submit-review span");
var userRating = 0;

function displayReviews(productId) {
    fetch(`${baseUrl}/api/reviews/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch reviews");
            return response.json();
        })
        .then(data => {
            console.log( data);

            const reviews = data?.data || [];
            const reviewList = document.getElementById("reviews-list");
            reviewList.innerHTML = "";

            if (reviews.length === 0) {
                reviewList.innerHTML = `<p>No reviews yet. Be the first to review this product!</p>`;
                return;
            }

            reviews.forEach(review => {
                const reviewDiv = document.createElement("div");
                reviewDiv.classList.add("review-item");
                reviewDiv.innerHTML = `
                    <div class="review-rating">${`<i class="fa fa-star"></i>`.repeat(review.rating)}</div>
                    <p>${review.feedback}</p>
                `;
                reviewList.appendChild(reviewDiv);
            });
        })
        .catch(error => console.error("Error fetching reviews:", error));
}

submitReviewButton.addEventListener("click", () => {
    const reviewTextValue = reviewText.value.trim();
    if (!token) {
        console.error("Authorization token is missing or invalid.");
        errorMessege.textContent = "Authentication failed. Please log in again.";
        return;
    }

    if (reviewTextValue && userRating > 0) {
        console.log("Request Data:", { product_id: productId, rating: userRating, feedback: reviewTextValue });

        const formData = new FormData();
        formData.append("product_id", productId);
        formData.append("rating", userRating);
        formData.append("feedback", reviewTextValue);

        fetch(`${baseUrl}/api/reviews`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then(response => {
                console.log(response)
                // console.log("Response Status:", response.status);
                if (!response.ok) throw new Error("Failed to submit review");
                return response.json();
            })
            .then(() => {
                reviewText.value = "";
                userRating = 0;
                updateStars(ratingStarsContainer, userRating);
                displayReviews(productId);
            })
            .catch(error => console.error("Error submitting review:", error));
    } else {
        errorMessege.textContent = "Please complete your data to make a review.";
    }
});


//* Add Reviews
// var reviewList = document.getElementById("reviews-list");
// var submitReviewButton = document.getElementById("submit-review-btn");
// var reviewText = document.getElementById("review-text");
// var reviewName = document.getElementById("review-name");
// var ratingStarsContainer = document.getElementById("rating-stars");
// var errorMessege = document.querySelector(".submit-review span");
// var userRating = 0;

// function displayReviews(productId) {
//     fetch(`${baseUrl}/api/products/${productId}/reviews`)
//         .then(response => response.json())
//         .then(reviews => {
//             const reviewList = document.getElementById("reviews-list");
//             reviewList.innerHTML = "";
//             reviews.forEach(review => {
//                 const reviewDiv = document.createElement("div");
//                 reviewDiv.classList.add("review-item");
//                 reviewDiv.innerHTML = `
//                     <h3><strong>${review.name}</strong></h3>
//                     <div class="review-rating">${`<i class="fa fa-star"></i>`.repeat(review.rating)}</div>
//                     <span>${review.date}</span>
//                     <p>${review.text}</p>
//                 `;
//                 reviewList.appendChild(reviewDiv);
//             });
//         })
//         .catch(error => console.error('Error fetching reviews:', error));
// }

// ratingStarsContainer.addEventListener("click", (event) => {
//     if (event.target.classList.contains("fa-star")) {
//         userRating = parseInt(event.target.getAttribute("data-value"));
//         updateStars(ratingStarsContainer, userRating);
//     }
// });

// function updateStars(starContainer, rating) {
//     const stars = starContainer.querySelectorAll(".fa-star");

//     stars.forEach((star) => {
//         const starValue = parseInt(star.getAttribute("data-value"), 10);
//         if (starValue <= rating) {
//             star.classList.add("filled");
//         } else {
//             star.classList.remove("filled");
//         }
//     });
// }

// submitReviewButton.addEventListener("click", () => {
//     const reviewNameValue = reviewName.value.trim();
//     const reviewTextValue = reviewText.value.trim();

//     if (reviewNameValue && reviewTextValue && userRating > 0) {

//         const reviewDateAndTime = new Date();
//         const reviewDate = reviewDateAndTime.toLocaleDateString();
//         const reviewTime = reviewDateAndTime.toLocaleTimeString();

//         let reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
        
//         const newReview = {
//             name: reviewNameValue,
//             text: reviewTextValue,
//             rating: userRating,
//             date: reviewDate,
//             time: reviewTime,
//         };

//         reviews.push(newReview);
//         localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

//         reviewName.value = "";
//         reviewText.value = "";
//         userRating = 0; 
//         updateStars(ratingStarsContainer, userRating);
//         displayReviews(productId);
//     } else {
//         errorMessege.textContent = "Please complete your data to make a review.";
//     }
// });


// Fetch related products
function fetchRelatedProducts(categoryId, currentProductId) {
    fetch(`${baseUrl}/api/products?category_id=${categoryId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch related products');
            }
            return response.json();
        })
        .then(products => {
            const relatedProducts = products.data.filter(product => product.id !== currentProductId);
            displayRelatedProducts(relatedProducts);
        })
        .catch(error => {
            console.error('Error fetching related products:', error);
        });
}

// Display related products
function displayRelatedProducts(products) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    relatedProductRow.innerHTML = "";
    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "related-product-card";
        productCard.setAttribute("data-id", product.id);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="related-product-description">
                <h2>${product.name}</h2>
                <h4>${product.price} LE</h4>
            </div>
            <button onclick="addToCart(${product.id})"><i class="fal fa-shopping-cart cart"></i></button>
            <button data-wishlist-id="${product.id}" onclick="addToWishList(${product.id})"><i class="fa-regular fa-heart"></i></button>
        `;

        relatedProductRow.appendChild(productCard);

        // updateStars(productCard.querySelector(".star"), product.rating);

        // Check if the product is already in the wishlist and update the style
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

// Activate size options
document.addEventListener("DOMContentLoaded", () => {
    if (productId) {
        fetchProductDetails(productId);
    }

    const sizeOptions = document.querySelectorAll(".product-size ul li a");
    sizeOptions.forEach((option) => {
        option.addEventListener("click", (event) => {
            event.preventDefault();
            sizeOptions.forEach((opt) => opt.classList.remove("active-size"));
            option.classList.add("active-size");
        });
    });
});




//* Related Products Swipper
let currentIndex = 0;

function moveSlide(direction) {
    const track = document.querySelector('.section-products-row');
    const slides = document.querySelectorAll('.related-product-card');
    const slideWidth = slides[0].offsetWidth + 20;
    const totalSlides = slides.length;

    currentIndex += direction;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    if (currentIndex >= totalSlides) currentIndex = 0;

    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

