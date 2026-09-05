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



export { getDecks, getDeckByID, addDeck, deleteDeck };