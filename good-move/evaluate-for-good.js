import { BLACK, SIZE, WHITE } from "../constants";


export const evaluateForGood = (board) => board.reduce((sum, player, index) => {
  let factor;
  if (index === 0 ||
    index === SIZE - 1 ||
    index === SIZE * (SIZE - 1) ||
    index === SIZE * SIZE - 1) {
    factor = 6;
  } else if ((index > 0 && index < SIZE - 1) ||
    index % SIZE === 0 ||
    index % SIZE === SIZE - 1 ||
    index > SIZE * (SIZE - 1)) {
    factor = 3;
  } else {
    factor = 1;
  }

  return sum + (player === BLACK ? -1 : player === WHITE ? 1 : 0) * factor;
}, 0);
