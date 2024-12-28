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

 // ///////////////////////////////////////////////////
 
function editProduct(productId) {
    // api/products/2
    fetch(`${baseUrl}/api/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            const product=data.data;
            editProductId.value=product.id;
            editProductName.value=product.name;
            editCategoryName.value=product.category.name;
            editPrice.value=product.price;
            editProductdescription.value=product.description;
            editStockQuantity.value=product.stock_quantity;
            editProductModal.style.display = 'block'
        })
        .catch(error => console.error('Error fetching category:', error));
}
// ////////////////////////////////////////////////////////////
 
function deleteProduct(productId) {
    deleteProductId.value = productId;
    deleteProductModal.style.display = 'block';
}
// ///////////////////////////////////////////////////////

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

        addProductForm.addEventListener('submit', function(event) {
            event.preventDefault();
          
            const productName = document.getElementById('productName').value;
            const productImage = document.getElementById('productImage').files[0];
            const categoryPro = document.getElementById('categoryName').value;
            const price = document.getElementById('price').value;
            const descriptionName = document.getElementById('descriptionName').value;
            const stockQuantity = document.getElementById('stockQuantity').value;
 

            const formData = new FormData();
            formData.append('name', productName);
            formData.append('image', productImage);
            formData.append('category', categoryPro);
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
           
            const productName = document.getElementById('editProductName').value;
            const productImage = document.getElementById('editProductImage').files[0];
            const categoryPro = document.getElementById('editCategory').value;
            const price = document.getElementById('editPrice').value;
            const descriptionName = document.getElementById('editProductdescription').value;
            const stockQuantity = document.getElementById('editStockQuantity').value;

    
            const formData = new FormData();
            formData.append('name', productName);
            if (productImage) {
                formData.append('image', productImage);
            }
             formData.append('category', categoryPro);
            formData.append('price', price);
            formData.append('description', descriptionName);
            formData.append('stock_quantity', stockQuantity);


            formData.append('_method', 'PUT');
    
            fetch(`${baseUrl}/api/admin/products/${editProductId.value}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                }
            })
            .then(response => response.json())
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
                deleteCategoryModal.style.display = 'none';
                location.reload();
            })
            .catch(error => console.error('Error deleting category:', error));
        });


    });

 
