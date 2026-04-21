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

## Why This Problem 

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






