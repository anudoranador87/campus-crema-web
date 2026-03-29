//ARRAY DE IMAGENES
const imagenes = [
"FOTO1.jpg",
"FOTO2.jpg",
"FOTO3.jpg",
"FOTO4.jpg",
"FOTO5.jpg"
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

    //TRAEMOS LOS ELEMENTOS DEL DOM
    this.track = document.querySelector(this.trackMolde);
    this.contenedor = document.querySelector(this.contenedorMolde);
    this.puntito = document.querySelector(this.puntitoMolde);
    this.botonPrev = document.querySelector(this.botonPrevMolde);
    this.botonNext = document.querySelector(this.botonNextMolde);
    this.numero = document.querySelector(this.numeroMolde);

    //ESTADO
    this.indiceActual = 0;
    this.init();    
  }


//RENDERIZADO 

init(){
  this.misSlides();
  this.renderPuntitos();
  this.actualizarUI();
  this.botonEscuchaActiva()
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
  })}
  renderPuntitos(){
    this.puntito.innerHTML = "";
    this.imagenes.forEach((_ , posicion) =>{
      const punto = document.createElement("button");
      punto.classList.add("indicador");
      if(posicion === 0) punto.classList.add("active"); 
      this.puntito.appendChild(punto);                            
      
    })}
 // ACTUALIZO LA UI ¿EL QUE? puntos, posicion, numeros, slides
 actualizarUI(){
 const desplazar = -(this.indiceActual * 100);
   this.track.style.transform = `translateX(${desplazar}%)`;  
   
   // movemos los indicadores
   
   document.querySelectorAll(".indicador").forEach((punto, posicion) =>{
        punto.classList.toggle("active", posicion === this.indiceActual)
         })    
     this.numero.innerText = this.indiceActual +1 } 
  //esto va fuera del forEach               
   //NAVEGACION CON LOS CONTROLES
   // estos metodos los controla el boton, no init
   siguiente(){
     this.indiceActual = this.indiceActual +1;
     if(this.indiceActual === this.imagenes.length)
       { this.indiceActual = 0
              }
     this.actualizarUI();
       }
  anterior(){
    this.indiceActual = this.indiceActual -1;
    if(this.indiceActual === -1)
    {this.indiceActual = this.imagenes.length -1}
      
     this.actualizarUI()  
        
    }
 
  botonEscuchaActiva(){
   this.botonPrev.addEventListener("click", this.anterior.bind(this));
this.botonNext.addEventListener("click", this.siguiente.bind(this));
    
  }
  
  // llamamos a los selectores
  

}

 const carousel = new Carousel({
  contenedorMolde: ".mi-slide",
  trackMolde: ".track",
  puntitoMolde: ".puntito",
  botonPrevMolde: ".prev-button",
  botonNextMolde: ".next-button",
  numeroMolde: ".numero-contador",
   imagenes: imagenes
})
  