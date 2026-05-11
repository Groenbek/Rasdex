import diceRollSound from "../data/sounds/dice roll.mp3";

const diceRollAudio = new Audio(diceRollSound);
diceRollAudio.volume = 0.55;

export function playDiceRollSound() {
  diceRollAudio.currentTime = 0;

  const playPromise = diceRollAudio.play();

  if (playPromise) {
    playPromise.catch(() => {});
  }
}
