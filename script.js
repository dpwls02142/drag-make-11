import { playDrop, playBreak, playBGM, stopBGM } from './sound.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const timerProgress = document.getElementById('timerProgressInner');
const startButton = document.getElementById('startButton');
const bgmToggleButton = document.getElementById('bgmToggleButton');

const ROWS = 10;
const COLS = 20;
const INITIAL_TIME_LIMIT = 10;
const TARGET_SUM = 11;

let apples = [];
let selectedApples = [];
let score = 0;
let isGameOver = false;
let timeLimit = INITIAL_TIME_LIMIT;
let timerInterval;
let isBGMPlaying = true;
let isDragging = false;
let startX, startY;

startButton.addEventListener('click', () => {
    document.querySelector('.start-screen-container').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'block';
    initGame();
    playBGM();
});

// 초기화
function initGame() {
    isGameOver = false;
    score = 0;
    timeLimit = INITIAL_TIME_LIMIT;
    initApples();

    updateTimerDisplay();
    updateScore(0);
    startTimer();
}

// bgm 버튼
bgmToggleButton.addEventListener('click', () => {
    if (isBGMPlaying) {
        stopBGM();
        bgmToggleButton.textContent = '🔇';
    } else {
        playBGM();
        bgmToggleButton.textContent = '🔊';
    }
    isBGMPlaying = !isBGMPlaying;
});


// 랜덤 숫자 생성 (1-9)
function getRandomNumber() {
    return Math.floor(Math.random() * 9) + 1;
}

// 게임판 그리기
function drawBoard() {
    ctx.fillStyle = '#f0f0f0';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const appleSize = getAppleSize();
    apples.forEach(apple => {
        if (!apple.visible) {
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(apple.x, apple.y, appleSize, appleSize);
        }
    });

    apples.forEach(apple => {
        if (apple.visible) {
            drawApple(apple);
        }
    });
}

// 사과 그리기
function drawApple(apple) {
    const { x, y, number, visible } = apple;
    
    if (!visible) return;
    
    const size = getAppleSize();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, size, size);
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
    
    ctx.fillStyle = '#555555';
    ctx.font = '22px Pretendard';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, x + size / 2, y + size / 2);
}

// 선택 영역 표시
function drawSelectionRect(startX, startY, endX, endY) {
    const sum = selectedApples.reduce((acc, apple) => acc + apple.number, 0);
    
    if (sum === TARGET_SUM) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'; 
    } else {
        ctx.strokeStyle = 'rgba(92, 92, 103, 0.35)'; 
        ctx.fillStyle = 'rgba(83, 85, 87, 0.39)';
    }

    ctx.fillRect(startX, startY, endX - startX, endY - startY);
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

// 사과 크기 계산
function getAppleSize() {
    return canvas.width / COLS;
}

// 초기 사과 데이터 생성
function initApples() {
    apples = [];
    const appleSize = getAppleSize();
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            apples.push({
                x: col * appleSize,
                y: row * appleSize,
                number: getRandomNumber(),
                visible: true,
            });
        }
    }
    drawBoard();
}

// 선택 영역 내의 사과 선택
function selectApples(startX, startY, endX, endY) {
    const appleSize = getAppleSize();
    
    selectedApples = apples.filter(apple => {
        // 셀 중앙이 선택 영역 안에 있는지 확인
        const appleCenterX = apple.x + (appleSize / 2);
        const appleCenterY = apple.y + (appleSize / 2);
        
        const withinX = appleCenterX >= startX && appleCenterX < endX;
        const withinY = appleCenterY >= startY && appleCenterY < endY;
        
        return withinX && withinY && apple.visible;
    });
    drawBoard();
    drawSelectionRect(startX, startY, endX, endY);
}

// 선택된 사과들 처리
function removeApples() {
    if (isGameOver) return;

    const sum = selectedApples.reduce((acc, apple) => acc + apple.number, 0);
    
    if (sum === TARGET_SUM) {
        const removedCount = selectedApples.length;
        selectedApples.forEach(apple => apple.visible = false);
        updateScore(removedCount);
        
        drawBoard();
        
        selectedApples = [];
        playDrop();
    } else {
        selectedApples = [];
        drawBoard();
    }
}

// 점수 업데이트
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `${score}점`;
}


// 타이머
function updateTimerDisplay() {
    timerDisplay.style.display = 'none';
    
    // 진행 바 업데이트
    const progressPercentage = (timeLimit / INITIAL_TIME_LIMIT) * 100;
    timerProgress.style.width = `${progressPercentage}%`;
    
    // 이미지 위치 업데이트
    const progressImage = document.getElementById('progressImage');
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

// 타이머 시작
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLimit--;
        updateTimerDisplay();
        
        if (timeLimit <= 0) {
            endGame();
            playBreak();
            stopBGM();
        }
    }, 1000);
}

// 게임 종료
function endGame() {
    isGameOver = true;
    clearInterval(timerInterval);
    
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreElement = document.getElementById('final-score');
    const endingImg = document.querySelector('.ending-img');
    const retryButton = document.getElementById('retry-button');
    
    // 점수에 따라 이미지 표시
    if (score >= 1) {
        endingImg.classList.remove('hidden');
        finalScoreElement.textContent = `${score}점! 뭉탱대 수석 입학 축하한다맨이야`;
    } else {
        endingImg.classList.add('hidden');
        finalScoreElement.textContent = `${score}점 오옹 나이스~`;
    }
    
    // 게임 오버
    gameOverScreen.classList.remove('hidden');
    
    // 다시하기
    retryButton.addEventListener('click', resetGame, { once: true });
}

function resetGame() {
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.classList.add('hidden');
    
    initGame();
    playBGM();
}

const appleSize = getAppleSize();
// 좌표를 그리드 인덱스로 변환
function getGridIndex(x, y) {
    return { row: Math.floor(y / appleSize), col: Math.floor(x / appleSize) };
}

// 특정 위치에 사과가 있는지 확인
function hasVisibleAppleAt(x, y) {
    const { row, col } = getGridIndex(x, y);
    const appleSize = getAppleSize();
    
    // 해당 위치에 있는 사과 찾기
    const apple = apples.find(a => 
        Math.floor(a.x / appleSize) === col && 
        Math.floor(a.y / appleSize) === row
    );
    
    return apple && apple.visible;
}

// 이벤트 리스너
canvas.addEventListener('mousedown', (e) => {
    if (isGameOver) return;
    
    // 클릭한 위치에 사과가 있을 때만
    if (!hasVisibleAppleAt(e.offsetX, e.offsetY)) return;
    isDragging = true;
    
    // 클릭한 정확한 픽셀 위치 저장
    startX = e.offsetX;
    startY = e.offsetY;
    
    // 시작 셀 찾기
    const startCell = getGridIndex(startX, startY);
    selectedApples = [];
    
    // 시작 시 첫 번째 셀만 선택
    const firstApple = apples.find(apple => 
        Math.floor(apple.x / getAppleSize()) === startCell.col && 
        Math.floor(apple.y / getAppleSize()) === startCell.row && 
        apple.visible
    );
    
    if (firstApple) {
        selectedApples = [firstApple];
        // 첫 번째 셀만 강조 표시
        drawBoard();
        drawSelectionRect(
            firstApple.x, 
            firstApple.y, 
            firstApple.x + getAppleSize(), 
            firstApple.y + getAppleSize()
        );
    }
});

// mousemove 이벤트 핸들러 수정
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || isGameOver) return;
    
    // 현재 마우스 위치
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    
    // 그리드 기반으로 선택 영역 조정
    const startCell = getGridIndex(startX, startY);
    const currentCell = getGridIndex(currentX, currentY);
    
    // 그리드 좌표로 변환
    const gridMinCol = Math.min(startCell.col, currentCell.col);
    const gridMaxCol = Math.max(startCell.col, currentCell.col);
    const gridMinRow = Math.min(startCell.row, currentCell.row);
    const gridMaxRow = Math.max(startCell.row, currentCell.row);
    
    // 그리드 좌표를 픽셀 좌표로 변환하여 선택 영역 계산
    const appleSize = getAppleSize();
    const selectionMinX = gridMinCol * appleSize;
    const selectionMaxX = (gridMaxCol + 1) * appleSize;
    const selectionMinY = gridMinRow * appleSize;
    const selectionMaxY = (gridMaxRow + 1) * appleSize;
    
    // 이 영역에 있는 사과들 선택
    selectApples(selectionMinX, selectionMinY, selectionMaxX, selectionMaxY);
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    removeApples();
});

// 페이지 로드 시 초기화
window.onload = () => {
    document.querySelector('.game-screen').style.display = 'none';
    document.querySelector('.start-screen-container').style.display = 'flex';
};