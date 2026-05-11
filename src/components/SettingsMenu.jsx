import { useEffect, useRef, useState } from "react";
import { languageOptions, languages } from "../data/languages";
import { Flag } from "./Flag";
import { ThemeToggle } from "./ThemeToggle";

export function SettingsMenu({ language, onLanguageChange, onThemeChange, theme }) {
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
