const categoryList = document.getElementById("category-list");
const addCategoryModal = document.getElementById("addCategoryModal");
const editCategoryModal = document.getElementById("editCategoryModal");
const deleteCategoryModal = document.getElementById("deleteCategoryModal");
const closeAddModal = document.getElementById("closeAddModal");
const closeEditModal = document.getElementById("closeEditModal");
const closeDeleteModal = document.getElementById("closeDeleteModal");
const openAddModal = document.getElementById("openAddModal");
const addCategoryForm = document.getElementById("addCategoryForm");
const editCategoryForm = document.getElementById("editCategoryForm");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const editCategoryId = document.getElementById("editCategoryId");
const editCategoryName = document.getElementById("editCategoryName");
const deleteCategoryId = document.getElementById("deleteCategoryId");

function editCategory(categoryId) {
  fetch(`${baseUrl}/api/categories/${categoryId}`)
    .then((response) => response.json())
    .then((data) => {
      const category = data.data;
      editCategoryId.value = category.id;
      editCategoryName.value = category.name;
      editCategoryModal.style.display = "block";
    })
    .catch((error) => console.error("Error fetching category:", error));
}

function deleteCategory(categoryId) {
  deleteCategoryId.value = categoryId;
  deleteCategoryModal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${baseUrl}/api/categories`)
    .then((response) => response.json())
    .then((data) => {
      const categories = data.data;
      categories.forEach((category) => {
        const categoryRow = document.createElement("tr");
        categoryRow.innerHTML = `
                    <td>${category.id}</td>
                    <td><img src="${category.image}" alt="${category.name}"></td>
                    <td>${category.name}</td>
                    <td>
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editCategory(${category.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteCategory(${category.id})">Delete</button>
                        </div>
                    </td>
                `;
        categoryList.appendChild(categoryRow);
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));

  openAddModal.addEventListener("click", () => {
    addCategoryModal.style.display = "block";
  });

  closeAddModal.addEventListener("click", () => {
    addCategoryModal.style.display = "none";
  });

  closeEditModal.addEventListener("click", () => {
    editCategoryModal.style.display = "none";
  });

  closeDeleteModal.addEventListener("click", () => {
    deleteCategoryModal.style.display = "none";
  });

  cancelDeleteBtn.addEventListener("click", () => {
    deleteCategoryModal.style.display = "none";
  });

  addCategoryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const categoryName = document.getElementById("categoryName").value;
    const categoryImage = document.getElementById("categoryImage").files[0];

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", categoryImage);

    fetch(`${baseUrl}/api/admin/categories`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        addCategoryModal.style.display = "none";
        location.reload();
      })
      .catch((error) => console.error("Error adding category:", error));
  });

  editCategoryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const categoryName = document.getElementById("editCategoryName").value;
    const categoryImage = document.getElementById("editCategoryImage").files[0];

    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }
    formData.append("_method", "PUT");

    fetch(`${baseUrl}/api/admin/categories/${editCategoryId.value}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        editCategoryModal.style.display = "none";
        location.reload();
      })
      .catch((error) => console.error("Error updating category:", error));
  });

  confirmDeleteBtn.addEventListener("click", () => {
    fetch(`${baseUrl}/api/admin/categories/${deleteCategoryId.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        deleteCategoryModal.style.display = "none";
        location.reload();
      })
      .catch((error) => console.error("Error deleting category:", error));
  });
});
