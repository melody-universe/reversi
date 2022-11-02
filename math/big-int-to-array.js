const bigIntToArray = (bigInt) =>
  [...bigInt.toString(3)].map((char) => parseInt(char));
export default bigIntToArray;
