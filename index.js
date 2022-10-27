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
    `${PLAYER_NAMES[currentPlayer]}'s turn. Valid moves: ${[
      ...validMoves.keys(),
    ]
      .map(JSON.parse)
      .map((move) => `(${move[0]}, ${move[1]})`)
      .join(", ")}`
  );

  console.log("Assuming black plays (2, 1)...");
  board = validMoves.get(JSON.stringify([2, 1]));
  drawBoard(board);
  currentPlayer = WHITE;
  validMoves = getValidMoves(board, WHITE);
  console.log(
    `${PLAYER_NAMES[currentPlayer]}'s turn. Valid moves: ${[
      ...validMoves.keys(),
    ]
      .map(JSON.parse)
      .map((move) => `(${move[0]}, ${move[1]})`)
      .join(", ")}`
  );
};

playGame();
