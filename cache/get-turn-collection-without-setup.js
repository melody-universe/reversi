import { SIZE } from "../constants";
import connect, { client } from "./connect";

const getTurnCollectionWithoutSetup = async (turn) => {
  await connect();
  const database = client.db(`reversi-${SIZE}`);
  return database.collection(`turn-${turn}`);
};
export default getTurnCollectionWithoutSetup;
