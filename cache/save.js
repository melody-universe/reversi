import stateToByteArray from "../math/state-to-byte-array";
import { collections } from "./setup";

const save = async (turn, leaf) => {
  const collection = collections.get(turn);
  const { score, ...state } = leaf;
  const stateBytes = stateToByteArray(state);
  await collection.updateOne(
    { state: stateBytes },
    { score },
    { upsert: true }
  );
};
export default save;
