const dotPositions = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
};

const cubeFaces = [
  ["front", 1],
  ["back", 6],
  ["right", 3],
  ["left", 4],
  ["top", 5],
  ["bottom", 2],
];

function Dots({ value }) {
  return dotPositions[value].map((position) => (
    <span className={`dot ${position}`} key={position} />
  ));
}

export function Die({ value, rolling, shakeRolling }) {
  const rollClass = shakeRolling ? "shake-rolling" : rolling ? "rolling" : "";

  return (
    <div
      className={`die ${rollClass}`}
      style={{ "--roll-offset": `${value * 2}deg` }}
      aria-label={`Die showing ${value}`}
    >
      <div className="die-cube" aria-hidden="true">
        {cubeFaces.map(([face, faceValue]) => (
          <div className={`die-face cube-face cube-face-${face}`} key={face}>
            <Dots value={faceValue} />
          </div>
        ))}
      </div>

      <div className="die-face die-result-face">
        <Dots value={value} />
      </div>
    </div>
  );
}
