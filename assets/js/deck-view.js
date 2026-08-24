import { getDeckByID } from "./decks.js";
import {
  showView,
  homeSection,
  deckViewSection,
  carouselSection,
  notFoundSection,
} from "./index.js";

let currentFlippedCards = new Set();
let currentDeck = null;

/**
 * Renders the view for a specific deck showing all its cards.
 *
 * @param {string} deckId - The ID of the deck to render
 * @param {Function} onNotFound - Callback when deck is not found
 */
export function renderDeckView(deckId, onNotFound) {
  const deck = getDeckByID(deckId);
  currentDeck = deck;

  if (!deck) {
    onNotFound();
    return;
  }

  showView(deckViewSection);

  const deckViewTitle = deckViewSection.querySelector(".gallery__title");
  deckViewTitle.textContent = deck.name;

  const practiceBtn = deckViewSection.querySelector(".gallery__practice-btn");
  // Remove old event listeners by cloning
  const newPracticeBtn = practiceBtn.cloneNode(true);
  practiceBtn.parentNode.replaceChild(newPracticeBtn, practiceBtn);
  newPracticeBtn.addEventListener("click", () => {
    window.location.hash = `#carousel/${deck.id}`;
  });

  const cardTemplateEl = document.querySelector("#card-template");
  const cardContainerEl = deckViewSection.querySelector(".gallery__list");
  cardContainerEl.innerHTML = "";
  currentFlippedCards.clear();

  function createCardEl(card) {
    const cloneEl = cardTemplateEl.content.cloneNode(true);

    const cardElement = cloneEl.querySelector(".card");
    cardElement.style.backgroundColor = deck.color;

    const cardTitle = cloneEl.querySelector(".card__title");
    cardTitle.textContent = card.question;
    cardTitle.dataset.cardId = card.id;

    const flipBtn = cloneEl.querySelector(".card__flip-btn");
    flipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isFlipped = currentFlippedCards.has(card.id);
      if (isFlipped) {
        currentFlippedCards.delete(card.id);
        cardTitle.textContent = card.question;
        cardElement.classList.remove("card_flipped");
      } else {
        currentFlippedCards.add(card.id);
        cardTitle.textContent = card.answer;
        cardElement.classList.add("card_flipped");
      }
    });

    const deleteBtn = cloneEl.querySelector(".card__delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cardElement.remove();
    });

    return cloneEl;
  }

  function renderCardEl(card) {
    const cardEl = createCardEl(card);
    cardContainerEl.appendChild(cardEl);
  }

  deck.cards.forEach(renderCardEl);
}

export function getCurrentDeck() {
  return currentDeck;
}
