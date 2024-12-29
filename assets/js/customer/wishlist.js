const displayWishlist = async () => {
  const wishlistBody = document.getElementById("wishlist-table-body");
  const tokenUrl = localStorage.getItem("token");

  if (!tokenUrl) {
    wishlistBody.innerHTML = `
        <p style="text-align:center; font-size: 40px; color: #ffba00; margin-top: 100px;">
          <i class="fa-solid fa-triangle-exclamation"></i> Please login to view your wishlist!
        </p>`;
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/wishlist/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenUrl}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.data && data.data.length > 0) {
      wishlistBody.innerHTML = "";

      data.data.forEach((item) => {
        const row = document.createElement("tr");
        row.setAttribute('data-id', item.id);  // إضافة ID للـ row نفسه.
        row.innerHTML = `
            <td style="font-weight: 600">
              <img
                src="${item.image}"
                alt="${item.name}"
                class="product-image"
              />
            </td>
            <td>${item.name}</td>
            <td>$${parseFloat(item.price).toFixed(2)}</td>
            <td>
              <span class="remove-button" data-id="${item.id}" style="cursor: pointer; justify-content: flex-start; margin-left: 20px;">
                <i class="fa-solid fa-x"></i>
              </span>
            </td>
          `;
        wishlistBody.appendChild(row);
      });

      // إضافة listener للحذف
      const removeButtons = document.querySelectorAll(".remove-button");
      removeButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          const productId = event.target.closest(".remove-button").getAttribute("data-id");

          const token = localStorage.getItem("token");

          if (!token) {
            Swal.fire({
              title: "Login Required",
              text: "Please login to remove items from your wishlist.",
              icon: "warning",
            });
            return;
          }

          try {
            const res = await fetch(`${baseUrl}/api/wishlist/remove`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ product_id: productId }),
            });

            if (!res.ok) {
              throw new Error("Network response was not ok");
            }

            const data = await res.json();

            if (data.success) {
              // إزالة المنتج من الـ DOM مباشرة.
              const rowToRemove = document.querySelector(`[data-id="${productId}"]`).closest("tr");
              rowToRemove.remove();

              Swal.fire({
                title: "Deleted!",
                text: "Product has been ggggggggggggggggg removed from the wishlist.",
                icon: "success",
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
              });

              // إعادة عرض الويش ليست بعد حذف المنتج
              displayWishlist();

            } else {
              Swal.fire({
                title: "Error",
                text: data.message || "Failed to remove item from wishlist.",
                icon: "error",
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
              });
            }
          } catch (error) {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: `Error: ${error.message}`,
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
      });
    } else {
      wishlistBody.innerHTML = `
          <p style="text-align:center; font-size: 18px; color: #555; margin-top: 50px;">Your wishlist is empty.</p>`;
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    wishlistBody.innerHTML = `
        <p style="text-align:center; font-size: 18px; color: red; margin-top: 50px;">
          <i class="fa-solid fa-triangle-exclamation"></i> There was an error fetching the wishlist. Please try again later.
        </p>`;
  }
};

displayWishlist();
