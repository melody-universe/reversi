import { collections, database } from "./setup";

const getTurnCollection = async (turn) => {
  let collection = collections.get(turn);
  if (collection === undefined) {
    collection = database.collection(`turn-${turn}`);
    await collection.insertOne({});
    await collection.createIndex({ state: 1 }, { unique: true });
    await collection.deleteOne({});
    collections.set(turn, collection);
  }
  return collection;
};
export default getTurnCollection;
