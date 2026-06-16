// ======================
// MHD SCRIPT
// ======================

// Animação ao carregar

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

// Formulário de contacto

const form = document.querySelector("form");

if(form){

form.addEventListener("submit", function(e){

    e.preventDefault();

    alert(
        "Obrigado pela sua mensagem. Entraremos em contacto em breve."
    );

    form.reset();

});

}

// Efeito de aparecimento dos cards

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity = "1";
entry.target.style.transform = "translateY(0px)";

}

});

},{
threshold:0.2
});

cards.forEach(card=>{

card.style.opacity = "0";
card.style.transform = "translateY(30px)";
card.style.transition = "0.8s";

observer.observe(card);

});
