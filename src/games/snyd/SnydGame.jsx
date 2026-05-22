import { useEffect, useRef, useState } from "react";
import { DiceTray } from "../../components/DiceTray";
import { Die } from "../../components/Die";
import { useShakeToRoll } from "../../hooks/useShakeToRoll";
import { playBustedSound, playLifeLostSound, playYouLostSound } from "../../utils/playLifeSounds";
import { playDiceRollSound } from "../../utils/playDiceRollSound";
import { rollDice } from "../../utils/rollDice";
import catImage from "../../data/images/cat.png";
import { SnydRules } from "./SnydRules";

const diceOptions = [1, 2, 3, 4, 5, 6];
const rollSettleMs = 1120;
const kasperRerollSettleMs = 620;
const caughtChance = 0.33;

export function SnydGame({ controls, kasperMode, shakeToRoll, text }) {
  const [diceCount, setDiceCount] = useState(1);
  const [dice, setDice] = useState([1]);
  const [lives, setLives] = useState(6);
  const [lost, setLost] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [rerollingDie, setRerollingDie] = useState(null);
  const [caughtCheating, setCaughtCheating] = useState(false);
  const [started, setStarted] = useState(false);
  const rerollTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(rerollTimerRef.current);
    };
  }, []);

  function changeDiceCount(count) {
    if (count === diceCount) {
      return;
    }

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

    window.clearTimeout(rerollTimerRef.current);
    setRerollingDie(null);
    setCaughtCheating(false);
    setRolling(true);
    setStarted(true);
    setDice(rollDice(diceCount));
    playDiceRollSound();

    setTimeout(() => {
      setRolling(false);
    }, rollSettleMs);
  }

  function handleKasperReroll(index) {
    if (!kasperMode || !started || rolling || lost || rerollingDie !== null) {
      return;
    }

    window.clearTimeout(rerollTimerRef.current);
    setRerollingDie(index);
    setDice((currentDice) =>
      currentDice.map((value, diceIndex) =>
        diceIndex === index ? rollDice(1)[0] : value
      )
    );

    if (Math.random() < caughtChance) {
      playBustedSound();
      setCaughtCheating(true);
    }

    rerollTimerRef.current = window.setTimeout(() => {
      setRerollingDie(null);
    }, kasperRerollSettleMs);
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
          rollingDice={rerollingDie === null ? [] : [rerollingDie]}
          shakeRolling={shaking}
          label={text.rollDiceLabel(diceCount)}
          onDieClick={
            kasperMode && started && !rolling && !lost
              ? handleKasperReroll
              : undefined
          }
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

      {caughtCheating && (
        <div
          className="cheat-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-label={text.cheated}
        >
          <button
            className="cheat-close"
            type="button"
            onClick={() => setCaughtCheating(false)}
            aria-label="Close"
          >
            {"\u00d7"}
          </button>
          <div className="cheat-message">
            <img src={catImage} alt="" aria-hidden="true" />
            <h2>{text.cheated}</h2>
            <p>{text.cheatedTaunt}</p>
          </div>
        </div>
      )}

      {rulesOpen && <SnydRules text={text} onClose={() => setRulesOpen(false)} />}
    </section>
  );
}
