const dropSound = new Audio('./sound/remove.mp3');
const breakSound = new Audio('./sound/break.mp3');
const backgroundSound = new Audio('./sound/MusMus-BGM-128.mp3');

backgroundSound.volume = 0.1;
backgroundSound.loop = false;

const loopStart = 0;
const loopEnd = 28.2;

export function playBGM() {
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    
    backgroundSound.addEventListener('timeupdate', () => {
        if (backgroundSound.currentTime >= loopEnd) {
            backgroundSound.currentTime = loopStart;
            backgroundSound.play();
        }
    });
}

export function stopBGM() {
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
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