//ARRAY DE IMAGENES
const imagenes = [
"FOTO1.jpg",
"FOTO2.jpg",
"FOTO3.jpg",
"FOTO4.jpg",
"FOTO5.jpg",
"campus_crema_espacio_1.png",
"campus_crema_espacio_2.png",
"campus_crema_v60.png",
"campus_crema_energy_bowl.png",
"campus_crema_sourdough.png",
];

//CREAMOS EL CONSTRUCTOR
class Carousel {    
  constructor(config) {
    this.trackMolde = config.trackMolde; 
    this.contenedorMolde = config.contenedorMolde;
    this.puntitoMolde = config.puntitoMolde;
    this.botonPrevMolde = config.botonPrevMolde;
    this.botonNextMolde = config.botonNextMolde;
    this.numeroMolde = config.numeroMolde;
    this.imagenes = config.imagenes;
    this.autoplayInterval = config.autoplayInterval || 0; // 0 para deshabilitar autoplay
    this.autoplayTimer = null;
    this.pausado = false;

    //TRAEMOS LOS ELEMENTOS DEL DOM
    this.track = document.querySelector(this.trackMolde);
    this.contenedor = document.querySelector(this.contenedorMolde);
    this.puntito = document.querySelector(this.puntitoMolde);
    this.botonPrev = document.querySelector(this.botonPrevMolde);
    this.botonNext = document.querySelector(this.botonNextMolde);
    this.numero = document.querySelector(this.numeroMolde);

    //ESTADO
    this.indiceActual = 0;

    // Evitamos romper si falta algún selector del carrusel
    if (!this.track || !this.contenedor || !this.puntito || !this.botonPrev || !this.botonNext || !this.numero) {
      return;
    }

    this.init();    
  }

//AUTOPLAY
 iniciarAutoplay() {
    this.pausarAutoplay();
    this.autoplayTimer = setInterval(() => {
      if (!this.pausado) this.siguiente();
    }, this.autoplayInterval);
  }

  pausarAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  reanudarAutoplay() {
    if (this.autoplayInterval > 0 && !this.autoplayTimer) {
      this.iniciarAutoplay();
    }
  }

  agregarEventosPausaAutoplay() {
    this.contenedor.addEventListener("mouseenter", () => {
      this.pausado = true;
    });
    this.contenedor.addEventListener("mouseleave", () => {
      this.pausado = false;
    });
  }

//RENDERIZADO 

  init() {
    this.contenedor.setAttribute("tabindex", "0");
    this.misSlides();
    this.renderPuntitos();
    this.actualizarUI();
    this.botonEscuchaActiva();
    if (this.autoplayInterval > 0) {
      this.iniciarAutoplay();
      this.agregarEventosPausaAutoplay();
    }
  }

// LLAMAMOS A LOS METODOS FUERA( funciones)

misSlides(){
  
  this.track.innerHTML = "";
  this.imagenes.forEach((url) =>{
    const slide = document.createElement("div");
    slide.classList.add("slide");
    const img = document.createElement("img");
    img.src = url;
    img.alt = "slide de carousel";
    slide.appendChild(img); // metemos img dentro del padre, slide
    this.track.appendChild(slide); // metemos slide dentro del track, su padre
  });
}

  renderPuntitos(){
    this.puntito.innerHTML = "";
    this.imagenes.forEach((_ , posicion) =>{
      const punto = document.createElement("button");
      punto.type = "button";
      punto.setAttribute("aria-label", `Ir al slide ${posicion + 1}`);
      punto.classList.add("indicador");
      if(posicion === 0) punto.classList.add("active"); 
      this.puntito.appendChild(punto);
    });
}

 // ACTUALIZO LA UI ¿EL QUE? puntos, posicion, numeros, slides
 actualizarUI(){
   const desplazar = -(this.indiceActual * 100);
   this.track.style.transform = `translateX(${desplazar}%)`;
   
   // movemos los indicadores
   
   this.puntito.querySelectorAll(".indicador").forEach((punto, posicion) =>{
        punto.classList.toggle("active", posicion === this.indiceActual)
   });

   this.numero.innerText = `${this.indiceActual + 1} / ${this.imagenes.length}`;
 } 
     
  //esto va fuera del forEach               
   //NAVEGACION CON LOS CONTROLES
   // estos metodos los controla el boton, no init
   siguiente(){
     this.indiceActual = this.indiceActual + 1;
     if(this.indiceActual === this.imagenes.length) {
       this.indiceActual = 0;
     }
              
     this.actualizarUI();
   }
    
  anterior(){
    this.indiceActual = this.indiceActual - 1;
    if(this.indiceActual === -1) {
      this.indiceActual = this.imagenes.length - 1;
    }
      
    this.actualizarUI();  
  }
 
  botonEscuchaActiva(){
    this.botonPrev.addEventListener("click", this.anterior.bind(this));
    this.botonNext.addEventListener("click", this.siguiente.bind(this));
    this.puntito.addEventListener("click", (e) => {
      if(e.target.classList.contains("indicador")){
        const indice = Array.from(this.puntito.children).indexOf(e.target);
        this.indiceActual = indice;
        this.actualizarUI();
      }
    });

    // Soporte teclado para accesibilidad
    this.contenedor.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.anterior();
      if (e.key === "ArrowRight") this.siguiente();
    });
  }
  
  // llamamos a los selectores
  
}


const carousel = new Carousel({
  contenedorMolde: ".carousel",
  trackMolde: ".track",
  puntitoMolde: ".puntito",
  botonPrevMolde: ".prev-button",
  botonNextMolde: ".next-button",
  numeroMolde: ".numero-contador",
  imagenes: imagenes,
  autoplayInterval: 5000 // Autoplay cada 5 segundos
});
  

