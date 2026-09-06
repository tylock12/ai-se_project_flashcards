import { addDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.querySelector("#new-deck-form");
const submitBtn = document.querySelector(".new-deck-view__submit-btn");
const textareaEl = document.querySelector(".new-deck-view__textarea");

const errorModal = document.querySelector("#deck-error-modal");
const errorCloseBtn = errorModal.querySelector(".modal__close");
const errorMessageEl = errorModal.querySelector(".modal__message");

function disableSubmitBtn() {
  submitBtn.disabled = true;
}

function enableSubmitBtn() {
  submitBtn.disabled = false;
}

function openModal(modal) {
  modal.classList.add("modal_visible");
}

function closeModal(modal) {
  modal.classList.remove("modal_visible");
}

errorCloseBtn.addEventListener("click", function () {
  closeModal(errorModal);
});

function showError(message) {
  errorMessageEl.textContent = message;
  openModal(errorModal);
  enableSubmitBtn(); // Centralized button re-enabler! No more repetition below.
}

function validateName(name) {
  if (typeof name !== 'string' || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}


formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  disableSubmitBtn();

  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const colorValue = values.color;

  const jsonData = parseJSON(textareaEl.value);
  if (jsonData === null) {
    showError("Invalid JSON syntax. Please check your format.");
    return;
  }

  if (typeof jsonData !== 'object' || jsonData === null) {
    showError("JSON must be a valid object containing data fields.");
    return;
  }

  const validatedName = validateName(jsonData.name);
  if (validatedName === null) {
    showError("The 'name' field must be a text string between 2 and 80 characters.");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("The 'cards' field must be an array.");
    return;
  }

  if (typeof jsonData.color === 'string') {
    if (jsonData.color.toLowerCase() !== colorValue.toLowerCase()) {
      showError("The color field in the JSON conflicts with your selected color picker value.");
      return;
    }
  }

  const targetColor = jsonData.color || colorValue;
  for (const card of jsonData.cards) {
    if (typeof card !== 'object' || card === null) {
      showError("Invalid card structure found inside the cards list.");
      return;
    }

    if (card.color && String(card.color).toLowerCase() !== targetColor.toLowerCase()) {
      showError(`Color mismatch! Card '${card.name || 'Unknown'}' color does not match the deck color.`);
      return;
    }
  }

  const color = normalizeColor(values.color);
  addDeck({
    name: jsonData.name,
    cards: jsonData.cards,
    color: jsonData.color,
  }).then((newDeck) => {
    fetchedDecks.push(newDeck);
    window.location.hash = "deck/" + newDeck._id;
  });
});

export { disableSubmitBtn };