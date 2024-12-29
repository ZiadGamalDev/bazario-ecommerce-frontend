const displayCart = async () => {
  const cartBody = document.getElementById("cart-table-body");
  const totalPrice = document.getElementById("total-price");
  const tokenUrl = localStorage.getItem("token");

  if (!tokenUrl) {
    cartBody.innerHTML = `
        <p style="text-align:center; font-size: 40px; color: #ffba00; margin-top: 100px;">
          <i class="fa-solid fa-triangle-exclamation"></i> Please login to view your cart!
        </p>`;
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/api/cart/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenUrl}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    if (data && data.data && data.data.length > 0) {
      cartBody.innerHTML = "";
      let total = 0;

      data.data.forEach((item) => {
        const product = item.product;
        const quantity = item.quantity;
        const subtotal = parseFloat(product.price) * quantity;

        total += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="font-weight: 600">
              <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
              />
            </td>
            <td>${product.name}</td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td>
              <div class="quantity-controls">
                <input
                  type="number"
                  min="1"
                  value="${quantity}"
                  id="quantity-${product.id}"
                  onchange="updateQuantity(${product.id}, this.value, ${
          product.price
        })"
                />
                <div class="increaseBtn">
                  <button onclick="decreaseQuantity(${product.id}, ${
          product.price
        })">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <button onclick="increaseQuantity(${product.id}, ${
          product.price
        })">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </td>
            <td>$<span id="subtotal-${product.id}">${subtotal.toFixed(
          2
        )}</span></td>
            <td>
              <span class="remove-button" data-id="${product.id}">
                <i class="fa-solid fa-x"></i>
              </span>
            </td>
          `;
        cartBody.appendChild(row);
      });

      totalPrice.innerText = `$${total.toFixed(2)}`;

      const removeButtons = document.querySelectorAll(".remove-button");
      removeButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          const id = event.target.closest(".remove-button").getAttribute("data-id");
          console.log(id);
          try {
            const response = await fetch(`${baseUrl}/api/cart/remove`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokenUrl}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ product_id: id }),
            });

            if (response.ok) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Item removed successfully",
                showConfirmButton: false,
                timer: 1500
              });
              displayCart();
            } else {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to remove item",
                showConfirmButton: false,
                timer: 1500
              });
            }
          } catch (error) {
            console.error("Error removing item:", error);
          }
        });
      });
    } else {
      cartBody.innerHTML = `
          <p style="text-align:center; font-size: 38px; color: #555; margin-top: 100px;">
            Your cart is empty!
          </p>`;
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    cartBody.innerHTML = `
        <p style="text-align:center; font-size: 18px; color: red; margin-top: 50px;">
          <i class="fa-solid fa-triangle-exclamation"></i> There was an error fetching your cart. Please try again later.
        </p>`;
  }
};

displayCart();

const increaseQuantity = (id, price) => {
  const quantityInput = document.getElementById(`quantity-${id}`);
  let quantity = parseInt(quantityInput.value);
  quantity += 1;
  quantityInput.value = quantity;

  updateSubtotal(id, quantity, price);
};

const decreaseQuantity = (id, price) => {
  const quantityInput = document.getElementById(`quantity-${id}`);
  let quantity = parseInt(quantityInput.value);
  if (quantity > 1) {
    quantity -= 1;
    quantityInput.value = quantity;
    updateSubtotal(id, quantity, price);
  }
};

const updateSubtotal = (id, quantity, price) => {
  const subtotal = quantity * price;
  document.getElementById(`subtotal-${id}`).innerText = subtotal.toFixed(2);
  updateTotalPrice();
};

const updateTotalPrice = () => {
  const cartBody = document.getElementById("cart-table-body");
  let total = 0;
  const rows = cartBody.getElementsByTagName("tr");

  for (let row of rows) {
    const subtotal = parseFloat(
      row.querySelector("span[id^='subtotal']").innerText
    );
    total += subtotal;
  }

  document.getElementById("total-price").innerText = `$${total.toFixed(2)}`;
};

displayCart();