import { useCallback, useEffect, useRef, useState } from "react";

function getWakeLockSupported() {
  return typeof navigator !== "undefined" && "wakeLock" in navigator;
}

export function useScreenWakeLock(enabled) {
  const wakeLockRef = useRef(null);
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(getWakeLockSupported);

  const releaseWakeLock = useCallback(async () => {
    const wakeLock = wakeLockRef.current;
    wakeLockRef.current = null;
    setActive(false);

    if (!wakeLock || wakeLock.released) {
      return;
    }

    try {
      await wakeLock.release();
    } catch {
      // The browser may already have released it during tab visibility changes.
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!getWakeLockSupported() || document.visibilityState !== "visible") {
      setSupported(getWakeLockSupported());
      setActive(false);
      return;
    }

    try {
      const wakeLock = await navigator.wakeLock.request("screen");
      wakeLockRef.current = wakeLock;
      setSupported(true);
      setActive(true);

      wakeLock.addEventListener("release", () => {
        if (wakeLockRef.current === wakeLock) {
          wakeLockRef.current = null;
          setActive(false);
        }
      });
    } catch {
      setActive(false);
    }
  }, []);

  useEffect(() => {
    setSupported(getWakeLockSupported());

    if (!enabled) {
      releaseWakeLock();
      return undefined;
    }

    requestWakeLock();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      } else {
        setActive(false);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
    };
  }, [enabled, releaseWakeLock, requestWakeLock]);

  return { active, supported };
}
