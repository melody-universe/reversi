import { BLACK, EMPTY, SIZE, WHITE } from "./constants";
import { getBoardValue } from "./board";

// prettier-ignore
const DIRECTIONS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export const hasValidMoves = (board, player) => {
  const getValue = getBoardValue(board);
  const opponent = player === WHITE ? BLACK : WHITE;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (getValue(x, y) !== EMPTY) {
        continue;
      }
      directionLoop: for (const direction of DIRECTIONS) {
        const [xDirection, yDirection] = direction;
        const [xBound, yBound] = direction.map((dir) =>
          dir > 0 ? SIZE - 1 : 0
        );
        if (
          (xDirection === 0 ||
            x * xDirection < (xBound - xDirection) * xDirection) &&
          (yDirection === 0 ||
            y * yDirection < (yBound - yDirection) * yDirection) &&
          getValue(x + xDirection, y + yDirection) === opponent
        ) {
          let isValid = false;
          for (
            let i = 2;
            (xDirection === 0 ||
              (x + i * xDirection) * xDirection <= xBound * xDirection) &&
            (yDirection === 0 ||
              (y + i * yDirection) * yDirection <= yBound * yDirection);
            i++
          ) {
            switch (getValue(x + i * xDirection, y + i * yDirection)) {
              case player:
                return true;
              case EMPTY:
                continue directionLoop;
            }
          }
        }
      }
    }
  }
  return false;
};
