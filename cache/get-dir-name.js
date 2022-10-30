import { dirname } from "path";

const getDirName = (url) => dirname(new URL(url).pathname);
export default getDirName;
