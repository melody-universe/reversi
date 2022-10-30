import { appendFile } from "fs/promises";
import leafToByteArray from "../math/leaf-to-byte-array";
import { cacheFolder } from "./setup";

export const saveQueue = new Map();
const save = async (turn, leaf) => {
  const fileName = join(cacheFolder, `${turn}`);
  await appendFile(fileName, leafToByteArray(leaf));
};
export default save;

const savingIntervals = [];
export const startSaving = (turn) => {};

export const stopSaving = () => {
  if (savingIntervals.length > 0) {
    for (const interval of savingIntervals) {
      clearInterval(interval);
    }
  }
};
