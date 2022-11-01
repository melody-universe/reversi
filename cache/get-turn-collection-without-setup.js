import { MongoClient } from "mongodb";
import { SIZE } from "../constants";

const getTurnCollectionWithoutSetup = async (turn) => {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  const database = client.db(`reversi-${SIZE}`);
  return database.collection(`turn-${turn}`);
};
export default getTurnCollectionWithoutSetup;
