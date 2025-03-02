const dropSound = new Audio('./sound/remove.mp3');
const breakSound = new Audio('./sound/break.mp3');
const backgroundSound = new Audio('./sound/MusMus-BGM-128.mp3');
const alternativeSound = new Audio('./sound/mm.mp3');   // 변경될 BGM

// 기본 브금
backgroundSound.volume = 0.1;
const loopStart = 0;
const loopEnd = 28.2;
backgroundSound.loop = false;

// 이스터에그 브금
alternativeSound.volume = 0.1;
alternativeSound.loop = true;
let isChanged = false;
let isAlternativePlaying = false;

export function playBGM() {
    if (isAlternativePlaying) return; 
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

const inputField = document.createElement("input");
inputField.type = "text";
inputField.style.position = "absolute";
inputField.style.top = "-9999px";
document.body.appendChild(inputField);

inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !isChanged) {
        const userInput = inputField.value.trim();
        if (userInput === "뭉탱이") {
            alternativeSound.play();
            isChanged = true;
            isAlternativePlaying = true;
            backgroundSound.pause();
            backgroundSound.currentTime = 0;
        }
        inputField.value = "";
    }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
      inputField.focus();
  }
});