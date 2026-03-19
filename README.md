# Daily Motivation Dashboard

This is a small React project built with Vite. The idea is simple: show a random motivational quote, let the user like it, and keep track of liked quotes in one place.

The project was made to practice a few core React concepts in a beginner-friendly way, especially `useState`, `useEffect`, array updates, conditional rendering, and `localStorage`.

## What the project does

- Fetches a random quote when the app loads
- Shows the quote and author on the screen
- Lets the user load a new quote
- Lets the user like or unlike the current quote
- Displays the total number of liked quotes
- Shows a list of all liked quotes
- Saves liked quotes in `localStorage` so they stay even after refresh

## React concepts used

This project mainly focuses on state and side effects.

- `useState` is used to store the current quote, author, loading state, status message, and liked quotes
- `useEffect` is used to fetch a quote when the component first loads
- Another `useEffect` is used to save liked quotes whenever the liked quotes array changes
- Array methods like `some`, `filter`, and spread syntax are used for the like/unlike feature

## Quote flow

When the app opens, it calls the quote API and tries to get one random quote. If the request works, the quote and author are shown normally.

If the API is unavailable, the app uses a small built-in fallback quote system. That means the page still works and the user can still test the main features without getting stuck on a broken API.

## Tech stack

- React
- Vite
- CSS
- DummyJSON random quotes endpoint

## How to run the project

```bash
npm install
npm run dev
```

After that, open the local link shown in the terminal.

## Project structure

```text
src/
  App.jsx
  main.jsx
  index.css
index.html
package.json
vite.config.js
```

## Notes

The UI is intentionally simple. The goal of this project is not advanced design, but clear logic and beginner-level React practice.
