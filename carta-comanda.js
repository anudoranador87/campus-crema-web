// ─────────────────────────────────────────────

// ─────────────────────────────────────────────

const carta = [
  {
    categoria: "Café",
    platos: [
      { id: 1, nombre: "Espresso Doble", precio: 2.0 },
      { id: 2, nombre: "V60 / Filtrado", precio: 3.0 },
      { id: 3, nombre: "Flat White", precio: 3.0 }
    ]
  },
  {
    categoria: "Desayunos",
    platos: [
      { id: 4, nombre: "Toasted Sourdough", precio: 4.0 },
      { id: 5, nombre: "Energy Bowl", precio: 5.0 },
      { id: 6, nombre: "Cookie Laboratorio", precio: 3.0 }
    ]
  },
  {
    categoria: "Comidas",
    platos: [
      { id: 7, nombre: "The Classic Toasted", precio: 7.0 },
      { id: 8, nombre: "Serrano Premium", precio: 8.0 },
      { id: 9, nombre: "Salmon & Cream", precio: 7.0 }
    ]
  },
  {
    categoria: "Postres",
    platos: [
      { id: 10, nombre: "Brownie Chocolate 70%", precio: 4.0 },
      { id: 11, nombre: "Cheesecake Artesana", precio: 5.0 },
      { id: 12, nombre: "Cookie de Nutella", precio: 3.0 }
    ]
  }
];

// El ticket es un array de objetos: { id, nombre, precio, cantidad }
let ticket = [];

// ─────────────────────────────────────────────
const cartaContainer = document.getElementById("carta");
const btnEnviar = document.getElementById("btn-enviar");
const ivaPct = document.getElementById("iva-pct");
const IVA_FIJO = 10;
const PERSONALIZADO_ID = 1000;

if (cartaContainer && btnEnviar && ivaPct) {
  // ─────────────────────────────────────────────
  // TODO 1 — renderCarta
  // ─────────────────────────────────────────────
  function renderCarta() {
    // Limpiamos el contenedor antes de crear nada
    cartaContainer.innerHTML = "";

    // Recorremos cada categoría
    carta.forEach((bloque) => {
      // Crear div de categoría y ponerle el nombre
      const secciones = document.createElement("div");
      secciones.className = "carta-categoria";

      const titulo = document.createElement("h3");
      titulo.textContent = bloque.categoria;
      secciones.appendChild(titulo);

      // Recorremos los platos de esta categoría
      bloque.platos.forEach((plato) => {
        // Crear botón por cada plato con nombre y precio
        const dish = document.createElement("button");
        dish.className = "dish-btn";
        dish.type = "button";
        dish.textContent = `${plato.nombre} - ${plato.precio.toFixed(2)} €`;

        // Escuchamos el click y llamamos a añadirAlTicket
        dish.addEventListener("click", function () {
          anadirAlTicket(plato);
        });

        // Añadir botón al div de la categoría
        secciones.appendChild(dish);
      });

      // Añadir div de categoría al contenedor principal
      cartaContainer.appendChild(secciones);
    });
  }

  // ─────────────────────────────────────────────
  // TODO 2 — añadirAlTicket
  // ─────────────────────────────────────────────
  function anadirAlTicket(plato) {
    // Busco si el plato ya existe en el ticket
    const existe = ticket.find((item) => item.id === plato.id);

    // Si existe subo la cantidad, si no lo añado con cantidad 1
    existe ? (existe.cantidad += 1) : ticket.push({ ...plato, cantidad: 1 });

    renderTicket();
  }

  function actualizarCafePersonalizado(cafePersonalizado) {
    if (!cafePersonalizado) return;

    const existente = ticket.find((item) => item.id === PERSONALIZADO_ID);
    if (existente) {
      existente.nombre = cafePersonalizado.nombre;
      existente.precio = cafePersonalizado.precio;
      existente.configKey = cafePersonalizado.configKey;
    } else {
      ticket.push({
        id: PERSONALIZADO_ID,
        nombre: cafePersonalizado.nombre,
        precio: cafePersonalizado.precio,
        cantidad: 1,
        configKey: cafePersonalizado.configKey
      });
    }

    renderTicket();
  }

  // ─────────────────────────────────────────────
  // TODO 3 — cambiarCantidad
  // ─────────────────────────────────────────────
  function cambiarCantidad(id, delta) {
    const resultado = ticket.find((item) => item.id === id);
    if (!resultado) return;

    resultado.cantidad += delta;
    if (resultado.cantidad <= 0) {
      // Aqui eliminamos un item del array si la cantidad es 0
      const guardoIndice = ticket.findIndex((item) => item.id === id);
      if (guardoIndice !== -1) {
        ticket.splice(guardoIndice, 1);
      }
    }
    renderTicket();
  }

  // ─────────────────────────────────────────────
  // TODO 4 — renderTicket()
  // Recorre el array `ticket` y genera el HTML de los items.
  // Si está vacío, muestra el mensaje de vacío.
  // Llama a calcularTotales() al final.
  // ─────────────────────────────────────────────
  function renderTicket() {
    const contenedor = document.getElementById("ticket-items");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (ticket.length === 0) {
      const vacio = document.createElement("li");
      vacio.className = "ticket-vacio";
      vacio.textContent = "Ticket vacío";
      contenedor.appendChild(vacio);
      calcularTotales();
      return;
    }

    ticket.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("ticket-item");
      li.innerHTML = `
  <span>${item.nombre}</span>
  <span>${item.cantidad}</span>
  <span>${item.precio.toFixed(2)} €</span>
  <button class="quitar" type="button">-</button>
  <button class="agregar" type="button">+</button>
`;
      contenedor.appendChild(li);

      li.querySelector(".quitar").addEventListener("click", () => {
        cambiarCantidad(item.id, -1);
      });
      li.querySelector(".agregar").addEventListener("click", () => {
        cambiarCantidad(item.id, +1);
      });
    });

    calcularTotales();
  }

  function calcularTotales() {
    const subtotal = ticket.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );

    const ivaEuros = subtotal * (IVA_FIJO / 100);
    const total = subtotal + ivaEuros;

    const subtotalEl = document.getElementById("subtotal");
    const ivaEurosEl = document.getElementById("iva-euros");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (ivaEurosEl) ivaEurosEl.textContent = ivaEuros.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);
  }

  // ─────────────────────────────────────────────
  // TODO 6 — enviarComanda()
  // ─────────────────────────────────────────────  
  function enviarComanda() {
    if (ticket.length === 0) return;

    const idComanda = Date.now();
    const hora = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const historial = document.getElementById("historial-comandas");
    if (historial) {
      const linea = document.createElement("li");
      const resumen = ticket
        .map((item) => `${item.cantidad}x ${item.nombre}`)
        .join(", ");
      linea.textContent = `#${idComanda} | ${hora} | ${resumen}`;
      historial.prepend(linea);
    }

    ticket = [];
    renderTicket();
  }

  // EVENTOS
  btnEnviar.addEventListener("click", enviarComanda);
  document.addEventListener("cafePersonalizadoActualizado", (event) => {
    actualizarCafePersonalizado(event.detail);
  });

  ivaPct.textContent = String(IVA_FIJO);

  // ARRANQUE
  renderCarta();
  renderTicket();
}

// FAQ acordeon
const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const answer = button.nextElementSibling;

    button.setAttribute("aria-expanded", expanded ? "false" : "true");
    if (answer) {
      answer.hidden = expanded;
    }
  });
});
