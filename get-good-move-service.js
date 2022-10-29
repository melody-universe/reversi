import { workerData, parentPort } from "worker_threads";
import getGoodMove from "./get-good-move";

parentPort.postMessage({
  type: "move",
  value: await getGoodMove(...workerData),
});
