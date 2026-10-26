import assert from "node:assert/strict";
import test from "node:test";
import {
  getYatzyScoreSummary,
  scoreYatzyCategory,
  yatzyCategoryIds,
} from "./yatzyScoring.js";

test("defines exactly 18 score categories", () => {
  assert.equal(yatzyCategoryIds.length, 18);
  assert.equal(new Set(yatzyCategoryIds).size, 18);
});

test("scores all upper categories", () => {
  const dice = [1, 2, 3, 4, 5, 6];
  ["ones", "twos", "threes", "fours", "fives", "sixes"].forEach((category, index) => {
    assert.equal(scoreYatzyCategory(category, dice), index + 1);
  });
  assert.equal(scoreYatzyCategory("sixes", [6, 6, 6, 6, 1, 2]), 24);
});

test("scores one, two, and three distinct pairs", () => {
  assert.equal(scoreYatzyCategory("onePair", [2, 2, 5, 5, 6, 1]), 10);
  assert.equal(scoreYatzyCategory("twoPairs", [2, 2, 5, 5, 6, 1]), 14);
  assert.equal(scoreYatzyCategory("threePairs", [2, 2, 5, 5, 6, 6]), 26);
  assert.equal(scoreYatzyCategory("twoPairs", [6, 6, 6, 6, 2, 3]), 0);
});

test("scores groups and requires distinct triplets", () => {
  assert.equal(scoreYatzyCategory("threeKind", [4, 4, 4, 2, 2, 1]), 12);
  assert.equal(scoreYatzyCategory("fourKind", [5, 5, 5, 5, 2, 1]), 20);
  assert.equal(scoreYatzyCategory("twoTriplets", [3, 3, 3, 6, 6, 6]), 27);
  assert.equal(scoreYatzyCategory("twoTriplets", [6, 6, 6, 6, 6, 6]), 0);
});

test("scores straights and royal with an optional sixth die", () => {
  assert.equal(scoreYatzyCategory("smallStraight", [1, 2, 3, 4, 5, 5]), 15);
  assert.equal(scoreYatzyCategory("largeStraight", [2, 2, 3, 4, 5, 6]), 20);
  assert.equal(scoreYatzyCategory("royal", [1, 2, 3, 4, 5, 6]), 30);
  assert.equal(scoreYatzyCategory("royal", [1, 2, 3, 4, 5, 5]), 0);
});

test("scores the highest valid full house, chance, and six-die yatzy", () => {
  assert.equal(scoreYatzyCategory("fullHouse", [6, 6, 6, 5, 5, 2]), 28);
  assert.equal(scoreYatzyCategory("fullHouse", [4, 4, 4, 4, 2, 2]), 16);
  assert.equal(scoreYatzyCategory("fullHouse", [3, 3, 3, 6, 6, 6]), 24);
  assert.equal(scoreYatzyCategory("chance", [1, 2, 3, 4, 5, 6]), 21);
  assert.equal(scoreYatzyCategory("yatzy", [6, 6, 6, 6, 6, 6]), 86);
  assert.equal(scoreYatzyCategory("yatzy", [6, 6, 6, 6, 6, 5]), 0);
});

test("awards the bonus at 84 but not 83 and includes registered zeroes", () => {
  const at84 = { ones: 4, twos: 8, threes: 12, fours: 16, fives: 20, sixes: 24 };
  const at83 = { ...at84, sixes: 23 };
  assert.deepEqual(getYatzyScoreSummary(at84), {
    bonus: 50, bonusStatus: "achieved", complete: false, lowerTotal: 0, total: 134, upperTotal: 84,
  });
  assert.equal(getYatzyScoreSummary(at83).bonus, 0);
  assert.equal(getYatzyScoreSummary({ ones: 0 }).bonusStatus, "pending");
});

test("marks a game complete only when all 18 categories, including zeroes, are registered", () => {
  const scores = Object.fromEntries(yatzyCategoryIds.map((categoryId) => [categoryId, 0]));
  const summary = getYatzyScoreSummary(scores);
  assert.equal(summary.complete, true);
  assert.equal(summary.total, 0);
  assert.equal(summary.bonusStatus, "missed");
});
