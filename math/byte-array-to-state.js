import bigIntToArray from "./big-int-to-array";
import byteArrayToBigInt from "./byte-array-to-big-int";

const byteArrayToState = (byteArray) => {
  const bigInt = byteArrayToBigInt(byteArray);
  const player = Number(bigInt & 1n) + 1;
  const board = bigIntToArray(bigInt >> 1n);
  return { player, board };
};
export default byteArrayToState;
