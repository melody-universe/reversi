import { Collection, Db, MongoClient } from "mongodb";
import { CACHE_TURN_FREQUENCY, SIZE } from "../constants";

/** @type {MongoClient} */
export let client;

/** @type {Db} */
export let database;

/** @type {Map<number, Collection>} */
export const collections = new Map();

const setup = async () => {
  client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  database = client.db(`reversi-${SIZE}`);
  const existingCollections = new Set(
    (await database.collections()).map(
      (collection) => collection.collectionName
    )
  );
  for (
    let turn = CACHE_TURN_FREQUENCY;
    turn < SIZE * SIZE;
    turn += CACHE_TURN_FREQUENCY
  ) {
    const collectionName = `turn-${turn}`;
    const collection = database.collection(collectionName);
    if (!existingCollections.has(collectionName)) {
      await collection.insertOne({});
      await collection.createIndex({ state: 1 }, { unique: true });
      await collection.deleteOne({});
    }
    collections.set(turn, collection);
  }
};
export default setup;
