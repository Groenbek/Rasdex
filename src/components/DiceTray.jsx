import { Die } from "./Die";

export function DiceTray({ dice, label, rolling, shakeRolling }) {
  return (
    <div className="dice-tray" aria-label={label}>
      {dice.map((value, index) => (
        <Die
          value={value}
          index={index}
          rolling={rolling}
          shakeRolling={shakeRolling}
          key={`${index}-${value}`}
        />
      ))}
    </div>
  );
}
