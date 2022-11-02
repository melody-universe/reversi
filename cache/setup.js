import { Collection, Db } from "mongodb";
import connect, { client } from "./connect";
import { CACHE_TURN_FREQUENCY, SIZE } from "../constants";

/** @type {Db} */
export let database;

/** @type {Map<number, Collection>} */
export const collections = new Map();

const setup = async () => {
  await connect();
  database = client.db(`reversi-${SIZE}`);
  const existingCollections = new Set(
    (await database.collections()).map(
      (collection) => collection.collectionName
    )
  );
  for (
    let turn = CACHE_TURN_FREQUENCY;
    turn < SIZE * SIZE - 4;
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
