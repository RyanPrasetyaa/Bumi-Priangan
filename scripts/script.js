const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const slides = document.querySelectorAll(".slide");
const numberOfSlides = slides.length;
let slideNumber = 0;


/* helper */
const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

/* show page smoothly */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ====== MOBILE: hamburger ====== */
const hamburger = document.querySelector(".hamburger");
const nav = document.getElementById("site-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* ====== DESKTOP/TABLET: slider tombol next/prev ====== */
if (nextBtn && prevBtn) {
  nextBtn.onclick = () => {
  if (isMobile()) return; // nonaktif di mobile
  slides.forEach((slide) => slide.classList.remove("active"));
  slideNumber++;
  if (slideNumber > numberOfSlides - 1) slideNumber = 0;
  slides[slideNumber].classList.add("active");
};

prevBtn.onclick = () => {
  if (isMobile()) return; // nonaktif di mobile
  slides.forEach((slide) => slide.classList.remove("active"));
  slideNumber--;
  if (slideNumber < 0) slideNumber = numberOfSlides - 1;
  slides[slideNumber].classList.add("active");
};

}

/* kalau user resize dari desktop -> mobile, biar aman */
window.addEventListener("resize", () => {
  if (isMobile()) {
    // pastikan tidak ada transform aktif]
  }
});
