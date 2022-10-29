import { BLACK, EMPTY, SIZE, WHITE } from "./constants";

export const makeNewBoard = () => {
  const board = new Uint8Array(SIZE * SIZE);
  board.fill(EMPTY);
  setValue(board, 2, 2, WHITE);
  setValue(board, 3, 3, WHITE);
  setValue(board, 3, 2, BLACK);
  setValue(board, 2, 3, BLACK);
  return board;
};

export const copy = (board) => new Uint8Array(board);

export const getBoardValue = (board) => (x, y) => board[y * SIZE + x];
export const getValue = (board, x, y) => getBoardValue(board)(x, y);
export const setValue = (board, x, y, value) => (board[y * SIZE + x] = value);

export const evaluate = (board) =>
  board.reduce(
    (sum, player) => sum + (player === BLACK ? -1 : player === WHITE ? 1 : 0),
    0
  );

export const evaluateForGood = (board) =>
  board.reduce((sum, player, index) => {
    let factor;
    if (
      index === 0 ||
      index === SIZE - 1 ||
      index === SIZE * (SIZE - 1) ||
      index === SIZE * SIZE - 1
    ) {
      factor = 6;
    } else if (
      (index > 0 && index < SIZE - 1) ||
      index % SIZE === 0 ||
      index % SIZE === SIZE - 1 ||
      index > SIZE * (SIZE - 1)
    ) {
      factor = 3;
    } else {
      factor = 1;
    }

    return sum + (player === BLACK ? -1 : player === WHITE ? 1 : 0) * factor;
  }, 0);
