export class Rack {
  constructor() {
    this.available = {};
  }

  /**
   * Returns an object of available tiles mapped to their amount.
   * @returns {Object<string, number>} An object describing the tiles available
   * in this rack.
   */
  getAvailableTiles() {
    return this.available;
  }

  render(element) {
    element.innerHTML = '';

    for (const letter in this.available) {
      for (let i = 0; i < this.available[letter]; ++i) {
        const div = document.createElement('div');
        div.classList.add('grid-item');
        div.innerText = letter;
        element.appendChild(div);
      }
    }
  }

  /**
   * Removes a single tile from the available tiles.
   * @param {string} tile The tile to remove from the available tiles.
   * @returns {boolean} true if the tile was removed, false if it was not
   * available in the first place.
   */
  removeTile(tile) {
    if (!(tile in this.available)) {
      return false;
    } else {
      if (this.available[tile] === 1) {
        delete this.available[tile];
      } else {
        --this.available[tile];
      }

      return true;
    }
  }

  /**
   * This function will draw n tiles from the game's bag. If there are not
   * enough tiles in the bag, this should take all the remaining ones.
   * @param {number} n The number of tiles to take from the bag.
   * @param {Game} game The game whose bag to take the tiles from.
   */
  takeFromBag(n, game) {
    for (let tile of game.takeFromBag(n)) {
      if (tile in this.available) {
        ++this.available[tile];
      } else {
        this.available[tile] = 1;
      }
    }
  }
}
