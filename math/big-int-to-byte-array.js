const selector = (1n << 8n) - 1n;

const bigIntToByteArray = (bigInt) => {
  const byteCount = Math.ceil(bigInt.toString(2).length / 8);
  const array = new Uint8Array(byteCount);
  for (let i = byteCount - 1; i >= 0; i--) {
    array[i] = Number(bigInt & selector);
    bigInt = bigInt >> 8n;
  }
  return array;
};
export default bigIntToByteArray;
