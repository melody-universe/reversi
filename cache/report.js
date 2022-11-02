import { collections } from "./setup";

const report = async () => {
  const turns = [...collections.keys()];
  turns.sort((a, b) => a - b);
  const counts = await Promise.all(
    turns.map(async (turn) => {
      const collection = collections.get(turn);
      const [calced, total] = await Promise.all([
        collection.countDocuments({ score: { $exists: true } }),
        collection.countDocuments(),
      ]);
      const report = `${calced.toString().padStart(8)} / ${total
        .toString()
        .padEnd(8)} (${((calced / total) * 100).toFixed(1).padStart(5)}%)`;
      return report;
    })
  );
  return turns.map((turn, index) => ({ turn, count: counts[index] }));
};
export default report;
