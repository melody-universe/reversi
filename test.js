const size = 4;
const digitWidth = Math.ceil(Math.log10(size * size + 1));
const matrix = Array.from({ length: size * size }, (_, i) => i + 1);

drawMatrix(matrix);

console.log("");

const rotated = rotateMatrix(matrix);
drawMatrix(rotated);

function drawMatrix(matrix) {
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push(matrix[y * size + x]);
    }
    console.log(
      `| ${row.map((i) => `${i}`.padStart(digitWidth)).join(", ")} |`
    );
  }
}

function rotateMatrix(matrix) {
  const newMatrix = new Array(matrix.length);
  for (let y = 0; y < Math.ceil(size / 2); y++) {
    for (let x = 0; x < Math.floor(size / 2); x++) {
      newMatrix[(size - 1 - x) * size + y] = matrix[(size - y) * size - x - 1];
      newMatrix[(size - y) * size - x - 1] = matrix[(y + 1) * size - x - 1];
      newMatrix[(x + 1) * size - 1 - y] = matrix[y * size + x];
      newMatrix[y * size + x] = matrix[(size - 1 - x) * size + y];
    }
  }
  if ((size & 1) === 1) {
    const midPoint = Math.floor(size / 2) * size + Math.floor(size / 2);
    newMatrix[midPoint] = matrix[midPoint];
  }
  return newMatrix;
}
