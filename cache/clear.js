import { MongoClient } from "mongodb";
import { SIZE } from "../constants";

const clear = async () => {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  const database = client.db(`reversi-${SIZE}`);
  const collections = await database.collections();
  await Promise.all(
    collections.map((collection) =>
      database.dropCollection(collection.collectionName)
    )
  );
};
export default clear;
