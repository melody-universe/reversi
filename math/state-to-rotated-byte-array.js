import rotateMatrix from "./rotate-matrix";
import stateToByteArray from "./state-to-byte-array";

const stateToRotatedByteArray = ({ board, player }) =>
  Array.from({ length: 4 })
    .map((_, rotations) => ({
      byteArray: stateToByteArray({
        board: rotateMatrix(board, rotations),
        player,
      }),
      rotations,
    }))
    .reduce((previous, current) =>
      current.byteArray < previous.byteArray ? current : previous
    );
export default stateToRotatedByteArray;
