import { Worker } from "worker_threads";
import { evaluate } from "../board";
import { PLAYER_DIRECTIONS, PLAYER_NAMES } from "../constants";
import getOpponent from "../get-opponent";
import { getValidMoves } from "../get-valid-moves";

const getGoodMove = async (board, player, skippedLastTurn) => {
  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return {
        score: evaluate(board) * 100,
      };
    } else {
      return getGoodMove(board, getOpponent(player), true);
    }
  }

  const direction = PLAYER_DIRECTIONS[player];
  const opponent = getOpponent(player);
  const moveKeys = [...validMoves.keys()];
  const results = await Promise.all(
    moveKeys.map(async (move) => {
      const goodMove = await new Promise((resolve, reject) => {
        const worker = new Worker("./get-good-move-service.js", {
          workerData: {
            boardString: validMoves.get(move).join(""),
            player: opponent,
          },
        });
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (exitCode) => {
          if (exitCode !== 0) {
            reject(`Worker exited with non-zero exit code: ${exitCode}`);
          }
        });
      });
      console.log(
        `${PLAYER_NAMES[player]}: ${move} (score: ${goodMove.score})`
      );
      return { ...goodMove, move };
    })
  );
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
export default getGoodMove;
