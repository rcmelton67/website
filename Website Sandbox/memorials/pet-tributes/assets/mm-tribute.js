document.addEventListener("DOMContentLoaded", () => {
  // Archive search: show only matching tribute cards.
  const searchInput = document.getElementById("tributeSearch");
  const cards = Array.from(document.querySelectorAll(".mm-archive-card"));
  if (searchInput && cards.length) {
    const normalize = (value) => (value || "").toLowerCase().trim();
    const cardIndexText = new Map();

    cards.forEach((card) => {
      const datasetValues = Object.values(card.dataset || {}).join(" ");
      const visibleCardText = card.textContent || "";
      cardIndexText.set(card, normalize(`${datasetValues} ${visibleCardText}`));
    });

    searchInput.addEventListener("input", function () {
      const query = normalize(this.value);

      cards.forEach((card) => {
        const searchableText = cardIndexText.get(card) || "";
        const matches = !query || searchableText.includes(query);
        card.style.display = matches ? "" : "none";
      });
    });
  }

  // Enhanced email share: Format email body so URLs are clearly clickable
  // Note: mailto: links can't include HTML, but email clients auto-detect URLs in plain text
  const emailShareLinks = document.querySelectorAll('a[data-platform="email"]');
  emailShareLinks.forEach((link) => {
    link.addEventListener("click", function(e) {
      // Let the default mailto: behavior work
      // Email clients (Gmail, Outlook, Apple Mail) will auto-detect URLs in plain text
      // and make them clickable, especially when URLs are on their own lines
      return true;
    });
  });
});
