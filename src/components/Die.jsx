const dotPositions = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
};

export function Die({ value, rolling }) {
  return (
    <div className={`die ${rolling ? "rolling" : ""}`} aria-label={`Die showing ${value}`}>
      {dotPositions[value].map((position) => (
        <span className={`dot ${position}`} key={position} />
      ))}
    </div>
  );
}
