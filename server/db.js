
   
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

export class Database {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    this.client = await MongoClient.connect(this.dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    // Get the database.
    this.db = this.client.db('myFirstDatabase');

    // Init the database.
    await this.init();
  }

  async init() {
    this.wordScoreCollection = this.db.collection('wordScores');
    this.gameScoreCollection = this.db.collection('gameScores');
  }

  // Close the pool.
  async close() {
    this.client.close();
  }

  //CREATE a word in the database
  async createWord(name, word, score) {
    const res = await this.wordScoreCollection.insertOne({ name, word, score });
    return res
  }

  //CREATE a game in the database
  async createGame(name, score) {
    const res = await this.gameScoreCollection.insertOne({ name, score });
    return res
  }

  //GET all word scores in the database
  async getAllWordScores() {
    const res = await this.wordScoreCollection.find({}).toArray();
    return res;
  }

  //GET all game scores in the database
  async getAllGameScores() {
      console.log('butt')
    const res = await this.gameScoreCollection.find({}).toArray();
    console.log(res)
    return res;
  }


}