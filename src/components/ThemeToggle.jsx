const themeOptions = [
  { icon: "\u2600\uFE0F", labelKey: "light", value: "light" },
  { icon: "\u{1F319}", labelKey: "dark", value: "dark" },
  { icon: "\u25D0", labelKey: "contrast", value: "contrast" },
  { icon: "\u{1F5A5}\uFE0F", labelKey: "terminal", value: "terminal" },
];

export function ThemeToggle({ labels, onChange, theme }) {
  return (
    <div className="icon-toggle" aria-label={labels.theme}>
      {themeOptions.map((option) => (
        <button
          className={theme === option.value ? "active" : ""}
          type="button"
          onClick={() => onChange(option.value)}
          aria-label={labels.themeOptions[option.labelKey]}
          aria-pressed={theme === option.value}
          key={option.value}
        >
          <span className="switch-icon">{option.icon}</span>
        </button>
      ))}
    </div>
  );
}
