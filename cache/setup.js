import { appendFile, mkdir, open, stat, truncate } from "fs/promises";
import { join } from "path";
import { CACHE_TURN_FREQUENCY, SIZE } from "../constants";
import { LEAF_SIZE_IN_BYTES } from "./constants";
import getDirName from "./get-dir-name";
import { saveQueue, stopSaving } from "./save";

export const cacheFolder = join(
  getDirName(import.meta.url),
  "..",
  "data",
  `size-${SIZE}`
);

const setup = async () => {
  await mkdir(cacheFolder, { recursive: true });
  const filePromises = [];
  for (
    let i = CACHE_TURN_FREQUENCY;
    i < SIZE * SIZE - 5;
    i += CACHE_TURN_FREQUENCY
  ) {
    saveQueue.set(i, []);
    filePromises.push(
      (async () => {
        const fileName = join(cacheFolder, `${i}`);
        await appendFile(fileName, "").catch(null);
        const totalSize = (await stat(fileName)).size;
        if (totalSize % LEAF_SIZE_IN_BYTES === 0) {
          return;
        }
        await truncate(
          fileName,
          Math.floor(totalSize / LEAF_SIZE_IN_BYTES) * LEAF_SIZE_IN_BYTES
        );
      })()
    );
  }
  await Promise.all(filePromises);
};
export default setup;
