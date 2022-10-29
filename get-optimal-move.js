import { MongoClient } from "mongodb";
import { evaluate } from "./board";
import { BLACK, WHITE } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";
import parseBigInt from "./parse-big-int";

const PLAYER_DIRECTIONS = { [BLACK]: -1, [WHITE]: 1 };

const client = new MongoClient("mongodb://localhost:27017");
client.connect();
const db = client.db("reversi");
const optimalMoves = db.collection("optimal-moves");
if (!optimalMoves.indexExists("boardState")) {
  await optimalMoves.createIndex({ boardState: 1 });
}
console.log(`${await optimalMoves.countDocuments()} saved optimal moves`);

const getOptimalMove = async (board, player, skippedLastTurn) => {
  const boardState = (
    parseBigInt(board.join("")) <<
    (1n + (player === BLACK ? 0n : 1n))
  ).toString(36);

  let move;
  if ((move = await optimalMoves.findOne({ boardState }))) {
    const { _id, boardState, ...returnValue } = move;
    return returnValue;
  }

  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return cached({
        score: evaluate(board),
      });
    } else {
      return cached(await getOptimalMove(board, getOpponent(player), true));
    }
  }
  const direction = PLAYER_DIRECTIONS[player];
  const opponent = getOpponent(player);
  const moveKeys = [...validMoves.keys()];
  let best = null;
  for (const move of moveKeys) {
    const optimalMove = await getOptimalMove(validMoves.get(move), opponent);
    if (best === null) {
      best = { move, ...optimalMove };
      continue;
    }
    if (optimalMove.score * direction > best.score * direction) {
      best = { move, ...optimalMove };
    }
  }
  return cached(best);

  async function cached(optimalMove) {
    await optimalMoves.insertOne({ boardState, ...optimalMove });
    return optimalMove;
  }
};
export default getOptimalMove;
