// ═══════════════════════════════════════════════════════
//  ANIMA MUNDI — Quiz Modal
// ═══════════════════════════════════════════════════════
import { QUIZZES } from './gamification.js';
import { GUIDES } from './guides.js';

let currentQuiz = null;
let onComplete = null;

export function openRandomQuiz(guideId, onDone) {
  const pool = guideId
    ? QUIZZES.filter(q => q.guideId === guideId || Math.random() > 0.5)
    : QUIZZES;
  currentQuiz = pool[Math.floor(Math.random() * pool.length)];
  onComplete = onDone;
  renderQuiz(currentQuiz);
  document.getElementById('quizModal').classList.add('open');
}

export function openGuideQuiz(guideId, onDone) {
  const pool = QUIZZES.filter(q => q.guideId === guideId);
  if (!pool.length) return openRandomQuiz(null, onDone);
  currentQuiz = pool[Math.floor(Math.random() * pool.length)];
  onComplete = onDone;
  renderQuiz(currentQuiz);
  document.getElementById('quizModal').classList.add('open');
}

export function closeQuiz() {
  document.getElementById('quizModal').classList.remove('open');
  currentQuiz = null;
}

function renderQuiz(quiz) {
  const guide = GUIDES.find(g => g.id === quiz.guideId);
  const modal = document.getElementById('quizModal');

  modal.querySelector('.quiz-tradition').textContent = quiz.tradition;
  modal.querySelector('.quiz-question').textContent = quiz.question;

  const answersEl = modal.querySelector('.quiz-answers');
  answersEl.innerHTML = '';

  // Shuffle answers
  const shuffled = [...quiz.answers].sort(() => Math.random() - 0.5);

  shuffled.forEach(ans => {
    const btn = document.createElement('button');
    btn.className = 'quiz-answer-btn';
    btn.textContent = ans.text;
    btn.onclick = () => handleAnswer(btn, ans, quiz, shuffled);
    answersEl.appendChild(btn);
  });

  modal.querySelector('.quiz-explanation').style.display = 'none';
  modal.querySelector('.quiz-explanation').textContent = '';
  modal.querySelector('.quiz-next-btn').style.display = 'none';
  modal.querySelector('.quiz-result').style.display = 'none';
  modal.querySelector('.quiz-result').textContent = '';
}

function handleAnswer(btn, ans, quiz, allAnswers) {
  const modal = document.getElementById('quizModal');
  const buttons = modal.querySelectorAll('.quiz-answer-btn');

  // Disable all
  buttons.forEach(b => b.disabled = true);

  // Mark correct and wrong
  buttons.forEach(b => {
    const bAns = allAnswers.find(a => a.text === b.textContent);
    if (bAns?.correct) b.classList.add('correct');
    else if (b === btn && !ans.correct) b.classList.add('wrong');
  });

  // Show explanation
  const expEl = modal.querySelector('.quiz-explanation');
  expEl.textContent = quiz.explanation;
  expEl.style.display = 'block';

  // Show result
  const resultEl = modal.querySelector('.quiz-result');
  resultEl.textContent = ans.correct ? '✦ Correct' : '◌ Not quite';
  resultEl.className = 'quiz-result ' + (ans.correct ? 'correct' : 'wrong');
  resultEl.style.display = 'block';

  // Show next button
  const nextBtn = modal.querySelector('.quiz-next-btn');
  nextBtn.style.display = 'block';
  nextBtn.onclick = () => {
    closeQuiz();
    if (onComplete) onComplete(ans.correct ? 1 : 0, 1, quiz.id);
  };
}
