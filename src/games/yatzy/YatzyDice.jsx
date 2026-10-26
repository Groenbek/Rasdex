import { Die } from "../../components/Die";

export function YatzyDice({
  dice,
  disabled,
  locked,
  mode,
  onDieClick,
  rollingDice,
  text,
}) {
  return (
    <div className="yatzy-dice-grid" aria-label={text.diceLabel}>
      {dice.map((value, index) => {
        const isLocked = mode === "digital" && locked[index];
        const label = mode === "physical"
          ? text.physicalDieLabel(index + 1, value)
          : isLocked
            ? text.unlockDieLabel(index + 1, value)
            : text.lockDieLabel(index + 1, value);

        return (
          <button
            className={`yatzy-die-button ${isLocked ? "locked" : ""}`}
            type="button"
            onClick={() => onDieClick(index)}
            disabled={disabled || (mode === "digital" && value === null)}
            aria-label={label}
            aria-pressed={mode === "digital" ? isLocked : undefined}
            key={index}
          >
            {value === null ? (
              <span className="yatzy-empty-die" aria-hidden="true">?</span>
            ) : (
              <Die value={value} index={index} rolling={rollingDice.includes(index)} />
            )}
            {isLocked && (
              <span className="yatzy-lock-badge" aria-hidden="true">
                <span>{"\u{1F512}"}</span>
                {text.locked}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
