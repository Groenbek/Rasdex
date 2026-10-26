import rouletteWheelSound from "../data/sounds/roulette-wheel.mp3";

const rouletteAudio = new Audio(rouletteWheelSound);
rouletteAudio.volume = 0.5;
rouletteAudio.preload = "auto";

export function playRouletteSound() {
  rouletteAudio.pause();
  rouletteAudio.currentTime = 0;

  const playPromise = rouletteAudio.play();

  if (playPromise) {
    playPromise.catch(() => {});
  }
}

export function stopRouletteSound() {
  rouletteAudio.pause();
  rouletteAudio.currentTime = 0;
}
