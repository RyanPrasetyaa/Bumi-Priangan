// Ambil parameter id dari URL
const params = new URLSearchParams(window.location.search);
const articleId = parseInt(params.get("id"));

// Ambil daftar favorit dari localStorage (array of id)
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Ambil data artikel dari JSON
fetch("data/articles.json")
  .then((res) => res.json())
  .then((articles) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) {
      document.getElementById("articleDetail").innerHTML =
        "<p>Artikel tidak ditemukan.</p>";
      return;
    }

    // Fungsi untuk render artikel (bisa dipanggil ulang setelah fetch contentFile)
    function renderArticle(content) {
      const isFavorited = favorites.includes(article.id);

      // 🔥 Pisahkan teks menjadi paragraf (split berdasarkan baris kosong)
      const paragraphs = content
        .split(/\n\s*\n/) // pisah per dua baris kosong
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // Ubah ke HTML paragraf
      const formattedContent = paragraphs.map((p) => `<p>${p}</p>`).join("");

      document.getElementById("articleDetail").innerHTML = `
        <div class="article-full">
          <img src="${article.image}" alt="${article.title}" />
          <h1>${article.title}</h1>
          <p class="article-meta">
            <span class="date">${article.date}</span> • 
            <span class="city">${article.city}</span>
          </p>
          ${formattedContent}
          <button id="favBtn" class="${isFavorited ? "remove" : "add"}">
            ${isFavorited ? "Hapus dari Favorit" : "Tambah ke Favorit"}
          </button>
          <br><br>
          <a href="articles.html" class="back-btn">← Kembali</a>
        </div>
      `;

      // Event untuk toggle favorit
      const favBtn = document.getElementById("favBtn");
      favBtn.addEventListener("click", () => {
        let message = "";
        let type = "";

        if (favorites.includes(article.id)) {
          // Hapus dari favorit
          favorites = favorites.filter((favId) => favId !== article.id);
          message = "Dihapus dari Favorit";
          type = "remove";
        } else {
          // Tambah ke favorit
          favorites.push(article.id);
          message = "Ditambahkan ke Favorit";
          type = "add";
        }

        // Simpan ke localStorage
        localStorage.setItem("favorites", JSON.stringify(favorites));

        // Update tampilan tombol
        const isNowFav = favorites.includes(article.id);
        favBtn.textContent = isNowFav
          ? "Hapus dari Favorit"
          : "Tambah ke Favorit";
        favBtn.className = isNowFav ? "remove" : "add";

        // Tampilkan toast
        showToast(message, type);
      });
    }

    // 🔥 Cek apakah artikel pakai file eksternal atau langsung
    if (article.contentFile) {
      // Ambil isi file .txt
      fetch(article.contentFile)
        .then((res) => res.text())
        .then((text) => renderArticle(text))
        .catch(() => renderArticle("<p>Gagal memuat isi artikel.</p>"));
    } else {
      // Kalau pakai content langsung dari JSON
      renderArticle(article.content);
    }
  });

// Fungsi toast
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

const hamburger = document.querySelector(".hamburger");
const nav = document.getElementById("site-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}