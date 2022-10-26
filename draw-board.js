import { getValue } from "./board";
import { BLACK, EMPTY, SIZE, WHITE } from "./constants";

const CHARACTER_MAP = {
  [EMPTY]: " ",
  [WHITE]: "W",
  [BLACK]: "B",
};

const drawBoard = (board) => {
  drawXAxis();
  for (let y = 0; y < SIZE; y++) {
    if (y > 0) {
      drawGridLine();
    }
    drawRow(y);
  }

  function drawXAxis() {
    let line = "";
    for (let i = 0; i < SIZE; i++) {
      line += ` ${i}`;
    }
    console.log(line);
  }

  function drawGridLine() {
    let line = " ";
    for (let i = 0; i < SIZE * 2 - 1; i++) {
      line += i % 2 === 0 ? "-" : "+";
    }
    console.log(line);
  }

  function drawRow(y) {
    let line = `${y}`;
    for (let x = 0; x < SIZE; x++) {
      if (x > 0) {
        line += "|";
      }
      line += CHARACTER_MAP[getValue(board, x, y)];
    }
    console.log(line);
  }
};
export default drawBoard;
