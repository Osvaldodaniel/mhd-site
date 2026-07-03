const lista =
document.getElementById("listaOracoes");

const filtro =
document.getElementById("filtroCategoria");

const tituloCategoria =
document.getElementById("tituloCategoria");

/* CARREGAR CATEGORIAS */

Object.keys(oracoes).forEach(cat => {

filtro.innerHTML += `

<option value="${cat}">
${oracoes[cat].titulo}
</option>

`;

});

/* MOSTRAR ORAÇÕES */

function mostrarOracoes(categoria = "Todos"){

lista.innerHTML = "";

if(categoria === "Todos"){

tituloCategoria.textContent =
"Todas as Categorias";

Object.keys(oracoes).forEach(cat => {

const categoriaAtual =
oracoes[cat];

lista.innerHTML += `

<div class="categoria-bloco">

<h2 class="categoria-titulo">
${categoriaAtual.titulo}
</h2>

<img
class="categoria-imagem"
src="${categoriaAtual.imagem}"
alt="${categoriaAtual.titulo}">

<div class="oracoes-lista"
id="lista-${cat}">
</div>

</div>

`;

const container =
document.getElementById(
`lista-${cat}`
);

categoriaAtual.oracoes.forEach(o => {

container.innerHTML += `

<div class="oracao-item">

<h3>
🎧 ${o.titulo}
</h3>

<p class="autor">

Autor:
${o.autor}

</p>

<audio controls>

<source
src="${o.audio}"
type="audio/mpeg">

</audio>

<div class="quote-actions">

<button
class="btn secondary favorito-btn"
data-titulo="${o.titulo}"
data-autor="${o.autor}">

❤️ Favorito

</button>

<button
class="btn secondary share-btn"
data-titulo="${o.titulo}">

📤 Partilhar

</button>

</div>

</div>

`;

});

});

}else{

const categoriaAtual =
oracoes[categoria];

tituloCategoria.textContent =
categoriaAtual.titulo;

lista.innerHTML += `

<div class="categoria-bloco">

<img
class="categoria-imagem"
src="${categoriaAtual.imagem}"
alt="${categoriaAtual.titulo}">

<div class="oracoes-lista"
id="lista-filtrada">
</div>

</div>

`;

const container =
document.getElementById(
"lista-filtrada"
);

categoriaAtual.oracoes.forEach(o => {

container.innerHTML += `

<div class="oracao-item">

<h3>
🎧 ${o.titulo}
</h3>

<p class="autor">

Autor:
${o.autor}

</p>

<audio controls>

<source
src="${o.audio}"
type="audio/mpeg">

</audio>

<div class="quote-actions">

<button
class="btn secondary favorito-btn"
data-titulo="${o.titulo}">

❤️ Favorito

</button>

<button
class="btn secondary share-btn"
data-titulo="${o.titulo}">

📤 Partilhar

</button>

</div>

</div>

`;

});

}

}

/* FILTRO */

filtro.addEventListener(

"change",

e => mostrarOracoes(
e.target.value
)

);

/* PARTILHAR */

document.addEventListener(

"click",

function(e){

if(
e.target.classList.contains(
"share-btn"
)
){

const titulo =
e.target.dataset.titulo;
const autor =
e.target.dataset.autor;

if(navigator.share){

navigator.share({

title:titulo,

text:"Ouça esta oração no MHD",

url:window.location.href

});

}else{

navigator.clipboard.writeText(
window.location.href
);

alert("Link copiado!");

}

}

}

);

mostrarOracoes();

/* =========================
   FAVORITOS E PARTILHA
========================= */

document.addEventListener(

"click",

function(e){

/* FAVORITO */

if(
e.target.classList.contains(
"favorito-btn"
)
){

const titulo =
e.target.dataset.titulo;

let favoritos =
JSON.parse(
localStorage.getItem("favoritos")
) || [];

const existe =
favoritos.some(item =>
item.titulo === titulo
);

if(!existe){

favoritos.push({

id: Date.now().toString(),

tipo:"oracao",

titulo:titulo,

conteudo:"Oração MHD"

});

localStorage.setItem(

"favoritos",

JSON.stringify(favoritos)

);

e.target.innerHTML =
"❤️ Guardado";

}else{

alert(
"Esta oração já está nos favoritos."
);

}

}

/* PARTILHAR */

if(
e.target.classList.contains(
"share-btn"
)
){

const titulo =
e.target.dataset.titulo;

const texto =

titulo +

" | Ouça esta oração no MHD";

if(navigator.share){

navigator.share({

title:titulo,

text:texto,

url:window.location.href

});

}else{

navigator.clipboard.writeText(

window.location.href

);

alert(
"Link copiado!"
);

}

}

}

);