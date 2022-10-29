import { workerData, parentPort } from "worker_threads";
import { evaluate, evaluateForGood } from "./board";
import { PLAYER_DIRECTIONS } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";

const getGoodMoveService = (board, player, depth, skippedLastTurn) => {
  if (depth === 0) {
    return { score: evaluateForGood(board) };
  }

  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return {
        score: evaluate(board) * 100,
      };
    } else {
      return getGoodMoveService(board, getOpponent(player), depth, true);
    }
  }

  const direction = PLAYER_DIRECTIONS[player];
  const opponent = getOpponent(player);
  const moveKeys = [...validMoves.keys()];
  const results = moveKeys.map((move) => ({
    ...getGoodMoveService(validMoves.get(move), opponent, depth - 1),
    move,
  }));
  let best = null;
  for (const goodMove of results) {
    if (best === null) {
      best = goodMove;
      continue;
    }
    if (goodMove.score * direction > best.score * direction) {
      best = goodMove;
    }
  }
  return best;
};

const { boardString, player } = workerData;
const board = new Uint8Array([...boardString].map(parseInt));

parentPort.postMessage(getGoodMoveService(board, player, 9));
