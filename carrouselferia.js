const carrouselferia = document.querySelector(".carrouself_container");
const itemsPerView = 3; /* Número de elementos que quieres mostrar */
const itemWidth = carrouselferia.offsetWidth / itemsPerView; /* Ancho de cada elemento */
let maxScrollleft = carrouselferia.scrollWidth - carrouselferia.clientWidth;
let intervalo = null;
let step = 1;
const star = () => {
    intervalo = setInterval(function () {
        carrouselferia.scrollLeft = carrouselferia.scrollLeft + step;
        if (carrouselferia.scrollLeft === maxScrollleft) {
            step = step * -1;
        } else if (carrouselferia.scrollLeft === 0) {
            step = step * -1;
        }
    }, 20);
}

const stop = () => {
    clearInterval(intervalo);
};

carrouselferia.addEventListener("mouseover", () => {
    stop();
});
carrouselferia.addEventListener("mouseout", () => {
    star();
});

star();

/*const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");*/
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

prevButton.addEventListener("click", () => {
    stop(); // Detiene el carrusel automático
    carrouselferia.scrollLeft -= itemWidth * itemsPerView ; // Modifica el número según la cantidad de desplazamiento deseada
});

nextButton.addEventListener("click", () => {
    stop(); // Detiene el carrusel automático
    carrouselferia.scrollLeft += itemWidth * itemsPerView; // Modifica el número según la cantidad de desplazamiento deseada
});

