import { BLACK, EMPTY, SIZE, WHITE } from "./constants";

export const makeNewBoard = () => {
  const board = new Uint8Array(SIZE * SIZE);
  board.fill(EMPTY);
  const lowerHalf = SIZE / 2 - 1;
  const upperHalf = SIZE / 2;
  setValue(board, lowerHalf, lowerHalf, WHITE);
  setValue(board, upperHalf, upperHalf, WHITE);
  setValue(board, upperHalf, lowerHalf, BLACK);
  setValue(board, lowerHalf, upperHalf, BLACK);
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
