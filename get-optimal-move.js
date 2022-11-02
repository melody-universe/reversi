import { Worker } from "worker_threads";
import { CACHE_TURN_FREQUENCY, MAX_THREAD_COUNT, SIZE } from "./constants";
import stateToByteArray from "./math/state-to-byte-array";
import setup, { collections } from "./cache/setup";
import report from "./cache/report";
import byteArrayToState from "./math/byte-array-to-state";

const getOptimalMove = async (board, turn, player) => {
  await setup();
  if (collections.has(turn)) {
    const turnCollection = collections.get(turn);
    const stateHash = stateToByteArray({ board, player });
    const returnValue = await turnCollection.findOne({ state: stateHash });
    if (returnValue) {
      return returnValue;
    }
  }

  let maxTurn =
    Math.floor((SIZE * SIZE - 5) / CACHE_TURN_FREQUENCY) * CACHE_TURN_FREQUENCY;
  const workers = new Map();
  let returnValue;
  const mainTurn = turn;

  const reportInterval = setInterval(async () => {
    console.log(performance.now());
    await report();
    console.log(`${workers.size} workers`);
  }, 5000);

  if (
    !(
      await Promise.all(
        [...collections.values()].map((collection) =>
          collection.findOne({ score: { $exists: false } })
        )
      )
    ).some((i) => i)
  ) {
    queueWorker(turn, board, player);
  }

  while (returnValue === undefined && maxTurn > 0) {
    if (workers.size < MAX_THREAD_COUNT) {
      let workersToQueue = MAX_THREAD_COUNT - workers.size;
      while (workersToQueue > 0 && collections.has(maxTurn)) {
        const collection = collections.get(maxTurn);
        let queuedWorkers = 0;
        await collection
          .find({ score: { $exists: false } })
          .limit(workersToQueue)
          .forEach(({ state: stateHash }) => {
            const { board, player } = byteArrayToState(stateHash.buffer);
            queueWorker(maxTurn, board, player);
            queuedWorkers++;
          });
        workersToQueue -= queuedWorkers;
        if (workersToQueue > 0) {
          maxTurn -= CACHE_TURN_FREQUENCY;
        }
      }
    }
    while (workers.size > 0) {
      await new Promise((resolve) => setTimeout(resolve));
    }
    maxTurn =
      Math.floor((SIZE * SIZE - 5) / CACHE_TURN_FREQUENCY) *
      CACHE_TURN_FREQUENCY;
    while (
      maxTurn > 0 &&
      !(await collections.get(maxTurn).findOne({ score: { $exists: false } }))
    ) {
      maxTurn -= CACHE_TURN_FREQUENCY;
    }
  }

  function queueWorker(turn, board, player) {
    const workerTurn = maxTurn;
    const worker = new Worker("./get-optimal-move-service.js", {
      workerData: {
        turn: workerTurn,
        board,
        player,
        postReturnValue: workerTurn === mainTurn,
      },
    });
    worker.on("message", async (message) => {
      returnValue = { turn, ...message };
    });
    worker.on("error", (error) => {
      throw error;
    });
    worker.on("exit", async (exitCode) => {
      if (exitCode !== 0) {
        throw new Error(
          `get-optimal-move-service.js exited with non-zero exit code: ${exitCode}`
        );
      }
      let queuedWorker = false;
      while (maxTurn > 0 && !queuedWorker) {
        const collection = collections.get(maxTurn);
        const lockedMaxTurn = maxTurn;
        const stateHash = await collection.findOne({
          score: { $exists: false },
        })?.state;
        if (stateHash) {
          const { board, player } = byteArrayToState(stateHash);
          queueWorker(lockedMaxTurn, board, player);
          queuedWorker = true;
        } else {
          maxTurn = lockedMaxTurn - CACHE_TURN_FREQUENCY;
        }
      }
      workers.delete(worker);
    });
    workers.set(worker, { turn, board, player });
  }
  clearInterval(reportInterval);
  await report();
  console.log(returnValue);
  return returnValue;
};
export default getOptimalMove;
