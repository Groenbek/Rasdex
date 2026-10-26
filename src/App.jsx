import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { SettingsMenu } from "./components/SettingsMenu";
import { languages } from "./data/languages";
import { MeyerGame } from "./games/meyer/MeyerGame";
import { RouletteGame } from "./games/roulette/RouletteGame";
import { SnydGame } from "./games/snyd/SnydGame";
import { YatzyGame } from "./games/yatzy/YatzyGame";
import { useScreenWakeLock } from "./hooks/useScreenWakeLock";
import { unlockDiceRollSound } from "./utils/playDiceRollSound";

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
    const [kasperMode, setKasperMode] = useState(false);
    const screenWakeLock = useScreenWakeLock(keepScreenAwake);
    const text = languages[language];

    useEffect(() => {
        function unlockAudio() {
            unlockDiceRollSound();
        }

        window.addEventListener("pointerdown", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });

        return () => {
            window.removeEventListener("pointerdown", unlockAudio);
            window.removeEventListener("keydown", unlockAudio);
        };
    }, []);

    const controls = (
        <SettingsMenu
            keepScreenAwake={keepScreenAwake}
            kasperMode={kasperMode}
            language={language}
            onKasperModeChange={setKasperMode}
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
                        <button
                            className={activeGame === "roulette" ? "active" : ""}
                            type="button"
                            onClick={() => setActiveGame("roulette")}
                            aria-pressed={activeGame === "roulette"}
                        >
                            {text.roulette.navTitle}
                        </button>
                        <button
                            className={activeGame === "yatzy" ? "active" : ""}
                            type="button"
                            onClick={() => setActiveGame("yatzy")}
                            aria-pressed={activeGame === "yatzy"}
                        >
                            {text.yatzy.navTitle}
                        </button>
                    </nav>
                </header>

                <div className="game-stage">
                    {activeGame === "snyd" ? (
                        <SnydGame
                            text={text}
                            controls={controls}
                            kasperMode={kasperMode}
                            shakeToRoll={shakeToRoll}
                        />
                    ) : activeGame === "meyer" ? (
                        <MeyerGame
                            text={text}
                            controls={controls}
                            shakeToRoll={shakeToRoll}
                        />
                    ) : activeGame === "roulette" ? (
                        <RouletteGame text={text} controls={controls} />
                    ) : (
                        <YatzyGame text={text} controls={controls} />
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
