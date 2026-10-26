import assert from "node:assert/strict";
import test from "node:test";
import { languageOptions, languages } from "../../data/languages.js";
import { yatzyCategoryIds } from "./yatzyScoring.js";

test("all supported languages provide complete Yatzy text and categories", () => {
  const requiredStrings = [
    "navTitle", "title", "gameLabel", "playerName", "total", "digitalDice",
    "physicalDice", "rolling", "allLocked", "scorecard", "upperSection",
    "lowerSection", "bonus", "totalScore", "selectCategory", "confirmScore",
    "cancel", "confirm", "undo", "resetGame", "newGame", "rulesTitle",
  ];
  const requiredFunctions = [
    "rollsLeft", "rollButton", "lockDieLabel", "unlockDieLabel",
    "physicalDieLabel", "scoreConfirm", "selectCategoryLabel",
    "editCategoryLabel", "editConfirm", "finalScore", "turnComplete",
  ];

  languageOptions.forEach((language) => {
    const text = languages[language].yatzy;
    requiredStrings.forEach((key) => assert.equal(typeof text[key], "string", `${language}.${key}`));
    requiredFunctions.forEach((key) => assert.equal(typeof text[key], "function", `${language}.${key}`));
    assert.deepEqual(Object.keys(text.categories).sort(), [...yatzyCategoryIds].sort());
    assert.ok(Array.isArray(text.rules) && text.rules.length >= 4);
  });
});
