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
        row.setAttribute("data-id", item.id);
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
              <span class="remove-button" data-id="${
                item.id
              }" style="cursor: pointer; justify-content: flex-start; margin-left: 20px;">
                <i class="fa-solid fa-x"></i>
              </span>
            </td>
          `;
        wishlistBody.appendChild(row);
      });

      const removeButtons = document.querySelectorAll(".remove-button");
      removeButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          const id = event.target
            .closest(".remove-button")
            .getAttribute("data-id");
          console.log(id);

          try {
            const response = await fetch(`${baseUrl}/api/wishlist/remove`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokenUrl}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ product_id: id }),
            });

            if (response.ok) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Item removed successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);
              displayCart();
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to remove item",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          } catch (error) {
            console.error("Error removing item:", error);
          }
        });
      });
    } else {
      wishlistBody.innerHTML = `
          <p style="text-align:center; font-size: 38px; color: #555; margin-top: 100px;">Your wishlist is empty!</p>`;
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
