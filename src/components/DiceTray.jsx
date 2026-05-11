import { Die } from "./Die";

export function DiceTray({ dice, rolling, onRoll, label }) {
  return (
    <button className="dice-tray" type="button" onClick={onRoll} aria-label={label}>
      {dice.map((value, index) => (
        <Die value={value} rolling={rolling} key={`${index}-${value}`} />
      ))}
    </button>
  );
}
