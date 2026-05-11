import { useState } from "react";
import { DiceTray } from "../../components/DiceTray";
import { playDiceRollSound } from "../../utils/playDiceRollSound";
import { MeyerInfo } from "./MeyerInfo";

function rollMeyerDice() {
  return Array.from({ length: 2 }, () => Math.floor(Math.random() * 6) + 1);
}

export function MeyerGame({ controls, text }) {
  const [dice, setDice] = useState([1, 2]);
  const [rolling, setRolling] = useState(false);
  const [infoOpen, setInfoOpen] = useState(null);

  function handleRoll() {
    setRolling(true);
    playDiceRollSound();

    setTimeout(() => {
      setDice(rollMeyerDice());
      setRolling(false);
    }, 350);
  }

  return (
    <section className="dice-panel meyer-panel" aria-label="Meyer dice roller">
      <header className="top-bar">
        <h1>Meyer</h1>
      </header>

      <DiceTray dice={dice} rolling={rolling} label={text.meyer.rollLabel} />

      <button className="roll-button" type="button" onClick={handleRoll} disabled={rolling}>
        {rolling ? text.rolling : text.roll}
      </button>

      <div className="panel-actions meyer-actions" aria-label={text.meyer.helpLabel}>
        <button
          className="rules-button"
          type="button"
          onClick={() => setInfoOpen("rules")}
          aria-label={text.meyer.rulesTitle}
        >
          {"\u2753"}
        </button>

        {controls}

        <button
          className="strategy-button"
          type="button"
          onClick={() => setInfoOpen("strategy")}
          aria-label={text.meyer.strategyTitle}
        >
          {"\u{1F4A1}"}
        </button>
      </div>

      {infoOpen && <MeyerInfo text={text} type={infoOpen} onClose={() => setInfoOpen(null)} />}
    </section>
  );
}
