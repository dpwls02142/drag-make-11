import { playDrop, playBreak, playBGM, stopBGM } from './sound.js';
import { getAppleSize, getGridIndex, hasVisibleAppleAt, setApples } from './utils.js';
import { initApples, drawBoard, drawSelectionRect, selectApples as selectApplesOnBoard, removeApples as removeApplesFromBoard, getApples, getSelectedApples, setSelectedApples } from './board.js';
import { updateScore, updateTimerDisplay, showGameOverScreen, hideGameOverScreen } from './ui.js';
import { INITIAL_TIME_LIMIT, TARGET_SUM } from './config.js';

let score = 0;
let isGameOver = false;
let timeLimit = INITIAL_TIME_LIMIT;
let timerInterval;
let isDragging = false;
let startX = 0;
let startY = 0;
let isBGMPlaying = false;

export function initGame(canvas, ctx, timerDisplay, scoreDisplay, timerProgress, progressImage) {
    isGameOver = false;
    score = 0;
    timeLimit = INITIAL_TIME_LIMIT;
    
    const apples = initApples(canvas);
    setApples(apples);
    drawBoard(ctx, canvas);
    
    updateTimerDisplay(timerDisplay, timerProgress, progressImage, timeLimit);
    score = updateScore(scoreDisplay, 0, 0);
    startTimer(timerDisplay, timerProgress, progressImage);
    
    return {
        apples,
        score,
        timeLimit,
        isGameOver
    };
}

export function resetGame(gameOverScreen, canvas, ctx, timerDisplay, scoreDisplay, timerProgress, progressImage) {
    hideGameOverScreen(gameOverScreen);

    isDragging = false;
    startX = 0;
    startY = 0;

    initGame(canvas, ctx, timerDisplay, scoreDisplay, timerProgress, progressImage);
    playBGM();
}

export function endGame(scoreDisplay, gameOverScreen, endingImg, finalScoreElement) {
    isGameOver = true;
    clearInterval(timerInterval);
    
    showGameOverScreen(gameOverScreen, endingImg, finalScoreElement, score);
    playBreak();
    stopBGM();
}

export function startTimer(timerDisplay, timerProgress, progressImage) {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        --timeLimit;
        updateTimerDisplay(timerDisplay, timerProgress, progressImage, timeLimit);
        
        if (timeLimit <= 0) {
            clearInterval(timerInterval);
            return { isGameOver: true };
        }
        
        return { timeLimit, isGameOver };
    }, 1000);
}

export function handleMouseDown(e, canvas, ctx, isGameOver) {
    if (isGameOver) return { isDragging: false };
    
    const appleSize = getAppleSize(canvas);
    
    // 클릭한 위치에 사과가 있을 때만
    if (!hasVisibleAppleAt(e.offsetX, e.offsetY, appleSize)) return { isDragging: false };
    
    // 클릭한 정확한 픽셀 위치 저장
    startX = e.offsetX;
    startY = e.offsetY;
    
    // 시작 셀 찾기
    const startCell = getGridIndex(startX, startY, appleSize);
    setSelectedApples([]);
    
    // 시작 시 첫 번째 셀만 선택
    const apples = getApples();
    const firstApple = apples.find(apple => 
        Math.floor(apple.x / appleSize) === startCell.col && 
        Math.floor(apple.y / appleSize) === startCell.row && 
        apple.visible
    );
    
    if (firstApple) {
        setSelectedApples([firstApple]);
        // 첫 번째 셀만 강조 표시
        drawBoard(ctx, canvas);
        drawSelectionRect(
            ctx,
            firstApple.x, 
            firstApple.y, 
            firstApple.x + appleSize, 
            firstApple.y + appleSize
        );
    }
    
    return { isDragging: true, startX, startY };
}

export function handleMouseMove(e, canvas, ctx, isDragging, isGameOver, startX, startY) {
    if (!isDragging || isGameOver) return;
    
    // 현재 마우스 위치
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    
    const appleSize = getAppleSize(canvas);
    
    // 그리드 기반으로 선택 영역 조정
    const startCell = getGridIndex(startX, startY, appleSize);
    const currentCell = getGridIndex(currentX, currentY, appleSize);
    
    // 그리드 좌표로 변환
    const gridMinCol = Math.min(startCell.col, currentCell.col);
    const gridMaxCol = Math.max(startCell.col, currentCell.col);
    const gridMinRow = Math.min(startCell.row, currentCell.row);
    const gridMaxRow = Math.max(startCell.row, currentCell.row);
    
    // 그리드 좌표를 픽셀 좌표로 변환하여 선택 영역 계산
    const selectionMinX = gridMinCol * appleSize;
    const selectionMaxX = (gridMaxCol + 1) * appleSize;
    const selectionMinY = gridMinRow * appleSize;
    const selectionMaxY = (gridMaxRow + 1) * appleSize;
    
    // 이 영역에 있는 사과들 선택
    return selectApplesOnBoard(ctx, canvas, selectionMinX, selectionMinY, selectionMaxX, selectionMaxY);
}

export function handleMouseUp(scoreDisplay, canvas, ctx, isGameOver) {
    if (isGameOver) return { isDragging: false };
    
    const selectedApples = getSelectedApples();
    const sum = selectedApples.reduce((acc, apple) => acc + apple.number, 0);
    
    if (sum === TARGET_SUM) {
        const removedCount = removeApplesFromBoard(selectedApples);
        score = updateScore(scoreDisplay, score, removedCount);
        
        drawBoard(ctx, canvas);
        setSelectedApples([]);
        playDrop();
        
        return { isDragging: false, score };
    } else {
        setSelectedApples([]);
        drawBoard(ctx, canvas);
        return { isDragging: false };
    }
}

export function toggleBGM(isBGMPlaying) {
    if (isBGMPlaying) {
        stopBGM();
        return false;
    } else {
        playBGM();
        return true;
    }
}