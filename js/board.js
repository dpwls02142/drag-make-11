import { getAppleSize, getRandomNumber } from './utils.js';
import { ROWS, COLS, TARGET_SUM } from './config.js';

let apples = [];
let selectedApples = [];

export function getApples() {
    return apples;
}

export function getSelectedApples() {
    return selectedApples;
}

export function setSelectedApples(newSelectedApples) {
    selectedApples = newSelectedApples;
}

export function initApples(canvas) {
    apples = [];
    const appleSize = getAppleSize(canvas);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            let number = getRandomNumber();

            // 15% 확률로 가로로 11의 합이 되는 경우 생성
            if (col < COLS - 1 && Math.random() < 0.15) {
                const complement = TARGET_SUM - number;
                if (complement > 0 && complement <= 9) {
                    apples.push({
                        x: col * appleSize,
                        y: row * appleSize,
                        number: number,
                        visible: true,
                    });
                    apples.push({
                        x: (col + 1) * appleSize,
                        y: row * appleSize,
                        number: complement,
                        visible: true,
                    });
                    col++;
                    continue;
                }
            }

            // 일반 랜덤 숫자 추가
            apples.push({
                x: col * appleSize,
                y: row * appleSize,
                number: number,
                visible: true,
            });
        }
    }
    return apples;
}

export function drawBoard(ctx, canvas) {
    ctx.fillStyle = '#f0f0f0';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const appleSize = getAppleSize(canvas);
    apples.forEach(apple => {
        if (!apple.visible) {
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(apple.x, apple.y, appleSize, appleSize);
        }
    });

    apples.forEach(apple => {
        if (apple.visible) {
            drawApple(ctx, apple, appleSize);
        }
    });
}

export function drawApple(ctx, apple, appleSize) {
    const { x, y, number, visible } = apple;
    
    if (!visible) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, appleSize, appleSize);
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, appleSize, appleSize);
    
    ctx.fillStyle = '#555555';
    ctx.font = '22px Pretendard';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, x + appleSize / 2, y + appleSize / 2);
}

export function drawSelectionRect(ctx, startX, startY, endX, endY) {
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

export function selectApples(ctx, canvas, startX, startY, endX, endY) {
    const appleSize = getAppleSize(canvas);
    
    selectedApples = apples.filter(apple => {
        // 셀 중앙이 선택 영역 안에 있는지 확인
        const appleCenterX = apple.x + (appleSize / 2);
        const appleCenterY = apple.y + (appleSize / 2);
        
        const withinX = appleCenterX >= startX && appleCenterX < endX;
        const withinY = appleCenterY >= startY && appleCenterY < endY;
        
        return withinX && withinY && apple.visible;
    });
    drawBoard(ctx, canvas);
    drawSelectionRect(ctx, startX, startY, endX, endY);
    
    return selectedApples;
}

export function removeApples(selectedApples) {
    selectedApples.forEach(apple => apple.visible = false);
    return selectedApples.length;
}