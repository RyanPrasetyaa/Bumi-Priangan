const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const slides = document.querySelectorAll(".slide");
// const searchInput = document.getElementById("searchInput");
// const articlesList = document.getElementById("articlesList");
// const cards = articlesList.getElementsByClassName("card");
const numberOfSlides = slides.length;
let slideNumber = 0;

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

nextBtn.onclick = () => {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  slideNumber++;

  if (slideNumber > numberOfSlides - 1) {
    slideNumber = 0;
  }

  slides[slideNumber].classList.add("active");
};

prevBtn.onclick = () => {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  slideNumber--;

  if (slideNumber < 0) {
    slideNumber = numberOfSlides - 1;
  }

  slides[slideNumber].classList.add("active");
};

// searchInput.addEventListener("keyup", function () {
//   const filter = searchInput.value.toLowerCase();

//   // Loop semua card
//   Array.from(cards).forEach(card => {
//     const title = card.querySelector("h3").textContent.toLowerCase();
//     const description = card.querySelector("p").textContent.toLowerCase();

//     // Jika teks cocok dengan judul atau deskripsi → tampilkan
//     if (title.includes(filter) || description.includes(filter)) {
//       card.style.display = "";
//     } else {
//       card.style.display = "none";
//     }
//   });
// });