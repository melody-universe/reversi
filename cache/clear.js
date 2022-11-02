import { SIZE } from "../constants";
import connect, { client } from "./connect";

const clear = async () => {
  await connect();
  const database = client.db(`reversi-${SIZE}`);
  const collections = await database.collections();
  await Promise.all(collections.map(async (collection) => collection.drop()));
};
export default clear;
