import { Worker } from "worker_threads";
import { evaluate } from "./board";
import { BLACK, MAX_THREAD_COUNT, SIZE, WHITE } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";
import parseBigInt from "./math/parse-big-int";
import stateToByteArray from "./math/state-to-byte-array";
import setup, { collections } from "./cache/setup";
import report from "./cache/report";

const PLAYER_DIRECTIONS = { [BLACK]: -1, [WHITE]: 1 };

const getOptimalMove = async (board, turn, player) => {
  await setup();
  if (turn > 0 && turn % (SIZE * SIZE) === 0) {
    const turnCollection = collections.get(turn);
    const stateHash = stateToByteArray({ board, player });
    const returnValue = await turnCollection.findOne({ state: stateHash });
    if (returnValue) {
      return returnValue;
    }
  }

  const todo = new Map();
  todo.set(turn, [{ board, player }]);
  let maxTurn = turn;
  const workers = new Map();
  let returnValue;

  const reportInterval = setInterval(async () => {
    await report();
    console.log(`${workers.size} workers`);
  }, 3000);

  queueWorker();

  while (workers.size > 0 || maxTurn >= 0) {
    while (workers.size < MAX_THREAD_COUNT && maxTurn >= 0) {
      queueWorker();
    }
    await new Promise((resolve) => setTimeout(resolve));
  }

  function queueWorker() {
    const workerTurn = maxTurn;
    const states = todo.get(workerTurn);
    const state = states.pop();
    const worker = new Worker("./get-optimal-move-service.js", {
      workerData: { turn: workerTurn, ...state },
    });
    worker.on("message", async (message) => {
      if (Object.getPrototypeOf(message) === Array.prototype) {
        message.forEach(({ turn, ...state }) => {
          addTodo(turn, state);
        });
        addTodo(workerTurn, state);
      } else if (workerTurn === turn) {
        returnValue = { ...turn, ...message };
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
      workers.delete(worker);
      if (maxTurn >= 0) {
        queueWorker();
      }
    });
    workers.set(worker, state);
    if (states.length === 0) {
      todo.delete(workerTurn);
      calculateMaxTurn();
    }

    function addTodo(turn, state) {
      let states = todo.get(turn);
      if (!states) {
        states = [];
        todo.set(turn, states);
        calculateMaxTurn();
      }
      states.push(state);
    }

    function calculateMaxTurn() {
      const todoTurns = [...todo.keys()];
      maxTurn = todoTurns.length ? Math.max(...todoTurns) : -1;
    }
  }
  clearInterval(reportInterval);
  await report();
  console.log(returnValue);
  return returnValue;

  const boardStack = [board];
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
  return best;
};
export default getOptimalMove;
