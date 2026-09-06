const baseUrl = "https://se-flashcards-api.en.tripleten-services.com";
const headers = {
    "Content-Type": "application/json",
    Authorization: "01a06f55-625c-7553-a886-8619e4b58c65",
};


function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

function getDecks() {
  return fetch(`${baseUrl}/v1/decks`, { headers }).then(processResponse);
}

function deleteDeck(deckID) {
  return fetch(`${baseUrl}/v1/decks/${deckID}`, { method: "DELETE", headers }).then(
    processResponse,
  );
}

function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/v1/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, color, cards }),
  }).then(processResponse);
}


 /**
  * Removes the deck matching the given ID from {@link fetchedDecks} in place.
  *
  * @param {string} deckId - The unique identifier of the deck to remove
  */
 function removeDeckByID(deckId) {
   const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
   if (index !== -1) {
     fetchedDecks.splice(index, 1);
   }
 }

export { getDecks, getDeckByID, addDeck, deleteDeck };

