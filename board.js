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
