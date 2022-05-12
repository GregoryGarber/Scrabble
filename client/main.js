import { Game } from './game.js';
import * as utils from './scrabbleUtils.js';
import { Rack } from './rack.js';

// Fetch the dictionary from the server.
const response = await fetch('dictionary.json');
if (!response.ok) {
  console.log(response.error);
} else {
  window.dictionary = await response.json();
}

// Set the number of players and the whose turn it is.
const NUMBER_OF_PLAYERS = 2;

// Player 1 starts the game
let turn = 0;

// Updates and displays the current payers turn.
function updateTurn() {
  document.getElementById('turn').innerText = document.getElementById(
    `p${(turn % NUMBER_OF_PLAYERS) + 1}-name`
  ).value;
}

function renderGame(game) {
  game.render(document.getElementById('board'));
}

function renderRacks(racks) {
  racks.forEach((rack, i) =>
    rack.render(document.getElementById(`p${i + 1}-rack`))
  );
}

// Create a new game.
const game = new Game();

// Display the player's turn.
updateTurn();

// An array of racks.
const racks = [];

// An array of scores for each player.
const scores = Array.from(Array(NUMBER_OF_PLAYERS), () => 0);

// Initialize the racks and player name's event handler.
for (let i = 0; i < NUMBER_OF_PLAYERS; ++i) {
  racks[i] = new Rack();

  racks[i].takeFromBag(7, game);

  // When the player's name changes, update the player's turn.
  document
    .getElementById(`p${i + 1}-name`)
    .addEventListener('change', updateTurn);
}

// Render the racks and the game board.
renderRacks(racks);
renderGame(game);

// SOLUTION BEGIN
async function saveWordScore(name, word, score) {
  const data = JSON.stringify({ name, word, score });
  const response = await fetch(`/wordScore?name=${name}&word=${word}&score=${score}`, {
    method: 'POST'
  });
  if (!response.ok) {
    console.error(`Unable to save ${data} to server`);
  }
}

function displayWordScore(name, word, score) {
  const tr = document.createElement('tr');
  const ename = document.createElement('td');
  const eword = document.createElement('td');
  const escore = document.createElement('td');
  ename.innerText = name;
  eword.innerText = word;
  escore.innerText = score;
  tr.appendChild(ename);
  tr.appendChild(eword);
  tr.appendChild(escore);
  document.getElementById('word-scores-table').appendChild(tr);
}

async function displayScores() {
  const wordScoresRequest = await fetch('/highestWordScores');
  const wordScoresData = wordScoresRequest.ok
    ? await wordScoresRequest.json()
    : [];

  // Reset word scores table
  const wordScores = document.getElementById('word-scores-table');
  while (wordScores.childNodes.length > 2) {
    wordScores.removeChild(wordScores.lastChild);
  }

  for (const wordScore of wordScoresData) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    const word = document.createElement('td');
    const score = document.createElement('td');
    name.innerText = wordScore.name;
    word.innerText = wordScore.word;
    score.innerText = wordScore.score;
    tr.appendChild(name);
    tr.appendChild(word);
    tr.appendChild(score);
    document.getElementById('word-scores-table').appendChild(tr);
  }

  const gameScoresRequest = await fetch('/highestGameScores');
  const gameScoresData = gameScoresRequest.ok
    ? await gameScoresRequest.json()
    : [];

  // Reset game scores table
  const gameScores = document.getElementById('game-scores-table');
  while (gameScores.childNodes.length > 2) {
    gameScores.removeChild(gameScores.lastChild);
  }

  for (const gameScore of gameScoresData) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    const score = document.createElement('td');
    name.innerText = gameScore.name;
    score.innerText = gameScore.score;
    tr.appendChild(name);
    tr.appendChild(score);
    document.getElementById('game-scores-table').appendChild(tr);
  }
}

async function saveGameScore(name, score) {
  const data = JSON.stringify({ name, score });
  const response = await fetch(`/gameScore?name=${name}&score=${score}`, {
    method: 'POST'
  });
  if (!response.ok) {
    console.error(`Unable to save ${data} to server`);
  }
}

displayScores();
// SOLUTION END

// Several changes to account for two players and dictionary.
document.getElementById('play').addEventListener('click', async () => {
  const word = document.getElementById('word').value;
  const x = parseInt(document.getElementById('x').value);
  const y = parseInt(document.getElementById('y').value);
  const direction = document.getElementById('direction').value === 'horizontal';

  // Get the rack for the current player's turn.
  const rack = racks[turn % NUMBER_OF_PLAYERS];

  // We need to remove tiles already on the grid from the word trying to be
  // constructed.
  let remaining = word;
  for (let i = 0; i < word.length; ++i) {
    const tile = direction
      ? game.getGrid()[x + i][y]
      : game.getGrid()[x][y + i];
    if (tile !== null) {
      if (tile !== word[i]) {
        alert(`The word intercepts already placed tiles.`);
        return;
      } else {
        remaining = remaining.replace(tile, '');
      }
    }
  }

  if (remaining === '') {
    alert('You need to place at least one tile!');
  }

  if (!utils.canConstructWord(rack.getAvailableTiles(), remaining)) {
    alert(`The word ${word} cannot be constructed.`);
  } else {
    try {
      const score = game.playAt(word, { x, y }, direction);
      scores[turn % NUMBER_OF_PLAYERS] += score;
      document.getElementById('word').value = '';
      renderGame(game);

      // SOLUTION BEGIN
      const id = `p${(turn % NUMBER_OF_PLAYERS) + 1}-name`;
      const name = document.getElementById(id).value;
      const availableTiles = rack.getAvailableTiles();
      const constructedWord = utils
        .constructWord(availableTiles, word)
        .join('');
      await saveWordScore(name, constructedWord, score);
      displayWordScore(name, constructedWord, score);
      // SOLUTION END
      /** TEMPLATE BEGIN
      // TODO: Save the player's name, word, and score to the server. You will
      //       need to use the `POST /wordScore` endpoint to do this. We
      //       recommend you write functions to do this for you rather than
      //       make calls to `fetch` directly in this function. For example:

      //       `await saveWordScore(name, word, score);`

      //       You will also want to update the word score table in the UI.
      //       Again, we recommend a function for this. For example:

      //       `displayWordScore(name, word, score);`
      TEMPLATE END*/

      const used = utils.constructWord(rack.getAvailableTiles(), remaining);
      used.forEach((tile) => rack.removeTile(tile));
      rack.takeFromBag(used.length, game);
      renderRacks(racks);
      ++turn;

      updateTurn();
    } catch (e) {
      alert(e);
    }
  }
});

document.getElementById('reset').addEventListener('click', () => {
  game.reset();
  game.render(board);
});

document.getElementById('help').addEventListener('click', () => {
  // Updates to account for two racks.
  const availableTiles = racks[turn % NUMBER_OF_PLAYERS].getAvailableTiles();
  console.log(availableTiles);
  const possibilities = utils.bestPossibleWords(availableTiles);
  // const possibilities = utils.bestPossibleWords(
  //   racks[turn].getAvailableTiles()
  // );
  const hint = possibilities[Math.floor(Math.random() * possibilities.length)];
  document.getElementById('hint').innerText = hint;
});

// BEGIN SOLUTION
document.getElementById('end').addEventListener('click', async () => {
  for (let i = 0; i < NUMBER_OF_PLAYERS; ++i) {
    const name = document.getElementById(`p${i + 1}-name`).value;
    await saveGameScore(name, scores[i]);
  }
  console.log('Clicked end button');
  displayScores();
});
// END SOLUTION
/** BEGIN TEMPLATE
document.getElementById('end').addEventListener('click', async () => {
  // TODO: Add a button whose id is `end` before you complete this method.
  // TODO: Save the game scores to the server. You will need to use the
  //      `POST /gameScore` endpoint to do this. We recommend you write
  //      functions to do this for you rather than make calls to `fetch`
  //     directly in this function. For example:
  //
  //     `await saveGameScore(name, score[i]);`
  //
  //      Where `i` is the i'th player.
}); 
END TEMPLATE */
