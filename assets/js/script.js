'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebar && sidebarBtn) {
  const setSidebarMaxHeight = function (value) {
    if (value === null) {
      sidebar.style.removeProperty("max-height");
      return;
    }

    sidebar.style.setProperty("max-height", value);
  };

  const updateAriaExpanded = function (isExpanded) {
    sidebarBtn.setAttribute("aria-expanded", String(Boolean(isExpanded)));
  };

  const handleExpandTransitionEnd = function (event) {
    if (event.propertyName !== "max-height") { return; }
    setSidebarMaxHeight("none");
    sidebar.removeEventListener("transitionend", handleExpandTransitionEnd);
  };

  updateAriaExpanded(sidebar.classList.contains("active"));

  sidebarBtn.addEventListener("click", function () {
    const isOpening = !sidebar.classList.contains("active");

    if (isOpening) {
      sidebar.classList.add("active");
      updateAriaExpanded(true);
      sidebar.removeEventListener("transitionend", handleExpandTransitionEnd);

      setSidebarMaxHeight(`${sidebar.scrollHeight}px`);
      sidebar.addEventListener("transitionend", handleExpandTransitionEnd);
      return;
    }

    sidebar.removeEventListener("transitionend", handleExpandTransitionEnd);

    const currentHeight = sidebar.scrollHeight;
    setSidebarMaxHeight(`${currentHeight}px`);

    void sidebar.offsetHeight;
    sidebar.classList.remove("active");
    updateAriaExpanded(false);

    const collapseCleanup = function () {
      setSidebarMaxHeight(null);
    };

    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(collapseCleanup);
    } else {
      collapseCleanup();
    }
  });
}



// testimonials variables
const testimonialsItems = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const setTestimonialsModalState = function (shouldOpen) {
  if (!modalContainer || !overlay) { return; }
  modalContainer.classList.toggle("active", Boolean(shouldOpen));
  overlay.classList.toggle("active", Boolean(shouldOpen));
};

const openTestimonialsModal = function (item) {
  if (!item) { return; }

  const avatar = item.querySelector("[data-testimonials-avatar]");
  const title = item.querySelector("[data-testimonials-title]");
  const text = item.querySelector("[data-testimonials-text]");

  if (modalImg && avatar) {
    modalImg.src = avatar.src;
    modalImg.alt = avatar.alt;
  }

  if (modalTitle && title) {
    modalTitle.innerHTML = title.innerHTML;
  }

  if (modalText && text) {
    modalText.innerHTML = text.innerHTML;
  }

  setTestimonialsModalState(true);
};

for (let i = 0; i < testimonialsItems.length; i++) {
  const item = testimonialsItems[i];
  const itemAvatar = item.querySelector("[data-testimonials-avatar]");

  if (itemAvatar) {
    itemAvatar.dataset.lightboxDisabled = "true";
  }
  item.setAttribute("tabindex", item.getAttribute("tabindex") || "0");
  item.setAttribute("role", item.getAttribute("role") || "button");

  item.addEventListener("click", function () {
    if (window.console && typeof console.debug === "function") {
      console.debug("Testimonial clicked", { index: i });
    }
    openTestimonialsModal(item);
  });

  item.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      openTestimonialsModal(item);
    }
  });
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", function () {
    setTestimonialsModalState(false);
  });
}

if (overlay) {
  overlay.addEventListener("click", function () {
    setTestimonialsModalState(false);
  });
}



// project modal variables
const projectItems = document.querySelectorAll("[data-project-item]");
const PROJECT_TEMPLATE_PATH = "project_template.html";

projectItems.forEach((item) => {
  const projectLink = item.querySelector("[data-project-link]");

  if (!projectLink) { return; }

  const externalUrl = projectLink.dataset.externalUrl;

  if (externalUrl) {
    projectLink.setAttribute("href", externalUrl);
    projectLink.setAttribute("target", projectLink.getAttribute("target") || "_blank");
    if (!projectLink.hasAttribute("rel")) {
      projectLink.setAttribute("rel", "noopener noreferrer");
    }
    return;
  }

  projectLink.setAttribute("href", PROJECT_TEMPLATE_PATH);
  projectLink.setAttribute("target", "_self");
  projectLink.removeAttribute("rel");

  projectLink.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = PROJECT_TEMPLATE_PATH;
  });
});



// blog redirect variables
const isBlogPage = window.location.pathname.endsWith("blog.html");

const blogItems = document.querySelectorAll("[data-blog-item]");

blogItems.forEach((item) => {
  const blogLink = item.querySelector("[data-blog-link]");
  const blogImage = item.querySelector("[data-blog-img]");

  if (!blogLink) { return; }

  if (isBlogPage) {
    const targetUrl = blogLink.dataset.blogTarget || blogLink.getAttribute("href");

    if (!targetUrl) {
      blogLink.removeAttribute("href");
      blogLink.removeAttribute("target");
      blogLink.removeAttribute("rel");
      blogLink.classList.add("blog-link--disabled");
      blogLink.setAttribute("tabindex", "-1");
      blogLink.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
    } else {
      blogLink.setAttribute("href", targetUrl);
      blogLink.setAttribute("target", "_self");
      blogLink.removeAttribute("rel");
      blogLink.classList.remove("blog-link--disabled");
      blogLink.removeAttribute("tabindex");
    }

    return;
  }

  const blogExternalUrl = blogLink.dataset.externalUrl;

  if (blogExternalUrl) {
    blogLink.setAttribute("href", blogExternalUrl);
    if (isBlogPage) {
      blogLink.setAttribute("target", "_self");
      blogLink.removeAttribute("rel");
    } else {
      blogLink.setAttribute("target", blogLink.getAttribute("target") || "_blank");
      if (!blogLink.hasAttribute("rel")) {
        blogLink.setAttribute("rel", "noopener noreferrer");
      }
    }
  } else {
    blogLink.setAttribute("href", PROJECT_TEMPLATE_PATH);
    blogLink.setAttribute("target", "_self");
    blogLink.removeAttribute("rel");

    blogLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = PROJECT_TEMPLATE_PATH;
    });
  }

  if (blogImage) {
    blogImage.setAttribute("data-lightbox-disabled", "true");
    blogImage.classList.remove("media-lightbox__trigger");
    blogImage.removeAttribute("tabindex");
    blogImage.removeAttribute("role");
    blogImage.removeAttribute("aria-haspopup");
    blogImage.removeAttribute("aria-expanded");
  }

});

// learning hub redirects
const learningResourceLinks = document.querySelectorAll(".resource-card");

learningResourceLinks.forEach((link) => {
  const isBlogCard = Boolean(link.closest("[data-blog-item]"));
  const blogTarget = link.dataset.blogTarget || link.getAttribute("href");

  if (isBlogPage && isBlogCard) {
    if (!blogTarget) {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.classList.add("blog-link--disabled");
      link.setAttribute("tabindex", "-1");
      link.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
      return;
    }

    link.setAttribute("href", blogTarget);
    link.setAttribute("target", "_self");
    link.removeAttribute("rel");
    link.classList.remove("blog-link--disabled");
    link.removeAttribute("tabindex");
    return;
  }

  const externalUrl = link.dataset.externalUrl;

  if (externalUrl) {
    link.setAttribute("href", externalUrl);
    link.setAttribute("target", link.getAttribute("target") || "_blank");
    if (!link.hasAttribute("rel")) {
      link.setAttribute("rel", "noopener noreferrer");
    }
    return;
  }

  link.setAttribute("href", PROJECT_TEMPLATE_PATH);
  link.setAttribute("target", "_self");
  link.removeAttribute("rel");

  link.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = PROJECT_TEMPLATE_PATH;
  });
});

const mediaLightbox = (function ensureMediaLightbox() {
  let lightbox = document.querySelector("#mediaLightbox");

  if (!lightbox) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="media-lightbox" id="mediaLightbox" aria-hidden="true">
        <div class="media-lightbox__backdrop" data-lightbox-close></div>
        <div
          class="media-lightbox__dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged media preview"
          tabindex="-1"
        >
          <button class="media-lightbox__close" type="button" data-lightbox-close aria-label="Close preview">
            &times;
          </button>
          <div class="media-lightbox__controls" aria-hidden="false">
            <button class="media-lightbox__zoom" type="button" data-zoom="out" aria-label="Zoom out">
              &minus;
            </button>
            <span class="media-lightbox__zoom-level" aria-live="polite">100%</span>
            <button class="media-lightbox__zoom" type="button" data-zoom="in" aria-label="Zoom in">
              +
            </button>
          </div>
          <div class="media-lightbox__content">
            <img src="" alt="">
          </div>
        </div>
      </div>
    `.trim();

    lightbox = wrapper.firstElementChild;
    document.body.appendChild(lightbox);
  }

  return lightbox;
})();
const mediaLightboxImage = mediaLightbox ? mediaLightbox.querySelector(".media-lightbox__content img") : null;

if (mediaLightbox && mediaLightboxImage) {
  const mediaLightboxDialog = mediaLightbox.querySelector(".media-lightbox__dialog");
  const mediaLightboxContent = mediaLightbox.querySelector(".media-lightbox__content");
  const zoomButtons = mediaLightbox.querySelectorAll("[data-zoom]");
  const zoomLevelDisplay = mediaLightbox.querySelector(".media-lightbox__zoom-level");
  const closeTriggers = mediaLightbox.querySelectorAll("[data-lightbox-close]");

  const clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
  };

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const SCALE_STEP = 0.25;
  const SCALE_PRECISION = 100;
  const ZOOMED_CLASS = "media-lightbox--zoomed";

  let currentScale = MIN_SCALE;
  let activeTrigger = null;
  let lastFocusedElement = null;
  let isDragging = false;
  let lastPointerPosition = { x: 0, y: 0 };
  let translate = { x: 0, y: 0 };

  const applyTransform = function () {
    clampTranslate();
    mediaLightboxImage.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${currentScale})`;
  };

  const clampTranslate = function () {
    if (!mediaLightboxImage) { return; }
    if (currentScale <= MIN_SCALE) {
      translate = { x: 0, y: 0 };
      return;
    }

    const baseWidth = mediaLightboxImage.offsetWidth || 0;
    const baseHeight = mediaLightboxImage.offsetHeight || 0;

    if (!baseWidth || !baseHeight) { return; }

    const maxX = (baseWidth * (currentScale - 1)) / 2;
    const maxY = (baseHeight * (currentScale - 1)) / 2;

    translate.x = clamp(translate.x, -maxX, maxX);
    translate.y = clamp(translate.y, -maxY, maxY);
  };

  const updateZoomUi = function () {
    if (zoomLevelDisplay) {
      const percentage = Math.round(currentScale * 100);
      zoomLevelDisplay.textContent = `${percentage}%`;
    }

    mediaLightbox.classList.toggle(ZOOMED_CLASS, currentScale > MIN_SCALE + 0.01);

    zoomButtons.forEach((button) => {
      const direction = button.dataset.zoom;
      if (direction === "in") {
        button.disabled = currentScale >= MAX_SCALE - 0.001;
      } else if (direction === "out") {
        button.disabled = currentScale <= MIN_SCALE + 0.001;
      }
    });
  };

  const setScale = function (scale) {
    const nextScale = Math.round(clamp(scale, MIN_SCALE, MAX_SCALE) * SCALE_PRECISION) / SCALE_PRECISION;
    currentScale = nextScale;
    if (currentScale <= MIN_SCALE) {
      translate = { x: 0, y: 0 };
    }
    applyTransform();
    updateZoomUi();
  };

  const applyZoomChange = function (direction) {
    setScale(currentScale + direction * SCALE_STEP);
  };

  const resetZoom = function () {
    setScale(MIN_SCALE);
    translate = { x: 0, y: 0 };
    applyTransform();
  };

  const startPan = function (point) {
    if (!mediaLightboxContent || currentScale <= MIN_SCALE + 0.01) { return; }

    isDragging = true;
    lastPointerPosition = { x: point.x, y: point.y };
    mediaLightboxContent.classList.add("is-panning");
  };

  const movePan = function (point) {
    if (!isDragging || !mediaLightboxContent) { return; }

    const deltaX = point.x - lastPointerPosition.x;
    const deltaY = point.y - lastPointerPosition.y;

    translate.x += deltaX;
    translate.y += deltaY;
    applyTransform();

    lastPointerPosition = { x: point.x, y: point.y };
  };

  const endPan = function () {
    if (!isDragging) { return; }

    isDragging = false;
    if (mediaLightboxContent) {
      mediaLightboxContent.classList.remove("is-panning");
    }
  };

  function closeLightbox() {
    mediaLightbox.classList.remove("active", ZOOMED_CLASS);
    mediaLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("media-lightbox-open");

    mediaLightboxImage.style.transform = "scale(1)";
    mediaLightboxImage.removeAttribute("src");
    mediaLightboxImage.removeAttribute("srcset");
    mediaLightboxImage.removeAttribute("sizes");
    mediaLightboxImage.alt = "";

    resetZoom();

    endPan();

    if (activeTrigger) {
      activeTrigger.setAttribute("aria-expanded", "false");
    }

    const focusTarget = activeTrigger || lastFocusedElement;
    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus({ preventScroll: true });
    }

    activeTrigger = null;
    lastFocusedElement = null;

    document.removeEventListener("keydown", handleKeydown, true);
  }

  function handleKeydown(event) {
    if (!mediaLightbox.classList.contains("active")) { return; }

    const key = event.key;

    if (key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }

    if (key === "+" || (key === "=" && event.shiftKey)) {
      event.preventDefault();
      applyZoomChange(1);
    } else if (key === "-" || key === "_") {
      event.preventDefault();
      applyZoomChange(-1);
    }
  }

  const openLightbox = function (trigger) {
    if (!trigger) { return; }

    if (activeTrigger && activeTrigger !== trigger) {
      activeTrigger.setAttribute("aria-expanded", "false");
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeTrigger = trigger;

    activeTrigger.setAttribute("aria-expanded", "true");

    const source = trigger.currentSrc || trigger.src;
    const srcset = trigger.getAttribute("srcset");
    mediaLightboxImage.src = source;
    mediaLightboxImage.srcset = srcset || "";
    mediaLightboxImage.sizes = trigger.getAttribute("sizes") || "";
    mediaLightboxImage.alt = trigger.alt || "";

    resetZoom();

    mediaLightbox.classList.add("active");
    mediaLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("media-lightbox-open");

    document.addEventListener("keydown", handleKeydown, true);

    requestAnimationFrame(() => {
      if (mediaLightboxDialog) {
        mediaLightboxDialog.focus({ preventScroll: true });
      }
    });
  };

  const isEligibleForLightbox = function (img) {
    if (!(img instanceof HTMLImageElement)) { return false; }
    if (img.dataset.lightboxDisabled === "true") { return false; }
    if ("testimonialsAvatar" in img.dataset) { return false; }
    if (img.dataset.modalImg !== undefined) { return false; }
    if (img.closest("[data-testimonials-item]")) { return false; }
    if (img.closest(".contact-item")) { return false; }
    if (img.closest(".service-item")) { return false; }
    if (img.closest(".clients-item")) { return false; }
    if (img.closest(".media-placeholder--video")) { return false; }
    if (img.closest("[data-lightbox-ignore]") && img.dataset.lightboxOptIn !== "true") { return false; }
    if (img.closest("#mediaLightbox")) { return false; }

    return true;
  };

  const attachLightboxToImage = function (img) {
    if (!isEligibleForLightbox(img)) { return; }
    if (img.dataset.lightboxBound === "true") { return; }

    img.dataset.lightboxBound = "true";
    img.dataset.lightboxTrigger = "true";
    img.classList.add("media-lightbox__trigger");
    img.setAttribute("tabindex", img.getAttribute("tabindex") || "0");
    img.setAttribute("role", img.getAttribute("role") || "button");
    img.setAttribute("aria-haspopup", "dialog");
    img.setAttribute("aria-expanded", "false");

    img.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openLightbox(img);
    });

    img.addEventListener("keydown", function (event) {
      const key = event.key;
      if (key === "Enter" || key === " ") {
        event.preventDefault();
        openLightbox(img);
      }
    });
  };

  const attachLightboxToImages = function (root = document) {
    const images = root instanceof Element || root instanceof DocumentFragment
      ? root.querySelectorAll("img")
      : document.querySelectorAll("img");

    images.forEach(attachLightboxToImage);
  };

  zoomButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const direction = this.dataset.zoom === "in" ? 1 : -1;
      applyZoomChange(direction);
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeLightbox);
  });

  mediaLightbox.addEventListener("click", function (event) {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.lightboxClose !== undefined) {
      closeLightbox();
    }
  });

  mediaLightboxImage.addEventListener("mousedown", function (event) {
    if (currentScale <= MIN_SCALE + 0.01) { return; }
    event.preventDefault();
    startPan({ x: event.clientX, y: event.clientY });
  });

  window.addEventListener("mousemove", function (event) {
    if (!isDragging) { return; }
    event.preventDefault();
    movePan({ x: event.clientX, y: event.clientY });
  });

  window.addEventListener("mouseup", function () {
    if (!isDragging) { return; }
    endPan();
  });

  mediaLightboxImage.addEventListener("touchstart", function (event) {
    if (currentScale <= MIN_SCALE + 0.01) { return; }
    if (event.touches.length !== 1) { return; }
    const touch = event.touches[0];
    event.preventDefault();
    startPan({ x: touch.clientX, y: touch.clientY });
  }, { passive: false });

  window.addEventListener("touchmove", function (event) {
    if (!isDragging || event.touches.length !== 1) { return; }
    const touch = event.touches[0];
    event.preventDefault();
    movePan({ x: touch.clientX, y: touch.clientY });
  }, { passive: false });

  window.addEventListener("touchend", function () {
    if (!isDragging) { return; }
    endPan();
  });

  window.addEventListener("touchcancel", function () {
    if (!isDragging) { return; }
    endPan();
  });

  attachLightboxToImages();

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          attachLightboxToImage(node);
        } else if (node instanceof HTMLElement) {
          attachLightboxToImages(node);
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  setScale(MIN_SCALE);
}


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    const selectedValue = this.innerText.trim().toLowerCase();
    if (selectValue) {
    selectValue.innerText = this.innerText;
    }

    if (select) {
    elementToggleFunc(select);
    }

    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const normalizeFilterValue = function (value) {
  return (value || "").trim().toLowerCase();
};

const filterFunc = function (selectedValue) {
  const normalizedValue = normalizeFilterValue(selectedValue) || "all";
  let hasActiveItem = false;

  for (let i = 0; i < filterItems.length; i++) {
    const item = filterItems[i];
    const itemCategory = normalizeFilterValue(item.dataset.category);

    if (normalizedValue === "all" || normalizedValue === itemCategory) {
      item.classList.add("active");
      hasActiveItem = true;
    } else {
      item.classList.remove("active");
    }
  }

  return hasActiveItem;
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    const selectedValue = normalizeFilterValue(this.innerText);
    if (selectValue) {
    selectValue.innerText = this.innerText;
    }
    filterFunc(selectedValue);

    if (lastClickedBtn && lastClickedBtn !== this) {
      lastClickedBtn.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBtn = this;

  });

}


const learningSelect = document.querySelector("[data-learning-select]");
const learningSelectValue = document.querySelector("[data-learning-select-value]");
const learningFilterBtns = document.querySelectorAll("[data-learning-filter-btn]");
const learningFilterItems = document.querySelectorAll("[data-learning-filter-item]");

if (learningSelect) {
  learningSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

const learningFilterFunc = function (selectedValue) {
  const normalizedValue = (selectedValue || "all").trim().toLowerCase();

  learningFilterItems.forEach((item) => {
    const itemCategory = (item.dataset.learningCategory || "").trim().toLowerCase();

    if (normalizedValue === "all" || normalizedValue === itemCategory) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

if (learningFilterBtns.length > 0) {
  learningFilterBtns.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedValue = this.innerText.trim().toLowerCase();

      learningFilterBtns.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      if (learningSelectValue) {
        learningSelectValue.innerText = this.innerText.trim();
      }

      learningFilterFunc(selectedValue);

      if (learningSelect) {
        learningSelect.classList.remove("active");
      }
    });
  });

  learningFilterFunc("all");
}


const activatePortfolioFilter = function (categoryName) {
  if (!categoryName) { return; }

  const normalizedCategory = normalizeFilterValue(categoryName);

  for (let i = 0; i < filterBtn.length; i++) {
    const button = filterBtn[i];
    if (normalizeFilterValue(button.innerText) === normalizedCategory) {
      button.click();
      return;
    }
  }

  const hasResults = filterFunc(normalizedCategory);

  if (!hasResults) {
    return;
  }

  if (selectValue) {
    const words = normalizedCategory.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    selectValue.innerText = words.join(" ");
  }

  if (select) {
    select.classList.remove("active");
  }
};

const PORTFOLIO_FILTER_PARAM = "category";
const PORTFOLIO_FILTER_STORAGE_KEY = "pending-portfolio-filter";

const getStoredPortfolioFilter = function () {
  try {
    const value = sessionStorage.getItem(PORTFOLIO_FILTER_STORAGE_KEY);
    if (!value) { return null; }
    sessionStorage.removeItem(PORTFOLIO_FILTER_STORAGE_KEY);
    return value;
  } catch (error) {
    console.warn("Unable to access sessionStorage for portfolio filter.", error);
    return null;
  }
};

const setStoredPortfolioFilter = function (filterName) {
  try {
    sessionStorage.setItem(PORTFOLIO_FILTER_STORAGE_KEY, normalizeFilterValue(filterName));
  } catch (error) {
    console.warn("Unable to store portfolio filter in sessionStorage.", error);
  }
};

const applyPortfolioFilterFromQuery = function () {
  if (filterBtn.length === 0) { return; }

  let filterFromQuery = null;

  if (typeof URLSearchParams !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    filterFromQuery = searchParams.get(PORTFOLIO_FILTER_PARAM);
  }

  const normalizedQueryFilter = normalizeFilterValue(filterFromQuery);
  if (normalizedQueryFilter) {
    activatePortfolioFilter(normalizedQueryFilter);
    return;
  }

  const storedFilter = getStoredPortfolioFilter();
  if (storedFilter) {
    activatePortfolioFilter(storedFilter);
  }
};

applyPortfolioFilterFromQuery();

window.addEventListener("DOMContentLoaded", applyPortfolioFilterFromQuery);
window.addEventListener("load", applyPortfolioFilterFromQuery);
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    applyPortfolioFilterFromQuery();
  }
});

const serviceItems = document.querySelectorAll("[data-service-item]");


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formAlert = document.querySelector("[data-form-alert]");
const formAlertTitle = document.querySelector("[data-form-alert-title]");
const formAlertMessage = document.querySelector("[data-form-alert-message]");
const formAlertCloseBtn = document.querySelector("[data-form-alert-close]");

const toggleFormButton = function (isEnabled) {
  if (!formBtn) { return; }
  if (isEnabled) {
    formBtn.removeAttribute("disabled");
  } else {
    formBtn.setAttribute("disabled", "");
  }
}

const showFormAlert = function (title, message, isError = false) {
  if (!formAlert || !formAlertTitle || !formAlertMessage) { return; }
  formAlertTitle.textContent = title;
  formAlertMessage.textContent = message;
  formAlert.classList.toggle("form-alert-error", isError);
  formAlert.removeAttribute("hidden");
}

const hideFormAlert = function () {
  if (!formAlert) { return; }
  formAlert.setAttribute("hidden", "");
  formAlert.classList.remove("form-alert-error");
}

if (formAlertCloseBtn) {
  formAlertCloseBtn.addEventListener("click", hideFormAlert);
}

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (!form) { return; }
    if (form.checkValidity()) {
      toggleFormButton(true);
    } else {
      toggleFormButton(false);
    }
  });
}

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!form.checkValidity()) { return; }

    toggleFormButton(false);
    hideFormAlert();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method || "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (response.ok) {
        form.reset();
        toggleFormButton(false);
        showFormAlert("Thank you!", "Your response has been submitted.");
      } else {
        const data = await response.json().catch(() => null);
        const errorMessage = data && data.error ? data.error : "Something went wrong. Please try again later.";
        toggleFormButton(true);
        showFormAlert("Oops!", errorMessage, true);
      }
    } catch (error) {
      toggleFormButton(true);
      showFormAlert("Oops!", "We couldn't send your message. Please try again later.", true);
    }
  });
}



const mediaLayoutButtons = document.querySelectorAll("[data-media-layout]");
const mediaGallery = document.querySelector("[data-media-gallery]");

if (mediaLayoutButtons.length > 0 && mediaGallery) {
  mediaLayoutButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetLayout = this.dataset.mediaLayout;
      if (!targetLayout) { return; }

      mediaGallery.classList.remove("masonry", "two-column");
      mediaGallery.classList.add(targetLayout);

      mediaLayoutButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn === button);
      });
    });
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

const ACTIVE_PAGE_KEY = "active-page";
const SCROLL_POSITION_KEY = "page-scroll-position";

const normalizePageName = function (value) {
  return (typeof value === "string" ? value : "")
    .trim()
    .toLowerCase();
};

const getNavTarget = function (link) {
  if (!(link instanceof HTMLElement)) { return ""; }
  const explicitTarget = normalizePageName(link.dataset.navTarget);
  if (explicitTarget) { return explicitTarget; }
  return normalizePageName(link.textContent);
};

const sessionStorageController = (function createSessionStorageController() {
  try {
    const testKey = "__page_state__";
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);

    return {
      get(key) {
        try {
          return sessionStorage.getItem(key);
        } catch (error) {
          console.warn("Unable to read from sessionStorage.", error);
          return null;
        }
      },
      set(key, value) {
        try {
          sessionStorage.setItem(key, value);
        } catch (error) {
          console.warn("Unable to write to sessionStorage.", error);
        }
      }
    };
  } catch (error) {
    console.warn("Session storage is not available. Page state will not persist.", error);
    return {
      get() { return null; },
      set() {}
    };
  }
})();

const activatePage = function (pageName, options = {}) {
  const { scrollToTop = true } = options;
  const normalizedPageName = normalizePageName(pageName);
  if (!normalizedPageName) { return; }

  for (let i = 0; i < pages.length; i++) {
    const pageIdentifier = normalizePageName(pages[i].dataset.page);
    const shouldActivate = pageIdentifier === normalizedPageName;
    pages[i].classList.toggle("active", shouldActivate);
  }

  for (let i = 0; i < navigationLinks.length; i++) {
    const navTarget = getNavTarget(navigationLinks[i]);
    const shouldActivate = navTarget === normalizedPageName;
    navigationLinks[i].classList.toggle("active", shouldActivate);
  }

  sessionStorageController.set(ACTIVE_PAGE_KEY, normalizedPageName);

  if (scrollToTop) {
    window.scrollTo(0, 0);
  }
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  const currentLink = navigationLinks[i];
  const targetPage = getNavTarget(currentLink);

  if (!targetPage) { continue; }

  currentLink.addEventListener("click", function () {
    activatePage(targetPage);
  });
}


const restoreScrollPosition = function () {
  const storedValue = sessionStorageController.get(SCROLL_POSITION_KEY);
  if (!storedValue) { return; }

  const y = parseInt(storedValue, 10);
  if (Number.isNaN(y)) { return; }

  window.scrollTo({ top: y, left: 0, behavior: "auto" });
};

window.addEventListener("beforeunload", function () {
  sessionStorageController.set(SCROLL_POSITION_KEY, String(window.scrollY || window.pageYOffset));
});

const restoreActivePage = function () {
  const storedPage = sessionStorageController.get(ACTIVE_PAGE_KEY);
  const normalizedStoredPage = normalizePageName(storedPage);

  if (normalizedStoredPage) {
    activatePage(normalizedStoredPage, { scrollToTop: false });
  }
};

window.addEventListener("load", function () {
  restoreActivePage();
  restoreScrollPosition();
});

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    restoreActivePage();
    restoreScrollPosition();
  }
});

const singlePageNavbar = document.querySelector(".single-page-navbar");
const singlePageSidebar = document.querySelector(".single-page-sidebar");

if (singlePageNavbar && singlePageSidebar) {
  const handleNavbarScroll = function (event) {
    const delta = event.deltaY || event.deltaX;

    if (!delta) { return; }
    if (singlePageSidebar.scrollHeight <= singlePageSidebar.clientHeight) { return; }

    event.preventDefault();
    singlePageSidebar.scrollTop += delta;
  };

  singlePageNavbar.addEventListener("wheel", handleNavbarScroll, { passive: false });
}

const sectionNavLinks = document.querySelectorAll("[data-section-link]");

if (sectionNavLinks.length > 0) {
  const sectionEntries = [];
  let activeLink = null;
  let pendingTargetEntry = null;
  let scrollRafId = null;
  let resizeRafId = null;

  const getScrollMarginTop = function (element) {
    if (!element || typeof window === "undefined") { return 0; }
    const computed = window.getComputedStyle(element);
    const value = computed ? parseFloat(computed.scrollMarginTop || "0") : 0;
    return Number.isFinite(value) ? value : 0;
  };

  const setActiveSectionLink = function (nextLink) {
    if (!nextLink || nextLink === activeLink) { return; }
    activeLink = nextLink;
    sectionNavLinks.forEach((link) => {
      link.classList.toggle("active", link === nextLink);
    });
  };

  const computeSectionOffsets = function () {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    sectionEntries.forEach((entry) => {
      const rect = entry.target.getBoundingClientRect();
      entry.offset = rect.top + scrollY - entry.marginTop;
    });
    sectionEntries.sort((a, b) => a.offset - b.offset);
  };

  const syncActiveLink = function () {
    if (sectionEntries.length === 0) { return; }

    if (pendingTargetEntry) {
      const currentScroll = window.scrollY || window.pageYOffset || 0;
      const distance = Math.abs(currentScroll - pendingTargetEntry.offset);
      if (distance > 4) {
        return;
      }
      pendingTargetEntry = null;
    }

    const scrollPosition = (window.scrollY || window.pageYOffset || 0) + 12;
    let currentEntry = sectionEntries[0];

    for (let i = 0; i < sectionEntries.length; i++) {
      const entry = sectionEntries[i];
      if (scrollPosition >= entry.offset - 4) {
        currentEntry = entry;
      } else {
        break;
      }
    }

    if (currentEntry && currentEntry.link) {
      setActiveSectionLink(currentEntry.link);
    }
  };

  const requestSync = function () {
    if (scrollRafId !== null) { return; }
    scrollRafId = window.requestAnimationFrame(function () {
      scrollRafId = null;
      syncActiveLink();
    });
  };

  const requestRecompute = function () {
    if (resizeRafId !== null) { return; }
    resizeRafId = window.requestAnimationFrame(function () {
      resizeRafId = null;
      computeSectionOffsets();
      syncActiveLink();
    });
  };

  sectionNavLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) { return; }

    const target = document.querySelector(href);
    if (!target) { return; }

    const marginTop = getScrollMarginTop(target);
    const entry = { target, link, marginTop, offset: 0 };
    sectionEntries.push(entry);

    link.addEventListener("click", function (event) {
      event.preventDefault();

      setActiveSectionLink(link);
      pendingTargetEntry = entry;

      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (typeof history !== "undefined" && typeof history.replaceState === "function") {
        history.replaceState(null, "", href);
      }

      window.requestAnimationFrame(() => {
        computeSectionOffsets();
        requestSync();
      });
    });
  });

  if (sectionEntries.length > 0) {
    const initialHash = window.location.hash;
    computeSectionOffsets();

    if (initialHash) {
      const initialTarget = document.querySelector(initialHash);
      const initialEntry = sectionEntries.find((entry) => entry.target === initialTarget);
      if (initialEntry) {
        setActiveSectionLink(initialEntry.link);
      } else if (sectionEntries[0]) {
        setActiveSectionLink(sectionEntries[0].link);
      }
    } else if (sectionEntries[0]) {
      setActiveSectionLink(sectionEntries[0].link);
    }

    syncActiveLink();

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestRecompute);
    window.addEventListener("orientationchange", requestRecompute);
    window.addEventListener("load", requestRecompute);
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        requestRecompute();
      }
    });
  }
}