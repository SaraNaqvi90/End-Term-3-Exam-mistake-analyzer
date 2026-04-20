# Exam Mistake Analyzer

Exam Mistake Analyzer is a beginner-friendly React project that helps students learn from graded tests instead of only checking marks.

The student uploads a graded test, saves each wrong answer, and the app classifies the root cause of the mistake. After that, the app builds a focused revision plan based on repeated patterns such as concept gaps, careless errors, and misread questions.

## Problem Statement

Students often solve many papers but still repeat the same mistakes in later exams because they do not track why they lost marks.

This project solves that problem by helping a student:

- store graded tests in one place
- save every wrong answer with notes
- categorize mistakes by root cause
- build a revision plan from real mistake data
- track whether each revision task is done

## Target User

The main user is a school or college student who wants to improve exam performance by understanding patterns in their mistakes.

## Why This Problem Matters

- marks are lost not only because of weak concepts, but also because of careless habits and poor revision
- students usually forget old mistakes after a few days
- one clear system can improve revision quality and exam confidence

## Main Features

- Email/password authentication with Firebase Auth
- Protected routes
- Upload graded test details
- Save wrong answers for each test
- Root cause suggestion using simple rule-based logic
- CRUD operations for tests and mistakes
- Dashboard with stats and recent tests
- Study plan page with priority topics
- Revision checklist with status updates

## React Concepts Used

### Core React

- Functional components
- Props
- Component composition
- `useState`
- `useEffect`
- Conditional rendering
- Lists and keys

### Intermediate React

- Lifting state up
- Controlled components
- React Router
- Context API

### Advanced React

- `useMemo` for filtered lists and dashboard stats
- `useRef` for form focus/scroll and file input reset
- `React.lazy` and `Suspense` for lazy loaded pages

## Tech Stack

- React
- Vite
- React Router
- Firebase Authentication
- Firebase Firestore
- CSS

## Folder Structure

```text
src/
  components/
  context/
  hooks/
  pages/
  services/
  utils/
  App.jsx
  main.jsx
  index.css
```

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication with Email/Password.
3. Create a Firestore database.
4. Copy the rules from `firestore.rules` into Firestore Rules.
5. Copy `.env.example` to `.env`.
6. Paste your Firebase credentials into the `.env` file.

## Suggested Firestore Collections

- `examSessions`
- `mistakes`

## How To Run

```bash
npm install
npm run dev
```

## Build For Production

```bash
npm run build
```

## Deployment Idea

This project is a good fit for Vercel or Netlify.

### Vercel Steps

1. Push the code to GitHub.
2. Go to Vercel and import the GitHub repository.
3. Add the same Firebase environment variables in Vercel.
4. Deploy.

`vercel.json` is already included so React Router routes work after deployment.

### Netlify Steps

1. Push the code to GitHub.
2. Import the project in Netlify.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.
5. Add the Firebase environment variables.
6. Deploy.

## Demo Video Idea

In your 3 to 5 minute demo, explain:

1. The student problem you are solving
2. Login and signup
3. Uploading a graded test
4. Saving a mistake and showing the suggested root cause
5. Dashboard summary
6. Study plan and revision checklist

## Viva Tip

The categorization logic is intentionally simple and explainable. It uses keyword-based rules instead of a complex machine learning model so that every part of the code can be understood and explained clearly as a beginner project.
