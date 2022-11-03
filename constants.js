export const EMPTY = 0;
export const WHITE = 1;
export const BLACK = 2;
export const SIZE = 6;
export const CACHE_TURN_FREQUENCY = 8;
export const CACHE_TURNS = (() => {
  const cacheTurns = [];
  for (
    let i = CACHE_TURN_FREQUENCY;
    i < SIZE * SIZE - 4;
    i += CACHE_TURN_FREQUENCY
  ) {
    cacheTurns.push(i);
  }
  return cacheTurns;
})();

export const PLAYER_NAMES = {
  [BLACK]: "Black",
  [WHITE]: "White",
};
export const PLAYER_DIRECTIONS = { [BLACK]: -1, [WHITE]: 1 };
export const MAX_THREAD_COUNT = 100;
