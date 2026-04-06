document.addEventListener("DOMContentLoaded", () => {
  const simuladorModal = document.getElementById("simulador-pedido");
  const abrirSimuladorBtn = document.getElementById("abrirSimulador");
  const cerrarXBtn = simuladorModal?.querySelector(".close-button");
  const cerrarSimuladorBtn = document.getElementById("cerrarSimulador");
  const opcionesCafe = simuladorModal?.querySelectorAll(
    "input[type='radio'], input[type='checkbox']"
  );
  const precioTotalSpan = document.getElementById("precioTotal");
  const anadirPedidoBtn = document.getElementById("añadirPedido");
  const totalPedido = simuladorModal?.querySelector(".total-pedido");

  if (
    !simuladorModal ||
    !abrirSimuladorBtn ||
    !cerrarXBtn ||
    !precioTotalSpan ||
    !anadirPedidoBtn ||
    !opcionesCafe
  ) {
    return;
  }

  let precioActual = 0;
  let mensajeConfirmacion = null;

  function marcarSelecciones() {
    opcionesCafe.forEach((opcion) => {
      const label = opcion.closest("label");
      if (!label) return;
      label.classList.toggle("seleccionada", opcion.checked);
    });
  }

  function calcularTotal() {
    let total = 0;

    const tipoCafeSeleccionado = simuladorModal.querySelector(
      "input[name='tipoCafe']:checked"
    );
    const tipoLecheSeleccionado = simuladorModal.querySelector(
      "input[name='tipoLeche']:checked"
    );

    if (tipoCafeSeleccionado) {
      total += parseFloat(tipoCafeSeleccionado.dataset.precio || "0");
    }

    if (tipoLecheSeleccionado) {
      total += parseFloat(tipoLecheSeleccionado.dataset.precio || "0");
    }

    simuladorModal
      .querySelectorAll("input[name='extra']:checked")
      .forEach((extra) => {
        total += parseFloat(extra.dataset.precio || "0");
      });

    precioActual = total;
    precioTotalSpan.textContent = total.toFixed(2);
    marcarSelecciones();
  }

  function abrirModal() {
    simuladorModal.style.display = "flex";
    document.body.classList.add("modal-open");
    calcularTotal();
  }

  function cerrarModal() {
    simuladorModal.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  function mostrarConfirmacion() {
    if (!totalPedido) return;

    if (!mensajeConfirmacion) {
      mensajeConfirmacion = document.createElement("p");
      mensajeConfirmacion.className = "mensaje-confirmacion";
      totalPedido.appendChild(mensajeConfirmacion);
    }

    mensajeConfirmacion.textContent = `Cafe anadido al pedido por ${precioActual.toFixed(
      2
    )} EUR.`;
    mensajeConfirmacion.classList.add("visible");

    setTimeout(() => {
      mensajeConfirmacion?.classList.remove("visible");
    }, 2200);
  }

  abrirSimuladorBtn.addEventListener("click", abrirModal);
  cerrarXBtn.addEventListener("click", cerrarModal);
  cerrarSimuladorBtn?.addEventListener("click", cerrarModal);

  window.addEventListener("click", (event) => {
    if (event.target === simuladorModal) cerrarModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && simuladorModal.style.display === "flex") {
      cerrarModal();
    }
  });

  opcionesCafe.forEach((opcion) => {
    opcion.addEventListener("change", calcularTotal);
  });

  anadirPedidoBtn.addEventListener("click", () => {
    mostrarConfirmacion();
    setTimeout(cerrarModal, 500);
  });

  calcularTotal();
});