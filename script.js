
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


// common.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburgerBtn");
  const nav = document.querySelector(".nav");

  if (btn && nav) {
    btn.addEventListener("click", () => {
      nav.classList.toggle("active");
      btn.classList.toggle("active");
      const expanded = btn.classList.contains("active");
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.setAttribute("aria-label", expanded ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        btn.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Abrir menú");
      });
    });
  }
});

// VALIDACION DE FORMULARIO


  // Método para inicializar el formulario

 class ValidarFormulario {
  constructor(selector) {
    this.miFormulario = document.querySelector(selector);
    this.misInputs = this.miFormulario.querySelectorAll("input[required], textarea[required]");
    this.mensajeExito = document.createElement("p");
    this.mensajeExito.classList.add("mensaje-exito");
    this.miFormulario.appendChild(this.mensajeExito);
    this.init();
  }

  init() {
    this.agregaEventListener();

    this.miFormulario.addEventListener("submit", async (e) => { // Añadir 'async'
      e.preventDefault();
      let esCorrecto = true;

      this.misInputs.forEach(input => {
        if (!this.validarCampos(input)) {
          esCorrecto = false;
        }
      });

      if (esCorrecto) {
        this.mensajeExito.textContent = "Enviando formulario...";
        this.mensajeExito.style.color = "orange";
        this.mensajeExito.style.display = "block";

        try {
          const response = await fetch(this.miFormulario.action, {
            method: this.miFormulario.method,
            body: new FormData(this.miFormulario),
            headers: {
                'Accept': 'application/json'
            }
          });

          if (response.ok) {
            this.mensajeExito.textContent = "¡Formulario enviado con éxito!";
            this.mensajeExito.style.color = "green";
            this.miFormulario.reset();
            // Opcional: ocultar el mensaje después de unos segundos
            setTimeout(() => { this.mensajeExito.style.display = "none"; }, 5000);
          } else {
            const data = await response.json();
            if (Object.hasOwnProperty.call(data, 'errors')) {
              this.mensajeExito.textContent = data["errors"].map(error => error["message"]).join(", ");
            } else {
              this.mensajeExito.textContent = "¡Oops! Hubo un problema al enviar el formulario.";
            }
            this.mensajeExito.style.color = "red";
          }
        } catch (error) {
          this.mensajeExito.textContent = "Error de red. Por favor, inténtalo de nuevo.";
          this.mensajeExito.style.color = "red";
          console.error("Error al enviar el formulario:", error);
        }
      } else {
        this.mensajeExito.style.display = "none"; // Ocultar mensaje de envío si hay errores
      }
    });
  }

  // ... (métodos validarCampos, showError, showSuccess existentes)
}

// Instanciar la validación del formulario
new ValidarFormulario(".reserva form");