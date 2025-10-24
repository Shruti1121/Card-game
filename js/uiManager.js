/**
 * UIManager - handles DOM rendering and user events.
 * Keeps DOM updates separate from game logic.
 */
export default class UIManager {
  /**
   * @param {HTMLElement} gridEl
   * @param {GameManager} game
   */
  constructor(gridEl, game) {
    this.gridEl = gridEl;
    this.game = game;

    // wire game events
    this.game.on('render', data => this.render(data));
    this.game.on('update', st => this.updateStats(st));
    this.game.on('win', st => this.showWin(st));
  }

  // Render grid and set data-cols for CSS grid
  render(payload) {
    const deck = payload.deck || payload; // support both shapes
    const flippedIds = payload.flippedIds || [];

    // set grid columns attribute
    this.gridEl.setAttribute('data-cols', this.game.cols);

    // clear
    this.gridEl.innerHTML = '';

    deck.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.dataset.id = card.id;

      const inner = document.createElement('div');
      inner.className = 'card-inner';

      const back = document.createElement('div');
      back.className = 'card-face card-back';
      back.textContent = '?';

      const front = document.createElement('div');
      front.className = 'card-face card-front';
      front.style.backgroundColor = card.value;
      // Add a subtle border to help distinguish cards
      front.style.border = '2px solid rgba(255, 255, 255, 0.3)';

      inner.appendChild(back);
      inner.appendChild(front);
      cardEl.appendChild(inner);

      // mark matched visually
      if (card.matched) {
        cardEl.classList.add('flipped');
        cardEl.style.pointerEvents = 'none';
      } else {
        if (flippedIds.includes(card.id)) cardEl.classList.add('flipped');
        else cardEl.classList.remove('flipped');
        cardEl.style.pointerEvents = '';
      }

      // click handler
      cardEl.addEventListener('click', (e) => {
        // delegate to game manager
        this.game.flip(card.id);
      });

      this.gridEl.appendChild(cardEl);
      // keep reference on card object for convenience
      card.element = cardEl;
    });
  }

  updateStats(st) {
    // updates number of moves
    document.getElementById('moves').textContent = `Moves: ${st.moves}`;
    // updates number of matched pairs
    document.getElementById('matched').textContent = `Matched: ${st.matchedPairs}/${st.totalPairs}`;
    // calculates minutes
    const mm = String(Math.floor(st.seconds/60)).padStart(2,'0');
    // calculates seconds
    const ss = String(st.seconds%60).padStart(2,'0');
    // updates time spent since start of the game
    document.getElementById('timer').textContent = `Time: ${mm}:${ss}`;
  }

  // function called once all pairs are matched
  // it displays win popup, number of moves andtime taken
  showWin(st) {
    const popup = document.getElementById('winPopup');
    const stats = document.getElementById('finalStats');
    stats.textContent = `Moves: ${st.moves} — Time: ${String(Math.floor(st.seconds/60)).padStart(2,'0')}:${String(st.seconds%60).padStart(2,'0')}`;
    popup.classList.remove('hidden'); // to make pop up visible
  }
}
