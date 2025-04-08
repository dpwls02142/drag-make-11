import { playDrop, playBreak, playBGM, stopBGM, setupEasterEgg } from './sound.js';
import { initGame, resetGame, endGame, handleMouseDown, handleMouseMove, handleMouseUp, toggleBGM } from './game.js';
import { setupResolutionCheck } from './utils.js';
import { INITIAL_STATE } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const timerProgress = document.getElementById('timerProgressInner');
    const progressImage = document.getElementById('progressImage');
    const startButton = document.getElementById('startButton');
    const bgmToggleButton = document.getElementById('bgmToggleButton');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreElement = document.getElementById('final-score');
    const endingImg = document.querySelector('.ending-img');
    const retryButton = document.getElementById('retry-button');

    // 상태 초기화
    let {
        isGameOver,
        isBGMPlaying,
        isDragging,
        startX,
        startY
    } = structuredClone(INITIAL_STATE);

    // 이스터에그 설정
    setupEasterEgg();
    
    // 해상도 체크 설정
    setupResolutionCheck();

    startButton.addEventListener('click', () => {
        document.querySelector('.start-screen-container').style.display = 'none';
        document.querySelector('.game-screen').style.display = 'block';
        initGame(canvas, ctx, timerDisplay, scoreDisplay, timerProgress, progressImage);
        playBGM();
        isBGMPlaying = true;
    });

    // bgm 버튼
    bgmToggleButton.addEventListener('click', () => {
        isBGMPlaying = toggleBGM(isBGMPlaying);
        bgmToggleButton.textContent = isBGMPlaying ? '🔊' : '🔇';
    });

    // 이벤트 리스너
    canvas.addEventListener('mousedown', (e) => {
        const result = handleMouseDown(e, canvas, ctx, isGameOver);
        isDragging = result.isDragging;
        if (result.startX !== undefined) startX = result.startX;
        if (result.startY !== undefined) startY = result.startY;
    });

    canvas.addEventListener('mousemove', (e) => {
        handleMouseMove(e, canvas, ctx, isDragging, isGameOver, startX, startY);
    });

    canvas.addEventListener('mouseup', () => {
        const result = handleMouseUp(scoreDisplay, canvas, ctx, isGameOver);
        isDragging = result.isDragging;
        
        if (result.timeIsUp) {
            isGameOver = true;
            endGame(scoreDisplay, gameOverScreen, endingImg, finalScoreElement);
        }
    });

    // 다시하기
    retryButton.addEventListener('click', () => {
        resetGame(gameOverScreen, canvas, ctx, timerDisplay, scoreDisplay, timerProgress, progressImage);
        isGameOver = false;
        isBGMPlaying = true;
    });

    // 페이지 로드 시 초기화
    document.querySelector('.game-screen').style.display = 'none';
    document.querySelector('.start-screen-container').style.display = 'flex';
});