/**
 * GameManager - central game logic and state manager.
 * Keeps the deck, game rules, matching logic and exposes events via callbacks.
 */
import Card from './card.js';

export default class GameManager {
  /**
   * @param {object} opts
   * @param {number} opts.cols
   * @param {number} opts.rows
   */
  constructor({ cols = 4, rows = 4 } = {}) {
    this.cols = cols;
    this.rows = rows;
    this.totalCards = cols * rows;
    if (this.totalCards % 2 !== 0) {
      throw new Error('Total card count must be even (pairs).');
    }

    this.deck = []; // array of Card
    this.flipped = []; // currently flipped cards
    this.moves = 0;
    this.matchedPairs = 0;
    this.callbacks = {}; // event callbacks: 'update','win','render'
    this._createDeck();
    this._timer = null;
    this._seconds = 0;
    this.running = false;
  }

  // API to attach callbacks


  on(eventName, cb) {
    this.callbacks[eventName] = cb;
  }

  _emit(eventName, payload) {
    const cb = this.callbacks[eventName];
    if (cb) cb(payload);
  }

  // create pair values and shuffle them
  _createDeck() {
    const pairs = this.totalCards / 2;
    const values = [];
    // Define a palette of distinct colors
    const colors = [
  '#FF5733', // Vibrant Red
  '#33FF57', // Bright Green
  '#3357FF', // Bold Blue
  '#FF33A1', // Hot Pink
  '#33FFF5', // Aqua
  '#F5FF33', // Yellow
  '#FF8C33', // Orange
  '#8C33FF', // Purple
  '#33FF8C', // Mint Green
  '#FF3333', // Crimson
  '#33A1FF', // Sky Blue
  '#A1FF33', // Lime
  '#FF33F5', // Magenta
  '#F533FF', // Neon Pink
  '#33F5FF', // Cyan
  '#F5A833', // Amber
  '#A833FF', // Violet
  '#33FFA8', // Teal
  '#FF5733', // Coral
  '#5733FF'  // Deep Purple
    ];
    for (let i = 0; i < pairs; i++) values.push(colors[i % colors.length]);
    // duplicate and create Card instances
    const raw = values.concat(values);
    // shuffle
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    this.deck = raw.map((v, idx) => new Card(idx, v));
    this.moves = 0;
    this.matchedPairs = 0;
    this.flipped = [];
    this._seconds = 0;
    this.running = false;
    this._emit('render', this.deck.slice());
    this._emit('update', this._status());
  }

  startTimer() {
    if (this.running) return;
    this.running = true;
    this._timer = setInterval(() => {
      this._seconds++;
      this._emit('update', this._status());
    }, 1000);
  }

  stopTimer() {
    this.running = false;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  _status() {
    return {
      moves: this.moves,
      matchedPairs: this.matchedPairs,
      totalPairs: this.totalCards / 2,
      seconds: this._seconds,
    };
  }

  // Called by UI when a card is clicked
  async flip(cardId) {
    // first click of the game starts timer
    if (!this.running) this.startTimer();

    const card = this.deck.find(c => c.id === cardId);
    if (!card || card.matched) return;
    // ignore if already flipped in current attempt
    if (this.flipped.find(f => f.id === cardId)) return;

    // add to flipped and emit so UI flips
    this.flipped.push(card);
    this._emit('render', { deck: this.deck.slice(), flippedIds: this.flipped.map(c => c.id) });

    if (this.flipped.length === 2) {
      this.moves += 1;
      // check match
      const [a, b] = this.flipped;
      if (a.value === b.value) {
        // mark matched
        a.setMatched(true);
        b.setMatched(true);
        this.matchedPairs += 1;
        this.flipped = [];
        this._emit('update', this._status());
        // check win
        if (this.matchedPairs === this.totalCards / 2) {
          this.stopTimer();
          this._emit('win', this._status());
        }
      } else {
        // wait a short delay then flip back
        await new Promise(res => setTimeout(res, 600));
        this.flipped = [];
        this._emit('render', { deck: this.deck.slice(), flippedIds: [] });
        this._emit('update', this._status());
      }
    } else {
      this._emit('update', this._status());
    }
  }

  // Restart with optional new grid size
  restart({ cols = this.cols, rows = this.rows } = {}) {
    this.stopTimer();
    this.cols = cols;
    this.rows = rows;
    this.totalCards = cols * rows;
    this._createDeck();
  }
}
