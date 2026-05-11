const themeOptions = [
  { icon: "\u2600\uFE0F", label: "Switch to light mode", value: "light" },
  { icon: "\u{1F319}", label: "Switch to dark mode", value: "dark" },
  { icon: "\u25D0", label: "Switch to high contrast mode", value: "contrast" },
  { icon: "\u{1F5A5}\uFE0F", label: "Switch to old school computer mode", value: "terminal" },
];

export function ThemeToggle({ onChange, theme }) {
  return (
    <div className="icon-toggle" aria-label="Theme">
      {themeOptions.map((option) => (
        <button
          className={theme === option.value ? "active" : ""}
          type="button"
          onClick={() => onChange(option.value)}
          aria-label={option.label}
          aria-pressed={theme === option.value}
          key={option.value}
        >
          <span className="switch-icon">{option.icon}</span>
        </button>
      ))}
    </div>
  );
}
