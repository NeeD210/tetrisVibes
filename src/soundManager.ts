import { Howl } from 'howler';

const sounds = {
  clear: new Howl({ src: ['/sounds/clear.wav'], volume: 0.3 }),
  drop: new Howl({ src: ['/sounds/drop.wav'], volume: 0.3 }),
  gameover: new Howl({ src: ['/sounds/gameover.mp3'], volume: 0.4 }),
};

export function playSound(type: 'clear' | 'drop' | 'gameover') {
  sounds[type]?.play();
} 