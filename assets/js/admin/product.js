const categoryList = document.getElementById('product-list');
const addProductModal = document.getElementById('addProductModal');
const editProductModal = document.getElementById('editProductModal');
const deleteProductModal = document.getElementById('deleteProductModal');
const closeAddModal = document.getElementById('closeAddModal');
const closeEditModal = document.getElementById('closeEditModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const openAddModal = document.getElementById('openAddModal');
const addProductForm = document.getElementById('addProductForm');
const editProductForm = document.getElementById('editProductForm');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const editProductId = document.getElementById('editProductId');
const editProductName = document.getElementById('editProductName');
const editCategoryName = document.getElementById('editCategory');
const editProductdescription = document.getElementById('editProductdescription');
const editStockQuantity = document.getElementById('editStockQuantity');
const editPrice = document.getElementById('editPrice');
const deleteProductId = document.getElementById('deleteProductId');
const categorySelect = document.getElementById('categorySelect');
const editCategorySelect = document.getElementById('editCategorySelect');

function editProduct(productId) {
    fetch(`${baseUrl}/api/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            const product = data.data;
            editProductId.value = product.id;
            editProductName.value = product.name;
            editPrice.value = product.price;
            editProductdescription.value = product.description;
            editStockQuantity.value = product.stock_quantity;
            editProductModal.style.display = 'block';
            // Set selected category
            for (option of editCategorySelect.options) {
                if (option.value == product.category.id) {
                    option.selected = true;
                }
            }
        })
        .catch(error => console.error('Error fetching category:', error));
}

function deleteProduct(productId) {
    deleteProductId.value = productId;
    deleteProductModal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${baseUrl}/api/products`)
        .then(response => response.json())
        .then(data => {
            const products = data.data;
            products.forEach(product => {
                const productRow = document.createElement('tr');
                productRow.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="${product.image}" alt="${product.name}"></td>
                    <td>${product.name}</td>
                    <td>${product.category.name}</td>
                    <td>${product.price}</td>
                    <td>${product.description}</td>
                    <td>${product.stock_quantity}</td>
                     <td>
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
                        </div>
                    </td>
                `;
                categoryList.appendChild(productRow);
            });
        })
        .catch((error) => console.log('Error fetching products:', error));

    // Fill category dropdown
    fetch(`${baseUrl}/api/categories`)
        .then(response => response.json())
        .then(data => {
            const categories = data.data;
            categories.forEach(category => {
                const categoryOption = document.createElement('option');
                categoryOption.value = category.id;
                categoryOption.textContent = category.name;
                categorySelect.appendChild(categoryOption);
                editCategorySelect.appendChild(categoryOption.cloneNode(true));
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    openAddModal.addEventListener('click', () => {
        addProductModal.style.display = 'block';
    });
    closeAddModal.addEventListener('click', () => {
        addProductModal.style.display = 'none';
    });
    closeEditModal.addEventListener('click', () => {
        editProductModal.style.display = 'none';
    });
    closeDeleteModal.addEventListener('click', () => {
        deleteProductModal.style.display = 'none';
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteProductModal.style.display = 'none';
    });

    addProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productImage = document.getElementById('productImage').files[0];
        const categoryId = document.getElementById('categorySelect').value;
        const price = document.getElementById('price').value;
        const descriptionName = document.getElementById('descriptionName').value;
        const stockQuantity = document.getElementById('stockQuantity').value;

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('image', productImage);
        formData.append('category_id', categoryId);
        formData.append('price', price);
        formData.append('description', descriptionName);
        formData.append('stock_quantity', stockQuantity);

        fetch(`${baseUrl}/api/admin/products`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            }
        })
            .then(response => response.json())
            .then(() => {
                addProductModal.style.display = 'none';
                location.reload();
            })
            .catch(error => console.error('Error adding category:', error));
    });

    editProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const productId = editProductId.value;
        const productName = editProductName.value;
        const productImage = document.getElementById('editProductImage').files[0];
        const categoryId = editCategorySelect.value;
        const price = editPrice.value;
        const description = editProductdescription.value;
        const stockQuantity = editStockQuantity.value;

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('image', productImage);
        formData.append('category_id', categoryId);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('stock_quantity', stockQuantity);
        formData.append('_method', 'PUT');

        fetch(`${baseUrl}/api/admin/products/${productId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update product');
                }
                return response.text();
            })
            .then(() => {
                editProductModal.style.display = 'none';
                location.reload();
            })
            .catch(error => console.error('Error updating category:', error));
    });

    confirmDeleteBtn.addEventListener('click', () => {
        fetch(`${baseUrl}/api/admin/products/${deleteProductId.value}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                deleteProductModal.style.display = 'none';
                location.reload();
            })
            .catch(error => console.error('Error deleting category:', error));
        });


 });

// ///////////////////////////////////////////////////

// Start pagination 
// Global variables for pagination
let currentPage = 1;
const productsPerPage = 7;  
let products = []; 
const productList = document.getElementById('product-list');
const paginationContainer = document.getElementById('pagination');

// Fetch products and initialize pagination
function fetchProducts() {
    fetch(`${baseUrl}/api/products`)
        .then(response => response.json())
        .then(data => {
            products = data.data;  
            renderPage(currentPage);  
            renderPagination(); 
        })
        .catch(error => console.log('Error fetching products:', error));
}

 function renderPage(page) {
     const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

     productList.innerHTML = '';

     currentProducts.forEach(product => {
        const productRow = document.createElement('tr');
        productRow.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.category.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>${product.stock_quantity}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        `;
        productList.appendChild(productRow);
    });
}

 function renderPagination() {
    const totalPages = Math.ceil(products.length / productsPerPage); 
    paginationContainer.innerHTML = '';

     if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => changePage(currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

     for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => changePage(i);
        if (i === currentPage) {
            pageButton.disabled = true; 
        }
        paginationContainer.appendChild(pageButton);
    }

     if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => changePage(currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}

// page change
function changePage(page) {
    currentPage = page;
    renderPage(currentPage);
    renderPagination();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); 
});


//////////////////////////////////////////////////////////////////////////////
 

 

 
