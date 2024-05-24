let currentSlide = 0;

function moveCarousel(direction) {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const visibleItems = 3; // Número de elementos visibles al mismo tiempo

    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = totalItems - visibleItems;
    } else if (currentSlide >= totalItems - visibleItems) {
        currentSlide = 0;
    }

    const offset = -currentSlide * (100 / visibleItems);
    carousel.style.transform = `translateX(${offset}%)`;
}