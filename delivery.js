// delivery.js - Sistema Delivery Funcional Marmitaria Delivery Premium

// =====================================
// CONFIGURAÇÕES
// =====================================

const DELIVERY_STORAGE = 'marmitariaDeliverySystem';

const PIX_CONFIG = {
  chave: 'contato@marmitariapremium.com',
  nome: 'MARMITARIA DELIVERY PREMIUM',
  cidade: 'SAO PAULO'
};

// =====================================
// ESTADO GLOBAL
// =====================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =====================================
// UTILITÁRIOS
// =====================================

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function generateOrderId() {
  return Math.floor(Math.random() * 999999);
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;

  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');

    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3500);
}

// =====================================
// CARRINHO
// =====================================

function addToCart(id, nome, preco, imagem) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantidade += 1;
  } else {
    cart.push({
      id,
      nome,
      preco,
      imagem,
      quantidade: 1
    });
  }

  saveCart();
  renderCart();
  updateCartCounter();

  showNotification(`${nome} adicionado ao carrinho!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();
  updateCartCounter();

  showNotification('Item removido do carrinho!', 'error');
}

function changeQuantity(id, action) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  if (action === 'increase') {
    item.quantidade += 1;
  }

  if (action === 'decrease') {
    item.quantidade -= 1;

    if (item.quantidade <= 0) {
      removeFromCart(id);
      return;
    }
  }

  saveCart();
  renderCart();
  updateCartCounter();
}

function calculateSubtotal() {
  return cart.reduce((acc, item) => {
    return acc + item.preco * item.quantidade;
  }, 0);
}

function calculateDeliveryFee() {
  const subtotal = calculateSubtotal();

  if (subtotal >= 80) {
    return 0;
  }

  return 8;
}

function calculateTotal() {
  return calculateSubtotal() + calculateDeliveryFee();
}

function updateCartCounter() {
  const counter = document.getElementById('cartCounter');

  if (!counter) return;

  const totalItems = cart.reduce((acc, item) => {
    return acc + item.quantidade;
  }, 0);

  counter.textContent = totalItems;
}

function renderCart() {
  const cartContainer = document.getElementById('cartItems');
  const subtotalElement = document.getElementById('subtotal');
  const deliveryElement = document.getElementById('deliveryFee');
  const totalElement = document.getElementById('totalPrice');

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione pratos deliciosos para continuar.</p>
      </div>
    `;

    if (subtotalElement) subtotalElement.textContent = 'R$ 0,00';
    if (deliveryElement) deliveryElement.textContent = 'R$ 0,00';
    if (totalElement) totalElement.textContent = 'R$ 0,00';

    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.imagem}" alt="${item.nome}">

      <div class="cart-item-info">
        <h4>${item.nome}</h4>
        <p>${formatPrice(item.preco)}</p>

        <div class="cart-quantity">
          <button onclick="changeQuantity(${item.id}, 'decrease')">-</button>
          <span>${item.quantidade}</span>
          <button onclick="changeQuantity(${item.id}, 'increase')">+</button>
        </div>
      </div>

      <div class="cart-item-total">
        <strong>${formatPrice(item.preco * item.quantidade)}</strong>

        <button onclick="removeFromCart(${item.id})" class="remove-item">
          Remover
        </button>
      </div>
    </div>
  `).join('');

  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(calculateSubtotal());
  }

  if (deliveryElement) {
    deliveryElement.textContent = calculateDeliveryFee() === 0
      ? 'GRÁTIS'
      : formatPrice(calculateDeliveryFee());
  }

  if (totalElement) {
    totalElement.textContent = formatPrice(calculateTotal());
  }
}

// =====================================
// MODAL CARRINHO
// =====================================

function openCart() {
  const modal = document.getElementById('cartModal');

  if (modal) {
    modal.classList.add('active');
  }
}

function closeCart() {
  const modal = document.getElementById('cartModal');

  if (modal) {
    modal.classList.remove('active');
  }
}

// =====================================
// ENDEREÇO ENTREGA
// =====================================

function validateDeliveryForm() {
  const requiredFields = [
    'customerName',
    'customerPhone',
    'customerAddress',
    'customerNumber',
    'customerDistrict',
    'paymentMethod'
  ];

  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);

    if (!field || !field.value.trim()) {
      showNotification('Preencha todos os campos obrigatórios!', 'error');
      return false;
    }
  }

  return true;
}

function getDeliveryData() {
  return {
    cliente: document.getElementById('customerName').value,
    telefone: document.getElementById('customerPhone').value,
    endereco: document.getElementById('customerAddress').value,
    numero: document.getElementById('customerNumber').value,
    complemento: document.getElementById('customerComplement').value,
    bairro: document.getElementById('customerDistrict').value,
    referencia: document.getElementById('customerReference').value,
    pagamento: document.getElementById('paymentMethod').value,
    observacoes: document.getElementById('customerNotes').value
  };
}

// =====================================
// QR CODE PIX
// =====================================

function generatePixPayload(valor) {
  const amount = valor.toFixed(2);

  return `00020126580014BR.GOV.BCB.PIX0136${PIX_CONFIG.chave}520400005303986540${amount.replace('.', '')}5802BR5918${PIX_CONFIG.nome}6009${PIX_CONFIG.cidade}62070503***6304ABCD`;
}

function generatePixQRCode() {
  const qrContainer = document.getElementById('pixQrCode');

  if (!qrContainer) return;

  const total = calculateTotal();

  const pixCode = generatePixPayload(total);

  qrContainer.innerHTML = `
    <div class="pix-payment-box">
      <h3>Pagamento via PIX</h3>

      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}"
        alt="QR Code PIX"
      >

      <div class="pix-info">
        <p><strong>Valor:</strong> ${formatPrice(total)}</p>
        <p><strong>Chave PIX:</strong> ${PIX_CONFIG.chave}</p>
      </div>

      <textarea readonly class="pix-copy-code">${pixCode}</textarea>

      <button onclick="copyPixCode()" class="copy-pix-button">
        Copiar Código PIX
      </button>
    </div>
  `;
}

function copyPixCode() {
  const codeElement = document.querySelector('.pix-copy-code');

  if (!codeElement) return;

  navigator.clipboard.writeText(codeElement.value)
    .then(() => {
      showNotification('Código PIX copiado!');
    })
    .catch(() => {
      showNotification('Erro ao copiar código!', 'error');
    });
}

// =====================================
// FINALIZAR PEDIDO
// =====================================

function finalizeOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    showNotification('Seu carrinho está vazio!', 'error');
    return;
  }

  if (!validateDeliveryForm()) {
    return;
  }

  const deliveryData = getDeliveryData();

  const order = {
    id: generateOrderId(),
    cliente: deliveryData.cliente,
    telefone: deliveryData.telefone,
    endereco: `${deliveryData.endereco}, ${deliveryData.numero}`,
    bairro: deliveryData.bairro,
    complemento: deliveryData.complemento,
    referencia: deliveryData.referencia,
    pagamento: deliveryData.pagamento,
    observacoes: deliveryData.observacoes,
    itens: cart,
    subtotal: calculateSubtotal(),
    entrega: calculateDeliveryFee(),
    total: calculateTotal(),
    status: 'Pedido recebido',
    data: new Date().toLocaleString('pt-BR')
  };

  const existingData = JSON.parse(localStorage.getItem(DELIVERY_STORAGE)) || {
    pedidos: []
  };

  existingData.pedidos.push(order);

  localStorage.setItem(
    DELIVERY_STORAGE,
    JSON.stringify(existingData)
  );

  if (deliveryData.pagamento === 'pix') {
    generatePixQRCode();

    const pixModal = document.getElementById('pixModal');

    if (pixModal) {
      pixModal.classList.add('active');
    }
  }

  sendOrderToWhatsApp(order);

  showNotification('Pedido realizado com sucesso!');

  cart = [];
  saveCart();
  renderCart();
  updateCartCounter();

  document.getElementById('checkoutForm').reset();
}

// =====================================
// WHATSAPP PEDIDO
// =====================================

function sendOrderToWhatsApp(order) {
  const phone = '5511976794749';

  const itens = order.itens.map(item => {
    return `• ${item.nome} x${item.quantidade} - ${formatPrice(item.preco * item.quantidade)}`;
  }).join('%0A');

  const message = `
🍛 *NOVO PEDIDO - MARMITARIA DELIVERY PREMIUM*%0A%0A
📦 *Pedido:* #${order.id}%0A
👤 *Cliente:* ${order.cliente}%0A
📞 *Telefone:* ${order.telefone}%0A%0A
📍 *Entrega:*%0A${order.endereco}%0A
Bairro: ${order.bairro}%0A%0A
🛒 *Itens:*%0A${itens}%0A%0A
💰 *Subtotal:* ${formatPrice(order.subtotal)}%0A
🚚 *Entrega:* ${formatPrice(order.entrega)}%0A
💵 *Total:* ${formatPrice(order.total)}%0A%0A
💳 *Pagamento:* ${order.pagamento}%0A%0A
📝 *Observações:* ${order.observacoes || 'Nenhuma'}
  `;

  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, '_blank');
}

// =====================================
// MODAL PIX
// =====================================

function closePixModal() {
  const modal = document.getElementById('pixModal');

  if (modal) {
    modal.classList.remove('active');
  }
}

// =====================================
// FILTROS CARDÁPIO
// =====================================

function filterMenu(category) {
  const products = document.querySelectorAll('.menu-item');

  products.forEach(product => {
    const productCategory = product.dataset.category;

    if (category === 'all' || productCategory === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// =====================================
// BUSCA PRODUTOS
// =====================================

function searchProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();

  const products = document.querySelectorAll('.menu-item');

  products.forEach(product => {
    const title = product.querySelector('h3').textContent.toLowerCase();

    if (title.includes(search)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// =====================================
// ABRIR CHECKOUT
// =====================================

function openCheckout() {
  if (cart.length === 0) {
    showNotification('Adicione itens ao carrinho!', 'error');
    return;
  }

  const checkout = document.getElementById('checkoutSection');

  if (checkout) {
    checkout.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

// =====================================
// INICIALIZAÇÃO
// =====================================

window.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCounter();

  const checkoutForm = document.getElementById('checkoutForm');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', finalizeOrder);
  }

  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('keyup', searchProducts);
  }

  window.addEventListener('click', event => {
    const cartModal = document.getElementById('cartModal');
    const pixModal = document.getElementById('pixModal');

    if (event.target === cartModal) {
      closeCart();
    }

    if (event.target === pixModal) {
      closePixModal();
    }
  });
});
