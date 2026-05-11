import { useEffect, useRef, useState } from "react";
import { languageOptions, languages } from "../data/languages";
import { Flag } from "./Flag";

export function LanguageMenu({ language, onChange }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const text = languages[language];

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
    onChange(nextLanguage);
    setOpen(false);
  }

  return (
    <div className="language-menu" ref={menuRef}>
      <button
        className={`globe-button ${open ? "active" : ""}`}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Choose language. Current language is ${text.name}`}
      >
        <span className="switch-icon">{"\u{1F310}"}</span>
      </button>

      {open && (
        <div className="language-list" role="menu">
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
      )}
    </div>
  );
}
