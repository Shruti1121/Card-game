/**
 * Card module - represents a single card.
 * Uses a simple object with id and value properties.
 */
export default class Card {
  /**
   * @param {number} id - unique identifier for this card instance
   * @param {string} value - the face value (pair key)
   */
  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.matched = false; // set default value of matched as false
    this.element = null; // DOM element reference (set by UI manager)
  }
//function to set card as matched
  setMatched(matched = true) {
    this.matched = matched;
    if (this.element) {
      this.element.classList.add('matched');
      this.element.style.pointerEvents = 'none';
    }
  }
}
