import { useState } from "react";
import { Footer } from "./components/Footer";
import { SettingsMenu } from "./components/SettingsMenu";
import { languages } from "./data/languages";
import { MeyerGame } from "./games/meyer/MeyerGame";
import { SnydGame } from "./games/snyd/SnydGame";

export function App() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [activeGame, setActiveGame] = useState("snyd");
  const [shakeToRoll, setShakeToRoll] = useState(false);
  const text = languages[language];
  const controls = (
    <SettingsMenu
      language={language}
      onLanguageChange={setLanguage}
      onShakeToRollChange={setShakeToRoll}
      onThemeChange={setTheme}
      shakeToRoll={shakeToRoll}
      text={text}
      theme={theme}
    />
  );

  return (
    <main className={`page-shell ${theme}`}>
      <div className="app-layout">
        <header className="game-header">
          <nav className="game-nav" aria-label="Game selection">
            <button
              className={activeGame === "snyd" ? "active" : ""}
              type="button"
              onClick={() => setActiveGame("snyd")}
              aria-pressed={activeGame === "snyd"}
            >
              Snyd
            </button>
            <button
              className={activeGame === "meyer" ? "active" : ""}
              type="button"
              onClick={() => setActiveGame("meyer")}
              aria-pressed={activeGame === "meyer"}
            >
              Meyer
            </button>
          </nav>
        </header>

        <div className="game-stage">
          {activeGame === "snyd" ? (
            <SnydGame text={text} controls={controls} shakeToRoll={shakeToRoll} />
          ) : (
            <MeyerGame text={text} controls={controls} shakeToRoll={shakeToRoll} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
