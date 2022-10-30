const byteArrayToBigInt = (array) => {
  let bigInt = BigInt(array[0]);
  for (let i = 1; i < array.length; i++) {
    bigInt = (bigInt << 8n) + BigInt(array[i]);
  }
  return bigInt;
};
export default byteArrayToBigInt;
