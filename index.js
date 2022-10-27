import promptSync from "prompt-sync";
import { makeNewBoard, setValue } from "./board";
import { BLACK, WHITE } from "./constants";
import drawBoard from "./draw-board";
import { getValidMoves } from "./get-valid-moves";

const prompt = promptSync({ sigint: true });

const PLAYER_NAMES = {
  [BLACK]: "Black",
  [WHITE]: "White",
};

const playGame = () => {
  let board = makeNewBoard();
  let currentPlayer = BLACK;
  let gameOver = false;
  let skippedLastTurn = false;
  while (!gameOver) {
    const validMoves = getValidMoves(board, currentPlayer);
    if (validMoves.size === 0) {
      if (skippedLastTurn) {
        gameOver = true;
      } else {
        skippedLastTurn = true;
      }
      currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
      continue;
    } else {
      drawBoard(board);
      skippedLastTurn = false;
    }
    let nextBoard = null;
    while (nextBoard === null) {
      console.log(
        `${PLAYER_NAMES[currentPlayer]}'s turn. Valid moves: ${[
          ...validMoves.keys(),
        ]
          .map(JSON.parse)
          .map((move) => `(${move[0]}, ${move[1]})`)
          .join(", ")}`
      );
      const move = prompt("Move: ");
      try {
        const key = JSON.stringify(JSON.parse(`[${move}]`));
        if (validMoves.has(key)) {
          nextBoard = validMoves.get(key);
        }
      } catch {}
      if (nextBoard === null) {
        console.log("Invalid move.");
      }
    }
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    board = nextBoard;
  }

  drawBoard(board);
  console.log("Game over.");
  console.log("Final scores:");
  const scores = board.reduce(
    (previousTally, value) => ({
      ...previousTally,
      [value]: previousTally[value] + 1,
    }),
    { [BLACK]: 0, [WHITE]: 0 }
  );
  [BLACK, WHITE].forEach((player) =>
    console.log(`${PLAYER_NAMES[player]}: ${scores[player]}`)
  );
  if (scores[BLACK] === scores[WHITE]) {
    console.log("Draw!");
  } else {
    console.log(
      `${PLAYER_NAMES[scores[BLACK] > scores[WHITE] ? BLACK : WHITE]} wins!`
    );
  }
};

playGame();
