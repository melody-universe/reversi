import { exit } from "process";
import clear from "./cache/clear";
import connect, { client } from "./cache/connect";
import report from "./cache/report";
import setup from "./cache/setup";

await connect();

/*const collections = await database.collections();
await Promise.all(
  collections.map(async (collection) => {
    console.log(
      `${collection.collectionName}: ${await collection.countDocuments()}`
    );
  })
);*/
await setup();
await report();
/*const collection = await collections.get(4);
const doc = await collection.find().next();
console.log(doc);*/
await clear();
await client.close();
exit();
