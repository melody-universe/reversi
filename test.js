import { Collection } from "mongodb";
import connect, { client, database } from "./cache/connect";

await connect();
/** @type {Collection[]} */
const collections = await database.collections();
for (const collection of collections) {
  console.log(`Collection: ${collection.collectionName}`);
}
client.close();
