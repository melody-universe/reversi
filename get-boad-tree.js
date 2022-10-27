import { BLACK, WHITE } from "./constants";
import { getValidMoves } from "./get-valid-moves";

const getBoardTree = (board, player, skippedLastTurn) => {
  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return {
        board,
        score: board.reduce(
          (sum, player) =>
            sum + (player === BLACK ? -1 : player === WHITE ? 1 : 0),
          0
        ),
      };
    } else {
      return getBoardTree(board, player === BLACK ? WHITE : BLACK, true);
    }
  }
  return {
    board,
    player,
    moves: [...validMoves.keys()].reduce(
      (moves, move) => ({
        ...moves,
        [move]: getBoardTree(
          validMoves.get(move),
          player === BLACK ? WHITE : BLACK
        ),
      }),
      {}
    ),
  };
};
export default getBoardTree;
