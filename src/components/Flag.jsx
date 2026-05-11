import { languages } from "../data/languages";

export function Flag({ languageKey }) {
  const language = languages[languageKey];

  return <span className={`flag ${language.flagClass}`} role="img" aria-label={language.name} />;
}
