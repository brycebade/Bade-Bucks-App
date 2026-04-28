# Bade Bucks App

A simple web app to track kids' chores and calculate weekly pay in a clear, visual way.

---

## Demo

> *(Add your live link here later — GitHub Pages or deployed site)*
> https://your-live-link.com

![App Screenshot](./screenshot.png)

---

## Features

* Select a child and week to view progress
* Track daily chores using checkboxes
* Automatically calculate total chores completed
* Dynamically calculate pay due based on rules per child
* Mark a week as paid to reset displayed balance
* Persist data using localStorage (no login required)

---

## Tech Stack

* HTML
* CSS (Tailwind + DaisyUI)
* JavaScript (Vanilla JS)
* LocalStorage

---

## How to Run Locally

1. Clone the repository

   ```bash
   git clone https://github.com/brycebade/Bade-Bucks-App.git
   ```

2. Open the project folder

3. Open `index.html` in your browser
   *(or use Live Server in VS Code for a better experience)*

---

## Project Structure

* `index.html` → Main layout and UI structure
* `style.css` → Custom styling (if applicable)
* `index.js` → Core app logic and event handling
* `data.js` → Initial data model for children and weeks

---

## Key Concepts Implemented

* DOM manipulation (updating UI dynamically)
* Event listeners (click, change, keydown)
* Working with nested data structures
  *(children → weeks → days)*
* Array methods like `find()` and iteration loops
* State management between UI and data
* LocalStorage for persistent data

---

## What I Learned

* How to sync UI state with underlying data without breaking things
* How to structure and access nested objects safely
* How event-driven programming works in real apps
* How small bugs in logic (like incorrect references or scope issues) can break functionality
* The importance of resetting UI correctly when switching between selections

---

## Future Improvements

* Add backend support (Supabase) for real data storage
* Create user accounts for each child
* Improve mobile responsiveness and layout
* Add rewards/store system for spending earned money
* Add weekly summaries and history tracking

---

## Author

Bryce Bade

---

## Notes

This project is part of my journey learning JavaScript and building real-world applications.
The goal is not just functionality, but understanding how and why the code works.
