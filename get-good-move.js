import { parentPort, Worker } from "worker_threads";
import { evaluate } from "./board";
import { BLACK, PLAYER_NAMES, WHITE } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";

const PLAYER_DIRECTIONS = { [BLACK]: -1, [WHITE]: 1 };

const getGoodMove = async (
  initDepth,
  board,
  player,
  depth = initDepth,
  skippedLastTurn,
  isWorker
) => {
  if (depth === 0) {
    return { score: evaluate(board) };
  }

  if (initDepth - depth <= 0 && !isWorker) {
    return new Promise((resolve, reject) => {
      const workerData = [
        initDepth,
        board,
        player,
        depth,
        skippedLastTurn,
        true,
      ];
      const worker = new Worker("./get-good-move-service.js", {
        workerData,
      });
      worker.on("message", (message) => {
        switch (message.type) {
          case "console":
            if (isWorker) {
              parentPort.postMessage(message);
            } else {
              console.log(message.value);
            }
            break;
          case "move":
            resolve(message.value);
        }
      });
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(
            new Error(
              `Worked stopped with code: ${code} (${JSON.parse(workerData)})`
            )
          );
        }
      });
    });
  }

  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return {
        score: evaluate(board),
      };
    } else {
      return await getGoodMove(
        initDepth,
        board,
        getOpponent(player),
        depth,
        true
      );
    }
  }

  const direction = PLAYER_DIRECTIONS[player];
  const opponent = getOpponent(player);
  const moveKeys = [...validMoves.keys()];
  const results = await Promise.all(
    moveKeys.map(async (move) => ({
      ...(await getGoodMove(
        initDepth,
        validMoves.get(move),
        opponent,
        depth - 1
      )),
      move,
    }))
  );
  let best = null;
  for (const goodMove of results) {
    if (depth === initDepth) {
      console.log(
        `${PLAYER_NAMES[player]}: ${goodMove.move} (score: ${goodMove.score})`
      );
    }
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
export default getGoodMove;
