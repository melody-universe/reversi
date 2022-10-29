import { evaluate, evaluateForGood } from "./board";
import { BLACK, PLAYER_NAMES, WHITE } from "./constants";
import getOpponent from "./get-opponent";
import { getValidMoves } from "./get-valid-moves";

const PLAYER_DIRECTIONS = { [BLACK]: -1, [WHITE]: 1 };

const getGoodMove = (
  initDepth,
  board,
  player,
  depth = initDepth,
  skippedLastTurn
) => {
  if (depth === 0) {
    return { score: evaluateForGood(board) };
  }

  const validMoves = getValidMoves(board, player);
  if (validMoves.size === 0) {
    if (skippedLastTurn) {
      return {
        score: evaluate(board) * 100,
      };
    } else {
      return getGoodMove(initDepth, board, getOpponent(player), depth, true);
    }
  }

  const direction = PLAYER_DIRECTIONS[player];
  const opponent = getOpponent(player);
  const moveKeys = [...validMoves.keys()];
  const results = moveKeys.map((move) => ({
    ...getGoodMove(initDepth, validMoves.get(move), opponent, depth - 1),
    move,
  }));
  let best = null;
  for (const goodMove of results) {
    if (depth === initDepth) {
      console.log(
        `${PLAYER_NAMES[player]}: ${goodMove.move} (score: ${goodMove.score})`
      );
    }
    if (best === null) {
      best = goodMove;
      continue;
    }
    if (goodMove.score * direction > best.score * direction) {
      best = goodMove;
    }
  }
  return best;
};
export default getGoodMove;
