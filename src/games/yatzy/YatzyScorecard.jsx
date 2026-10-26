import { lowerCategoryIds, upperCategoryIds } from "./yatzyScoring.js";

function ScoreRow({ candidateScores, categoryId, onSelect, scores, text }) {
  const filled = categoryId in scores;
  const available = categoryId in candidateScores;
  const score = filled ? scores[categoryId] : available ? candidateScores[categoryId] : null;

  return (
    <button
      className={`yatzy-score-row ${filled ? "filled" : ""} ${available ? "available" : ""}`}
      type="button"
      onClick={() => onSelect(categoryId, filled)}
      disabled={!filled && !available}
      aria-label={filled
        ? text.editCategoryLabel(text.categories[categoryId], score)
        : available
          ? text.selectCategoryLabel(text.categories[categoryId], score)
          : text.categories[categoryId]}
    >
      <span>{text.categories[categoryId]}</span>
      <strong>{score ?? "\u2014"}</strong>
    </button>
  );
}

function ScoreSection({ candidateScores, categoryIds, onSelect, scores, title, text }) {
  return (
    <section className="yatzy-score-section">
      <h3>{title}</h3>
      <div className="yatzy-score-rows">
        {categoryIds.map((categoryId) => (
          <ScoreRow
            candidateScores={candidateScores}
            categoryId={categoryId}
            onSelect={onSelect}
            scores={scores}
            text={text}
            key={categoryId}
          />
        ))}
      </div>
    </section>
  );
}

export function YatzyScorecard({ candidateScores, onSelect, scores, summary, text }) {
  const bonusText = summary.bonusStatus === "achieved"
    ? text.bonusAchieved
    : summary.bonusStatus === "missed"
      ? text.bonusMissed
      : text.bonusPending;

  return (
    <div className="yatzy-scorecard" aria-label={text.scorecard}>
      <ScoreSection
        candidateScores={candidateScores}
        categoryIds={upperCategoryIds}
        onSelect={onSelect}
        scores={scores}
        text={text}
        title={text.upperSection}
      />

      <div className="yatzy-summary-row">
        <span>{text.upperTotal}</span>
        <strong>{summary.upperTotal}</strong>
      </div>
      <div className={`yatzy-summary-row yatzy-bonus ${summary.bonusStatus}`}>
        <span>{text.bonus}<small>{bonusText}</small></span>
        <strong>{summary.bonus}</strong>
      </div>

      <ScoreSection
        candidateScores={candidateScores}
        categoryIds={lowerCategoryIds}
        onSelect={onSelect}
        scores={scores}
        text={text}
        title={text.lowerSection}
      />

      <div className="yatzy-summary-row">
        <span>{text.lowerTotal}</span>
        <strong>{summary.lowerTotal}</strong>
      </div>
      <div className="yatzy-summary-row yatzy-grand-total">
        <span>{text.totalScore}</span>
        <strong>{summary.total}</strong>
      </div>
    </div>
  );
}
