import { decks } from "./decks.js";
import { hexToString,removeColorClasses } from "./colors.js"

function renderCarouselView(deck) {
  
    let currentIndex = 0;
    let showingQuestion = true;

    const color = hexToString(deck.color);
    const carousel = document.querySelector(".carousel");
    carousel.style.display = "flex";

    const carouselTitle = document.querySelector(".carousel__title");
    const carouselCard = document.querySelector(".carousel__card");
    const carouselCardText = document.querySelector(".carousel__card-text");
    const leftButton = document.querySelector(".carousel__btn_type_left");
    const rightButton = document.querySelector(".carousel__btn_type_right");
    const carouselFlipButton = document.querySelector(".carousel__btn_type_flip");

    function getCarouselTitleString() {
        return `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
    }

    function updateDisplay() {
        const currentCard = deck.cards[currentIndex];

    if (showingQuestion) {
        carouselCardText.textContent = currentCard.question;
        carouselCard.classList.remove("carousel__card_color_white");    
    } else {
        carouselCardText.textContent = currentCard.answer;
        carouselCard.classList.add("carousel__card_color_white");
    }        
    
    carouselTitle.textContent = getCarouselTitleString();

        leftButton.disabled = currentIndex === 0;
        rightButton.disabled = currentIndex === deck.cards.length - 1;

    leftButton.classList.toggle(
        "carousel__btn_disabled",
        leftButton.disabled
);

    rightButton.classList.toggle(
        "carousel__btn_disabled",
        rightButton.disabled
);
    }
    
    removeColorClasses(carouselCard);
    carouselCard.classList.add(`carousel__card_color_${color}`);

    updateDisplay();
    
    
rightButton.onclick = () => {
        if (currentIndex < deck.cards.length - 1) {
            currentIndex++;
            showingQuestion = true;
            updateDisplay();
        }
    };

   leftButton.onclick = () => {
    if (currentIndex > 0) {
        currentIndex--;
        showingQuestion = true;
        updateDisplay();
    }
};

    carouselFlipButton.onclick = () => {

        showingQuestion = !showingQuestion;
        console.log(showingQuestion);
        
        updateDisplay();
};

       carouselCard.classList.add(`carousel__card_color_${color}`);
}

export {renderCarouselView};