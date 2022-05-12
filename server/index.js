import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import { Database } from './db.js';
import dotenv from 'dotenv'
dotenv.config()
import logger from 'morgan';

// const WORD_SCORE_FILE = 'word-scores.json';
// const GAME_SCORE_FILE = 'game-scores.json';

// Returns a function that will read a score file.
// function readScoreFile(path) {
//   return async () => {
//     try {
//       const scoreFile = await readFile(path, 'utf8');
//       const scores = JSON.parse(scoreFile);
//       return scores;
//     } catch (error) {
//       // Likely the file doesn't exist
//       return [];
//     }
//   };
// }

// Create functions for reading from score files.
// const readWordScores = readScoreFile(WORD_SCORE_FILE);
// const readGameScores = readScoreFile(GAME_SCORE_FILE);

class Server {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
    this.app.use('/', express.static('client'));
  }

  async initRoutes() {
    const self = this;

    //POSTS word score to database
    this.app.post('/wordScore', async (request, response) => {
      console.log(request.query)
      const { name, word, score } = request.query;
      await self.db.createWord(name, word, score)
      response.status(200).json({ status: 'success' });
    });

    //POSTS game score to database
    this.app.post('/gameScore', async (request, response) => {
      const { name, score } = request.query;
      await self.db.createGame(name, score)
      response.status(200).json({ status: 'success' });
    });

    //GETS top 10 word scores
    this.app.get('/highestWordScores', async (request, response) => {
      const scores = await self.db.getAllWordScores()
      const sorted = scores.sort((a, b) => b.score - a.score);
      const top = sorted.slice(0, 10);
      response.status(200).json(top);
    });


    this.app.get('/highestGameScores', async (request, response) => {
      const scores = await self.db.getAllGameScores()
      console.log(scores)
      const sorted = scores.sort((a, b) => b.score - a.score);
      const top = sorted.slice(0, 10);
      response.status(200).json(top);
    });
  }

  async initDb() {
    console.log(this.dburl)
    this.db = new Database(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    console.log('check')
    await this.initDb();
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });
  }
}

const server = new Server(`mongodb+srv://ggarber:${process.env.DB_PASSWORD}@cluster0.ikucv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
server.start();

// Returns a function that will save a word score to a word score file.
// function saveToWordScoreFile(path) {
//   return async (name, word, score) => {
//     const data = { name, word, score };
//     const scores = await readWordScores();
//     scores.push(data);
//     writeFile(path, JSON.stringify(scores), 'utf8');
//   };
// }

// // Returns a function that will save a game score to a game score file.
// function saveToGameScoreFile(path) {
//   return async (name, score) => {
//     const data = { name, score };
//     const scores = await readGameScores();
//     scores.push(data);
//     writeFile(path, JSON.stringify(scores), 'utf8');
//   };
// }

// // Create functions for saving to score files
// async function saveWordScore(name, word, score) {

// }
// const saveGameScore = saveToGameScoreFile(GAME_SCORE_FILE);

// async function top10WordScores() {
//   const scores = await readWordScores();
//   const sorted = scores.sort((a, b) => b.score - a.score);
//   const top = sorted.slice(0, 10);
//   return top;
// }

// async function top10GameScores() {
//   const scores = await readGameScores();
//   const sorted = scores.sort((a, b) => b.score - a.score);
//   const top = sorted.slice(0, 10);
//   return top;
// }

// // Create the Express app and set the port number.
// const app = express();
// const port = process.env.PORT || 8080;

// // Add Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// // SOLUTION BEGIN
// app.use(logger('dev'));
// app.use('/', express.static('client'));
// // SOLUTION END
// /** TEMPLATE BEGIN 
// TODO: Add the morgan middleware to the app.
// TODO: Add the express.static middleware to the app. 
//  TEMPLATE END */

// // SOLUTION BEGIN
// app.post('/wordScore', async (request, response) => {
//   const { name, word, score } = request.body;
//   await saveWordScore(name, word, score);
//   response.status(200).json({ status: 'success' });
// });

// app.get('/highestWordScores', async (request, response) => {
//   const scores = await top10WordScores();
//   response.status(200).json(scores);
// });

// app.post('/gameScore', async (request, response) => {
//   const { name, score } = request.body;
//   await saveGameScore(name, score);
//   response.status(200).json({ status: 'success' });
// });

// app.get('/highestGameScores', async (request, response) => {
//   const scores = await top10GameScores();
//   response.status(200).json(scores);
// });

// // This matches all routes that are not defined.
// app.all('*', async (request, response) => {
//   response.status(404).send(`Not found: ${request.path}`);
// });

// // Start the server.
// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

// // SOLUTION END
// /** TEMPLATE BEGIN
// // TODO: Implement the ExpressJS routes for this server.

// // Add your code here. 😎 👍
// // You can do this! Make sure you reference example applications covered in 
// // class and in the associated exercises!

// // This matches all routes that are not defined.
// app.all('*', async (request, response) => {
//   response.status(404).send(`Not found: ${request.path}`);
// });

// // Start the server.
// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });
// TEMPLATE END */
