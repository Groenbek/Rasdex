import { useState } from "react";
import { Footer } from "./components/Footer";
import { SettingsMenu } from "./components/SettingsMenu";
import { languages } from "./data/languages";
import { MeyerGame } from "./games/meyer/MeyerGame";
import { SnydGame } from "./games/snyd/SnydGame";
import { useScreenWakeLock } from "./hooks/useScreenWakeLock";

export function App() {
    function needsMotionPermission() {
        return (
            typeof window !== "undefined" &&
            typeof window.DeviceMotionEvent !== "undefined" &&
            typeof window.DeviceMotionEvent.requestPermission === "function"
        );
    }

    const [theme, setTheme] = useState("dark");
    const [language, setLanguage] = useState("en");
    const [activeGame, setActiveGame] = useState("snyd");
    const [shakeToRoll, setShakeToRoll] = useState(() => !needsMotionPermission());
    const [keepScreenAwake, setKeepScreenAwake] = useState(false);
    const screenWakeLock = useScreenWakeLock(keepScreenAwake);
    const text = languages[language];
    const controls = (
        <SettingsMenu
            keepScreenAwake={keepScreenAwake}
            language={language}
            onKeepScreenAwakeChange={setKeepScreenAwake}
            onLanguageChange={setLanguage}
            onShakeToRollChange={setShakeToRoll}
            onThemeChange={setTheme}
            screenWakeLock={screenWakeLock}
            shakeToRoll={shakeToRoll}
            text={text}
            theme={theme}
        />
    );

    return (
        <main className={`page-shell ${theme}`}>
            <div className="app-layout">
                <header className="game-header">
                    {theme === "football" && (
                        <img
                            className="football-logo"
                            src="/bayern-logo-2024.svg"
                            alt="FC Bayern Munich logo"
                        />
                    )}

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
                        <SnydGame
                            text={text}
                            controls={controls}
                            shakeToRoll={shakeToRoll}
                        />
                    ) : (
                        <MeyerGame
                            text={text}
                            controls={controls}
                            shakeToRoll={shakeToRoll}
                        />
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
