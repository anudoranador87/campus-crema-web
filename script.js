const { createElement } = require("react");

// He creado IntersectionObserver para animar tarjetas al aparecer
document.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll(".tarjeta-historia");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible"); // anima solo cuando entra en viewport
        observer.unobserve(entry.target); // evito reanimaciones
      }
    });
  }, { threshold: 0.2 });

  tarjetas.forEach(tarjeta => observer.observe(tarjeta));
});

document.querySelectorAll(".tarjeta-historia").forEach(card => {
  card.addEventListener("mouseenter", () => card.classList.add("hover"));
  card.addEventListener("mouseleave", () => card.classList.remove("hover"));
});


const btn = document.getElementById("hamburgerBtn");
const nav = document.querySelector(".nav");

btn.addEventListener("click", () => {
  nav.classList.toggle("active");
});


// VALIDACION DE FORMULARIO

class ValidarFormulario {
  constructor(selector) {
    this.miFormulario = document.querySelector(selector);
    this.misInputs = this.miFormulario.querySelectorAll("input[required], textarea[required]");
    this.esCorrecto = false;
    this.init();
  }

  // Método para inicializar el formulario

  init() {
  this.agregaEventListener();  //agrega la escucha de eventos
  
  this.miFormulario.addEventListener("submit", (e) => {
    e.preventDefault(); //evitamos que se recarge la pagina cuando pulsamos submit
    this.esCorrecto = true;
    
    this.misInputs.forEach(input => { //recorremos los inputs y validamos
      if(!this.validarCampos(input)){//sino es validar campos, es false
        this.esCorrecto = false;
      }
    });
    
    if (this.esCorrecto) {  //si esta correcto, entonces mensaje exito
      alert("¡Formulario enviado con éxito!");
      this.miFormulario.reset();
    }
  });
}
  

  //metodo para validar cada input
  validarCampos(input) {
    const type = input.type;
    const value = input.value;

    if (value === "") {
      this.showError(input, "Este campo es obligatorio");
      return false;
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(input, "Por favor ingresa un correo válido");
        return false;
      }
    }

    if (type === "password") {
      if (value.length < 6) {
        this.showError(input, "La contraseña debe tener al menos 6 caracteres");
        return false;
      }
    }

    if (type === "tel") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        this.showError(input, "Por favor ingresa un número de teléfono válido");
        return false;
      }
    }

    // Si pasa las validaciones anteriores
    return true; 
  }

  // Métodos para mostrar y limpiar errores
 showError(input,message){
  if(input.nextElementSibling && input.nextElementSibling.classList.contains("error-message")){
  input.nextElementSibling.remove();// Evito duplicar mensajes de error
  }

  //ya fuera del if, para que se muestre el error aunque no haya uno previo
  const error1 = document.createElement("span");
  error1.classList.add("error-message");
  error1.textContent = message;
  input.classList.add("input-error");
  input.after(error1);

}
//imagina una fila de mesas en el café. nextElementSibling es la mesa que está justo al lado a la derecha de la que señalas.
showSuccess(input){ 
  if(input.nextElementSibling && input.nextElementSibling.classList.contains("error-message")){
    input.nextElementSibling.remove();
  }
  input.classList.remove("input-error"); 
  input.classList.add("input-success"); 
}
}
