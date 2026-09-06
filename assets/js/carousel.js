/**
 * Renders the carousel view for practicing a deck's cards, one at a time,
 * with flip-to-reveal and left/right navigation.
 * @param {Array<Object>} cards - The array of card objects to display.
 * @param {string} deckName - The name of the deck, shown in the title.
 * @returns {void}
 */
function renderCarouselView(cards, deckName) {
  let currentIndex = 0;
  let isFlipped = false;

  const carouselEl = document.querySelector(".carousel");
  const titleEl = carouselEl.querySelector(".carousel__title");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const carouselImageEl = carouselEl.querySelector(".carousel__card-text");
  const carouselCardEl = carouselEl.querySelector(".carousel__card");

  /**
   * Visually disables a carousel navigation button.
   * @param {HTMLElement} buttonEl - The button element to disable.
   * @returns {void}
   */
  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }

  /**
   * Visually enables a carousel navigation button.
   * @param {HTMLElement} buttonEl - The button element to enable.
   * @returns {void}
   */
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  /**
   * Enables or disables the left/right navigation buttons based on whether
   * the current card is the first or last in the deck.
   * @returns {void}
   */
  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  /**
   * Updates the carousel's title, card text, and flip state to reflect
   * the card at the current index.
   * @returns {void}
   */
  function updateDisplay() {
    const card = cards[currentIndex];
    titleEl.textContent = `${deckName} · ${currentIndex + 1}/${cards.length}`;
    carouselImageEl.textContent = card.question;
    isFlipped = false;
    carouselCardEl.classList.remove("carousel__card_color_white");
    updateArrows();
  }

  rightBtn.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateDisplay();
    }
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateDisplay();
    }
  });

  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");

  /**
   * Toggles between showing the current card's question and its answer.
   * @returns {void}
   */
  function toggleFlip() {
    const card = cards[currentIndex];
    isFlipped = !isFlipped;
    carouselImageEl.textContent = isFlipped ? card.answer : card.question;
    carouselCardEl.classList.toggle("carousel__card_color_white", isFlipped);
  }

  carouselImageEl.addEventListener("click", toggleFlip);
  flipBtn.addEventListener("click", toggleFlip);

  updateDisplay();
}

export { renderCarouselView };