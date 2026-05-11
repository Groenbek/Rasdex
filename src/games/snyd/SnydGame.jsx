import { useState } from "react";
import { DiceTray } from "../../components/DiceTray";
import { Die } from "../../components/Die";
import { SnydRules } from "./SnydRules";

const diceOptions = [1, 2, 3, 4, 5, 6];

function rollDice(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

export function SnydGame({ controls, text }) {
  const [diceCount, setDiceCount] = useState(1);
  const [dice, setDice] = useState([1]);
  const [lives, setLives] = useState(6);
  const [lost, setLost] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rolling, setRolling] = useState(false);

  function changeDiceCount(count) {
    setDiceCount(count);
    setDice(rollDice(count));
  }

  function handleRoll() {
    if (lost) {
      return;
    }

    setRolling(true);

    setTimeout(() => {
      setDice(rollDice(diceCount));
      setRolling(false);
    }, 350);
  }

  function loseLife() {
    if (lost) {
      return;
    }

    if (lives === 1) {
      setLost(true);
      return;
    }

    setLives((current) => current - 1);
  }

  function restart() {
    setLives(6);
    setLost(false);
  }

  return (
    <section className="dice-panel" aria-label="Dice roller">
      <header className="top-bar">
        <h1>{text.title}</h1>
      </header>

      <DiceTray
        dice={dice}
        rolling={rolling}
        onRoll={handleRoll}
        label={text.rollDiceLabel(diceCount)}
      />

      <div className="dice-count" aria-label="Number of dice">
        {diceOptions.map((count) => (
          <button
            className={count === diceCount ? "selected" : ""}
            type="button"
            onClick={() => changeDiceCount(count)}
            aria-pressed={count === diceCount}
            key={count}
          >
            {count}
          </button>
        ))}
      </div>

      <button className="roll-button" type="button" onClick={handleRoll} disabled={rolling || lost}>
        {rolling ? text.rolling : text.roll}
      </button>

      <div className="panel-actions">
        <button
          className="rules-button"
          type="button"
          onClick={() => setRulesOpen(true)}
          aria-label={text.rulesTitle}
        >
          {"\u2753"}
        </button>

        {controls}

        <button
          className="life-die"
          type="button"
          onClick={loseLife}
          aria-label={text.loseLifeLabel(lives)}
          disabled={lost}
        >
          <Die value={lives} />
        </button>
      </div>

      {lost && (
        <div className="lost-overlay" role="alertdialog" aria-modal="true" aria-label={text.lost}>
          <h2>{text.lost}</h2>
          <button type="button" onClick={restart}>
            {text.restart}
          </button>
        </div>
      )}

      {rulesOpen && <SnydRules text={text} onClose={() => setRulesOpen(false)} />}
    </section>
  );
}
