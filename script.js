// Banco de dados Mock Premium
const PRODUCTS = [
    { id: 1, name: "Vinho Quinta do Crasto Douro", price: 149.90, category: "vinhos", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300" },
    { id: 2, name: "Whisky Johnnie Walker Black Label", price: 189.00, category: "destilados", img: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=300" },
    { id: 3, name: "Cerveja Artesanal IPA Premium", price: 18.90, category: "cervejas", img: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300" },
    { id: 4, name: "Gin Tanqueray London Dry", price: 135.00, category: "destilados", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300" }
];

let cart = [];

// Inicialização da vitrine
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(PRODUCTS);
    setupPWA();
});

function renderProducts(productsList) {
    const container = document.getElementById("products-container");
    container.innerHTML = productsList.map(prod => `
        <div class="product-card" data-category="${prod.category}">
            <img src="${prod.img}" alt="${prod.name}" class="product-img">
            <div class="product-info">
                <h4>${prod.name}</h4>
                <div class="product-price">R$ ${prod.price.toFixed(2).replace('.', ',')}</div>
            </div>
            <button class="btn-add" onclick="addToCart(${prod.id})">Adicionar</button>
        </div>
    `).join('');
}

// Filtro de Categorias
function filterCategory(category) {
    document.querySelectorAll('.category-chip').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if(category === 'todos') {
        renderProducts(PRODUCTS);
    } else {
        const filtered = PRODUCTS.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// Controle do Carrinho
function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("open");
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const itemsWrapper = document.getElementById("cart-items");
    const countBadge = document.getElementById("cart-count");
    const totalSpan = document.getElementById("cart-total-value");
    
    let total = 0;
    let itemsCount = 0;

    itemsWrapper.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        itemsCount += item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    }).join('');

    countBadge.innerText = itemsCount;
    totalSpan.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Modais & Checkout
function openCheckoutModal() {
    if(cart.length === 0) return alert("Seu carrinho está vazio!");
    document.getElementById("pix-modal").classList.add("open");
}

function closeCheckoutModal() {
    document.getElementById("pix-modal").classList.remove("open");
}

function copyPixKey() {
    const input = document.getElementById("pix-key");
    input.select();
    navigator.clipboard.writeText(input.value);
    alert("Chave Copia e Cola copiada com sucesso!");
}

function sendToWhatsApp() {
    let message = `*Novo Pedido - Adega Premium*%0A%0A`;
    cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    const total = document.getElementById("cart-total-value").innerText;
    message += `%0A*Total:* ${total}%0A*Forma de Pagamento:* PIX (Efetuado)`;
    
    // Altere o número abaixo para o WhatsApp da adega
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
}

// Configuração PWA para Dispositivos Móveis
let deferredPrompt;
function setupPWA() {
    const installBtn = document.getElementById('pwa-install-btn');
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                installBtn.classList.add('hidden');
            }
            deferredPrompt = null;
        }
    });
}
