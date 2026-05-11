const dotPositions = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
};

const faceNames = [
  "front",
  "back",
  "right",
  "left",
  "top",
  "bottom",
];

function getCubeFaceValues(value) {
  const remainingValues = [1, 2, 3, 4, 5, 6].filter((faceValue) => faceValue !== value);

  return {
    front: value,
    back: 7 - value,
    right: remainingValues[0],
    left: remainingValues[1],
    top: remainingValues[2],
    bottom: remainingValues[3],
  };
}

function Dots({ value }) {
  return dotPositions[value].map((position) => (
    <span className={`dot ${position}`} key={position} />
  ));
}

const rollTimings = [
  { delay: 0, duration: 760 },
  { delay: 55, duration: 820 },
  { delay: 95, duration: 780 },
  { delay: 25, duration: 860 },
  { delay: 120, duration: 800 },
  { delay: 70, duration: 840 },
];

export function Die({ value, index = 0, rolling, shakeRolling }) {
  const rollClass = shakeRolling ? "shake-rolling" : rolling ? "rolling" : "";
  const timing = rollTimings[index % rollTimings.length];
  const cubeFaceValues = getCubeFaceValues(value);

  return (
    <div
      className={`die die-${(index % 6) + 1} ${rollClass}`}
      style={{
        "--roll-delay": `${timing.delay}ms`,
        "--roll-duration": `${timing.duration}ms`,
        "--roll-offset": `${value * 2 + index * 7}deg`,
        "--roll-wobble": index % 2 === 0 ? "1" : "-1",
      }}
      aria-label={`Die showing ${value}`}
    >
      <div className="die-cube" aria-hidden="true">
        {faceNames.map((face) => (
          <div className={`die-face cube-face cube-face-${face}`} key={face}>
            <Dots value={cubeFaceValues[face]} />
          </div>
        ))}
      </div>

      <div className="die-face die-result-face">
        <Dots value={value} />
      </div>
    </div>
  );
}
