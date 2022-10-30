import { mkdirSync } from "fs";
import { join } from "path";
import { Worker } from "worker_threads";
import { evaluate } from "./board";
import { BLACK, MAX_THREAD_COUNT, SIZE, WHITE } from "./constants";
import getDirName from "./cache/get-dir-name";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";
import parseBigInt from "./math/parse-big-int";
import setup from "./cache/setup";
import save from "./cache/save";

const PLAYER_DIRECTIONS = { [BLACK]: -1, [WHITE]: 1 };

const getOptimalMove = async (board, turn, player, skippedLastTurn) => {
  await setup();
  const todo = new Map([turn, [{ board, player }]]);
  let returnLeaf;
  let maxTurn = turn;
  const workers = new Map();

  queueWorker();

  while (workers.size > 0) {
    await new Promise((resolve) => setTimeout(resolve));
  }

  function queueWorker() {
    const workerTurn = maxTurn;
    const turns = todo.get(workerTurn);
    const state = turns.pop();
    const worker = new Worker("./get-optimal-move-service.js", {
      workerData: { turn: workerTurn, ...state },
    });
    worker.on("message", ({ type, value }) => {
      switch (type) {
        case "return":
          save({ ...workers.get(worker), score: value });
          break;
        case "find":
          break;
      }
    });
    worker.on("error", (error) => {
      throw error;
    });
    worker.on("exit", (exitCode) => {
      if (exitCode !== 0) {
        throw new Error(
          `get-optimal-move-service.js exited with non-zero exit code: ${exitCode}`
        );
      }
    });
    workers.set(worker, state);
    if (turns.length === 0) {
      todo.delete(workerTurn);
      const todoTurns = [...todo.keys()];
      maxTurn = todoTurns.length ? Math.max(todoTurns) : -1;
    }
  }
  return;
  const boardStack = [board];
  BigInt(3).toString(64);
  const boardState = Buffer.from()(
    parseBigInt(board.join("")) << (1n + (player === BLACK ? 0n : 1n))
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
