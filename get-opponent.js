import { BLACK, WHITE } from "./constants";

const getOpponent = (player) => (player === BLACK ? WHITE : BLACK);
export default getOpponent;
