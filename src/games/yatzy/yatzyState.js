import { rollDice } from "../../utils/rollDice.js";
import {
  getYatzyScoreSummary,
  scoreYatzyCategory,
  yatzyCategoryIds,
} from "./yatzyScoring.js";

export const yatzyStorageKey = "rasdex-yatzy-v2";

function createGameId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `yatzy-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyDice(mode) {
  return mode === "physical" ? Array(6).fill(1) : Array(6).fill(null);
}

export function createInitialYatzyState(overrides = {}) {
  const mode = overrides.mode === "physical" ? "physical" : "digital";

  return {
    version: 2,
    gameId: overrides.gameId || createGameId(),
    playerName: "",
    mode,
    scores: {},
    history: [],
    dice: emptyDice(mode),
    locked: Array(6).fill(false),
    rollsUsed: mode === "physical" ? 1 : 0,
    ...overrides,
  };
}

export function rollYatzyDice(state, roller = () => rollDice(1)[0]) {
  if (
    state.mode !== "digital" ||
    state.rollsUsed >= 3 ||
    (state.rollsUsed > 0 && state.locked.every(Boolean))
  ) {
    return state;
  }

  const dice = state.dice.map((value, index) =>
    state.rollsUsed > 0 && state.locked[index] ? value : roller(index),
  );

  return {
    ...state,
    dice,
    rollsUsed: state.rollsUsed + 1,
  };
}

export function toggleYatzyDieLock(state, index) {
  if (
    state.mode !== "digital" ||
    state.rollsUsed === 0 ||
    state.rollsUsed >= 3 ||
    index < 0 ||
    index >= 6
  ) {
    return state;
  }

  return {
    ...state,
    locked: state.locked.map((locked, dieIndex) => dieIndex === index ? !locked : locked),
  };
}

export function setPhysicalDieValue(state, index, value) {
  if (state.mode !== "physical" || index < 0 || index >= 6 || value < 1 || value > 6) {
    return state;
  }

  return {
    ...state,
    dice: state.dice.map((current, dieIndex) => dieIndex === index ? value : current),
  };
}

export function setYatzyMode(state, mode) {
  if (!['digital', 'physical'].includes(mode) || mode === state.mode) {
    return state;
  }

  return {
    ...state,
    mode,
    dice: emptyDice(mode),
    locked: Array(6).fill(false),
    rollsUsed: mode === "physical" ? 1 : 0,
  };
}

export function resetYatzyTurn(state) {
  return {
    ...state,
    dice: emptyDice(state.mode),
    locked: Array(6).fill(false),
    rollsUsed: state.mode === "physical" ? 1 : 0,
  };
}

export function recordYatzyCategory(state, categoryId) {
  if (
    !yatzyCategoryIds.includes(categoryId) ||
    categoryId in state.scores ||
    state.rollsUsed === 0 ||
    state.dice.some((value) => value === null)
  ) {
    return state;
  }

  const score = scoreYatzyCategory(categoryId, state.dice);
  const scores = { ...state.scores, [categoryId]: score };
  const nextState = {
    ...state,
    scores,
    history: [...state.history, { categoryId, score }],
  };

  return resetYatzyTurn(nextState);
}

export function undoLastYatzyScore(state) {
  const lastEntry = state.history[state.history.length - 1];

  if (!lastEntry) {
    return state;
  }

  const scores = { ...state.scores };
  delete scores[lastEntry.categoryId];

  return resetYatzyTurn({
    ...state,
    scores,
    history: state.history.slice(0, -1),
  });
}

export function clearYatzyCategory(state, categoryId) {
  if (!(categoryId in state.scores)) {
    return state;
  }

  const scores = { ...state.scores };
  delete scores[categoryId];

  return resetYatzyTurn({
    ...state,
    scores,
    history: state.history.filter((entry) => entry.categoryId !== categoryId),
  });
}

export function normalizeYatzyState(value) {
  if (!value || value.version !== 2 || typeof value.gameId !== "string") {
    return null;
  }

  const mode = value.mode === "physical" ? "physical" : "digital";
  const validDice = Array.isArray(value.dice) && value.dice.length === 6 &&
    value.dice.every((die) => die === null || (Number.isInteger(die) && die >= 1 && die <= 6));
  const validLocks = Array.isArray(value.locked) && value.locked.length === 6 &&
    value.locked.every((locked) => typeof locked === "boolean");
  const rollsUsed = Number.isInteger(value.rollsUsed)
    ? Math.min(3, Math.max(mode === "physical" ? 1 : 0, value.rollsUsed))
    : mode === "physical" ? 1 : 0;

  if (!validDice || !validLocks) {
    return null;
  }

  const scores = Object.fromEntries(
    Object.entries(value.scores || {}).filter(
      ([categoryId, score]) => yatzyCategoryIds.includes(categoryId) && Number.isFinite(score),
    ),
  );
  const history = Array.isArray(value.history)
    ? value.history.filter(
      (entry) => entry && entry.categoryId in scores && scores[entry.categoryId] === entry.score,
    )
    : [];

  return {
    ...createInitialYatzyState({ gameId: value.gameId, mode }),
    playerName: typeof value.playerName === "string" ? value.playerName.slice(0, 40) : "",
    scores,
    history,
    dice: value.dice,
    locked: value.locked,
    rollsUsed,
  };
}

export function loadYatzyState(storage = globalThis.localStorage) {
  try {
    const saved = storage?.getItem(yatzyStorageKey);
    return saved ? normalizeYatzyState(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

export function saveYatzyState(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(yatzyStorageKey, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function getCurrentCategoryScores(state) {
  if (state.rollsUsed === 0 || state.dice.some((value) => value === null)) {
    return {};
  }

  return Object.fromEntries(
    yatzyCategoryIds
      .filter((categoryId) => !(categoryId in state.scores))
      .map((categoryId) => [categoryId, scoreYatzyCategory(categoryId, state.dice)]),
  );
}

export { getYatzyScoreSummary };
