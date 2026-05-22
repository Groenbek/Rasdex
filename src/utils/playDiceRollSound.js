import diceRollSound from "../data/sounds/dice roll.mp3";

const diceRollAudio = new Audio(diceRollSound);
diceRollAudio.volume = 0.55;
diceRollAudio.preload = "auto";

let diceRollAudioUnlocked = false;
let diceRollPlaybackId = 0;

export function unlockDiceRollSound() {
  if (diceRollAudioUnlocked) {
    return;
  }

  const playbackId = diceRollPlaybackId;
  const wasMuted = diceRollAudio.muted;
  diceRollAudio.muted = true;

  const playPromise = diceRollAudio.play();

  if (!playPromise) {
    if (playbackId === diceRollPlaybackId) {
      diceRollAudio.pause();
      diceRollAudio.currentTime = 0;
      diceRollAudio.muted = wasMuted;
    }

    diceRollAudioUnlocked = true;
    return;
  }

  playPromise
    .then(() => {
      if (playbackId === diceRollPlaybackId) {
        diceRollAudio.pause();
        diceRollAudio.currentTime = 0;
        diceRollAudio.muted = wasMuted;
      }

      diceRollAudioUnlocked = true;
    })
    .catch(() => {
      if (playbackId === diceRollPlaybackId) {
        diceRollAudio.muted = wasMuted;
      }
    });
}

export function playDiceRollSound() {
  diceRollPlaybackId += 1;
  diceRollAudio.muted = false;
  diceRollAudio.currentTime = 0;

  const playPromise = diceRollAudio.play();

  if (playPromise) {
    playPromise.catch(() => {});
  }
}
