document.addEventListener("DOMContentLoaded", () => {   //CARGA EL DOM
  const botonesFiltro = document.querySelectorAll(".filtro-btn");
  const secciones = document.querySelectorAll(".menu-container .columna");
  const buscador = document.getElementById("buscadorCarta");
  const resultado = document.getElementById("resultadoFiltros");

  if (!botonesFiltro.length || !secciones.length || !buscador || !resultado) {
    return;
  }

  let filtroActivo = "todos"; //FILTRO ACTIVO
  let textoBusqueda = ""; //TEXTO DE BÚSQUEDA

  const normalizar = (texto) => //NORMALIZA EL TEXTO
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const aplicarFiltros = () => { //APLICA LOS FILTROS
    let totalVisible = 0;

    secciones.forEach((seccion) => {
      const categoria = seccion.dataset.categoria || ""; //CATEGORIA
      const coincideCategoria =
        filtroActivo === "todos" || categoria === filtroActivo;
      //MUESTRA LOS PRODUCTOS DE LA CATEGORIA
      let visiblesEnSeccion = 0;
      const items = seccion.querySelectorAll(".item");

      items.forEach((item) => {
        const nombre = item.querySelector("strong")?.textContent || "";
        const descripcion = item.querySelector("p")?.textContent || "";
        const contenido = normalizar(`${nombre} ${descripcion}`);
        const coincideTexto =
          !textoBusqueda || contenido.includes(normalizar(textoBusqueda));

        const mostrar = coincideCategoria && coincideTexto;
        item.classList.toggle("oculto", !mostrar);

        if (mostrar) {
          visiblesEnSeccion += 1;
          totalVisible += 1;
        }
      });

      seccion.classList.toggle("oculta", visiblesEnSeccion === 0);
    });

    if (!textoBusqueda && filtroActivo === "todos") {
      resultado.textContent = "Mostrando todos los productos.";
      return;
    }

    if (totalVisible === 0) {
      resultado.textContent = "No hay resultados para esos filtros.";
      return;
    }

    resultado.textContent = `Se muestran ${totalVisible} producto(s).`;
  };

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      filtroActivo = boton.dataset.filtro || "todos";
      botonesFiltro.forEach((btn) =>
        btn.classList.toggle("activo", btn === boton)
      );
      aplicarFiltros();
    });
  });

  buscador.addEventListener("input", (event) => {
    textoBusqueda = event.target.value || "";
    aplicarFiltros();
  });

  aplicarFiltros();
});
