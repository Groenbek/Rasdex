import lifeLostSound from "../data/sounds/lifelostNEW.mp3";
import youLostSound from "../data/sounds/you lost.mp3";

function playSound(source, volume = 0.65) {
  const audio = new Audio(source);
  audio.volume = volume;

  const playPromise = audio.play();

  if (playPromise) {
    playPromise.catch(() => {});
  }
}

export function playLifeLostSound() {
  playSound(lifeLostSound, 0.62);
}

export function playYouLostSound() {
  playSound(youLostSound, 0.72);
}
