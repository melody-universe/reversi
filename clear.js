import connect, { client } from "./cache/connect";

await connect();
const admin = client.db().admin();
const databases = await admin.listDatabases();
const reversiDatabases = databases.databases.filter((db) =>
  db.name.startsWith("reversi")
);
await Promise.all(
  reversiDatabases.map(async (db) => {
    await client.db(db.name).dropDatabase();
    console.log(`dropped ${db.name}`);
  })
);
client.close();
