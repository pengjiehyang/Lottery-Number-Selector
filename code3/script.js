const numberDisplay = document.getElementById('numberDisplay');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const lotteryTypeSelect = document.getElementById('lotteryType');

const lotteryConfigs = {
    'dlt': { name: '大樂透', balls: 6, min: 1, max: 49, type: 'single_range' },
    'wlc': { name: '威力彩', balls: 6, min: 1, max: 38, specialBall: { min: 1, max: 8 }, type: 'two_ranges' },
    'jc539': { name: '今彩539', balls: 5, min: 1, max: 39, type: 'single_range' },
    'swc': { name: '雙贏彩', balls: 7, min: 1, max: 24, type: 'single_range' },
    'sxc': { name: '3星彩', digits: 3, min: 0, max: 9, type: 'repeatable_digits' },
    'ssxc': { name: '4星彩', digits: 4, min: 0, max: 9, type: 'repeatable_digits' },
    'bingo': { name: 'BINGO BINGO', balls: 20, min: 1, max: 80, type: 'single_range' }
};

let currentLotteryConfig = lotteryConfigs[lotteryTypeSelect.value];

function generateUniqueRandomNumbers(count, min, max) {
    const numbers = new Set();
    while (numbers.size < count) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function generateRepeatableRandomNumbers(count, min, max) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return numbers;
}

function displayNumbers(numbers, specialNumber = null, ballCountOverride = null) {
    numberDisplay.innerHTML = '';

    let actualCount = ballCountOverride ?? (
        currentLotteryConfig.type === 'repeatable_digits' ? currentLotteryConfig.digits : currentLotteryConfig.balls
    );

    if (numbers.length === 0 && specialNumber === null) {
        for (let i = 0; i < actualCount; i++) {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = '?';
            numberDisplay.appendChild(ball);
        }
        if (currentLotteryConfig.type === 'two_ranges') {
            const specialBall = document.createElement('div');
            specialBall.className = 'number-ball special';
            specialBall.textContent = '?';
            numberDisplay.appendChild(specialBall);
        }
        return;
    }

    numbers.forEach(num => {
        const ball = document.createElement('div');
        ball.className = 'number-ball';
        ball.textContent = num;
        numberDisplay.appendChild(ball);
    });

    if (specialNumber !== null) {
        const specialBall = document.createElement('div');
        specialBall.className = 'number-ball special';
        specialBall.textContent = specialNumber;
        numberDisplay.appendChild(specialBall);
    }
}

generateBtn.addEventListener('click', () => {
    if (currentLotteryConfig.type === 'single_range') {
        const nums = generateUniqueRandomNumbers(currentLotteryConfig.balls, currentLotteryConfig.min, currentLotteryConfig.max);
        displayNumbers(nums);
    } else if (currentLotteryConfig.type === 'two_ranges') {
        const main = generateUniqueRandomNumbers(currentLotteryConfig.balls, currentLotteryConfig.min, currentLotteryConfig.max);
        const special = generateUniqueRandomNumbers(1, currentLotteryConfig.specialBall.min, currentLotteryConfig.specialBall.max)[0];
        displayNumbers(main, special);
    } else if (currentLotteryConfig.type === 'repeatable_digits') {
        const digits = generateRepeatableRandomNumbers(currentLotteryConfig.digits, currentLotteryConfig.min, currentLotteryConfig.max);
        displayNumbers(digits);
    }
});

resetBtn.addEventListener('click', () => {
    const count = currentLotteryConfig.type === 'repeatable_digits' ? currentLotteryConfig.digits : currentLotteryConfig.balls;
    displayNumbers([], null, count);
});

lotteryTypeSelect.addEventListener('change', e => {
    currentLotteryConfig = lotteryConfigs[e.target.value];
    const count = currentLotteryConfig.type === 'repeatable_digits' ? currentLotteryConfig.digits : currentLotteryConfig.balls;
    displayNumbers([], null, count);
});

document.addEventListener('DOMContentLoaded', () => {
    const count = currentLotteryConfig.type === 'repeatable_digits' ? currentLotteryConfig.digits : currentLotteryConfig.balls;
    displayNumbers([], null, count);
});
