export function SnydRules({ onClose, text }) {
  return (
    <div
      className="rules-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="snyd-rules-title"
      onClick={onClose}
    >
      <div className="rules-card" onClick={(event) => event.stopPropagation()}>
        <header className="rules-header">
          <h2 id="snyd-rules-title">{text.rulesTitle}</h2>
          <button type="button" onClick={onClose} aria-label={text.closeRules}>
            X
          </button>
        </header>

        <div className="rules-content">
          {text.rules.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="rules-source">{text.rulesSource}</p>
        </div>
      </div>
    </div>
  );
}
