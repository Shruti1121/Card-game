* A small Card Matching (Memory) game built with plain JavaScript, demonstrating modular code, event-driven architecture, and a clean UI.

* Engine / Versions
- Built with plain JavaScript (ES Modules) — no build step required.
- Tested to run in modern browsers (Chrome, Firefox, Edge) that support ES modules.

* How to open / run

1. open the folder.
2. Open terminal
     - Then open `http://localhost:3000` in your browser.
OR
1. install ritwickdey.LiveServer extension
2. Right-click on index.html and select "Open with Live Server"
3. It will automatically open your browser at something like http://localhost:5500

* Project Structure
- `index.html` - Main HTML file.
- `css/styles.css` - Styling and flip animations.
- `js/` - JavaScript ES modules:
  - `card.js` - Card class.
  - `gameManager.js` - Core game logic, state and events.
  - `uiManager.js` - DOM rendering and events.
  - `main.js` - Bootstraps the game and UI wiring.
- `README.md` - This file.

* Design & Architecture Notes
- Event-driven: `GameManager` exposes `on(event, cb)` and emits `render`, `update`, and `win` events. `UIManager` listens and updates DOM.
- Separation of concerns: Game logic (matching, moves, timer) lives in `GameManager`. UI and DOM live in `UIManager`.
- Simple modular code: ES Modules keep files small and focused.
- Flip animation: CSS 3D transform is used for card flipping.
- Difficulty: Choose grid size from the dropdown (Easy 4x3, Normal 4x4, Hard 5x4).

* Comments & Documentation
- Source files include inline comments explaining the logic, class responsibilities and key functions.
