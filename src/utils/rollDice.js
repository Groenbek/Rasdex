function getCryptoRandomByte() {
  if (
    typeof crypto === "undefined" ||
    typeof crypto.getRandomValues !== "function"
  ) {
    return null;
  }

  const values = new Uint8Array(1);
  crypto.getRandomValues(values);
  return values[0];
}

function rollOneDie() {
  let randomByte = getCryptoRandomByte();

  while (randomByte !== null) {
    if (randomByte < 252) {
      return (randomByte % 6) + 1;
    }

    randomByte = getCryptoRandomByte();
  }

  return Math.floor(Math.random() * 6) + 1;
}

export function rollDice(count) {
  return Array.from({ length: count }, rollOneDie);
}
