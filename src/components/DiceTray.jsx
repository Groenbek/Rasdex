import { Die } from "./Die";

export function DiceTray({ dice, rolling, label }) {
  return (
    <div className="dice-tray" aria-label={label}>
      {dice.map((value, index) => (
        <Die value={value} rolling={rolling} key={`${index}-${value}`} />
      ))}
    </div>
  );
}
