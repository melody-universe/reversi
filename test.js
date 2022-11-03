import { Collection } from "mongodb";
import connect, { client, database } from "./cache/connect";
import { SIZE } from "./constants";
import rotateMatrix from "./math/rotate-matrix";
import stateToRotatedByteArray from "./math/state-to-rotated-byte-array";

const randomState = {
  board: Array.from({ length: SIZE * SIZE }).map(() =>
    Math.floor(Math.random() * 3)
  ),
  player: Math.floor(Math.random() * 2),
};
console.log(
  Array.from({ length: 4 }).map((_, i) =>
    stateToRotatedByteArray({
      ...randomState,
      board: rotateMatrix(randomState.board, i),
    })
  )
);

function testRotateMatrix() {
  const valueLength = Math.ceil(Math.log10(SIZE * SIZE + 1));
  const matrix = Array.from({ length: SIZE * SIZE }, (_, i) => i + 1);
  for (let i = 0; i < 4; i++) {
    if (i > 0) {
      console.log("");
    }
    drawMatrix(rotateMatrix(matrix, i), valueLength);
  }
}

function drawMatrix(matrix, valueLength = 1) {
  for (let y = 0; y < SIZE; y++) {
    console.log(
      `| ${matrix
        .slice(y * SIZE, y * SIZE + SIZE)
        .map((i) => `${i}`.padStart(valueLength))
        .join(", ")} |`
    );
  }
}

async function writeAllCollections() {
  await connect();
  /** @type {Collection[]} */
  const collections = await database.collections();
  for (const collection of collections) {
    console.log(`Collection: ${collection.collectionName}`);
  }
  client.close();
}
