import { BLACK, SIZE } from "../constants";
import bigIntToByteArray from "../math/big-int-to-byte-array";
import parseBigInt from "../math/parse-big-int";

export const SCORE_SIZE_IN_BITS = Math.floor(Math.log2(SIZE * SIZE * 2)) + 1;
export const LEAF_SIZE_IN_BYTES = bigIntToByteArray(
  (parseBigInt(new Uint8Array(SIZE * SIZE).fill(BLACK)) << 1n) <<
    BigInt(SCORE_SIZE_IN_BITS)
).length;
