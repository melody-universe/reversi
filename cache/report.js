import { collections } from "./setup";

const report = async () => {
  const turns = [...collections.keys()];
  turns.sort((a, b) => a - b);
  const counts = await Promise.all(
    turns.map((turn) => collections.get(turn).countDocuments())
  );
  turns.forEach((turn, index) => console.log(`${turn}: ${counts[index]}`));
};
export default report;
