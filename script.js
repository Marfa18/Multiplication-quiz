let score = 0;
let currentQuestion = 0;
let totalQuestions = 10;
let streak = 0;
let timeLeft = 10;
let timerInterval;
let currentAnswer;
let isAnswering = false;

const questions = [];

function generateQuestions() {
    questions.length = 0;
    const used = new Set();
    
    while (questions.length < totalQuestions) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const key = `${a}x${b}`;
        
        if (!used.has(key)) {
            used.add(key);
            questions.push({ a, b, answer: a * b });
        }
    }
}

function startGame() {
    score = 0;
    currentQuestion = 0;
    streak = 0;
    generateQuestions();
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('endScreen').classList.add('hidden');
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= totalQuestions) {
        endGame();
        return;
    }

    isAnswering = false;
    const q = questions[currentQuestion];
    currentAnswer = q.answer;
    
    document.getElementById('questionNum').textContent = `${currentQuestion + 1}/${totalQuestions}`;
    document.getElementById('score').textContent = score;
    document.getElementById('question').textContent = `${q.a} × ${q.b} = ?`;
    
    const card = document.getElementById('questionCard');
    card.classList.remove('pop');
    void card.offsetWidth;
    card.classList.add('pop');
    
    const answers = generateAnswers(q.answer);
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach((btn, index) => {
        btn.textContent = answers[index];
        btn.className = 'answer-btn';
        btn.disabled = false;
    });

    startTimer();
}

function generateAnswers(correct) {
    const answers = [correct];
    
    while (answers.length < 3) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const wrong = correct + offset;
        
        if (wrong > 0 && wrong !== correct && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }
    
    return answers.sort(() => Math.random() - 0.5);
}

function startTimer() {
    timeLeft = 10;
    updateTimer();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeUp();
        }
    }, 100);
}

function updateTimer() {
    const progress = (timeLeft / 10) * 100;
    const bar = document.getElementById('timerProgress');
    const text = document.getElementById('timerText');
    
    bar.style.width = `${progress}%`;
    text.textContent = `${Math.ceil(timeLeft)} sec`;
    
    bar.classList.remove('warning', 'danger');
    if (timeLeft <= 3) {
        bar.classList.add('danger');
    } else if (timeLeft <= 5) {
        bar.classList.add('warning');
    }
}

function checkAnswer(index) {
    if (isAnswering) return;
    isAnswering = true;
    
    clearInterval(timerInterval);
    
    const buttons = document.querySelectorAll('.answer-btn');
    const selected = parseInt(buttons[index].textContent);
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (selected === currentAnswer) {
        buttons[index].classList.add('correct');
        streak++;
        const points = Math.ceil(timeLeft) * 10 + 50;
        score += points;
        showFeedback('✅', '#48bb78');
        
        if (streak > 2) {
            const streakEl = document.getElementById('streak');
            streakEl.textContent = `🔥 Streak: ${streak}`;
            streakEl.classList.add('show');
        }
    } else {
        buttons[index].classList.add('wrong');
        streak = 0;
        document.getElementById('streak').classList.remove('show');
        
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === currentAnswer) {
                btn.classList.add('correct');
            }
        });
        
        showFeedback('❌', '#f56565');
    }
    
    document.getElementById('score').textContent = score;
    
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

function timeUp() {
    isAnswering = true;
    streak = 0;
    document.getElementById('streak').classList.remove('show');
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (parseInt(btn.textContent) === currentAnswer) {
            btn.classList.add('correct');
        }
    });
    
    showFeedback('⏰', '#ed8936');
    
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

function showFeedback(emoji, color) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = emoji;
    feedback.style.color = color;
    feedback.classList.add('show');
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 800);
}

function endGame() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.remove('hidden');
    
    const maxScore = totalQuestions * 150;
    const percentage = (score / maxScore) * 100;
    
    document.getElementById('finalScore').textContent = score;
    
    let stars = '';
    if (percentage >= 80) stars = '⭐⭐⭐';
    else if (percentage >= 50) stars = '⭐⭐';
    else stars = '⭐';
    document.getElementById('stars').textContent = stars;
    
    let message = '';
    if (percentage >= 90) message = '🎉 Excellent! You are a math genius!';
    else if (percentage >= 70) message = '👍 Very good! You know the multiplication table perfectly!';
    else if (percentage >= 50) message = '👌 Not bad! Keep practicing!';
    else message = '💪 Don\'t give up! You need a bit more practice!';
    
    document.getElementById('resultMessage').textContent = message;
    
    if (percentage >= 80) {
        createConfetti();
    }
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

function restartGame() {
    startGame();
}
