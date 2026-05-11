export function ThemeToggle({ darkMode, onChange }) {
  return (
    <div className="icon-toggle" aria-label="Theme">
      <button
        className={!darkMode ? "active" : ""}
        type="button"
        onClick={() => onChange(false)}
        aria-label="Switch to light mode"
        aria-pressed={!darkMode}
      >
        <span className="switch-icon">{"\u2600\uFE0F"}</span>
      </button>
      <button
        className={darkMode ? "active" : ""}
        type="button"
        onClick={() => onChange(true)}
        aria-label="Switch to dark mode"
        aria-pressed={darkMode}
      >
        <span className="switch-icon">{"\u{1F319}"}</span>
      </button>
    </div>
  );
}
