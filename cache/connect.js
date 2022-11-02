import { MongoClient } from "mongodb";

/** @type {MongoClient} */
export let client;

let connected = false;

const connect = async () => {
  client = new MongoClient("mongodb://localhost:27017");
  if (!connected) {
    await client.connect();
    connected = true;
  }
};
export default connect;
