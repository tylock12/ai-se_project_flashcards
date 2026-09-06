import { addDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.querySelector("#new-deck-form");
const submitBtn = document.querySelector(".new-deck-view__submit-btn");
const textareaEl = document.querySelector(".new-deck-view__textarea");

const errorModal = document.querySelector("#deck-error-modal");
const errorCloseBtn = errorModal.querySelector(".modal__close");
const errorMessageEl = errorModal.querySelector(".modal__message");

/**
 * Disables the new-deck form's submit button.
 * @returns {void}
 */
function disableSubmitBtn() {
  submitBtn.disabled = true;
}

/**
 * Enables the new-deck form's submit button.
 * @returns {void}
 */
function enableSubmitBtn() {
  submitBtn.disabled = false;
}

/**
 * Makes a modal visible.
 * @param {HTMLElement} modal - The modal element to show.
 * @returns {void}
 */
function openModal(modal) {
  modal.classList.add("modal_visible");
}

/**
 * Hides a modal.
 * @param {HTMLElement} modal - The modal element to hide.
 * @returns {void}
 */
function closeModal(modal) {
  modal.classList.remove("modal_visible");
}

errorCloseBtn.addEventListener("click", function () {
  closeModal(errorModal);
});

/**
 * Displays an error message in the deck-error modal and re-enables the submit button.
 * @param {string} message - The error message to display.
 * @returns {void}
 */
function showError(message) {
  errorMessageEl.textContent = message;
  openModal(errorModal);
  enableSubmitBtn();
}

/**
 * Validates that a deck name is a string within the allowed length range.
 * @param {string} name - The proposed deck name.
 * @returns {string|null} The valid name, or null if invalid.
 */
function validateName(name) {
  if (typeof name !== 'string' || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

/**
 * Safely parses a JSON string.
 * @param {string} jsonString - The raw JSON text to parse.
 * @returns {Object|null} The parsed object, or null if parsing failed.
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Normalizes a color value to a lowercase 6-digit hex string, falling back
 * to a default color if the input is missing or invalid.
 * @param {string} color - The raw color value to normalize.
 * @returns {string} A valid lowercase hex color string, e.g. "#64d583".
 */
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