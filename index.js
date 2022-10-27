import { makeNewBoard, setValue } from "./board";
import { BLACK, WHITE } from "./constants";
import drawBoard from "./draw-board";
import { getValidMoves } from "./get-valid-moves";

const PLAYER_NAMES = {
  [BLACK]: "Black",
  [WHITE]: "White",
};

const playGame = () => {
  let board = makeNewBoard();
  drawBoard(board);
  let currentPlayer = BLACK;
  let validMoves = getValidMoves(board, BLACK);
  console.log(
    `${PLAYER_NAMES[currentPlayer]}'s turn. Valid moves: ${validMoves
      .map((move) => `(${move[0]}, ${move[1]})`)
      .join(", ")}`
  );

  console.log("Assumimg black plays (2, 1)...");
  setValue(board, 2, 1, BLACK);
  setValue(board, 2, 2, BLACK);
  drawBoard(board);
  currentPlayer = WHITE;
  validMoves = getValidMoves(board, WHITE);
  console.log(
    `${PLAYER_NAMES[currentPlayer]}'s turn. Valid moves: ${validMoves
      .map((move) => `(${move[0]}, ${move[1]})`)
      .join(", ")}`
  );
};

playGame();
