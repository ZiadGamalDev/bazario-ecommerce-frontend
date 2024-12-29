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
              <span class="remove-button" data-id="${item.id}" style="justify-content: flex-start; margin-left: 20px;">
                <i class="fa-solid fa-x"></i>
              </span>
            </td>
          `;
        wishlistBody.appendChild(row);
      });

      const removeButtons = document.querySelectorAll(".remove-button");
      removeButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          const productId = event.target.closest(".remove-button").getAttribute("data-id");
          confirmAndRemoveFromWishlist(productId);
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

const confirmAndRemoveFromWishlist = (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      title: "Login Required",
      text: "Please login to remove items from your wishlist.",
      icon: "warning",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${baseUrl}/api/wishlist/remove`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: id }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            displayWishlist();
            Swal.fire({
              title: "Deleted!",
              text: "Product has been removed from the wishlist.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: data.message || "Failed to remove item from wishlist.",
              icon: "error",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            title: "Error",
            text: "Something went wrong while removing from wishlist.",
            icon: "error",
          });
        });
    }
  });
};

displayWishlist();