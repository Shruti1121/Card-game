import GameManager from './gameManager.js';
import UIManager from './uiManager.js';

const grid = document.getElementById('grid');
const restartBtn = document.getElementById('restartBtn');
const difficulty = document.getElementById('difficulty');
const playAgain = document.getElementById('playAgain');
const winPopup = document.getElementById('winPopup');

// main.js file is to handle all the events and interation in the game
// it is the entry point of the game

// parse difficulty string "4x3"
function parseDifficulty(val){
  const [cols, rows] = val.split('x').map(Number);
  return { cols, rows };
}

let gm;
let ui;

// fn that takes difficulty level renders deck 
// updates rows, columns and resets moves, matched pairs and time to 0
function startNewGame(diff){
  if (gm) gm.stopTimer?.();
  gm = new GameManager({ cols: diff.cols, rows: diff.rows });
  ui = new UIManager(grid, gm);
  // initial render
  gm._emit('render', gm.deck.slice());
  gm._emit('update', { moves:0, matchedPairs:0, totalPairs: gm.totalCards/2, seconds:0 });
  document.getElementById('winPopup').classList.add('hidden');
}

// wiring controls

// click event on restart button
// it gets current dificulty level and starts a new game
restartBtn.addEventListener('click', () => {
  const diff = parseDifficulty(difficulty.value);
  startNewGame(diff);
});

// change event to get new difficulty level from user and start new game
difficulty.addEventListener('change', () => {
  const diff = parseDifficulty(difficulty.value);
  startNewGame(diff);
});


// click event play again button on win pop up window
// it gets current dificulty level and starts a new game
playAgain.addEventListener('click', () => {
  const diff = parseDifficulty(difficulty.value);
  startNewGame(diff);
});

// Start default
startNewGame(parseDifficulty(difficulty.value));
