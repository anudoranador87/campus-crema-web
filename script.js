
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
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copiarDireccion");
  const direccion = document.getElementById("direccion-texto");
  const btnTop = document.getElementById("btn-top");

  if (copyBtn && direccion && navigator.clipboard) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(direccion.textContent || "");
        copyBtn.textContent = "Direccion copiada";
        setTimeout(() => {
          copyBtn.textContent = "Copiar dirección";
        }, 1500);
      } catch (error) {
        console.error("No se pudo copiar la dirección:", error);
      }
    });
  }

  if (btnTop) {
    window.addEventListener("scroll", () => {
      btnTop.classList.toggle("visible", window.scrollY > 320);
    });

    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});




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
    this.agregaEventListeners();

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


  // asybgncronía para mostrar el clima en el widget del clima
async function myApiWeather(){ 
try{
const datos = await fetch ("https://api.openweathermap.org/data/2.5/weather?q=Malaga&appid=a7c274fbfdc82c83ec391428c873820b&units=metric&lang=es")    // esperando los datos
const jsonDatos = await datos.json();     // convertimos de json a objeto
const myClima = {name: jsonDatos.name ,temp:  jsonDatos.main.temp,description: jsonDatos.weather[0].description}

const clima = document.querySelector("#weather-widget")
clima.innerHTML = `${jsonDatos.name},${jsonDatos.main.temp},${jsonDatos.weather[0].description}`


}

catch(error){
console.log("Error, no se puede mostrar la información")
}
}


document.addEventListener('DOMContentLoaded', () => {
  myApiWeather();
});





