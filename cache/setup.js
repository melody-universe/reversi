import { Collection } from "mongodb";
import connect, { database } from "./connect";
import { SIZE } from "../constants";

/** @type {Collection} */
export let collection;

const setup = async () => {
  await connect();
  const collectionName = `size-${SIZE}`;
  collection = database.listCollections({ collectionName })?.[0];
  if (!collection) {
    collection = database.collection(collectionName);
    await collection.insertOne({});
    await collection.createIndex({ state: 1 }, { unique: true });
    await collection.createIndex({ turn: 1 }, { unique: false });
    await collection.deleteOne({});
  }
};
export default setup;
