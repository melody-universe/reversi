import stateToByteArray from "../math/state-to-byte-array";
import { collections } from "./setup";

const find = (turn, state) => {
  const collection = collections.get(turn);
  return collection.findOne({ state: stateToByteArray(state) });
};
export default find;
