import { saveScoreToLeaderboard } from "./firebase.js";
import { questions } from "./questions.js";
import { getRandomReaction, getFinalComment } from "./reactions.js";

const loadingScreen = document.getElementById("loadingScreen");
const loginScreen = document.getElementById("loginScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const goLeaderboardBtn = document.getElementById("goLeaderboardBtn");
const resultLeaderboardBtn = document.getElementById("resultLeaderboardBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const questionCounter = document.getElementById("questionCounter");
const timerDisplay = document.getElementById("timer");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const reactionPopup = document.getElementById("reactionPopup");
const reactionSticker = document.getElementById("reactionSticker");
const reactionText = document.getElementById("reactionText");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

const finalName = document.getElementById("finalName");
const finalScore = document.getElementById("finalScore");
const finalCorrect = document.getElementById("finalCorrect");
const finalAvgTime = document.getElementById("finalAvgTime");
const finalComment = document.getElementById("finalComment");

const footerElement = document.getElementById("footerRoast");

const FAST_LIMIT = 10;
const SLOW_LIMIT = 15;
const SCORE_PER_CORRECT = 5;

let playerName = "";
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let timerInterval = null;
let questionStartTime = 0;
let answerTimes = [];
let isAnswerLocked = false;
let shuffledQuestions = [];

const savageTexts = [
  "Jawabanmu salah semua… ini latihan matematika, bukan tebak nasib 😭",
  "Kok bisa salah? Itu pilihan ganda loh… tinggal pilih 😭",
  "Nilai segitu? Kalkulator aja malu lihatnya 😭",
  "Tenang… Einstein juga pernah salah. Tapi nggak separah ini 😌",
  "Kamu ngerjain atau cuma klik klik doang? 🤨",
  "Soalnya mudah, kamu yang hardcore 😭",
  "Leaderboard bukan buat kamu… tapi kamu boleh lihat 😏",
  "Otaknya lagi maintenance ya? coba restart dulu 😌",
  "Ini matematika dasar… bukan soal kehidupan 😭",
  "Kamu pasti jago… jago salah 😏",
  "Yang kamu tekan itu jawaban, bukan random button 😭",
  "Salah terus? konsisten sih, respect 😌",
  "Nilai kecil bukan masalah… yang masalah itu kenapa bisa kecil 😭",
  "Kamu butuh belajar… atau butuh keajaiban? 🤨",
  "Jawabanmu unik… sayangnya salah semua 😭"
];

function showScreen(screenElement) {
  loginScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screenElement.classList.add("active");
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function startQuiz() {
  playerName = playerNameInput.value.trim().toLowerCase();

  if (!playerName) {
    alert("Isi nama dulu dong, nanti di leaderboard kosong 😆");
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  correctCount = 0;
  answerTimes = [];
  isAnswerLocked = false;

  clearInterval(timerInterval);

  reactionPopup.classList.add("hidden");
  timerDisplay.textContent = "0.0 detik";

  shuffledQuestions = shuffleArray(questions);

  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const shuffledOptions = shuffleArray(currentQuestion.options);

  questionCounter.textContent = `Soal ${currentQuestionIndex + 1} / ${shuffledQuestions.length}`;
  questionText.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";
  isAnswerLocked = false;

  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.className = "optionBtn";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(option));
    optionsContainer.appendChild(button);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  questionStartTime = Date.now();

  timerDisplay.textContent = "0.0 detik";

  timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - questionStartTime) / 1000).toFixed(1);
    timerDisplay.textContent = `${elapsed} detik`;
  }, 100);
}

function getReactionCategory(isCorrect, timeTaken) {
  if (isCorrect) {
    if (timeTaken <= FAST_LIMIT) return "benar_cepat";
    if (timeTaken <= SLOW_LIMIT) return "benar_lambat";
    return "benar_sangat_lambat";
  }

  if (timeTaken <= FAST_LIMIT) return "salah_cepat";
  if (timeTaken <= SLOW_LIMIT) return "salah_lambat";
  return "salah_sangat_lambat";
}

function handleAnswer(selectedOption) {
  if (isAnswerLocked) return;
  isAnswerLocked = true;

  clearInterval(timerInterval);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const timeTaken = (Date.now() - questionStartTime) / 1000;
  const isCorrect = selectedOption === currentQuestion.answer;

  answerTimes.push(timeTaken);

  if (isCorrect) {
    score += SCORE_PER_CORRECT;
    correctCount += 1;
  }

  const buttons = optionsContainer.querySelectorAll(".optionBtn");
  buttons.forEach((button) => {
    button.disabled = true;
  });

  const category = getReactionCategory(isCorrect, timeTaken);
  showReaction(category, timeTaken);
}

function showReaction(category, timeTaken) {
  const reaction = getRandomReaction(category);

  reactionSticker.src = reaction.sticker;
  reactionText.textContent = `${reaction.text} (${timeTaken.toFixed(1)} detik)`;
  reactionPopup.classList.remove("hidden");
}

function goToNextQuestion() {
  currentQuestionIndex += 1;

  if (currentQuestionIndex < shuffledQuestions.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  clearInterval(timerInterval);

  const totalTime = answerTimes.reduce((sum, t) => sum + t, 0);
  const avgTime = answerTimes.length ? totalTime / answerTimes.length : 0;
  const maxScore = shuffledQuestions.length * SCORE_PER_CORRECT;

  finalName.textContent = `Nama: ${playerName}`;
  finalScore.textContent = `Skor: ${score}`;
  finalCorrect.textContent = `Benar: ${correctCount}/${shuffledQuestions.length}`;
  finalAvgTime.textContent = `Rata rata waktu: ${avgTime.toFixed(2)} detik`;
  finalComment.textContent = getFinalComment(score, maxScore);

  await saveScoreToLeaderboard({
    name: playerName,
    score,
    correct: correctCount,
    avgTime: Number(avgTime.toFixed(2))
  });

  showScreen(resultScreen);
}

function changeRoast() {
  if (!footerElement) return;
  const randomIndex = Math.floor(Math.random() * savageTexts.length);
  footerElement.textContent = savageTexts[randomIndex];
}

function resetToLogin() {
  clearInterval(timerInterval);

  reactionPopup.classList.add("hidden");
  timerDisplay.textContent = "0.0 detik";
  optionsContainer.innerHTML = "";
  questionText.textContent = "";
  questionCounter.textContent = `Soal 1 / ${questions.length}`;

  playerNameInput.value = "";
  playerNameInput.focus();

  showScreen(loginScreen);
}

startBtn.addEventListener("click", startQuiz);

playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startQuiz();
  }
});

goLeaderboardBtn.addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});

resultLeaderboardBtn.addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});

playAgainBtn.addEventListener("click", resetToLogin);

if (nextQuestionBtn) {
  nextQuestionBtn.addEventListener("click", () => {
    reactionPopup.classList.add("hidden");
    goToNextQuestion();
  });
}

changeRoast();
setInterval(changeRoast, 3000);

window.addEventListener("load", () => {
  if (!loadingScreen) return;

  setTimeout(() => {
    loadingScreen.classList.add("hidden");
  }, 600);
});