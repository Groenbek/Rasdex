const dotPositions = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
};

export function Die({ value, rolling, shakeRolling }) {
  const rollClass = shakeRolling ? "shake-rolling" : rolling ? "rolling" : "";

  return (
    <div
      className={`die ${rollClass}`}
      style={{ "--roll-offset": `${value * 2}deg` }}
      aria-label={`Die showing ${value}`}
    >
      {dotPositions[value].map((position) => (
        <span className={`dot ${position}`} key={position} />
      ))}
    </div>
  );
}
