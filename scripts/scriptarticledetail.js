// =========================================================
// URL PARAMS & INITIAL STATE
// Read article id from query string and setup favorites cache
// =========================================================
const params = new URLSearchParams(window.location.search);
const articleId = parseInt(params.get("id"));

// Favorites list stored in localStorage (array of article IDs)
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Enable scrolling after initial CSS fade-in completes
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// =========================================================
// LOAD ARTICLE DATA
// Fetch the articles JSON, find the requested article by id,
// then render its content (inline or via external file).
// =========================================================
fetch("data/articles.json")
  .then((res) => res.json())
  .then((articles) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) {
      document.getElementById("articleDetail").innerHTML =
        "<p>Artikel tidak ditemukan.</p>";
      return;
    }

    // -----------------------------------------------------
    // renderArticle
    // Renders the full article HTML into #articleDetail.
    // Accepts the article's content as a string.
    // -----------------------------------------------------
    function renderArticle(content) {
      const isFavorited = favorites.includes(article.id);

      // Split raw text content into paragraphs using empty lines as separators
      // (handles double newlines or blocks with whitespace)
      const paragraphs = content
        .split(/\n\s*\n/) // split by one or more blank lines
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // Convert to HTML paragraphs
      const formattedContent = paragraphs.map((p) => `<p>${p}</p>`).join("");

      // Inject the detail view markup (title, meta, content, favorite button, back link)
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

      // Favorite button behavior: toggle state, persist to localStorage, show toast
      const favBtn = document.getElementById("favBtn");
      favBtn.addEventListener("click", () => {
        let message = "";
        let type = "";

        if (favorites.includes(article.id)) {
          // Remove from favorites
          favorites = favorites.filter((favId) => favId !== article.id);
          message = "Dihapus dari Favorit";
          type = "remove";
        } else {
          // Add to favorites
          favorites.push(article.id);
          message = "Ditambahkan ke Favorit";
          type = "add";
        }

        // Persist the new list
        localStorage.setItem("favorites", JSON.stringify(favorites));

        // Reflect the new state in the button UI
        const isNowFav = favorites.includes(article.id);
        favBtn.textContent = isNowFav
          ? "Hapus dari Favorit"
          : "Tambah ke Favorit";
        favBtn.className = isNowFav ? "remove" : "add";

        // Feedback toast
        showToast(message, type);
      });
    }

    // Decide whether to load inline content or fetch from an external file
    if (article.contentFile) {
      // Load .txt (or similar) file content and render it
      fetch(article.contentFile)
        .then((res) => res.text())
        .then((text) => renderArticle(text))
        .catch(() => renderArticle("<p>Gagal memuat isi artikel.</p>"));
    } else {
      // Render content directly from JSON
      renderArticle(article.content);
    }
  });

// =========================================================
// TOAST NOTIFICATION
// Small ephemeral message that appears at the bottom center
// to confirm user actions (e.g., add/remove favorite).
// 'type' controls color via CSS classes: .add / .remove
// =========================================================
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Play entrance animation (slight delay to trigger CSS transition)
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-hide after 2 seconds, then remove from DOM
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// =========================================================
/* MOBILE NAVIGATION TOGGLE
   Hamburger toggles the primary nav ('open' class) and
   keeps aria-expanded in sync for accessibility. */
// =========================================================
const hamburger = document.querySelector(".hamburger");
const nav = document.getElementById("site-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
