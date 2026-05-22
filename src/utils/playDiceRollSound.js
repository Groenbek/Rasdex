import diceRollSound from "../data/sounds/dice roll.mp3";

const diceRollAudio = new Audio(diceRollSound);
diceRollAudio.volume = 0.55;

let diceRollAudioUnlocked = false;

export function unlockDiceRollSound() {
  if (diceRollAudioUnlocked) {
    return;
  }

  const wasMuted = diceRollAudio.muted;
  diceRollAudio.muted = true;

  const playPromise = diceRollAudio.play();

  if (!playPromise) {
    diceRollAudio.pause();
    diceRollAudio.currentTime = 0;
    diceRollAudio.muted = wasMuted;
    diceRollAudioUnlocked = true;
    return;
  }

  playPromise
    .then(() => {
      diceRollAudio.pause();
      diceRollAudio.currentTime = 0;
      diceRollAudio.muted = wasMuted;
      diceRollAudioUnlocked = true;
    })
    .catch(() => {
      diceRollAudio.muted = wasMuted;
    });
}

export function playDiceRollSound() {
  diceRollAudio.currentTime = 0;

  const playPromise = diceRollAudio.play();

  if (playPromise) {
    playPromise.catch(() => {});
  }
}
