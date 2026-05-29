/*
========================================================
© 2026 ADEGA 24H DELIVERY PREMIUM
Todos os direitos reservados.

Proprietário:
EMERSON RODRIGUES DA ROCHA

É proibida a cópia, redistribuição,
revenda ou reutilização deste sistema
sem autorização do proprietário.

Sistema protegido por direitos autorais.
========================================================
*/

const produtos = [

{
id:1,
nome:"Whisky Jack Daniels",
descricao:"Whisky premium importado.",
preco:129.90,
imagem:"./assets/jack-daniels.jpg"
},

{
id:2,
nome:"Heineken Long Neck",
descricao:"Cerveja premium gelada.",
preco:8.90,
imagem:"./assets/heineken.jpg"
},

{
id:3,
nome:"Red Bull Energy Drink",
descricao:"Energético Red Bull 250ml.",
preco:14.90,
imagem:"./assets/redbull.jpg"
},

{
id:4,
nome:"Smirnoff Ice",
descricao:"Bebida ice sabor limão.",
preco:12.90,
imagem:"./assets/smirnoff-ice.jpg"
},

{
id:5,
nome:"Vodka Absolut",
descricao:"Vodka premium importada.",
preco:89.90,
imagem:"./assets/absolut.jpg"
},

{
id:6,
nome:"Guaraná Antarctica 2L",
descricao:"Refrigerante gelado.",
preco:13.90,
imagem:"./assets/guarana.jpg"
},

{
id:7,
nome:"Combo Skol + Gelo",
descricao:"Combo especial da madrugada.",
preco:49.90,
imagem:"./assets/skol-combo.jpg"
},

{
id:8,
nome:"Vinho Tinto Suave",
descricao:"Vinho suave premium.",
preco:39.90,
imagem:"./assets/vinho.jpg"
}

];

let carrinho = [];

const cardapioContainer =
document.getElementById("cardapio");

const modalCarrinho =
document.getElementById("modal-carrinho");

const btnVerCarrinho =
document.getElementById("btn-ver-carrinho");

const btnFecharModal =
document.getElementById("btn-fechar-modal");

const itensCarrinhoContainer =
document.getElementById("itens-carrinho");

const totalBarra =
document.getElementById("total-barra");

const totalModal =
document.getElementById("total-modal");

const contadorCarrinho =
document.getElementById("contador-carrinho");

const inputEndereco =
document.getElementById("input-endereco");

const avisoEndereco =
document.getElementById("aviso-endereco");

const btnFinalizarPedido =
document.getElementById("btn-finalizar-pedido");

/* PIX */

const chavePix =
"00020101021126580014br.gov.bcb.pix0136581e7489-78a4-4c1a-a5a6-cc241cb1dbf55204000053039865802BR5925EMERSON RODRIGUES DA ROCH6009SAO PAULO622905251KST5W8STWTK7TDDEM0XY7GTS6304B666";

/* RENDERIZAR CARDÁPIO */

function renderizarCardapio(){

cardapioContainer.innerHTML = "";

produtos.forEach(produto => {

const div = document.createElement("div");

div.className =
"card-produto rounded-3xl overflow-hidden shadow-2xl flex flex-col";

div.innerHTML = `
<img
src="${produto.imagem}"
alt="${produto.nome}"
class="w-full h-56 object-cover"
>

<div class="p-5 flex flex-col flex-1">

<h3 class="font-extrabold text-xl gold">
${produto.nome}
</h3>

<p class="text-gray-400 text-sm mt-2 flex-1">
${produto.descricao}
</p>

<div class="flex items-center justify-between mt-5">

<span class="text-2xl font-extrabold text-yellow-400">
R$ ${produto.preco.toFixed(2).replace(".", ",")}
</span>

<button
class="btn-gold px-4 py-3 rounded-xl shadow-lg btn-add"
data-id="${produto.id}"
>
<i class="fa-solid fa-plus"></i>
</button>

</div>

</div>
`;

cardapioContainer.appendChild(div);

});

}

/* ADICIONAR */

cardapioContainer.addEventListener("click",(e)=>{

const botao =
e.target.closest(".btn-add");

if(botao){

const id =
parseInt(botao.getAttribute("data-id"));

adicionarAoCarrinho(id);

}

});

function adicionarAoCarrinho(id){

const produto =
produtos.find(p => p.id === id);

const itemExistente =
carrinho.find(item => item.id === id);

if(itemExistente){

itemExistente.quantidade++;

}else{

carrinho.push({
...produto,
quantidade:1
});

}

mostrarNotificacao(`${produto.nome} adicionado ao carrinho`);

atualizarInterface();

}

/* INTERFACE */

function atualizarInterface(){

let total = 0;
let totalItens = 0;

carrinho.forEach(item => {

total += item.preco * item.quantidade;
totalItens += item.quantidade;

});

totalBarra.textContent =
`R$ ${total.toFixed(2).replace(".", ",")}`;

totalModal.textContent =
`R$ ${total.toFixed(2).replace(".", ",")}`;

contadorCarrinho.textContent =
totalItens;

}

/* MODAL */

btnVerCarrinho.addEventListener("click",()=>{

renderizarCarrinhoModal();

modalCarrinho.classList.remove("hidden");

});

btnFecharModal.addEventListener("click",()=>{

modalCarrinho.classList.add("hidden");

});

modalCarrinho.addEventListener("click",(e)=>{

if(e.target === modalCarrinho){

modalCarrinho.classList.add("hidden");

}

});

/* RENDERIZAR CARRINHO */

function renderizarCarrinhoModal(){

itensCarrinhoContainer.innerHTML = "";

if(carrinho.length === 0){

itensCarrinhoContainer.innerHTML = `
<p class="text-center text-gray-400">
Seu carrinho está vazio.
</p>
`;

return;

}

carrinho.forEach(item => {

const div = document.createElement("div");

div.className =
"bg-zinc-800 rounded-2xl p-4 flex items-center justify-between";

div.innerHTML = `
<div>

<h4 class="font-bold text-sm">
${item.nome}
</h4>

<span class="text-gray-400 text-xs">
R$ ${item.preco.toFixed(2).replace(".", ",")}
</span>

</div>

<div class="flex items-center gap-3">

<button
class="text-red-500 font-bold btn-diminuir"
data-id="${item.id}"
>
-
</button>

<span class="font-bold">
${item.quantidade}
</span>

<button
class="text-green-500 font-bold btn-aumentar"
data-id="${item.id}"
>
+
</button>

</div>
`;

itensCarrinhoContainer.appendChild(div);

});

}

/* ALTERAR QUANTIDADE */

itensCarrinhoContainer.addEventListener("click",(e)=>{

if(e.target.classList.contains("btn-aumentar")){

const id =
parseInt(e.target.getAttribute("data-id"));

const item =
carrinho.find(i => i.id === id);

item.quantidade++;

}

if(e.target.classList.contains("btn-diminuir")){

const id =
parseInt(e.target.getAttribute("data-id"));

const idx =
carrinho.findIndex(i => i.id === id);

if(carrinho[idx].quantidade > 1){

carrinho[idx].quantidade--;

}else{

carrinho.splice(idx,1);

}

}

atualizarInterface();
renderizarCarrinhoModal();

});

/* COPIAR PIX */

function copiarPix(){

navigator.clipboard.writeText(chavePix);

mostrarNotificacao("Chave PIX copiada!");

}

/* FINALIZAR PEDIDO */

btnFinalizarPedido.addEventListener("click",()=>{

if(carrinho.length === 0){

alert("Seu carrinho está vazio!");
return;

}

if(inputEndereco.value.trim() === ""){

avisoEndereco.classList.remove("hidden");
return;

}

avisoEndereco.classList.add("hidden");

let mensagem =
`🍷 *ADEGA 24H DELIVERY* 🍷\n\n`;

carrinho.forEach(item => {

mensagem +=
`• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;

});

const total =
carrinho.reduce((acc,item)=>{
return acc + item.preco * item.quantidade;
},0);

mensagem +=
`\n💰 *Total:* R$ ${total.toFixed(2)}`;

mensagem +=
`\n📍 *Endereço:* ${inputEndereco.value}`;

mensagem +=
`\n\n💳 *Pagamento:* PIX`;

mensagem +=
`\n\n✅ Pedido enviado com sucesso!`;

const telefone = "5511976794749";

const url =
`https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;

window.open(url,"_blank");

});

/* NOTIFICAÇÃO */

function mostrarNotificacao(texto){

const notificacao =
document.createElement("div");

notificacao.className =
"fixed top-6 right-6 bg-yellow-400 text-black font-bold px-6 py-4 rounded-2xl shadow-2xl z-[9999]";

notificacao.textContent = texto;

document.body.appendChild(notificacao);

setTimeout(()=>{

notificacao.remove();

},2500);

}

/* INICIAR */

renderizarCardapio();
