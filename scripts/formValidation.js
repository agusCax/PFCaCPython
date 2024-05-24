// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("formulario-sumate");

    var nombreInput = document.getElementById("nombre");
    var apellidoInput = document.getElementById("apellido");
    var emailInput = document.getElementById("email");
    var telefonoInput = document.getElementById("telefono");
    var fotoInput = document.getElementById("foto");
    var zonaInput = document.getElementById("zona");
    var tipoInput = document.getElementsByName("tipo");
    var terminosInput = document.getElementById("terminos");

    nombreInput.addEventListener("input", validarNombre);
    apellidoInput.addEventListener("input", validarApellido);
    emailInput.addEventListener("input", validarEmail);
    telefonoInput.addEventListener("input", validarTelefono);
    fotoInput.addEventListener("input", validarFoto);
    zonaInput.addEventListener("change", validarZona);

    for (var i = 0; i < tipoInput.length; i++) {
        tipoInput[i].addEventListener("change", validarTipo);
    }
    terminosInput.addEventListener("change", validarTerminos);


    // creo una función genérica para validar campos
    function validarCampo(input, minLength, maxLength) {
        var valor = input.value.trim();

        if (valor === "") {
            mostrarError(input, "Este campo es obligatorio.");
        } else if (valor.length < minLength || valor.length > maxLength) {
            mostrarError(input, "Este campo debe tener entre " + minLength + " y " + maxLength + " caracteres.");
        } else {
            ocultarError(input);
        }
    }
    // valido nombre con parámetros largo min y largo max
    function validarNombre() {
        validarCampo(nombreInput,5,100);
    }
    // valido apellido con parámetros largo min y largo max
    function validarApellido() {
        validarCampo(apellidoInput,7,100);
    }

    function validarEmail() {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            mostrarError(emailInput, "Por favor, introduce una dirección de correo electrónico válida.");
        } else {
            ocultarError(emailInput);
        }
    }

    function validarTelefono() {
        var telefonoRegex = /^\d{10}$/;
        if (!telefonoRegex.test(telefonoInput.value.trim())) {
            mostrarError(telefonoInput, "Por favor, introduce un número de teléfono válido (10 dígitos).");
        } else {
            ocultarError(telefonoInput);
        }
    }

    function validarFoto() {
        // Aquí puedes agregar lógica para validar el tipo o tamaño de la foto, si es necesario
        if (fotoInput.value.trim() === "") {
            mostrarError(fotoInput, "Por favor, selecciona una foto.");
        } else {
            ocultarError(fotoInput);
        }
    }

    function validarZona() {
        if (zonaInput.value === "") {
            mostrarError(zonaInput, "Por favor, selecciona tu zona de residencia.");
        } else {
            ocultarError(zonaInput);
        }
    }

    function validarTipo() {
        for (var i = 0; i < tipoInput.length; i++) {
            if (tipoInput[i].checked) {
                ocultarError(tipoInput[0]); // Se oculta el error general
                return;
            }
        }
        mostrarError(tipoInput[0], "Por favor, selecciona tu tipo de usuario.");
    }

    function validarTerminos() {
        if (!terminosInput.checked) {
            mostrarError(terminosInput, "Debes aceptar los términos y condiciones.");
        } else {
            ocultarError(terminosInput);
        }
    }

    function mostrarError(input, mensaje) {
        var errorSpan = input.nextElementSibling;
        errorSpan.innerText = mensaje;
        errorSpan.style.display = "block";
    }

    function ocultarError(input) {
        var errorSpan = input.nextElementSibling;
        errorSpan.innerText = "";
        errorSpan.style.display = "none";
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        validarNombre();
        validarApellido();
        validarEmail();
        validarTelefono();
        validarFoto();
        validarZona();
        validarTipo();
        validarTerminos();

        var errores = form.querySelectorAll(".error");
        var hayErrores = false;
        for (var i = 0; i < errores.length; i++) {
            if (errores[i].innerText !== "") {
                hayErrores = true;
                break;
            }
        }

        if (!hayErrores) {
            // Aquí puedes enviar el formulario
            alert("Formulario válido. ¡Enviando datos!");
            form.submit();
        } else {
            alert("Por favor, completa correctamente todos los campos.");
        }
    });
});
