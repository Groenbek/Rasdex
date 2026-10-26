import { useEffect, useMemo, useRef, useState } from "react";
import { playRouletteSound, stopRouletteSound } from "../../utils/playRouletteSound";
import {
  getRouletteColor,
  getWheelRotation,
  pickRouletteIndex,
  rouletteNumbers,
  rouletteSegmentAngle,
} from "./roulette";

const spinDurationMs = 7600;

function createWheelGradient() {
  return `conic-gradient(from ${-rouletteSegmentAngle / 2}deg, ${rouletteNumbers
    .map((number, index) => {
      const start = index * rouletteSegmentAngle;
      const end = (index + 1) * rouletteSegmentAngle;
      return `var(--roulette-${getRouletteColor(number)}) ${start}deg ${end}deg`;
    })
    .join(", ")})`;
}

export function RouletteGame({ controls, text }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const settleTimerRef = useRef(null);
  const spinningRef = useRef(false);
  const wheelGradient = useMemo(createWheelGradient, []);
  const rouletteText = text.roulette;

  useEffect(() => {
    return () => {
      spinningRef.current = false;
      window.clearTimeout(settleTimerRef.current);
      stopRouletteSound();
    };
  }, []);

  function handleSpin() {
    if (spinningRef.current) {
      return;
    }

    const targetIndex = pickRouletteIndex();
    const targetNumber = rouletteNumbers[targetIndex];

    window.clearTimeout(settleTimerRef.current);
    spinningRef.current = true;
    setSpinning(true);
    setResult(null);
    playRouletteSound();
    setWheelRotation((current) => getWheelRotation(current, targetIndex));
    setBallRotation((current) => current - 7 * 360);

    settleTimerRef.current = window.setTimeout(() => {
      stopRouletteSound();
      setResult({
        color: getRouletteColor(targetNumber),
        number: targetNumber,
      });
      spinningRef.current = false;
      setSpinning(false);
    }, spinDurationMs);
  }

  return (
    <section className="dice-panel roulette-panel" aria-label={rouletteText.gameLabel}>
      <header className="top-bar roulette-heading">
        <h1>{rouletteText.title}</h1>
      </header>

      <div className="roulette-scene">
        <div className="roulette-pointer" aria-hidden="true" />
        <div className="roulette-wheel-frame">
          <div
            className="roulette-wheel"
            style={{
              background: wheelGradient,
              transform: `rotate(${wheelRotation}deg)`,
            }}
            role="img"
            aria-label={rouletteText.wheelLabel}
          >
            {rouletteNumbers.map((number, index) => (
              <span
                className="roulette-number"
                style={{ "--pocket-angle": `${index * rouletteSegmentAngle}deg` }}
                key={number}
              >
                <b>{number}</b>
              </span>
            ))}
            <span className="roulette-inner-track" aria-hidden="true" />
            <span className="roulette-rotor" aria-hidden="true">
              <i />
            </span>
          </div>

          <div
            className="roulette-ball-carrier"
            style={{ transform: `rotate(${ballRotation}deg)` }}
            aria-hidden="true"
          >
            <span className="roulette-ball" />
          </div>
        </div>
      </div>

      <div className="roulette-status" aria-live="polite">
        {result ? (
          <div className={`roulette-result roulette-result-${result.color}`}>
            <span>{rouletteText.result}</span>
            <strong>
              <span className="roulette-result-number">{result.number}</span>
            </strong>
            <b>{rouletteText.colors[result.color]}</b>
          </div>
        ) : !spinning ? (
          <p>{rouletteText.ready}</p>
        ) : null}
      </div>

      <button
        className="roll-button roulette-spin-button"
        type="button"
        onClick={handleSpin}
        disabled={spinning}
        aria-label={rouletteText.spinLabel}
      >
        {spinning ? rouletteText.spinning : rouletteText.spin}
      </button>

      <div className="panel-actions roulette-actions">{controls}</div>
    </section>
  );
}
