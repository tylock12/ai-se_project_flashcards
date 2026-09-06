# Flashcard App

My first project in TripleTen's AI-Assisted Software
Engineering program. It includes decks of flashcards,
each of which can be viewed in a carousel.

## Features

- Browse a collection of flashcard decks on the home page, each with a distinct color
- Click into a deck to view its cards in an interactive carousel, flipping through one card at a time
- Create a new deck by submitting a name, color, and a set of question/answer cards as JSON
- Delete a deck directly from the home page with a single click
- View an About page describing the project

## Data & Error Handling

- All decks are fetched from, created in, and deleted from a remote API rather than stored locally, so changes persist across sessions
- Requests are authenticated using a personal API token sent via the `Authorization` header
- If a request fails (e.g., invalid input, network error, or a bad response from the server), the error is caught and displayed to the user in a modal, rather than failing silently

## Technologies used

- HTML5 for page structure and semantic markup
- CSS3 for styling and layout, including custom fonts via Google Fonts
- Vanilla JavaScript (ES6 modules) for interactivity, hash-based routing, and dynamic rendering
- The Fetch API and Promises for all communication with the remote flashcards API
- JSDoc for documenting every function's parameters, return values, and behavior

## Deployed Site

Check out [this site](https://tylock12.github.io/ai-se_project_flashcards/) on GitHub Pages.