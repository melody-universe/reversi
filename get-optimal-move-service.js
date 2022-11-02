import { Collection } from "mongodb";
import { exit } from "process";
import { parentPort, workerData } from "worker_threads";
import { evaluate } from "./board";
import getTurnCollectionWithoutSetup from "./cache/get-turn-collection-without-setup";
import { CACHE_TURN_FREQUENCY, PLAYER_DIRECTIONS, SIZE } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";
import { hasValidMoves } from "./has-valid-moves";
import stateToByteArray from "./math/state-to-byte-array";

const { board, turn, player, postReturnValue } = workerData;
let nextCacheTurn =
  Math.ceil((turn + 1) / CACHE_TURN_FREQUENCY) * CACHE_TURN_FREQUENCY;
if (nextCacheTurn >= SIZE * SIZE - 4) {
  nextCacheTurn = undefined;
}

/** @type {Collection} */
const nextTurnCollection =
  nextCacheTurn && (await getTurnCollectionWithoutSetup(nextCacheTurn));
/** @type {Collection} */
const collection = await getTurnCollectionWithoutSetup(turn);
let needMoreCache = false;

const getOptimalMove = async (board, turn, player, skippedLastTurn) => {
  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return {
        score: evaluate(board),
      };
    } else {
      return getOptimalMove(board, turn, getOpponent(player), true);
    }
  }
  const direction = PLAYER_DIRECTIONS[player];
  const opponent = getOpponent(player);
  const moveKeys = [...validMoves.keys()];
  let best = null;
  const pullFromCache = turn + 1 === nextCacheTurn;
  for (const move of moveKeys) {
    let optimalMove;
    const board = validMoves.get(move);
    const nextPlayer = hasValidMoves(board, opponent) ? opponent : player;
    if (pullFromCache) {
      const stateHash = stateToByteArray({
        board,
        player: nextPlayer,
      });
      optimalMove = await nextTurnCollection.findOne({
        state: stateHash,
      });
      if (!optimalMove) {
        await nextTurnCollection.updateOne(
          { state: stateHash },
          { $set: {} },
          { upsert: true }
        );
        needMoreCache = true;
      }
    } else {
      optimalMove = await getOptimalMove(board, turn + 1, nextPlayer);
    }
    if (needMoreCache) {
      continue;
    }
    if (best === null) {
      best = { ...optimalMove, move: JSON.parse(move) };
      continue;
    }
    if (optimalMove.score * direction > best.score * direction) {
      best = { ...optimalMove, move: JSON.parse(move) };
    }
  }
  return best;
};

const move = await getOptimalMove(board, turn, player);
if (turn > 0 && turn % CACHE_TURN_FREQUENCY === 0) {
  await collection.updateOne(
    { state: stateToByteArray({ board, player }) },
    { $set: { move: move.move, score: move.score } },
    { upsert: true }
  );
}
if (!needMoreCache && postReturnValue) {
  parentPort.postMessage(needs);
}
exit();
