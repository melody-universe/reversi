import { BLACK, SIZE } from "../constants";
import bigIntToByteArray from "./big-int-to-byte-array";
import parseBigInt from "./parse-big-int";

const STATE_SIZE = bigIntToByteArray(
  parseBigInt(new Uint8Array(SIZE * SIZE).fill(BLACK)) << 1n
).length;

const stateToByteArray = ({ board, player }) => {
  const boardBigInt = parseBigInt(board.join(""));
  const boardWithPlayerBigInt = (boardBigInt << 1n) + BigInt(player - 1);
  const unpaddedArray = bigIntToByteArray(boardWithPlayerBigInt);
  const paddedArray = new Uint8Array(STATE_SIZE);
  paddedArray.set(unpaddedArray, STATE_SIZE - unpaddedArray.length);
  return paddedArray;
};
export default stateToByteArray;
