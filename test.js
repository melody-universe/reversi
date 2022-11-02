import { exit } from "process";
import connect, { client } from "./cache/connect";
import { SIZE } from "./constants";

await connect();
const database = client.db(`reversi-${SIZE}`);
await database.collection(`turn-0`).drop();
const collections = await database.collections();
await Promise.all(
  collections.map(async (collection) => {
    console.log(
      `${collection.collectionName}: ${await collection.countDocuments()}`
    );
  })
);
/* await setup();
 await report(); 
const collection = await collections.get(4);
const doc = await collection.find().next(); 
console.log(doc); */
// await clear();
await client.close();
exit();
