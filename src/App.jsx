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
  const text = languages[language];
  const controls = (
    <SettingsMenu
      language={language}
      onLanguageChange={setLanguage}
      onThemeChange={setTheme}
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
            <SnydGame text={text} controls={controls} />
          ) : (
            <MeyerGame text={text} controls={controls} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
