const galleryImages = [
  "./gallery/1.png",
  "./gallery/2.png"
 
];

let currentImage = 0;
let overlay: HTMLDivElement | null = null;

export function openGallery() {
  if (overlay) return;

  currentImage = 0;

  overlay = document.createElement("div");
  overlay.className = "gallery-overlay";

  overlay.innerHTML = `
    <div class="gallery-window">
      <div class="gallery-header">
        <div>
          <h2>Gallery</h2>
          <span>memories & moments</span>
        </div>

        <button class="gallery-close" aria-label="Close gallery">
          ×
        </button>
      </div>

      <div class="gallery-grid">
        ${galleryImages
          .map(
            (image, index) => `
              <button class="gallery-item" data-index="${index}">
                <img src="${image}" alt="Gallery image ${index + 1}" loading="lazy">
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;

  document.body.append(overlay);

  requestAnimationFrame(() => {
    overlay?.classList.add("visible");
  });

  overlay.querySelector(".gallery-close")?.addEventListener("click", closeGallery);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeGallery();
    }
  });

  overlay.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number((item as HTMLElement).dataset.index);
      openViewer(index);
    });
  });

  document.addEventListener("keydown", handleKeyboard);
}

function openViewer(index: number) {
  if (!overlay) return;

  currentImage = index;

  const viewer = document.createElement("div");
  viewer.className = "gallery-viewer";

  viewer.innerHTML = `
    <button class="viewer-close">×</button>

    <button class="viewer-arrow viewer-prev">‹</button>

    <img
      class="viewer-image"
      src="${galleryImages[currentImage]}"
      alt="Gallery image"
    >

    <button class="viewer-arrow viewer-next">›</button>

    <div class="viewer-counter">
      ${currentImage + 1} / ${galleryImages.length}
    </div>
  `;

  document.body.append(viewer);

  requestAnimationFrame(() => {
    viewer.classList.add("visible");
  });

  viewer.querySelector(".viewer-close")?.addEventListener("click", () => {
    viewer.remove();
  });

  viewer.querySelector(".viewer-prev")?.addEventListener("click", () => {
    currentImage =
      (currentImage - 1 + galleryImages.length) % galleryImages.length;

    updateViewer(viewer);
  });

  viewer.querySelector(".viewer-next")?.addEventListener("click", () => {
    currentImage = (currentImage + 1) % galleryImages.length;

    updateViewer(viewer);
  });

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) {
      viewer.remove();
    }
  });
}

function updateViewer(viewer: HTMLDivElement) {
  const image = viewer.querySelector(".viewer-image") as HTMLImageElement;
  const counter = viewer.querySelector(".viewer-counter");

  image.src = galleryImages[currentImage];

  if (counter) {
    counter.textContent = `${currentImage + 1} / ${galleryImages.length}`;
  }
}

function handleKeyboard(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeGallery();

    document.querySelector(".gallery-viewer")?.remove();
  }

  const viewer = document.querySelector(".gallery-viewer") as HTMLDivElement | null;

  if (!viewer) return;

  if (event.key === "ArrowLeft") {
    currentImage =
      (currentImage - 1 + galleryImages.length) % galleryImages.length;

    updateViewer(viewer);
  }

  if (event.key === "ArrowRight") {
    currentImage = (currentImage + 1) % galleryImages.length;

    updateViewer(viewer);
  }
}

export function closeGallery() {
  if (!overlay) return;

  overlay.classList.remove("visible");

  setTimeout(() => {
    overlay?.remove();
    overlay = null;
  }, 250);

  document.removeEventListener("keydown", handleKeyboard);
}
