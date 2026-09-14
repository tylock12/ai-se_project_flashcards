/**
 * The list of decks fetched from the API. Starts empty and is populated
 * after the initial fetch on page load.
 * @type {Array<Object>}
 */
const fetchedDecks = [];

/**
 * Retrieves a deck object by its ID from the fetched decks array.
 *
 * @param {string} deckId - The unique identifier of the deck to retrieve
 * @returns {Object|undefined} The deck object if found, undefined otherwise
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Removes a deck from the fetched decks array by its ID, in place.
 *
 * @param {string} deckId - The unique identifier of the deck to remove
 * @returns {void}
 */
function deleteDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
  fetchedDecks.splice(index, 1);
}

export { getDeckByID, deleteDeckByID, fetchedDecks };