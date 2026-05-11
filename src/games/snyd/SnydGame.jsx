import { useState } from "react";
import { DiceTray } from "../../components/DiceTray";
import { Die } from "../../components/Die";
import { useShakeToRoll } from "../../hooks/useShakeToRoll";
import { playLifeLostSound, playYouLostSound } from "../../utils/playLifeSounds";
import { playDiceRollSound } from "../../utils/playDiceRollSound";
import { SnydRules } from "./SnydRules";

const diceOptions = [1, 2, 3, 4, 5, 6];

function rollDice(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

export function SnydGame({ controls, shakeToRoll, text }) {
  const [diceCount, setDiceCount] = useState(1);
  const [dice, setDice] = useState([1]);
  const [lives, setLives] = useState(6);
  const [lost, setLost] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [started, setStarted] = useState(false);

  function changeDiceCount(count) {
    setDiceCount(count);

    if (started) {
      setDice(rollDice(count));
    } else {
      setDice(Array.from({ length: count }, () => 1));
    }
  }

  function handleRoll() {
    if (lost || rolling) {
      return;
    }

    setRolling(true);
    setStarted(true);
    playDiceRollSound();

    setTimeout(() => {
      setDice(rollDice(diceCount));
      setRolling(false);
    }, 350);
  }

  const shaking = useShakeToRoll({
    canRoll: !rolling && !lost,
    enabled: shakeToRoll,
    onRoll: handleRoll,
  });

  function loseLife() {
    if (lost) {
      return;
    }

    if (lives === 1) {
      playYouLostSound();
      setLost(true);
      return;
    }

    playLifeLostSound();
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

      <div className="dice-tray-shell">
        <DiceTray
          dice={dice}
          rolling={rolling}
          shakeRolling={shaking}
          label={text.rollDiceLabel(diceCount)}
        />

        {!started && !rolling && (
          <div className="start-overlay" aria-live="polite">
            <p>{shakeToRoll ? text.startPrompt : text.startPromptEnableShake}</p>
          </div>
        )}
      </div>

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
