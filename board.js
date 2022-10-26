import { BLACK, EMPTY, SIZE, WHITE } from "./constants";

export const makeNewBoard = () => {
  const board = new Uint8Array(SIZE * SIZE);
  board.fill(EMPTY);
  setValue(board, 2, 2, WHITE);
  setValue(board, 3, 3, WHITE);
  setValue(board, 3, 2, BLACK);
  setValue(board, 2, 3, BLACK);
  return board;
};

export const getValidMoves = (board, player) => {
  const getValue = getBoardValue(board);
  const validMoves = [];
  const opponent = player === WHITE ? BLACK : WHITE;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (getValue(x, y) !== EMPTY) {
        continue;
      }
      if (x > 1) {
        if (y > 1 && getValue(x - 1, y - 1) === opponent) {
          checkUpLeftValidity(x, y);
        }
        if (getValue(x - 1, y) === opponent) {
          checkLeftValidity(x, y);
        }
        if (y < SIZE - 2 && getValue(x - 1, y + 1) === opponent) {
          checkDownLeftValidity(x, y);
        }
      }
      if (y > 1) {
        if (getValue(x, y - 1) === opponent) {
          checkUpValidity(y, x);
        }
        if (x < SIZE - 2 && getValue(x + 1, y - 1) === opponent) {
          checkUpRightValidity(x, y);
        }
      }
      if (x < SIZE - 2) {
        if (getValue(x + 1, y) === opponent) {
          checkRightValidity(x, y);
        }
        if (y < SIZE - 2 && getValue(x + 1, y + 1) === opponent) {
          checkDownRightValidity(x, y);
        }
      }
      if (y < SIZE - 2 && getValue(x, y + 1) === opponent) {
        let isValid = false;
        let isInvalid = false;
        for (let i = 2; y + i < SIZE; i++) {
          switch (getValue(x, y + i)) {
            case player:
              isValid = true;
              break;
            case EMPTY:
              isInvalid = true;
              break;
          }
          if (isValid) {
            validMoves.push([x, y]);
            break;
          } else if (isInvalid) {
            break;
          }
        }
      }
    }
  }
  return validMoves;

  function checkUpLeftValidity(x, y) {
    let isValid = false;
    let isInvalid = false;
    for (let i = 2; x >= i && y >= i; i++) {
      switch (getValue(x - i, y - i)) {
        case player:
          isValid = true;
          break;
        case EMPTY:
          isInvalid = true;
          break;
      }
      if (isValid) {
        validMoves.push([x, y]);
        break;
      } else if (isInvalid) {
        break;
      }
    }
  }

  function checkLeftValidity(x, y) {
    let isValid = false;
    let isInvalid = false;
    for (let i = 2; x >= i; i++) {
      switch (getValue(x - i, y)) {
        case player:
          isValid = true;
          break;
        case EMPTY:
          isInvalid = true;
          break;
      }
      if (isValid) {
        validMoves.push([x, y]);
        break;
      } else if (isInvalid) {
        break;
      }
    }
  }

  function checkDownLeftValidity(x, y) {
    let isValid = false;
    let isInvalid = false;
    for (let i = 2; x >= i && y + i < SIZE; i++) {
      switch (getValue(x - i, y + i)) {
        case player:
          isValid = true;
          break;
        case EMPTY:
          isInvalid = true;
          break;
      }
      if (isValid) {
        validMoves.push([x, y]);
        break;
      } else if (isInvalid) {
        break;
      }
    }
  }

  function checkUpValidity(y, x) {
    let isValid = false;
    let isInvalid = false;
    for (let i = 2; y >= i; i++) {
      switch (getValue(x, y - i)) {
        case player:
          isValid = true;
          break;
        case EMPTY:
          isInvalid = true;
          break;
      }
      if (isValid) {
        validMoves.push([x, y]);
        break;
      } else if (isInvalid) {
        break;
      }
    }
  }

  function checkUpRightValidity(x, y) {
    let isValid = false;
    let isInvalid = false;
    for (let i = 2; x + i < SIZE && y >= i; i++) {
      switch (getValue(x + i, y - i)) {
        case player:
          isValid = true;
          break;
        case EMPTY:
          isInvalid = true;
          break;
      }
      if (isValid) {
        validMoves.push([x, y]);
        break;
      } else if (isInvalid) {
        break;
      }
    }
  }

  function checkRightValidity(x, y) {
    let isValid = false;
    let isInvalid = false;
    for (let i = 2; x + i < SIZE; i++) {
      switch (getValue(x + i, y)) {
        case player:
          isValid = true;
          break;
        case EMPTY:
          isInvalid = true;
          break;
      }
      if (isValid) {
        validMoves.push([x, y]);
        break;
      } else if (isInvalid) {
        break;
      }
    }
  }

  function checkDownRightValidity(x, y) {
    let isValid = false;
    let isInvalid = false;
    for (let i = 2; x + i < SIZE && y + i < SIZE; i++) {
      switch (getValue(x + i, y + i)) {
        case player:
          isValid = true;
          break;
        case EMPTY:
          isInvalid = true;
          break;
      }
      if (isValid) {
        validMoves.push([x, y]);
        break;
      } else if (isInvalid) {
        break;
      }
    }
  }
};

const getBoardValue = (board) => (x, y) => board[y * SIZE + x];
export const getValue = (board, x, y) => getBoardValue(board)(x, y);
export const setValue = (board, x, y, value) => (board[y * SIZE + x] = value);