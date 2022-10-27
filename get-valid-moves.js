import { BLACK, EMPTY, SIZE, WHITE } from "./constants";
import { copy, getBoardValue, setValue } from "./board";

// prettier-ignore
const DIRECTIONS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export const getValidMoves = (board, player) => {
  const getValue = getBoardValue(board);
  const validMoves = new Map();
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
          const swappedTiles = [
            [x, y],
            [x + xDirection, y + yDirection],
          ];
          let isValid = false;
          swappedTilesLoop: for (
            let i = 2;
            (xDirection === 0 ||
              (x + i * xDirection) * xDirection <= xBound * xDirection) &&
            (yDirection === 0 ||
              (y + i * yDirection) * yDirection <= yBound * yDirection);
            i++
          ) {
            switch (getValue(x + i * xDirection, y + i * yDirection)) {
              case player:
                isValid = true;
                break swappedTilesLoop;
              case EMPTY:
                continue directionLoop;
              case opponent:
                swappedTiles.push([x + i * xDirection, y + i * yDirection]);
            }
          }
          if (isValid) {
            const key = JSON.stringify([x, y]);
            const moveBoard = validMoves.has(key)
              ? validMoves.get(key)
              : copy(board);
            swappedTiles.forEach(([x, y]) => setValue(moveBoard, x, y, player));
            if (!validMoves.has(key)) {
              validMoves.set(key, moveBoard);
            }
          }
        }
      }
    }
  }
  return validMoves;
};
