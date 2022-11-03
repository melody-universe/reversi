import { MongoClient } from "mongodb";

/** @type {MongoClient} */
export let client;

/** @type {Db} */
export let database;

let connected = false;

const connect = async () => {
  client = new MongoClient("mongodb://localhost:27017");
  if (!connected) {
    await client.connect();
    database = client.db("reversi");
    connected = true;
  }
};
export default connect;
