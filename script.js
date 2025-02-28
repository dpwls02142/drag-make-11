import { playDrop, playBreak, playBGM, stopBGM } from './sound.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const timerProgress = document.getElementById('timerProgressInner');
const startButton = document.getElementById('startButton');

const ROWS = 10;
const COLS = 20;
const INITIAL_TIME_LIMIT = 120;
const TARGET_SUM = 11;

let apples = [];
let selectedApples = [];
let score = 0;
let isGameOver = false;
let timeLimit = INITIAL_TIME_LIMIT;
let timerInterval;
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

// 랜덤 숫자 생성 (1-9)
function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

// 사과 그리기
function drawApple(apple) {
    const { x, y, number, visible } = apple;
    
    if (!visible) return;
    
    // 사과 배경
    ctx.fillStyle = '#ffd3c9';
    ctx.fillRect(x, y, getAppleSize(), getAppleSize());
    
    // 사과 테두리
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, getAppleSize(), getAppleSize());
    
    // 사과 숫자
    ctx.fillStyle = 'white';
    ctx.font = '30px pretendard';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, x + getAppleSize() / 2, y + getAppleSize() / 2);
}

// 선택 영역 표시
function drawSelectionRect(startX, startY, endX, endY) {
    const sum = selectedApples.reduce((acc, apple) => acc + apple.number, 0);
    
    // 합계에 따른 색상 변경
    if (sum === TARGET_SUM) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'; 
    } else {
        ctx.strokeStyle = 'rgba(21, 21, 24, 0.5)'; 
        ctx.fillStyle = 'rgba(83, 85, 87, 0.39)';
    }
    
    // 테두리와 배경 그리기
    ctx.fillRect(startX, startY, endX - startX, endY - startY);
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

// 게임판 그리기
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    apples.forEach(apple => drawApple(apple));
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
    const appleSize = canvas.width / COLS;
    
    selectedApples = apples.filter(apple => {
        const withinX = apple.x < endX && apple.x + appleSize > startX;
        const withinY = apple.y < endY && apple.y + appleSize > startY;
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
        requestAnimationFrame(drawBoard);
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
    scoreDisplay.textContent = `점수: ${score}`;
}


// 타이머 업데이트 함수 수정
function updateTimerDisplay() {
    timerDisplay.textContent = `남은 시간: ${timeLimit}초`;
    
    // 진행 바 업데이트
    const progressPercentage = (timeLimit / INITIAL_TIME_LIMIT) * 100;
    timerProgress.style.width = `${progressPercentage}%`;
    
    // 이미지 위치 업데이트 - 여기가 중요
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
    timerDisplay.textContent = 'ㅅㄱㅇ';
    
    // 종료 화면 표시
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '50px pretendard';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}점 오옹 나이스~`, canvas.width / 2, canvas.height / 2);
}

// 이벤트 리스너 설정
canvas.addEventListener('mousedown', (e) => {
    if (isGameOver) return;
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
    selectedApples = [];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || isGameOver) return;
    const endX = e.offsetX;
    const endY = e.offsetY;
    selectApples(
        Math.min(startX, endX), 
        Math.min(startY, endY),
        Math.max(startX, endX), 
        Math.max(startY, endY)
    );
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    removeApples();
});

// 페이지 로드 시 초기화 (시작 화면만 표시)
window.onload = () => {
    document.querySelector('.game-screen').style.display = 'none';
    document.querySelector('.start-screen-container').style.display = 'flex';
};