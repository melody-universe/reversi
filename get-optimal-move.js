import { BLACK, WHITE } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";

const PLAYER_DIRECTIONS = { [BLACK]: -1, [WHITE]: 1 };

const getOptimalMove = (board, player, skippedLastTurn) => {
  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return {
        score: evaluate(board),
      };
    } else {
      return getOptimalMove(board, getOpponent(player), true);
    }
  }
  const direction = PLAYER_DIRECTIONS[player];
  const opponent = getOpponent(player);
  const moveKeys = [...validMoves.keys()];
  return moveKeys.slice(1).reduce(
    ({ move: bestMove, score: bestScore }, move) => {
      const score = getOptimalMove(validMoves.get(move), opponent).score;
      return score * direction > bestScore * direction
        ? {
            move,
            score,
          }
        : { move: bestMove, score: bestScore };
    },
    {
      move: moveKeys[0],
      score: getOptimalMove(validMoves.get(moveKeys[0]), opponent).score,
    }
  );
};
export default getOptimalMove;

const evaluate = (board) =>
  board.reduce(
    (sum, player) => sum + (player === BLACK ? -1 : player === WHITE ? 1 : 0),
    0
  );
