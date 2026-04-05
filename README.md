# Campus & Crema

🇪🇸 [Español](#español) · 🇬🇧 [English](#english)

🌐 **[Ver en vivo / Live](https://anudoranador87.github.io/campus-crema-web/)**

---

## Español

### Qué es esto

Web completa para una cafetería de especialidad ficticia. Proyecto de práctica real — no un ejercicio de tutorial.

Construida para aplicar OOP, manipulación del DOM, validación de formularios y diseño responsive en un contexto concreto, con páginas reales, contenido real y lógica real.

---

### Clonar y ver en local

```bash
git clone https://github.com/anudoranador87/campus-crema-web.git
cd campus-crema-web
open index.html
```

Sin npm. Sin build tools. Sin dependencias. Abre directamente en el navegador.

---

### Qué hay dentro

```
campus-crema-web/
├── index.html          # Página principal — hero, carousel, menú destacado, formulario
├── carta.html          # Carta completa con secciones y filtros
├── nosotros.html       # Página de equipo y filosofía
├── css/
│   └── styles.css      # Estilos globales con CSS Custom Properties
└── js/
    └── main.js         # Lógica del carousel, menú hamburguesa y validación
```

---

### Qué hace cada pieza de JavaScript

**Menú hamburguesa**  
`getElementById` + `classList.toggle('active')`. El botón vive fuera del `<nav>` — decisión deliberada para que las media queries no lo oculten junto al menú.

**Carousel de imágenes**  
Clase `Carousel` en OOP vanilla. Estado centralizado en `indiceActual`. Métodos `siguiente()`, `anterior()` y `actualizarUI()`. Indicadores con `classList.toggle('active', condición)`. Transición con `translateX`. Listeners con `bind(this)` para mantener el contexto correcto.

**Validación de formulario**  
Clase `ValidarFormulario`. Constructor con `miFormulario`, `misInputs` y `esCorrecto`. Event listeners `blur` e `input` por cada campo con `forEach`. Método `validarCampos()` con comprobación de campo vacío y regex de email. Métodos `showError()` y `showSuccess()` con creación dinámica de spans en el DOM usando `input.after()`.

---

### Decisiones técnicas

**OOP sobre funciones sueltas.** La validación y el carousel viven en clases, no en funciones globales. Objetivo: practicar encapsulación real antes de llegar a React.

**Sin librerías de UI.** Cada animación y transición está escrita a mano. El carousel no usa Swiper. La validación no usa una librería externa. Decisión pedagógica: entender antes de abstraer.

**CSS Custom Properties para theming.** Variables definidas en `:root` para colores, tipografía y espaciado.

**`input.after()` para inserción de errores.** Inserción precisa en el DOM sin romper el layout del formulario.

---

### Stack

`HTML5` · `CSS3 (Custom Properties, Flexbox, Grid)` · `JavaScript ES6+ (OOP)` · `GitHub Pages`

---

### Autor

Jose Aparicio — Frontend developer en transición desde hostelería.

📧 josemaparicio87@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/joseaparicio87/)  
🐙 [GitHub](https://github.com/anudoranador87)

---

## English

### What this is

A complete website for a fictional specialty coffee shop. A real practice project — not a tutorial exercise.

Built to apply OOP, DOM manipulation, form validation, and responsive design in a concrete context: real pages, real content, real logic.

---

### Clone and run locally

```bash
git clone https://github.com/anudoranador87/campus-crema-web.git
cd campus-crema-web
open index.html
```

No npm. No build tools. No dependencies. Opens directly in the browser.

---

### What's inside

```
campus-crema-web/
├── index.html          # Main page — hero, carousel, menu highlights, booking form
├── carta.html          # Full menu with sections
├── nosotros.html       # Team and philosophy page
├── css/
│   └── styles.css      # Global styles with CSS Custom Properties
└── js/
    └── main.js         # Carousel, hamburger menu and form validation logic
```

---

### What each JavaScript piece does

**Hamburger menu**  
`getElementById` + `classList.toggle('active')`. The button lives outside the `<nav>` — deliberate decision so media queries don't hide it along with the menu.

**Image carousel**  
`Carousel` class in vanilla OOP. State centralised in `indiceActual`. Methods `siguiente()`, `anterior()` and `actualizarUI()`. Indicators with `classList.toggle('active', condition)`. Transition via `translateX`. Listeners with `bind(this)` to preserve correct context.

**Form validation**  
`ValidarFormulario` class. Constructor with `miFormulario`, `misInputs` and `esCorrecto`. `blur` and `input` event listeners per field via `forEach`. `validarCampos()` method with empty field check and email regex. `showError()` and `showSuccess()` methods with dynamic span creation in the DOM using `input.after()`.

---

### Technical decisions

**OOP over loose functions.** Validation and carousel live in classes, not global functions. Goal: practise real encapsulation before reaching React.

**No UI libraries.** Every animation and transition is written by hand. The carousel doesn't use Swiper. Validation doesn't use an external library. Pedagogical decision: understand before abstracting.

**CSS Custom Properties for theming.** Variables defined in `:root` for colours, typography and spacing.

**`input.after()` for error insertion.** Precise DOM insertion without breaking the form layout.

---

### Stack

`HTML5` · `CSS3 (Custom Properties, Flexbox, Grid)` · `JavaScript ES6+ (OOP)` · `GitHub Pages`

---

### Author

Jose Aparicio — Frontend developer transitioning from hospitality.

📧 josemaparicio87@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/joseaparicio87/)  
🐙 [GitHub](https://github.com/anudoranador87)
