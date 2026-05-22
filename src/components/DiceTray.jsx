import { Die } from "./Die";

export function DiceTray({
  dice,
  label,
  onDieClick,
  rolling,
  rollingDice = [],
  shakeRolling,
}) {
  return (
    <div className="dice-tray" aria-label={label}>
      {dice.map((value, index) => (
        onDieClick ? (
          <button
            className="die-button"
            type="button"
            onClick={() => onDieClick(index)}
            aria-label={`Reroll die ${index + 1}, currently showing ${value}`}
            key={`${index}-${value}`}
          >
            <Die
              value={value}
              index={index}
              rolling={rolling || rollingDice.includes(index)}
              shakeRolling={shakeRolling}
            />
          </button>
        ) : (
          <Die
            value={value}
            index={index}
            rolling={rolling || rollingDice.includes(index)}
            shakeRolling={shakeRolling}
            key={`${index}-${value}`}
          />
        )
      ))}
    </div>
  );
}
