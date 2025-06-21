import { Howl, Howler } from 'howler';

let isMuted = false;

const sounds = {
  clear: new Howl({ src: ['/sounds/clear.wav'], volume: 0.3 }),
  drop: new Howl({ src: ['/sounds/drop.wav'], volume: 0.3 }),
  gameover: new Howl({ src: ['/sounds/gameover.mp3'], volume: 0.4 }),
};

Howler.mute(isMuted);

export function playSound(type: 'clear' | 'drop' | 'gameover') {
  sounds[type]?.play();
}

export function toggleMute() {
  isMuted = !isMuted;
  Howler.mute(isMuted);
  return isMuted;
}

export function getMutedState() {
  return isMuted;
} 