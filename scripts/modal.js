// const openEls = document.querySelectorAll("[data-open]");
// const isVisible = "is-visible";
// for(const el of openEls) {
//     el.addEventListener("click", function() {
//     const modalId = this.dataset.open;
//     document.getElementById(modalId).classList.add(isVisible);
//     });
// }

// const closeEls = document.querySelectorAll("[data-close]");
// for (const el of closeEls) {
//     el.addEventListener("click", function() {
//     document.querySelector(".modal.is-visible").classList.remove(isVisible);
//     });
// }

// document.addEventListener("keyup", e => {
//     if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
//     document.querySelector(".modal.is-visible").classList.remove(isVisible);
//     }
// });



'[class^="miClase"]'

// const showButtons = document.querySelectorAll(".show-button");
// const modales = document.querySelectorAll('[class^="modal__"]');

// for (button of showButtons) {
//     button.addEventListener("click", function () {
//         const alertDialog = document.querySelector(".alert-dialog");
//         alertDialog.showModal();
//     });
// }

// // Obtener todos los elementos div con clase "item_x"
// const items = document.querySelectorAll('[class^="item_"]');
// items.forEach((item) => {
//     // Agregar un evento de clic a cada div
//     item.addEventListener('click', () => {
//         // Obtener el número de clase del div actual
//         const classNumber = item.className.match(/item_(\d+)/)[1];
//         // Obtener el dialog correspondiente
//         const modal = document.querySelector(".modal__${classNumber}");
//         // Mostrar el dialog correspondiente
//         modal.show();
//     });
// });

// // Agregar eventos de clic a todos los botones de cierre de los dialogs
// const botonesCerrar = document.querySelectorAll('.modal__');
// botonesCerrar.forEach((boton) => {
//     boton.addEventListener('click', () => {
//         // Obtener el dialog actual
//         const dialog = boton.closest('dialog');
//         // Cerrar el dialog
//         dialog.close();
//     });
// });

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
