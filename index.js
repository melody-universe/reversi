import { makeNewBoard } from "./board";
import { BLACK, PLAYER_NAMES, WHITE } from "./constants";
import drawBoard from "./draw-board";
import getGoodMove from "./good-move/get-good-move";
import getOptimalMove from "./get-optimal-move";
import { getValidMoves } from "./get-valid-moves";
import prompt from "./prompt";

const playGame = async () => {
  let board = makeNewBoard();
  let currentPlayer = BLACK;
  let turn = 0;
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
      if (move === "best") {
        const optimalMove = await getOptimalMove(board, turn, currentPlayer);
        console.log(
          `Best move: ${optimalMove.move} (score: ${optimalMove.score})`
        );
        continue;
      } else if (move.startsWith("good")) {
        let goodMove;
        if (move === "good") {
          goodMove = await getGoodMove(board, currentPlayer);
        } else {
          const depth = parseInt(move.substring(4).trim());
          goodMove = await getGoodMove(depth, board, currentPlayer);
        }
        console.log(`Good move: ${goodMove.move} (score: ${goodMove.score})`);
      } else {
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
    }
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    board = nextBoard;
    turn++;
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
