"use strict";

const QUESTIONS = [
  { q: "Apa nama mata uang di Roblox?", a: "Robux", hard: false },
  { q: "Siapa pencipta Roblox?", a: "David Baszucki", hard: false },
  {
    q: "Game apa yang populer dengan mode bertahan hidup zombie di Roblox?",
    a: "Zombie Rush",
    hard: false,
  },
  { q: "Tahun berapa Roblox dirilis secara publik?", a: "2006", hard: false },
  { q: "Apa nama studio yang membuat Roblox?", a: "Roblox Corporation", hard: false },
  { q: "Apa nama event tahunan besar di Roblox?", a: "Bloxy Awards", hard: true },
  { q: "Apa nama sistem fisika yang digunakan Roblox?", a: "Havok", hard: true },
  { q: "Berapa maksimal teman di Roblox?", a: "200", hard: true },
  {
    q: "Apa nama bahasa pemrograman utama yang digunakan di Roblox Studio?",
    a: "Lua",
    hard: true,
  },
  { q: "Siapa yang pertama kali menciptakan istilah 'Roblox'?", a: "Erik Cassel", hard: true },
];

const SCORES_KEY = "robloxScores";

const nameScreen = document.getElementById("name-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const startButton = document.getElementById("start-btn");
const playerNameLabel = document.getElementById("player-name");
const quizForm = document.getElementById("quiz-form");
const questionContainer = document.getElementById("question-container");
const resultName = document.getElementById("result-name");
const resultSummary = document.getElementById("result-summary");
const leaderboardList = document.getElementById("leaderboard-list");
const restartButton = document.getElementById("restart-btn");

let currentPlayer = null;
let scores = loadScores();

function loadScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry) =>
          entry &&
          typeof entry.name === "string" &&
          typeof entry.score === "number" &&
          typeof entry.timestamp === "number"
      )
      .slice(0, 25);
  } catch (error) {
    console.warn("Gagal memuat skor dari localStorage", error);
    return [];
  }
}

function saveScores() {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.warn("Gagal menyimpan skor", error);
  }
}

function updateLeaderboard() {
  leaderboardList.innerHTML = "";

  if (!scores.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Belum ada skor tersimpan.";
    emptyItem.classList.add("empty-state");
    leaderboardList.appendChild(emptyItem);
    return;
  }

  scores.forEach((entry, index) => {
    const item = document.createElement("li");

    const position = document.createElement("span");
    position.textContent = `${index + 1}.`;

    const name = document.createElement("span");
    name.textContent = entry.name;

    const score = document.createElement("span");
    score.classList.add("score");
    score.textContent = `${entry.score} benar`;

    item.append(position, name, score);
    leaderboardList.appendChild(item);
  });
}

function buildQuestions() {
  questionContainer.innerHTML = "";

  QUESTIONS.forEach((question, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("question");

    const label = document.createElement("label");
    label.setAttribute("for", `answer-${index}`);

    const number = document.createElement("span");
    number.classList.add("question-number");
    number.textContent = `${index + 1}.`;

    const labelText = document.createElement("span");
    labelText.textContent = question.q;

    label.append(number, labelText);

    if (question.hard) {
      const badge = document.createElement("span");
      badge.classList.add("difficulty-badge");
      badge.textContent = "Sulit";
      label.appendChild(badge);
    }

    const input = document.createElement("input");
    input.type = "text";
    input.id = `answer-${index}`;
    input.name = `answer-${index}`;
    input.placeholder = "Jawaban kamu...";
    input.classList.add("text-input");

    wrapper.append(label, input);
    questionContainer.appendChild(wrapper);
  });
}

function switchScreen({ showName = false, showQuiz = false, showResult = false }) {
  nameScreen.hidden = !showName;
  quizScreen.hidden = !showQuiz;
  resultScreen.hidden = !showResult;
}

function startQuiz(playerName) {
  currentPlayer = playerName;
  playerNameLabel.textContent = playerName;
  quizForm.reset();
  switchScreen({ showQuiz: true });
}

function evaluateQuiz() {
  const inputs = Array.from(questionContainer.querySelectorAll("input"));
  const answers = inputs.map((input) => input.value.trim().toLowerCase());

  const correct = QUESTIONS.reduce((total, question, index) => {
    return total + (answers[index] === question.a.toLowerCase() ? 1 : 0);
  }, 0);

  resultName.textContent = currentPlayer;
  resultSummary.textContent = `Benar: ${correct} dari ${QUESTIONS.length} pertanyaan.`;

  const entry = {
    name: currentPlayer,
    score: correct,
    timestamp: Date.now(),
  };

  scores.push(entry);
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timestamp - b.timestamp;
  });
  scores = scores.slice(0, 10);

  saveScores();
  updateLeaderboard();

  switchScreen({ showResult: true });
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const trimmedName = nameInput.value.trim();
  if (!trimmedName) return;
  startQuiz(trimmedName);
});

nameInput.addEventListener("input", () => {
  startButton.disabled = !nameInput.value.trim();
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  evaluateQuiz();
});

restartButton.addEventListener("click", () => {
  currentPlayer = null;
  nameInput.value = "";
  startButton.disabled = true;
  quizForm.reset();
  switchScreen({ showName: true });
});

buildQuestions();
updateLeaderboard();
startButton.disabled = true;
switchScreen({ showName: true });

