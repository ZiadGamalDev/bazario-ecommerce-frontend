const displayWishlist = async () => {
  const wishlistBody = document.getElementById("wishlist-table-body");
  const token = getLoggedInUserToken();

  if (!token) {
    wishlistBody.innerHTML = `<p style="text-align:center; font-size: 40px; color: #ffba00; margin-top: 100px;"><i class="fa-solid fa-triangle-exclamation"></i> Please login to view your wishlist!</p>`;
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/wishlist/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response:", response); // Debug: Check response object

    const data = await response.json();
    console.log("Data:", data); // Debug: Check response data

    if (response.ok && data.success) {
      wishlistBody.innerHTML = "";
      if (data.items && data.items.length > 0) {
        data.items.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                <td style="font-weight: 600">
                  <img
                    src="${item.product.image}"
                    alt="${item.product.name}"
                    class="product-image"
                  />
                </td>
                <td>${item.product.name}</td>
                <td>$${item.product.price.toFixed(2)}</td>
                <td>
                  <span class="remove-button" style="justify-content: flex-start; margin-left: 20px;" onclick="removeFromWishlist(${
                    item.product.id
                  })">
                    <i class="fa-solid fa-x"></i>
                  </span>
                </td>
              `;
          wishlistBody.appendChild(row);
        });
      } else {
        wishlistBody.innerHTML = `<p>Your wishlist is empty.</p>`;
      }
    } else {
      wishlistBody.innerHTML = `<p>Error loading wishlist. Please try again later.</p>`;
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    wishlistBody.innerHTML = `<p>There was an error fetching the wishlist. Please try again later.</p>`;
  }
};

// Remove product from the wishlist
const removeFromWishlist = (id) => {
  const token = getLoggedInUserToken();

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
      fetch("https://ecommerce.ershaad.net/api/wishlist/remove", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            displayWishlist(); // Refresh wishlist view
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
