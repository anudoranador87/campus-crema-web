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