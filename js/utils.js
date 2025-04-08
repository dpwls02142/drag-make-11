import { ROWS, COLS } from './config.js';

let apples = [];

export function setApples(applesArray) {
    apples = applesArray;
}

export function getAppleSize(canvas) {
    return canvas.width / COLS;
}

export function getRandomNumber() {
    return Math.floor(Math.random() * 9) + 1;
}

export function getGridIndex(x, y, appleSize) {
    return { row: Math.floor(y / appleSize), col: Math.floor(x / appleSize) };
}

export function hasVisibleAppleAt(x, y, appleSize) {
    const { row, col } = getGridIndex(x, y, appleSize);
    
    // 해당 위치에 있는 사과 찾기
    const apple = apples.find(a => 
        Math.floor(a.x / appleSize) === col && 
        Math.floor(a.y / appleSize) === row
    );
    
    return apple && apple.visible;
}

export function checkWindowWidth() {
    const minWidth = 1280;
    const currentWidth = window.innerWidth;
    
    if (currentWidth < minWidth) {
        showResolutionAlert(currentWidth);
    } else {
        hideResolutionAlert();
    }
}

function showResolutionAlert(currentWidth) {
    const alertElement = document.getElementById('resolution-alert');
    const currentWidthElement = document.getElementById('current-width');
    
    currentWidthElement.textContent = `현재 브라우저 크기: ${currentWidth}px`;
    
    if (alertElement.classList.contains('hidden')) {
        alertElement.classList.remove('hidden');
    }
}

function hideResolutionAlert() {
    const alertElement = document.getElementById('resolution-alert');
    if (!alertElement.classList.contains('hidden')) {
        alertElement.classList.add('alert-closing');
        
        setTimeout(function() {
            alertElement.classList.add('hidden');
            alertElement.classList.remove('alert-closing');
        }, 300);
    }
}

export function setupResolutionCheck() {
    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);
    
    document.getElementById('alert-close-btn').addEventListener('click', function() {
        const alertElement = document.getElementById('resolution-alert');
        alertElement.classList.add('alert-closing');
        
        setTimeout(function() {
            alertElement.classList.add('hidden');
            alertElement.classList.remove('alert-closing');
        }, 300);
    });
}