import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js"

const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".decks__list");
const homeSection = document.querySelector("#home");
const aboutSection = document.querySelector("#about");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector(".carousel");

function createDeckEl(item) {
   const newDeck = deckTemplate.content.cloneNode(true);

   const deckElement = newDeck.querySelector(".deck");
   const color = hexToString(item.color);

   deckElement.classList.add(`deck_color_${color}`);

   newDeck.querySelector(".deck__title").textContent = item.name;

   newDeck.querySelector(".deck__count").textContent = `${item.cards.length} cards`;

   const deckLink = newDeck.querySelector(".deck__link");
   deckLink.href = `#carousel/${item.id}`;

   const deleteButton = newDeck.querySelector(".deck__delete-btn");

   deleteButton.addEventListener("click", () => {
      deleteButton.parentElement.parentElement.remove();
   });

   return newDeck;
}

function renderDeckEl(item) {
    const newDeck = createDeckEl(item);
    deckList.prepend(newDeck);
}
    decks.forEach((item) => {
        renderDeckEl(item);
});

function renderView () {
    homeSection.style.display = "none";
    aboutSection.style.display = "none";
    notFoundSection.style.display = "none";
    carouselSection.style.display = "none";

    const hash = window.location.hash;

    if (hash === "#home" || hash === "") {
        homeSection.style.display = "block";  
    } else if (hash === "#about") {
       aboutSection.style.display = "block";
    } else if  (hash.startsWith("#carousel/")) {
        const currentDeckID = hash.split("/")[1];
        const deck = getDeckByID(currentDeckID);
    if (deck) {
        carouselSection.style.display = "flex";
        renderCarouselView(deck);
    } else {
       notFoundSection.style.display = "block"; 
    }
    } else {
        notFoundSection.style.display = "block";
    }
}

window.addEventListener("hashchange", renderView);
renderView();
