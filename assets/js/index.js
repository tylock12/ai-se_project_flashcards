import { decks, getDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

export const homeSection = document.querySelector("#home");
export const deckViewSection = document.querySelector("#deck-view");
export const carouselSection = document.querySelector("#carousel");
export const notFoundSection = document.querySelector("#not-found");
export const allSections = [homeSection, deckViewSection, carouselSection, notFoundSection];

export function showView(currentSection, display) {
  allSections.forEach((section) => {
    section.style.display = "none";
  });

  currentSection.style.display = display;
}
/**
 * Renders the home view showing all available decks.
 */
function renderHomeView() {
  showView(homeSection, "block");

  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = homeSection.querySelector(".gallery__list");
  deckContainerEl.innerHTML = "";

  function createDeckEl(deck) {
    const cloneEl = deckTemplateEl.content.cloneNode(true);

    const deckElement = cloneEl.querySelector(".card");
    deckElement.style.backgroundColor = deck.color;

    const deckLink = cloneEl.querySelector(".card__link");
    deckLink.href = `#deck/${deck.id}`;

    cloneEl.querySelector(".card__title").textContent = deck.name;
    cloneEl.querySelector(".card__count").textContent = `${deck.cards.length} cards`;

    const deleteButton = cloneEl.querySelector(".card__delete-btn");
    deleteButton.addEventListener("click", () => {
      // Delete functionality can be implemented later
      console.log("Delete deck:", deck.id);
    });

    return cloneEl;
  }

  function renderDeckEl(deck) {
    const deckEl = createDeckEl(deck);
    deckContainerEl.appendChild(deckEl);
  }

  decks.forEach(renderDeckEl);
}

function renderNotFoundView() {
 showView(notFoundSection, "flex");
}

/**
 * Main router function that handles hash changes.
 * Reads the current hash and renders the appropriate view.
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  const isCarousel = hash.startsWith("carousel/");
  const isNotFound = !(hash === "home" || hash === "" || hash.startsWith("deck/") || hash.startsWith("carousel/"));

  document.body.classList.toggle("page_mobile-no-bar", isCarousel || isNotFound);
  document.body.classList.toggle("page_location_carousel", isCarousel);

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("deck/")) {
    const deckId = hash.split("/")[1];
    renderDeckView(deckId, renderNotFoundView);
  } else if (hash.startsWith("carousel/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);
    if (deck) {
      showView(carouselSection, "block");
      renderCarouselView(deck.cards, deck.name);
    } else {
      renderNotFoundView();
    }
  } else {
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
