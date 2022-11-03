import { SIZE } from "../constants";

const MID =
  (SIZE & 1) === 1
    ? Math.floor(SIZE / 2) * SIZE + Math.floor(SIZE / 2)
    : undefined;

const rotateMatrix = (matrix, times = 1) => {
  const modTimes = times & 3;
  if (modTimes === 0) {
    return matrix;
  }

  const newMatrix = new Array(matrix.length);

  for (let y = 0; y < Math.ceil(SIZE / 2); y++) {
    for (let x = 0; x < Math.floor(SIZE / 2); x++) {
      switch (modTimes) {
        case 1:
          newMatrix[(SIZE - 1 - x) * SIZE + y] =
            matrix[(SIZE - y) * SIZE - 1 - x];
          newMatrix[(SIZE - y) * SIZE - 1 - x] = matrix[(x + 1) * SIZE - 1 - y];
          newMatrix[(x + 1) * SIZE - 1 - y] = matrix[y * SIZE + x];
          newMatrix[y * SIZE + x] = matrix[(SIZE - 1 - x) * SIZE + y];
          break;
        case 2:
          newMatrix[(SIZE - 1 - x) * SIZE + y] = matrix[(x + 1) * SIZE - 1 - y];
          newMatrix[(SIZE - y) * SIZE - 1 - x] = matrix[y * SIZE + x];
          newMatrix[(x + 1) * SIZE - 1 - y] = matrix[(SIZE - 1 - x) * SIZE + y];
          newMatrix[y * SIZE + x] = matrix[(SIZE - y) * SIZE - 1 - x];
          break;
        case 3:
          newMatrix[(SIZE - 1 - x) * SIZE + y] = matrix[y * SIZE + x];
          newMatrix[(SIZE - y) * SIZE - 1 - x] =
            matrix[(SIZE - 1 - x) * SIZE + y];
          newMatrix[(x + 1) * SIZE - 1 - y] = matrix[(SIZE - y) * SIZE - 1 - x];
          newMatrix[y * SIZE + x] = matrix[(x + 1) * SIZE - 1 - y];
          break;
      }
    }
  }

  if (MID !== undefined) {
    newMatrix[MID] = matrix[MID];
  }

  return newMatrix;
};
export default rotateMatrix;
