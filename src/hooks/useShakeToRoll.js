import { useEffect, useRef, useState } from "react";

const shakeThreshold = 11;
const shakeDuration = 500;
const shakeGapTolerance = 260;
const rollCooldown = 1200;

function getMotionVector(event) {
  const acceleration = event.acceleration || event.accelerationIncludingGravity;

  if (!acceleration) {
    return null;
  }

  return {
    x: acceleration.x || 0,
    y: acceleration.y || 0,
    z: acceleration.z || 0,
  };
}

function getMotionDelta(current, previous) {
  if (!previous) {
    return 0;
  }

  const x = current.x - previous.x;
  const y = current.y - previous.y;
  const z = current.z - previous.z;

  return Math.sqrt(x * x + y * y + z * z);
}

export function useShakeToRoll({ canRoll = true, enabled, onRoll }) {
  const [shaking, setShaking] = useState(false);
  const onRollRef = useRef(onRoll);
  const canRollRef = useRef(canRoll);
  const shakeStopTimerRef = useRef(null);

  useEffect(() => {
    onRollRef.current = onRoll;
  }, [onRoll]);

  useEffect(() => {
    canRollRef.current = canRoll;
  }, [canRoll]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setShaking(false);
      return undefined;
    }

    let previousMotion = null;
    let shakeStartedAt = 0;
    let lastShakeAt = 0;
    let lastRollAt = 0;

    function resetShake() {
      shakeStartedAt = 0;
      lastShakeAt = 0;
      setShaking(false);
    }

    function keepShakeAnimationAlive() {
      setShaking(true);

      window.clearTimeout(shakeStopTimerRef.current);
      shakeStopTimerRef.current = window.setTimeout(() => {
        setShaking(false);
      }, shakeGapTolerance);
    }

    function handleMotion(event) {
      const currentMotion = getMotionVector(event);

      if (!currentMotion) {
        return;
      }

      const now = performance.now();
      const delta = getMotionDelta(currentMotion, previousMotion);
      previousMotion = currentMotion;

      if (delta < shakeThreshold) {
        if (lastShakeAt && now - lastShakeAt > shakeGapTolerance) {
          resetShake();
        }

        return;
      }

      if (!shakeStartedAt || now - lastShakeAt > shakeGapTolerance) {
        shakeStartedAt = now;
      }

      lastShakeAt = now;
      keepShakeAnimationAlive();

      if (
        canRollRef.current &&
        now - shakeStartedAt >= shakeDuration &&
        now - lastRollAt >= rollCooldown
      ) {
        lastRollAt = now;
        resetShake();
        onRollRef.current();
      }
    }

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      window.clearTimeout(shakeStopTimerRef.current);
      setShaking(false);
    };
  }, [enabled]);

  return shaking;
}
