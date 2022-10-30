import { LEAF_SIZE_IN_BYTES, SCORE_SIZE_IN_BITS } from "../cache/constants";
import { SIZE } from "../constants";
import bigIntToByteArray from "./big-int-to-byte-array";
import parseBigInt from "./parse-big-int";

const leafToByteArray = ({ board, player, score }) => {
  const boardBigInt = parseBigInt(board.join(""));
  const boardWithPlayerBigInt = (boardBigInt << 1n) + BigInt(player - 1);
  const unpaddedArray = bigIntToByteArray(
    (boardWithPlayerBigInt << BigInt(SCORE_SIZE_IN_BITS)) +
      BigInt(score + SIZE * SIZE)
  );
  console.log(unpaddedArray);
  const paddedArray = new Uint8Array(LEAF_SIZE_IN_BYTES);
  paddedArray.set(unpaddedArray, LEAF_SIZE_IN_BYTES - unpaddedArray.length);
  return paddedArray;
};
export default leafToByteArray;
