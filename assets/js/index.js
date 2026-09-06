import { decks, getDeckByID, deleteDeckByID, fetchedDecks } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { getDecks } from "./api.js";
import { showError } from "./new-deck-view.js";
import { deleteDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";

export const homeSection = document.querySelector("#home");
export const deckViewSection = document.querySelector("#deck-view");
export const newDeckViewSection = document.querySelector("#new-deck-view");
export const carouselSection = document.querySelector("#carousel");
export const notFoundSection = document.querySelector("#not-found");
export const allSections = [homeSection, deckViewSection, newDeckViewSection, carouselSection, notFoundSection];

export function showView(currentSection) {
  allSections.forEach((section) => {
    const baseClass = section.classList[0];
    section.classList.add(`${baseClass}_hidden`);
  });

  const currentBaseClass = currentSection.classList[0];
  currentSection.classList.remove(`${currentBaseClass}_hidden`);
}
/**
 * Renders the home view showing all available decks.
 */
function renderHomeView(deck) {
  showView(homeSection);

  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = homeSection.querySelector(".gallery__list");
  
  const existingCards = deckContainerEl.querySelectorAll(".card");
  existingCards.forEach((card) => {
    card.remove();
  });

  function createDeckEl(deck) {
    const cloneEl = deckTemplateEl.content.cloneNode(true);

    const deckElement = cloneEl.querySelector(".card");
    deckElement.style.backgroundColor = deck.color;

    const deckLink = cloneEl.querySelector(".card__link");
    deckLink.href = `#deck/${deck._id}`;

    cloneEl.querySelector(".card__title").textContent = deck.name;
    cloneEl.querySelector(".card__count").textContent = `${deck.cards.length} cards`;

  const deleteButton = cloneEl.querySelector(".card__delete-btn");
    deleteButton.addEventListener("click", () => {
      deleteDeck(deck._id)
        .then(() => {
          const index = fetchedDecks.findIndex((d) => d._id === deck._id);
          fetchedDecks.splice(index, 1);
          renderHomeView(fetchedDecks);
        });
  });

    return cloneEl;
  }

  function renderDeckEl(deck) {
    const deckEl = createDeckEl(deck);
    deckContainerEl.appendChild(deckEl);
  }

  deck.forEach(renderDeckEl);
}

function renderNotFoundView() {
 showView(notFoundSection);
}

/**
 * Main router function that handles hash changes.
 * Reads the current hash and renders the appropriate view.
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  const isCarousel = hash.startsWith("carousel/");
  const isNotFound = !(hash === "home" || hash === "" || hash === "new-deck" || hash.startsWith("deck/") || hash.startsWith("carousel/"));

  document.body.classList.toggle("page_mobile-no-bar", isCarousel || isNotFound);
  document.body.classList.toggle("page_location_carousel", isCarousel);

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash === "new-deck") {
    disableSubmitBtn()
    showView(newDeckViewSection)
  } else if (hash.startsWith("deck/")) {
    const deckId = hash.split("/")[1];
    renderDeckView(deckId, renderNotFoundView);
  } else if (hash.startsWith("carousel/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);
    if (deck) {
      showView(carouselSection);
      renderCarouselView(deck.cards, deck.name);
    } else {
      renderNotFoundView();
    }
  } else {
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      renderHomeView(fetchedDecks);
    })
    .catch(showError)
    .finally(() => {
      router();
    });
});
window.addEventListener("hashchange", router);

const newDeckBtn = document.querySelector("#home .gallery__new-card-btn");
newDeckBtn.addEventListener("click", () => {
  window.location.hash = "new-deck";
});