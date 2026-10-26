export const upperCategoryIds = [
  "ones",
  "twos",
  "threes",
  "fours",
  "fives",
  "sixes",
];

export const lowerCategoryIds = [
  "onePair",
  "twoPairs",
  "threePairs",
  "threeKind",
  "fourKind",
  "twoTriplets",
  "smallStraight",
  "largeStraight",
  "royal",
  "fullHouse",
  "chance",
  "yatzy",
];

export const yatzyCategoryIds = [...upperCategoryIds, ...lowerCategoryIds];

function getCounts(dice) {
  return dice.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function getHighestGroupScore(counts, groupSize) {
  const value = [1, 2, 3, 4, 5, 6]
    .reverse()
    .find((candidate) => (counts[candidate] || 0) >= groupSize);

  return value ? value * groupSize : 0;
}

function getPairScore(counts, pairCount) {
  const pairs = [1, 2, 3, 4, 5, 6]
    .filter((value) => (counts[value] || 0) >= 2)
    .sort((a, b) => b - a)
    .slice(0, pairCount);

  return pairs.length === pairCount
    ? pairs.reduce((total, value) => total + value * 2, 0)
    : 0;
}

function hasValues(counts, values) {
  return values.every((value) => (counts[value] || 0) >= 1);
}

function getFullHouseScore(counts) {
  let bestScore = 0;

  for (let triple = 1; triple <= 6; triple += 1) {
    if ((counts[triple] || 0) < 3) {
      continue;
    }

    for (let pair = 1; pair <= 6; pair += 1) {
      if (pair !== triple && (counts[pair] || 0) >= 2) {
        bestScore = Math.max(bestScore, triple * 3 + pair * 2);
      }
    }
  }

  return bestScore;
}

export function scoreYatzyCategory(categoryId, dice) {
  if (!Array.isArray(dice) || dice.length !== 6 || dice.some((value) => value < 1 || value > 6)) {
    return 0;
  }

  const counts = getCounts(dice);
  const total = dice.reduce((sum, value) => sum + value, 0);
  const upperIndex = upperCategoryIds.indexOf(categoryId);

  if (upperIndex !== -1) {
    const face = upperIndex + 1;
    return (counts[face] || 0) * face;
  }

  switch (categoryId) {
    case "onePair":
      return getPairScore(counts, 1);
    case "twoPairs":
      return getPairScore(counts, 2);
    case "threePairs":
      return getPairScore(counts, 3);
    case "threeKind":
      return getHighestGroupScore(counts, 3);
    case "fourKind":
      return getHighestGroupScore(counts, 4);
    case "twoTriplets": {
      const triples = [1, 2, 3, 4, 5, 6].filter((value) => (counts[value] || 0) >= 3);
      return triples.length >= 2 ? triples.slice(-2).reduce((sum, value) => sum + value * 3, 0) : 0;
    }
    case "smallStraight":
      return hasValues(counts, [1, 2, 3, 4, 5]) ? 15 : 0;
    case "largeStraight":
      return hasValues(counts, [2, 3, 4, 5, 6]) ? 20 : 0;
    case "royal":
      return hasValues(counts, [1, 2, 3, 4, 5, 6]) ? 30 : 0;
    case "fullHouse":
      return getFullHouseScore(counts);
    case "chance":
      return total;
    case "yatzy":
      return Object.values(counts).some((count) => count === 6) ? 50 + total : 0;
    default:
      return 0;
  }
}

export function getYatzyScoreSummary(scores) {
  const upperTotal = upperCategoryIds.reduce(
    (total, categoryId) => total + (scores[categoryId] ?? 0),
    0,
  );
  const upperComplete = upperCategoryIds.every((categoryId) => categoryId in scores);
  const bonus = upperTotal >= 84 ? 50 : 0;
  const lowerTotal = lowerCategoryIds.reduce(
    (total, categoryId) => total + (scores[categoryId] ?? 0),
    0,
  );

  return {
    bonus,
    bonusStatus: bonus ? "achieved" : upperComplete ? "missed" : "pending",
    complete: yatzyCategoryIds.every((categoryId) => categoryId in scores),
    lowerTotal,
    total: upperTotal + bonus + lowerTotal,
    upperTotal,
  };
}
