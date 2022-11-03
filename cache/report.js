import { EOL } from "os";
import { CACHE_TURNS } from "../constants";
import { collection } from "./setup";

const report = async () => {
  const counts = await Promise.all(
    CACHE_TURNS.map((turn) =>
      Promise.all([
        collection.countDocuments({
          turn: { $eq: turn },
          score: { $exists: true },
        }),
        collection.countDocuments({
          turn: { $eq: turn },
        }),
      ])
    )
  );
  const largestNumber = Math.max(...counts.map(([_, num]) => num));
  const largestNumberLength = Math.ceil(Math.log10(largestNumber + 1));
  const decimals = Math.max(largestNumberLength - 5, 0);
  return CACHE_TURNS.map((turn, i) => {
    const calculated = counts[i][0];
    const total = counts[i][1];
    return `${turn}: ${calculated
      .toString()
      .padStart(largestNumberLength)} / ${total
      .toString()
      .padEnd(largestNumberLength)} (${((calculated / total) * 100)
      .toFixed(decimals)
      .padStart(decimals + (decimals === 0 ? 3 : 4))}%)`;
  }).join(EOL);
};
export default report;
