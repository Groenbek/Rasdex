export function MeyerInfo({ onClose, text, type }) {
  const isStrategy = type === "strategy";
  const title = isStrategy ? text.meyer.strategyTitle : text.meyer.rulesTitle;
  const paragraphs = isStrategy ? text.meyer.strategy : text.meyer.rules;

  return (
    <div
      className="rules-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meyer-info-title"
      onClick={onClose}
    >
      <div className="rules-card" onClick={(event) => event.stopPropagation()}>
        <header className="rules-header">
          <h2 id="meyer-info-title">{title}</h2>
          <button type="button" onClick={onClose} aria-label={text.closeRules}>
            X
          </button>
        </header>

        <div className="rules-content">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {isStrategy && (
            <div className="odds-list" aria-label={text.meyer.oddsLabel}>
              {text.meyer.odds.map(([name, chance]) => (
                <div className="odds-row" key={name}>
                  <span>{name}</span>
                  <strong>{chance}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
