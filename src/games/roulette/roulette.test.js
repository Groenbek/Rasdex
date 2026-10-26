import assert from "node:assert/strict";
import test from "node:test";
import { languageOptions, languages } from "../../data/languages.js";
import {
  getRouletteColor,
  getWheelRotation,
  pickRouletteIndex,
  rouletteNumbers,
  rouletteSegmentAngle,
} from "./roulette.js";

test("uses the exact European wheel order with 37 unique pockets", () => {
  const europeanOrder = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
    10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  assert.equal(rouletteNumbers.length, 37);
  assert.equal(new Set(rouletteNumbers).size, 37);
  assert.deepEqual(rouletteNumbers, europeanOrder);
});

test("contains one green, 18 red, and 18 black pockets", () => {
  const officialRedNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  const totals = rouletteNumbers.reduce((colors, number) => {
    const color = getRouletteColor(number);
    colors[color] += 1;
    return colors;
  }, { black: 0, green: 0, red: 0 });

  assert.deepEqual(totals, { black: 18, green: 1, red: 18 });
  assert.deepEqual(
    rouletteNumbers.filter((number) => getRouletteColor(number) === "red").sort((a, b) => a - b),
    officialRedNumbers,
  );
});

test("maps the full random interval evenly to all pocket indexes", () => {
  rouletteNumbers.forEach((_, index) => {
    const midpoint = (index + 0.5) / rouletteNumbers.length;
    assert.equal(pickRouletteIndex(() => midpoint, null), index);
  });
});

test("uses crypto bytes without bias and rejects the uneven remainder", () => {
  const counts = Array.from({ length: rouletteNumbers.length }, () => 0);

  for (let byte = 0; byte < 222; byte += 1) {
    const cryptoSource = {
      getRandomValues(values) {
        values[0] = byte;
      },
    };

    counts[pickRouletteIndex(Math.random, cryptoSource)] += 1;
  }

  assert.ok(counts.every((count) => count === 6));

  const bytes = [255, 221];
  const cryptoSource = {
    getRandomValues(values) {
      values[0] = bytes.shift();
    },
  };

  assert.equal(pickRouletteIndex(Math.random, cryptoSource), 36);
  assert.equal(bytes.length, 0);
});

test("aligns every selected pocket with the ball at the top", () => {
  let rotation = 0;

  rouletteNumbers.forEach((_, index) => {
    rotation = getWheelRotation(rotation, index);
    const pocketAngle = rotation + index * rouletteSegmentAngle;
    const normalized = ((pocketAngle % 360) + 360) % 360;
    assert.ok(normalized < 1e-9 || Math.abs(normalized - 360) < 1e-9);
  });
});

test("provides complete roulette text for every supported language", () => {
  const requiredText = [
    "navTitle", "title", "gameLabel", "wheelLabel", "spinLabel",
    "spin", "spinning", "ready", "result",
  ];

  languageOptions.forEach((language) => {
    const text = languages[language].roulette;
    requiredText.forEach((key) => assert.equal(typeof text[key], "string"));
    assert.deepEqual(Object.keys(text.colors).sort(), ["black", "green", "red"]);
  });
});
