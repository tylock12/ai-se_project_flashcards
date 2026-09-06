const baseUrl = "https://se-flashcards-api.en.tripleten-services.com";
const headers = {
    "Content-Type": "application/json",
    Authorization: "01a06f55-625c-7553-a886-8619e4b58c65",
};


/**
 * Checks a fetch Response and either parses its JSON body or rejects with an error.
 * @param {Response} res - The response object returned by fetch.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data, or rejects with an error message.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Fetches the list of decks from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of deck objects.
 */
function getDecks() {
  return fetch(`${baseUrl}/v1/decks`, { headers }).then(processResponse);
}

/**
 * Deletes a deck by its ID.
 * @param {string} deckID - The unique identifier of the deck to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
function deleteDeck(deckID) {
  return fetch(`${baseUrl}/v1/decks/${deckID}`, { method: "DELETE", headers }).then(
    processResponse,
  );
}

/**
 * Creates a new deck via the API.
 * @param {Object} deck - The deck data to create.
 * @param {string} deck.name - The name of the deck.
 * @param {string} deck.color - The color associated with the deck.
 * @param {Array} deck.cards - The array of card objects belonging to the deck.
 * @returns {Promise<Object>} A promise that resolves to the newly created deck, including its server-assigned _id.
 */
function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/v1/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, color, cards }),
  }).then(processResponse);
}

/**
 * Deletes a card by its ID.
 * @param {string} cardId - The unique identifier of the card to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
function deleteCard(cardId) {
  return fetch(`${baseUrl}/v1/cards/${cardId}`, { method: "DELETE", headers }).then(
    processResponse,
  );
}

/**
 * Creates a new card within a deck.
 * @param {string} deckId - The ID of the deck to add the card to.
 * @param {Object} card - The card data to create.
 * @param {string} card.question - The question text.
 * @param {string} card.answer - The answer text.
 * @returns {Promise<Object>} A promise that resolves to the newly created card.
 */
function addCard(deckId, { question, answer }) {
  return fetch(`${baseUrl}/v1/cards/${deckId}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ question, answer }),
  }).then(processResponse);
}

/**
 * Updates an existing card's question and answer.
 * @param {string} cardId - The ID of the card to update.
 * @param {Object} card - The updated card data.
 * @param {string} card.question - The updated question text.
 * @param {string} card.answer - The updated answer text.
 * @returns {Promise<Object>} A promise that resolves to the updated card.
 */
function updateCard(cardId, { question, answer }) {
  return fetch(`${baseUrl}/v1/cards/${cardId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ question, answer }),
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck, deleteCard, addCard, updateCard };