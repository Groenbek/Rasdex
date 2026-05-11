import { useEffect, useRef, useState } from "react";
import { languageOptions, languages } from "../data/languages";
import { Flag } from "./Flag";
import { ThemeToggle } from "./ThemeToggle";

function getMotionPermissionRequirement() {
    return (
        typeof window !== "undefined" &&
        typeof window.DeviceMotionEvent !== "undefined" &&
        typeof window.DeviceMotionEvent.requestPermission === "function"
    );
}

export function SettingsMenu({
    keepScreenAwake,
    language,
    onKeepScreenAwakeChange,
    onLanguageChange,
    onShakeToRollChange,
    onThemeChange,
    screenWakeLock,
    shakeToRoll,
    text,
    theme,
}) {
    const [open, setOpen] = useState(false);
    const [motionPermissionState, setMotionPermissionState] = useState(() =>
        getMotionPermissionRequirement() ? "prompt" : "granted"
    );
    const menuRef = useRef(null);
    const shakeHint =
        motionPermissionState === "prompt" && !shakeToRoll
            ? text.settings.shakePermissionHint ||
              "Tap to allow motion access for shake-to-throw."
            : motionPermissionState === "denied" && !shakeToRoll
              ? text.settings.shakePermissionDenied ||
                "Motion access was not granted. Enable it in your browser settings, then try again."
              : text.settings.shakeHint;

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        function closeMenu(event) {
            if (!menuRef.current?.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("pointerdown", closeMenu);

        return () => {
            document.removeEventListener("pointerdown", closeMenu);
        };
    }, [open]);

    function selectLanguage(nextLanguage) {
        onLanguageChange(nextLanguage);
    }

    async function toggleShakeToRoll() {
        const nextValue = !shakeToRoll;

        if (
            nextValue &&
            getMotionPermissionRequirement()
        ) {
            try {
                const permission = await window.DeviceMotionEvent.requestPermission();

                if (permission !== "granted") {
                    setMotionPermissionState("denied");
                    onShakeToRollChange(false);
                    return;
                }

                setMotionPermissionState("granted");
            } catch {
                setMotionPermissionState("denied");
                onShakeToRollChange(false);
                return;
            }
        }

        onShakeToRollChange(nextValue);
    }

    return (
        <div className="settings-menu" ref={menuRef}>
            <button
                className={`settings-button ${open ? "active" : ""}`}
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-haspopup="menu"
                aria-label={text.settings.open}
            >
                <span className="switch-icon">{"\u2699\uFE0F"}</span>
            </button>

            {open && (
                <div className="settings-panel" role="menu">
                    <div className="settings-section">
                        <span className="settings-label">
                            {text.settings.color}
                        </span>
                        <ThemeToggle
                            labels={text.settings}
                            theme={theme}
                            onChange={onThemeChange}
                        />
                    </div>

                    <div className="settings-section">
                        <span className="settings-label">
                            {text.settings.motion}
                        </span>
                        <button
                            className={`settings-switch ${shakeToRoll ? "active" : ""}`}
                            type="button"
                            onClick={toggleShakeToRoll}
                            role="switch"
                            aria-checked={shakeToRoll}
                        >
                            <span>{text.settings.shakeToThrow}</span>
                            <span className="settings-switch-state">
                                {shakeToRoll
                                    ? text.settings.on
                                    : text.settings.off}
                            </span>
                        </button>
                        <span className="settings-hint">{shakeHint}</span>
                    </div>

                    <div className="settings-section">
                        <span className="settings-label">
                            {text.settings.language}
                        </span>
                        <div className="settings-language-list">
                            {languageOptions.map((languageKey) => (
                                <button
                                    className={
                                        languageKey === language ? "active" : ""
                                    }
                                    type="button"
                                    onClick={() => selectLanguage(languageKey)}
                                    role="menuitemradio"
                                    aria-checked={languageKey === language}
                                    key={languageKey}
                                >
                                    <Flag languageKey={languageKey} />
                                    <span>{languages[languageKey].name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="settings-section settings-section-screen">
                        <span className="settings-label">
                            {text.settings.screen}
                        </span>
                        <button
                            className={`settings-switch ${
                                keepScreenAwake && screenWakeLock.active
                                    ? "active"
                                    : ""
                            }`}
                            type="button"
                            onClick={() =>
                                onKeepScreenAwakeChange(!keepScreenAwake)
                            }
                            role="switch"
                            aria-checked={
                                keepScreenAwake && screenWakeLock.active
                            }
                            disabled={!screenWakeLock.supported}
                        >
                            <span>{text.settings.keepAwake}</span>
                            <span className="settings-switch-state">
                                {keepScreenAwake && screenWakeLock.active
                                    ? text.settings.on
                                    : text.settings.off}
                            </span>
                        </button>
                        <span className="settings-hint">
                            {screenWakeLock.supported
                                ? text.settings.keepAwakeHint
                                : text.settings.keepAwakeUnsupported}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
