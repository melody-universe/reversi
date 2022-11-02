import { exit } from "process";
import clear from "./cache/clear";
import connect, { client } from "./cache/connect";
import report from "./cache/report";
import setup from "./cache/setup";
import { PLAYER_NAMES, SIZE } from "./constants";
import drawBoard from "./draw-board";
import byteArrayToState from "./math/byte-array-to-state";

await connect();
const database = client.db(`reversi-${SIZE}`);
const collections = await database.collections();
await Promise.all(
  collections.map(async (collection) => {
    const doc = await collection.findOne({
      score: { $exists: true },
    });
    if (!doc) {
      return;
    }
    const { board, player } = byteArrayToState(doc.state.buffer);
    console.log(`${collection.collectionName}:`);
    drawBoard(board);
    console.log(`Player: ${PLAYER_NAMES[player]}`);
    console.log(`Best move: ${doc.move}`);
    console.log(`Score: ${doc.score}`);
  })
);
// await setup();
// await report();
/*const collection = await collections.get(4);
const doc = await collection.find().next();
console.log(doc);*/
// await clear();
await client.close();
exit();
