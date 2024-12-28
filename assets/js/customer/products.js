document.addEventListener("DOMContentLoaded", () => {
    loadPartial("header", "../../../pages/components/header.html");
    loadPartial("footer", "../../../pages/components/footer.html");
});


const productsSection = document.getElementById("product-container");
const sortBySelect = document.getElementById("sort-by-select");
const categoriesContainer = document.querySelector(".categories ul"); 

let currentProducts = [];

// ** Fetch Products **
function fetchAllProducts() {
    fetch(`${baseUrl}/api/products`)
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

        categories.data.forEach(category => {
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
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    products.forEach((product) => {
        const productsCard = document.createElement("div");
        productsCard.className = "product";
        productsCard.setAttribute("data-id", product.id);
        productsCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="description">
                <h5>${product.name}</h5>
                <h4>${product.price}LE</h4>
            </div>
            <button class="cart-button"><i class="fal fa-shopping-cart cart"></i></button>
            <button class="wishlist-button" data-wishlist-id="${product.id}"><i class="fa-regular fa-heart"></i></button>
        `;

        // redirect to SingleProduct page
        productsCard.addEventListener("click", () => {
            var productId = productsCard.getAttribute("data-id");
            window.location.href = `singleProduct.html?productId=${productId}`;
        });

        // Add to Cart button
        const cartButton = productsCard.querySelector(".cart-button");
        cartButton.addEventListener("click", (event) => {
            event.stopPropagation();
            addToCart(product.id);
        });

        // Add to Wishlist button
        const wishlistButton = productsCard.querySelector(".wishlist-button");
        wishlistButton.addEventListener("click", (event) => {
            event.stopPropagation(); 
            addToWishList(product.id);
        });

        productsSection.appendChild(productsCard);

        // Update wishlist button if product is in wishlist
        if (wishlist.includes(product.id)) {
            updateWishlistButtonStyle(product.id, true);
        }
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
        .catch((error) => console.error("Error fetching products by category:", error));
}

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

