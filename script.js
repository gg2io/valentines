const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const container = document.querySelector('.buttons-container');
const celebration = document.getElementById('celebration');
const note = document.querySelector('.note');

let growthCount = 0;
const maxGrowth = 10;

// Function to grow the Yes button
function growYesButton() {
    if (growthCount < maxGrowth) {
        growthCount++;
        const newFontSize = 20 + (growthCount * 2);
        const newPaddingVertical = 15 + (growthCount * 1.5);
        const newPaddingHorizontal = 40 + (growthCount * 4);

        yesBtn.style.fontSize = newFontSize + 'px';
        yesBtn.style.padding = newPaddingVertical + 'px ' + newPaddingHorizontal + 'px';
    }
}

// Function to check if two rectangles overlap
function isOverlapping(x1, y1, w1, h1, x2, y2, w2, h2) {
    const padding = 20; // Extra space between buttons
    return !(x1 + w1 + padding < x2 ||
             x2 + w2 + padding < x1 ||
             y1 + h1 + padding < y2 ||
             y2 + h2 + padding < y1);
}

// Function to get random position within container bounds
function getRandomPosition() {
    const containerRect = container.getBoundingClientRect();
    const noBtnWidth = noBtn.offsetWidth;
    const noBtnHeight = noBtn.offsetHeight;

    // Get Yes button position relative to container
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const yesX = yesBtnRect.left - containerRect.left;
    const yesY = yesBtnRect.top - containerRect.top;
    const yesWidth = yesBtn.offsetWidth;
    const yesHeight = yesBtn.offsetHeight;

    // Calculate boundaries to keep button inside container
    const maxX = containerRect.width - noBtnWidth;
    const maxY = containerRect.height - noBtnHeight;

    let randomX, randomY;
    let attempts = 0;
    const maxAttempts = 50;

    // Keep trying until we find a position that doesn't overlap
    do {
        randomX = Math.random() * maxX;
        randomY = Math.random() * maxY;
        attempts++;
    } while (isOverlapping(randomX, randomY, noBtnWidth, noBtnHeight, yesX, yesY, yesWidth, yesHeight) && attempts < maxAttempts);

    return { x: randomX, y: randomY };
}

// Move button away from cursor
noBtn.addEventListener('mouseenter', () => {
    growYesButton();
    const pos = getRandomPosition();
    noBtn.style.left = pos.x + 'px';
    noBtn.style.top = pos.y + 'px';
});

// Also trigger on mouse getting close (for better mobile/touch experience)
container.addEventListener('mousemove', (e) => {
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(
        Math.pow(e.clientX - btnCenterX, 2) +
        Math.pow(e.clientY - btnCenterY, 2)
    );

    // If cursor is within 100px of button, move it
    if (distance < 100) {
        growYesButton();
        const pos = getRandomPosition();
        noBtn.style.left = pos.x + 'px';
        noBtn.style.top = pos.y + 'px';
    }
});

// Prevent clicking the No button
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    growYesButton();
    noBtn.classList.add('moving');
    const pos = getRandomPosition();
    noBtn.style.left = pos.x + 'px';
    noBtn.style.top = pos.y + 'px';
});

// Yes button celebration
yesBtn.addEventListener('click', () => {
    noBtn.classList.add('hidden');
    yesBtn.classList.add('hidden');
    note.classList.add('hidden');
    celebration.style.display = 'block';

    // Change text
    document.querySelector('h1').innerHTML = 'Yay! 💕<br>I knew you\'d say yes! 🎉';

    // Add confetti effect
    createConfetti();
});

// Simple confetti effect
function createConfetti() {
    const emojis = ['❤️‍🔥', '🍒', '💕', '💖', '💗', '💝', '💘', '🌹', '💐'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-50px';
            confetti.style.fontSize = '30px';
            confetti.style.opacity = '1';
            confetti.style.transition = 'all 3s ease-in';
            confetti.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.opacity = '0';
                confetti.style.transform = 'rotate(360deg)';
            }, 100);

            setTimeout(() => {
                confetti.remove();
            }, 3100);
        }, i * 100);
    }
}
