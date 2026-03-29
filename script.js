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

