const alphabet = "012";
const parseBigInt = (string) =>
  [...string].reduce(
    (acc, digit) => acc * 3n + BigInt(alphabet.indexOf(digit)),
    0n
  );
export default parseBigInt;
