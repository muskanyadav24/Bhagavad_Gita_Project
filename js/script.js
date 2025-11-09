const gita = () => {
  const container = document.getElementById("chaptersAll");
  container.innerHTML = "";

  fetch("https://vedicscriptures.github.io/chapters")
    .then((res) => res.json())
    .then((data) => {
      const chapters = Object.values(data);
      let row = null;

      chapters.forEach((chapter, index) => {
        if (index % 2 === 0) {
          row = document.createElement("div");
          row.classList.add("row", "g-4", "mt-4");
          container.appendChild(row);
        }

        const col = document.createElement("div");
        col.classList.add("col-lg-6");

        const shortSummary =
          (chapter.summary.hi || chapter.summary.en)
            .split(" ")
            .slice(0, 30)
            .join(" ") + " ...";

        col.innerHTML = `
          <div class="card border-0 shadow bgcolor rounded-4 h-100">
            <div class="card-body">
              <h5 class="card-title text-danger fw-bold mb-2">
                अध्याय ${chapter.chapter_number}: ${chapter.name}
              </h5>
              <p class="text-muted mb-1"><strong>श्लोक:</strong> ${chapter.verses_count}</p>
              <p class="card-text text-secondary fs-6">${shortSummary}</p>
              <button class="btn btn-warning text-white fw-semibold mt-2 see-more">
                SEE MORE
              </button>
            </div>
          </div>
        `;

        const seeMoreBtn = col.querySelector(".see-more");
        seeMoreBtn.addEventListener("click", () => openChapterModal(chapter));

        row.appendChild(col);
      });
    })
    .catch((err) => console.error("Error:", err));
};

function openChapterModal(chapter) {
  const modalEl = document.getElementById("chapterModal");
  const modalTitle = document.getElementById("chapterModalTitle");
  const modalSummary = document.getElementById("chapterSummary");
  // const modalVerses = document.getElementById("chapterVerses");

  modalTitle.innerText = `अध्याय ${chapter.chapter_number}: ${chapter.name}`;
  modalSummary.innerText = (chapter.summary.hi || "") + "\n\n" + (chapter.summary.en || "");
  // modalVerses.innerHTML = `<p class="text-center text-muted">Loading verses...</p>`;
  modalTitle.setAttribute('tabindex', '0');

  if (document.activeElement) document.activeElement.blur();

  const observer = new MutationObserver(() => {
    if (modalEl.getAttribute('aria-hidden') === 'true') {
      modalEl.setAttribute('aria-hidden', 'false');
    }
  });

  observer.observe(modalEl, { attributes: true, attributeFilter: ['aria-hidden'] });
  const modal = new bootstrap.Modal(modalEl, { focus: false });
  modal.show();

  function onShown() {
    try { modalTitle.focus(); } catch (e) {}
    modalEl.removeEventListener('shown.bs.modal', onShown);
  }
  modalEl.addEventListener('shown.bs.modal', onShown);

  function onHidden() {
    observer.disconnect();
    modalEl.removeEventListener('hidden.bs.modal', onHidden);
  }
  modalEl.addEventListener('hidden.bs.modal', onHidden);
}
gita();