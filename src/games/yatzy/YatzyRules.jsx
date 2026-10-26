export function YatzyRules({ onClose, text }) {
  return (
    <div className="rules-overlay" role="dialog" aria-modal="true" aria-labelledby="yatzy-rules-title">
      <div className="rules-card yatzy-rules-card">
        <header className="rules-header">
          <h2 id="yatzy-rules-title">{text.yatzy.rulesTitle}</h2>
          <button type="button" onClick={onClose} aria-label={text.closeRules}>
            {"\u00d7"}
          </button>
        </header>
        <div className="rules-content">
          {text.yatzy.rules.map((rule) => <p key={rule}>{rule}</p>)}
        </div>
      </div>
    </div>
  );
}
