import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialYatzyState,
  clearYatzyCategory,
  loadYatzyState,
  normalizeYatzyState,
  recordYatzyCategory,
  rollYatzyDice,
  saveYatzyState,
  setPhysicalDieValue,
  setYatzyMode,
  toggleYatzyDieLock,
  undoLastYatzyScore,
} from "./yatzyState.js";

function newState() {
  return createInitialYatzyState({ gameId: "test-game" });
}

test("first roll sets six dice, leaves them unlocked, and consumes one roll", () => {
  const state = rollYatzyDice(newState(), (index) => index + 1);
  assert.deepEqual(state.dice, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(state.locked, Array(6).fill(false));
  assert.equal(state.rollsUsed, 1);
});

test("locked dice survive later rolls and can be unlocked", () => {
  let state = rollYatzyDice(newState(), (index) => index + 1);
  state = toggleYatzyDieLock(toggleYatzyDieLock(state, 0), 2);
  state = rollYatzyDice(state, () => 6);
  assert.deepEqual(state.dice, [1, 6, 3, 6, 6, 6]);
  assert.equal(state.rollsUsed, 2);

  state = toggleYatzyDieLock(state, 0);
  state = rollYatzyDice(state, () => 2);
  assert.deepEqual(state.dice, [2, 2, 3, 2, 2, 2]);
  assert.equal(state.rollsUsed, 3);
});

test("never allows a fourth roll", () => {
  let state = newState();
  state = rollYatzyDice(state, () => 1);
  state = rollYatzyDice(state, () => 2);
  state = rollYatzyDice(state, () => 3);
  assert.equal(rollYatzyDice(state, () => 6), state);
});

test("all locked dice disable rolling without consuming a roll", () => {
  let state = rollYatzyDice(newState(), () => 4);
  for (let index = 0; index < 6; index += 1) {
    state = toggleYatzyDieLock(state, index);
  }
  assert.equal(rollYatzyDice(state, () => 6), state);
  assert.equal(state.rollsUsed, 1);
});

test("early scoring records even zero and resets the turn", () => {
  let state = rollYatzyDice(newState(), () => 1);
  state = recordYatzyCategory(state, "sixes");
  assert.equal(state.scores.sixes, 0);
  assert.equal(state.rollsUsed, 0);
  assert.deepEqual(state.dice, Array(6).fill(null));
  assert.deepEqual(state.locked, Array(6).fill(false));

  state = undoLastYatzyScore(state);
  assert.equal("sixes" in state.scores, false);
});

test("saved state restores dice, locks, scores, and rolls exactly", () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
  let state = rollYatzyDice(newState(), (index) => index + 1);
  state = toggleYatzyDieLock(toggleYatzyDieLock(toggleYatzyDieLock(state, 0), 2), 4);
  state = rollYatzyDice(state, () => 6);
  assert.equal(saveYatzyState(state, storage), true);
  assert.deepEqual(loadYatzyState(storage), state);
  assert.equal(loadYatzyState(storage).rollsUsed, 2);
});

test("invalid persisted state is rejected", () => {
  assert.equal(normalizeYatzyState({ version: 2, gameId: "bad", dice: [] }), null);
});

test("physical mode cycles entered values and uses the same scoring", () => {
  let state = setYatzyMode(newState(), "physical");
  [6, 6, 6, 5, 5, 2].forEach((value, index) => {
    state = setPhysicalDieValue(state, index, value);
  });
  state = recordYatzyCategory(state, "fullHouse");
  assert.equal(state.scores.fullHouse, 28);
  assert.equal(state.mode, "physical");
  assert.deepEqual(state.dice, Array(6).fill(1));
});

test("editing clears only the selected category and resets the current turn", () => {
  let state = rollYatzyDice(newState(), () => 6);
  state = recordYatzyCategory(state, "sixes");
  state = rollYatzyDice(state, () => 1);
  state = recordYatzyCategory(state, "ones");
  state = clearYatzyCategory(state, "sixes");
  assert.deepEqual(state.scores, { ones: 6 });
  assert.equal(state.history.length, 1);
  assert.equal(state.rollsUsed, 0);
});
