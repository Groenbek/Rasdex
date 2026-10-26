export const rouletteNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
  10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const redNumbers = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export const rouletteSegmentAngle = 360 / rouletteNumbers.length;

export function getRouletteColor(number) {
  if (number === 0) {
    return "green";
  }

  return redNumbers.has(number) ? "red" : "black";
}

function getCryptoRandomByte(cryptoSource) {
  if (!cryptoSource || typeof cryptoSource.getRandomValues !== "function") {
    return null;
  }

  const values = new Uint8Array(1);
  cryptoSource.getRandomValues(values);
  return values[0];
}

export function pickRouletteIndex(
  random = Math.random,
  cryptoSource = globalThis.crypto,
) {
  let randomByte = getCryptoRandomByte(cryptoSource);

  while (randomByte !== null) {
    if (randomByte < 222) {
      return randomByte % rouletteNumbers.length;
    }

    randomByte = getCryptoRandomByte(cryptoSource);
  }

  return Math.floor(random() * rouletteNumbers.length);
}

export function getWheelRotation(currentRotation, targetIndex, turns = 6) {
  const currentAngle = ((currentRotation % 360) + 360) % 360;
  const targetAngle = (360 - targetIndex * rouletteSegmentAngle) % 360;
  const alignment = (targetAngle - currentAngle + 360) % 360;

  return currentRotation + turns * 360 + alignment;
}
