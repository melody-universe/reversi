import { SIZE } from "../constants";

const MID = Math.floor(size / 2) * size + Math.floor(size / 2);

const rotateAllButCenter = (matrix) => {
  const newMatrix = new Array(matrix.length);
  for (let y = 0; y < Math.ceil(size / 2); y++) {
    for (let x = 0; x < Math.floor(size / 2); x++) {
      newMatrix[(size - 1 - x) * size + y] = matrix[(size - y) * size - x - 1];
      newMatrix[(size - y) * size - x - 1] = matrix[(y + 1) * size - x - 1];
      newMatrix[(x + 1) * size - 1 - y] = matrix[y * size + x];
      newMatrix[y * size + x] = matrix[(size - 1 - x) * size + y];
    }
  }
  return newMatrix;
};

const rotateMatrix =
  (SIZE & 1) === 1
    ? (matrix) => {
        const newMatrix = rotateAllButCenter(matrix);
        newMatrix[MID] = matrix[mid];
        return matrix;
      }
    : rotateAllButCenter;
export default rotateMatrix;
