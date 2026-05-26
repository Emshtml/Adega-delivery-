// script.js

const products = [

  {
    name: "Jack Daniels",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1200&auto=format&fit=crop"
  },

  {
    name: "Red Label",
    price: 99.90,
    image: "https://images.unsplash.com/photo-1582819509237-df9c0f1a8b4b?q=80&w=1200&auto=format&fit=crop"
  },

  {
    name: "Heineken Pack",
    price: 34.90,
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=1200&auto=format&fit=crop"
  },

  {
    name: "Smirnoff Vodka",
    price: 49.90,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"
  },

  {
    name: "Combo Gin + Red Bull",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop"
  },

  {
    name: "Corona Long Neck",
    price: 14.90,
    image: "https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=1200&auto=format&fit=crop"
  }

];

const menu = document.getElementById("menu");

const cartItems = document.getElementById("cart-items");

const cartTotal = document.getElementById("cart-total");

const cartCount = document.getElementById("cart-count");

let cart = [];

function renderProducts(){

  menu.innerHTML = "";

  products.forEach((product,index)=>{

    menu.innerHTML += `
      <div class="card">

        <img src="${product.image}" />

        <div class="card-content">

          <h3>${product.name}</h3>

          <p class="price">
            R$ ${product.price.toFixed(2)}
          </p>

          <button class="buy-btn"
          onclick="addToCart(${index})">

            Adicionar

          </button>

        </div>

      </div>
    `;

  });

}

function addToCart(index){

  cart.push(products[index]);

  updateCart();

}

function updateCart(){

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item=>{

    total += item.price;

    cartItems.innerHTML += `
      <div class="cart-item">

        <h4>${item.name}</h4>

        <p>R$ ${item.price.toFixed(2)}</p>

      </div>
    `;

  });

  cartTotal.innerText = total.toFixed(2);

  cartCount.innerText = cart.length;

}

function toggleCart(){

  document.getElementById("cart")
  .classList.toggle("open");

}

function clearCart(){

  cart = [];

  updateCart();

}

function checkoutWhatsApp(){

  if(cart.length === 0){

    alert("Seu carrinho está vazio.");

    return;

  }

  let message = "🍷 *Pedido Adega 24h Delivery*%0A%0A";

  let total = 0;

  cart.forEach(item=>{

    message += `• ${item.name} - R$ ${item.price.toFixed(2)}%0A`;

    total += item.price;

  });

  message += `%0A💰 Total: R$ ${total.toFixed(2)}`;

  window.open(
    `https://wa.me/5511999999999?text=${message}`,
    "_blank"
  );

}

function scrollToMenu(){

  document.getElementById("menu")
  .scrollIntoView({
    behavior:"smooth"
  });

}

renderProducts();
