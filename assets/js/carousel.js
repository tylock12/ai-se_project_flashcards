function renderCarouselView(cards, deckName) {
  let currentIndex = 0;
  let isFlipped = false;

  const carouselEl = document.querySelector(".carousel");
  const titleEl = carouselEl.querySelector(".carousel__title");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const carouselImageEl = carouselEl.querySelector(".carousel__image");

  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

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

  function updateDisplay() {
    const card = cards[currentIndex];
    titleEl.textContent = `${deckName} · ${currentIndex + 1}/${cards.length}`;
    carouselImageEl.textContent = card.question;
    carouselImageEl.style.display = "flex";
    carouselImageEl.style.alignItems = "center";
    carouselImageEl.style.justifyContent = "center";
    carouselImageEl.style.fontSize = "24px";
    carouselImageEl.style.textAlign = "center";
    carouselImageEl.style.padding = "20px";
    isFlipped = false;
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

  carouselImageEl.addEventListener("click", () => {
    const card = cards[currentIndex];
    if (isFlipped) {
      carouselImageEl.textContent = card.question;
      isFlipped = false;
    } else {
      carouselImageEl.textContent = card.answer;
      isFlipped = true;
    }
  });

  updateDisplay();
}

export { renderCarouselView };
