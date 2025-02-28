const dropSound = new Audio('./sound/remove.mp3');
const breakSound = new Audio('./sound/break.mp3');
const backgroundSound = new Audio('./sound/supertank.mp3');

backgroundSound.loop = true;
backgroundSound.volume = 0.2;

export function playBGM() {
    backgroundSound.currentTime = 0;
    backgroundSound.play();
}

export function stopBGM() {
    backgroundSound.pause();
}

export function playDrop() {
  playSound(dropSound)
}

export function playBreak() {
  playSound(breakSound)
}

function playSound(sound) {
  sound.currentTime = 0
  sound.play()
}