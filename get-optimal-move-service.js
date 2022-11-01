import { Collection } from "mongodb";
import { parentPort, workerData } from "worker_threads";
import { evaluate } from "./board";
import getTurnCollectionWithoutSetup from "./cache/get-turn-collection-without-setup";
import { CACHE_TURN_FREQUENCY, PLAYER_DIRECTIONS, SIZE } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";
import stateToByteArray from "./math/state-to-byte-array";

const { board, turn, player } = workerData;
let nextCacheTurn =
  turn + (CACHE_TURN_FREQUENCY - (turn % CACHE_TURN_FREQUENCY));
if (nextCacheTurn >= SIZE * SIZE - 4) {
  nextCacheTurn = undefined;
}
/** @type {Collection} */
const collection =
  nextCacheTurn && (await getTurnCollectionWithoutSetup(nextCacheTurn));
const needs = [];

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
    const optimalMove = pullFromCache
      ? await collection.findOne({
          state: stateToByteArray({
            board: validMoves.get(move),
            player: opponent,
          }),
        })
      : getOptimalMove(validMoves.get(move), turn + 1, opponent);
    if (!optimalMove) {
      needs.push({ board: validMoves.get(move), player: opponent });
    }
    if (needs.length > 0) {
      continue;
    }
    if (best === null) {
      best = { move, ...optimalMove };
      continue;
    }
    if (optimalMove.score * direction > best.score * direction) {
      best = { move, ...optimalMove };
    }
  }
  return best;
};

const move = await getOptimalMove(board, turn, player);
if (needs.length > 0) {
  parentPort.postMessage({ turn: nextCacheTurn, needs });
} else {
  await collection.updateOne(
    { state: stateToByteArray({ board, player }) },
    { $set: { move: move.move, score: move.score } },
    { upsert: true }
  );
}
