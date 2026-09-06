import { getDeckByID } from "./decks.js";
import { deleteCard, addCard, updateCard } from "./api.js";
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
 * @returns {void}
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
  const newPracticeBtn = practiceBtn.cloneNode(true);
  practiceBtn.parentNode.replaceChild(newPracticeBtn, practiceBtn);
  newPracticeBtn.addEventListener("click", () => {
    window.location.hash = `#carousel/${deck._id}`;
  });

  const cardTemplateEl = document.querySelector("#card-template");
  const cardFormTemplateEl = document.querySelector("#card-form-template");
  const cardContainerEl = deckViewSection.querySelector(".gallery__list");
  cardContainerEl.innerHTML = "";
  currentFlippedCards.clear();

  /**
   * Creates a card element for displaying an existing card's question/answer,
   * with flip, edit, and delete controls.
   * @param {Object} card - The card data to render.
   * @returns {DocumentFragment} The populated card element.
   */
  function createCardEl(card) {
    const cloneEl = cardTemplateEl.content.cloneNode(true);

    const cardElement = cloneEl.querySelector(".card");
    cardElement.style.backgroundColor = deck.color;

    const cardTitle = cloneEl.querySelector(".card__title");
    cardTitle.textContent = card.question;
    cardTitle.dataset.cardId = card._id;

    const flipBtn = cloneEl.querySelector(".card__flip-btn");
    flipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isFlipped = currentFlippedCards.has(card._id);
      if (isFlipped) {
        currentFlippedCards.delete(card._id);
        cardTitle.textContent = card.question;
        cardElement.classList.remove("card_flipped");
      } else {
        currentFlippedCards.add(card._id);
        cardTitle.textContent = card.answer;
        cardElement.classList.add("card_flipped");
      }
    });

    const deleteBtn = cloneEl.querySelector(".card__delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCard(card._id).then(() => {
        const index = deck.cards.findIndex((c) => c._id === card._id);
        deck.cards.splice(index, 1);
        cardElement.remove();
      });
    });

    const editBtn = cloneEl.querySelector(".card__edit-btn");
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const formEl = createCardFormEl(card);
      cardElement.replaceWith(formEl);
    });

    return cloneEl;
  }

  /**
   * Creates a form element for adding a new card or editing an existing one.
   * @param {Object} [existingCard] - The card being edited, if any. Omit to create a new card.
   * @returns {DocumentFragment} The populated form element.
   */
  function createCardFormEl(existingCard) {
    const cloneEl = cardFormTemplateEl.content.cloneNode(true);

    const formElement = cloneEl.querySelector(".card__form");
    formElement.style.backgroundColor = deck.color;

    const formEl = cloneEl.querySelector(".card__inner-form");
    const questionInput = cloneEl.querySelector(".card__question-input");
    const answerInput = cloneEl.querySelector(".card__answer-input");
    const flipBtn = cloneEl.querySelector(".card__flip-btn");

    if (existingCard) {
      questionInput.value = existingCard.question;
      answerInput.value = existingCard.answer;
    }

    let showingAnswer = false;
    flipBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showingAnswer = !showingAnswer;
      questionInput.classList.toggle("card__question-input_hidden", showingAnswer);
      answerInput.classList.toggle("card__answer-input_hidden", !showingAnswer);
    });

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const question = questionInput.value.trim();
      const answer = answerInput.value.trim();
      if (!question || !answer) return;

      if (existingCard) {
        updateCard(existingCard._id, { question, answer }).then((updatedCard) => {
          existingCard.question = updatedCard.question;
          existingCard.answer = updatedCard.answer;
          const newCardEl = createCardEl(existingCard);
          formElement.replaceWith(newCardEl);
        });
      } else {
        addCard(deck._id, { question, answer }).then((newCard) => {
          deck.cards.push(newCard);
          const newCardEl = createCardEl(newCard);
          formElement.replaceWith(newCardEl);
        });
      }
    });

    return cloneEl;
  }

  function renderCardEl(card) {
    const cardEl = createCardEl(card);
    cardContainerEl.appendChild(cardEl);
  }

  deck.cards.forEach(renderCardEl);

  const newCardBtn = deckViewSection.querySelector(
    ".gallery__new-card-btn_location_deck-view",
  );
  const newCardBtnClone = newCardBtn.cloneNode(true);
  newCardBtn.parentNode.replaceChild(newCardBtnClone, newCardBtn);
  newCardBtnClone.addEventListener("click", () => {
    const formEl = createCardFormEl();
    cardContainerEl.appendChild(formEl);
  });
}

/**
 * Returns the deck currently being viewed.
 * @returns {Object|null} The current deck object, or null if none is set.
 */
export function getCurrentDeck() {
  return currentDeck;
}
