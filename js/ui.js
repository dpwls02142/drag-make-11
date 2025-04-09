import { INITIAL_TIME_LIMIT } from './config.js';

export function updateScore(scoreDisplay, score, points) {
    const newScore = score + points;
    scoreDisplay.textContent = `${newScore}점`;
    return newScore;
}

export function updateTimerDisplay(timerDisplay, timerProgress, progressImage, timeLimit) {
    timerDisplay.style.display = 'none';
    
    // 진행 바 업데이트
    const progressPercentage = (timeLimit / INITIAL_TIME_LIMIT) * 100;
    timerProgress.style.width = `${progressPercentage}%`;
    
    // 이미지 위치 업데이트
    progressImage.style.left = `${progressPercentage}%`; // 백분율에 맞게 이동
    
    // 시간에 따른 색상 변경
    if (progressPercentage < 20) {
        timerProgress.style.backgroundColor = '#ff3333';
    } else if (progressPercentage < 50) {
        timerProgress.style.backgroundColor = '#ffcc33';
    } else {
        timerProgress.style.backgroundColor = '#66cc33';
    }
}

export function showGameOverScreen(gameOverScreen, endingImg, finalScoreElement, score) {
    if (score >= 100) {
        endingImg.classList.remove('hidden');
        finalScoreElement.textContent = `${score}점! 뭉탱대 수석 입학 축하한다맨이야`;
    } else {
        endingImg.classList.add('hidden');
        finalScoreElement.textContent = `${score}점 오옹 나이스~`;
    }
    
    gameOverScreen.classList.remove('hidden');
}

export function hideGameOverScreen(gameOverScreen) {
    gameOverScreen.classList.add('hidden');
}