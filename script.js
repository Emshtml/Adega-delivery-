// ===============================
// DELIVERY PREMIUM SYSTEM
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===============================
// UTIL
// ===============================

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===============================
// CART
// ===============================

function addToCart(id, name, price, image) {
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  saveCart();
  renderCart();
  updateCartCount();
}

function updateQuantity(id, action) {
  const item = cart.find((item) => item.id === id);

  if (!item) return;

  if (action === "increase") {
    item.quantity++;
  }

  if (action === "decrease") {
    item.quantity--;

    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function getSubtotal() {
  return cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
}

function getDeliveryFee() {
  return getSubtotal() >= 80 ? 0 : 8;
}

function getTotal() {
  return getSubtotal() + getDeliveryFee();
}

function updateCartCount() {
  const counter = document.getElementById("cartCounter");

  if (!counter) return;

  const total = cart.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  counter.innerText = total;
}

// ===============================
// RENDER CART
// ===============================

function renderCart() {
  const cartItems = document.getElementById("cartItems");

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Seu carrinho está vazio</h3>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)}</p>

          <div class="quantity">
            <button onclick="updateQuantity(${item.id}, 'decrease')">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 'increase')">+</button>
          </div>
        </div>

        <div class="cart-total">
          <strong>${formatPrice(item.price * item.quantity)}</strong>

          <button onclick="removeFromCart(${item.id})">
            Remover
          </button>
        </div>
      </div>
    `
    )
    .join("");

  document.getElementById("subtotal").innerText =
    formatPrice(getSubtotal());

  document.getElementById("deliveryFee").innerText =
    getDeliveryFee() === 0
      ? "GRÁTIS"
      : formatPrice(getDeliveryFee());

  document.getElementById("totalPrice").innerText =
    formatPrice(getTotal());
}

// ===============================
// MODAL
// ===============================

function openCart() {
  document.getElementById("cartModal").classList.add("active");
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("active");
}

// ===============================
// CHECKOUT
// ===============================

function finalizeOrder(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const customer = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;
  const number = document.getElementById("customerNumber").value;
  const district = document.getElementById("customerDistrict").value;
  const payment = document.getElementById("paymentMethod").value;

  if (
    !customer ||
    !phone ||
    !address ||
    !number ||
    !district ||
    !payment
  ) {
    alert("Preencha todos os campos!");
    return;
  }

  const items = cart
    .map((item) => {
      return `• ${item.name} x${item.quantity}`;
    })
    .join("%0A");

  const message = `
🍛 *NOVO PEDIDO*

👤 ${customer}
📞 ${phone}

📍 ${address}, ${number}
🏙️ ${district}

🛒 ${items}

💰 Total: ${formatPrice(getTotal())}

💳 ${payment}
`;

  const whatsapp =
    `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;

  window.open(whatsapp, "_blank");

  if (payment === "pix") {
    document.getElementById("pixModal").classList.add("active");
  }

  cart = [];
  saveCart();
  renderCart();
  updateCartCount();

  document.getElementById("checkoutForm").reset();
}

// ===============================
// PIX
// ===============================

function closePixModal() {
  document.getElementById("pixModal").classList.remove("active");
}

function copyPix() {
  const pix =
    "contato@marmitariapremium.com";

  navigator.clipboard.writeText(pix);

  alert("Chave PIX copiada!");
}

// ===============================
// INIT
// ===============================

window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();

  const checkoutForm =
    document.getElementById("checkoutForm");

  if (checkoutForm) {
    checkoutForm.addEventListener(
      "submit",
      finalizeOrder
    );
  }
});
