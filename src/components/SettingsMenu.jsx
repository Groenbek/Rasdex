import { useEffect, useRef, useState } from "react";
import { languageOptions, languages } from "../data/languages";
import { Flag } from "./Flag";
import { ThemeToggle } from "./ThemeToggle";

export function SettingsMenu({
  language,
  onLanguageChange,
  onShakeToRollChange,
  onThemeChange,
  shakeToRoll,
  theme,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function closeMenu(event) {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function closeMenuWithKeyboard(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeMenuWithKeyboard);

    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeMenuWithKeyboard);
    };
  }, [open]);

  function selectLanguage(nextLanguage) {
    onLanguageChange(nextLanguage);
    setOpen(false);
  }

  async function toggleShakeToRoll() {
    const nextValue = !shakeToRoll;

    if (
      nextValue &&
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceMotionEvent.requestPermission();

        if (permission !== "granted") {
          onShakeToRollChange(false);
          return;
        }
      } catch {
        onShakeToRollChange(false);
        return;
      }
    }

    onShakeToRollChange(nextValue);
  }

  return (
    <div className="settings-menu" ref={menuRef}>
      <button
        className={`settings-button ${open ? "active" : ""}`}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open settings"
      >
        <span className="switch-icon">{"\u2699\uFE0F"}</span>
      </button>

      {open && (
        <div className="settings-panel" role="menu">
          <div className="settings-section">
            <span className="settings-label">Color</span>
            <ThemeToggle theme={theme} onChange={onThemeChange} />
          </div>

          <div className="settings-section">
            <span className="settings-label">Motion</span>
            <button
              className={`settings-switch ${shakeToRoll ? "active" : ""}`}
              type="button"
              onClick={toggleShakeToRoll}
              role="switch"
              aria-checked={shakeToRoll}
            >
              <span>Shake to throw</span>
              <span className="settings-switch-state">{shakeToRoll ? "On" : "Off"}</span>
            </button>
            <span className="settings-hint">Shake for 1 second to roll.</span>
          </div>

          <div className="settings-section">
            <span className="settings-label">Language</span>
            <div className="settings-language-list">
              {languageOptions.map((languageKey) => (
                <button
                  className={languageKey === language ? "active" : ""}
                  type="button"
                  onClick={() => selectLanguage(languageKey)}
                  role="menuitemradio"
                  aria-checked={languageKey === language}
                  key={languageKey}
                >
                  <Flag languageKey={languageKey} />
                  <span>{languages[languageKey].name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
