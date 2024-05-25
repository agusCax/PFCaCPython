const showButtons = document.querySelectorAll(".show-button");

showButtons.forEach(button => {
    button.addEventListener("click", function () {
        // Obtener el valor del atributo data-target para identificar el modal que debe mostrarse
        const modalSelector = this.getAttribute("data-target");
        // Seleccionar el modal correspondiente
        const modal = document.querySelector(modalSelector);
        // Mostrar el modal
        modal.showModal();
    });
});
