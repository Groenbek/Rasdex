import { useEffect, useMemo, useRef, useState } from "react";
import { playDiceRollSound } from "../../utils/playDiceRollSound";
import { YatzyDice } from "./YatzyDice";
import { YatzyRules } from "./YatzyRules";
import { YatzyScorecard } from "./YatzyScorecard";
import {
  clearYatzyCategory,
  createInitialYatzyState,
  getCurrentCategoryScores,
  getYatzyScoreSummary,
  loadYatzyState,
  recordYatzyCategory,
  rollYatzyDice,
  saveYatzyState,
  setPhysicalDieValue,
  setYatzyMode,
  toggleYatzyDieLock,
  undoLastYatzyScore,
} from "./yatzyState.js";

const rollSettleMs = 1120;

function ConfirmationDialog({ body, confirmLabel, onCancel, onConfirm, title, cancelLabel }) {
  return (
    <div className="rules-overlay" role="alertdialog" aria-modal="true" aria-labelledby="yatzy-dialog-title">
      <div className="rules-card yatzy-confirm-card">
        <header className="rules-header yatzy-confirm-header">
          <span className="yatzy-confirm-icon" aria-hidden="true">✓</span>
          <h2 id="yatzy-dialog-title">{title}</h2>
        </header>
        <div className="yatzy-confirm-message">
          <p>{body}</p>
        </div>
        <div className="yatzy-dialog-actions">
          <button className="secondary" type="button" onClick={onCancel}>{cancelLabel}</button>
          <button className="primary" type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function YatzyGame({ controls, text }) {
  const yatzyText = text.yatzy;
  const [state, setState] = useState(() => loadYatzyState() || createInitialYatzyState());
  const [rolling, setRolling] = useState(false);
  const [rollingDice, setRollingDice] = useState([]);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [turnNotice, setTurnNotice] = useState("");
  const rollTimerRef = useRef(null);
  const rollingRef = useRef(false);
  const summary = useMemo(() => getYatzyScoreSummary(state.scores), [state.scores]);
  const candidateScores = useMemo(() => getCurrentCategoryScores(state), [state]);
  const rollsLeft = Math.max(0, 3 - state.rollsUsed);
  const allLocked = state.rollsUsed > 0 && state.locked.every(Boolean);
  const canRoll = state.mode === "digital" && !rolling && rollsLeft > 0 && !allLocked && !summary.complete;

  useEffect(() => {
    saveYatzyState(state);
  }, [state]);

  useEffect(() => () => window.clearTimeout(rollTimerRef.current), []);

  function handleRoll() {
    if (rollingRef.current || !canRoll) {
      return;
    }

    const activeDice = state.dice
      .map((_, index) => state.rollsUsed === 0 || !state.locked[index] ? index : null)
      .filter((index) => index !== null);
    const nextState = rollYatzyDice(state);

    if (nextState === state) {
      return;
    }

    rollingRef.current = true;
    setTurnNotice("");
    setState(nextState);
    setRollingDice(activeDice);
    setRolling(true);
    playDiceRollSound();
    window.clearTimeout(rollTimerRef.current);
    rollTimerRef.current = window.setTimeout(() => {
      rollingRef.current = false;
      setRolling(false);
      setRollingDice([]);
    }, rollSettleMs);
  }

  function handleDieClick(index) {
    if (rolling || summary.complete) {
      return;
    }

    if (state.mode === "physical") {
      setTurnNotice("");
      const value = state.dice[index] === 6 ? 1 : state.dice[index] + 1;
      setState((current) => setPhysicalDieValue(current, index, value));
    } else {
      setState((current) => toggleYatzyDieLock(current, index));
    }
  }

  function selectCategory(categoryId, filled) {
    if (rolling) {
      return;
    }

    if (filled) {
      setPendingAction({ type: "edit", categoryId });
    } else {
      setPendingCategory(categoryId);
    }
  }

  function confirmCategory() {
    setTurnNotice(yatzyText.turnComplete(
      yatzyText.categories[pendingCategory],
      candidateScores[pendingCategory],
    ));
    setState((current) => recordYatzyCategory(current, pendingCategory));
    setPendingCategory(null);
  }

  function changeMode(mode) {
    if (rolling) {
      return;
    }

    setTurnNotice("");
    setState((current) => setYatzyMode(current, mode));
  }

  function executeAction() {
    if (pendingAction.type === "undo") {
      setState((current) => undoLastYatzyScore(current));
    } else if (pendingAction.type === "edit") {
      setState((current) => clearYatzyCategory(current, pendingAction.categoryId));
    } else if (pendingAction.type === "reset") {
      setState((current) => createInitialYatzyState({
        gameId: current.gameId,
        mode: current.mode,
        playerName: current.playerName,
      }));
    } else if (pendingAction.type === "new") {
      setState((current) => createInitialYatzyState({
        mode: current.mode,
        playerName: current.playerName,
      }));
    }

    setTurnNotice("");
    setPendingAction(null);
  }

  function getActionCopy(action) {
    if (action.type === "undo") return [yatzyText.undo, yatzyText.undoConfirm];
    if (action.type === "edit") {
      return [yatzyText.editScore, yatzyText.editConfirm(yatzyText.categories[action.categoryId])];
    }
    if (action.type === "reset") return [yatzyText.resetGame, yatzyText.resetConfirm];
    return [yatzyText.newGame, yatzyText.newGameConfirm];
  }

  return (
    <section className="dice-panel yatzy-panel" aria-label={yatzyText.gameLabel}>
      <header className="yatzy-header">
        <div>
          <h1>{yatzyText.title}</h1>
          <input
            type="text"
            value={state.playerName}
            onChange={(event) => setState((current) => ({ ...current, playerName: event.target.value.slice(0, 40) }))}
            placeholder={yatzyText.playerNamePlaceholder}
            aria-label={yatzyText.playerName}
            maxLength={40}
          />
        </div>
        <div className="yatzy-total-badge"><span>{yatzyText.total}</span><strong>{summary.total}</strong></div>
      </header>

      <div className="yatzy-mode-toggle" aria-label={yatzyText.modeLabel}>
        <button className={state.mode === "digital" ? "active" : ""} type="button" disabled={rolling} onClick={() => changeMode("digital")}>{yatzyText.digitalDice}</button>
        <button className={state.mode === "physical" ? "active" : ""} type="button" disabled={rolling} onClick={() => changeMode("physical")}>{yatzyText.physicalDice}</button>
      </div>

      <div className="yatzy-play-area">
        <div className="yatzy-turn-status">
          <strong>{state.mode === "digital" ? yatzyText.rollsLeft(rollsLeft) : yatzyText.physicalMode}</strong>
          <span>{state.mode === "physical" ? yatzyText.physicalHint : allLocked && rollsLeft ? yatzyText.allLocked : yatzyText.lockHint}</span>
        </div>

        <YatzyDice
          dice={state.dice}
          disabled={rolling || summary.complete || (state.mode === "digital" && state.rollsUsed >= 3)}
          locked={state.locked}
          mode={state.mode}
          onDieClick={handleDieClick}
          rollingDice={rollingDice}
          text={yatzyText}
        />

        {state.mode === "digital" && (
          <button className="roll-button" type="button" onClick={handleRoll} disabled={!canRoll}>
            {rolling ? yatzyText.rolling : yatzyText.rollButton(rollsLeft)}
          </button>
        )}
      </div>

      {turnNotice && <p className="yatzy-turn-notice" aria-live="polite">{turnNotice}</p>}

      {summary.complete && (
        <div className="yatzy-finished" role="status">
          <span>{yatzyText.finishedTitle}</span>
          <strong>{yatzyText.finalScore(summary.total)}</strong>
          <button type="button" onClick={() => setPendingAction({ type: "new" })}>{yatzyText.newGame}</button>
        </div>
      )}

      <YatzyScorecard
        candidateScores={summary.complete || rolling ? {} : candidateScores}
        onSelect={selectCategory}
        scores={state.scores}
        summary={summary}
        text={yatzyText}
      />

      <div className="yatzy-management" aria-label={yatzyText.actionsLabel}>
        <button type="button" onClick={() => setPendingAction({ type: "undo" })} disabled={rolling || !state.history.length}>{yatzyText.undo}</button>
        <button type="button" onClick={() => setPendingAction({ type: "reset" })} disabled={rolling}>{yatzyText.resetGame}</button>
        <button type="button" onClick={() => setPendingAction({ type: "new" })} disabled={rolling}>{yatzyText.newGame}</button>
      </div>

      <div className="panel-actions yatzy-panel-actions">
        <button className="rules-button" type="button" onClick={() => setRulesOpen(true)} aria-label={yatzyText.rulesTitle}>{"\u2753"}</button>
        {controls}
      </div>

      {pendingCategory && (
        <ConfirmationDialog
          body={yatzyText.scoreConfirm(
            yatzyText.categories[pendingCategory],
            candidateScores[pendingCategory],
          )}
          cancelLabel={yatzyText.cancel}
          confirmLabel={yatzyText.confirmScore}
          onCancel={() => setPendingCategory(null)}
          onConfirm={confirmCategory}
          title={yatzyText.selectCategory}
        />
      )}

      {pendingAction && (() => {
        const [title, body] = getActionCopy(pendingAction);
        return (
          <ConfirmationDialog
            body={body}
            cancelLabel={yatzyText.cancel}
            confirmLabel={yatzyText.confirm}
            onCancel={() => setPendingAction(null)}
            onConfirm={executeAction}
            title={title}
          />
        );
      })()}

      {rulesOpen && <YatzyRules onClose={() => setRulesOpen(false)} text={text} />}
    </section>
  );
}
