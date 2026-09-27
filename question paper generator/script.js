const syllabusInput = document.getElementById("syllabus");
const difficultyInput = document.getElementById("difficulty");
const countInput = document.getElementById("questionCount");
const generateBtn = document.getElementById("generateBtn");
const charCount = document.getElementById("charCount");
const errorBox = document.getElementById("error");

const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const result = document.getElementById("result");
const resultActions = document.getElementById("resultActions");
const paperStatus = document.getElementById("paperStatus");

syllabusInput.addEventListener("input", () => {
  charCount.textContent = `${syllabusInput.value.length} / 2000`;
});

generateBtn.addEventListener("click", generatePaper);

function generatePaper() {
  const syllabus = syllabusInput.value.trim();
  errorBox.textContent = "";

  if (!syllabus) {
    errorBox.textContent = "Please enter your syllabus first.";
    syllabusInput.focus();
    return;
  }

  emptyState.classList.add("hidden");
  result.classList.add("hidden");
  resultActions.classList.add("hidden");
  loadingState.classList.remove("hidden");
  paperStatus.textContent = "GENERATING";

  setTimeout(() => {
    const questions = createDemoQuestions(syllabus, difficultyInput.value, Number(countInput.value));
    renderPaper(questions, difficultyInput.value);
    loadingState.classList.add("hidden");
    result.classList.remove("hidden");
    resultActions.classList.remove("hidden");
    paperStatus.textContent = "READY";
  }, 1000);
}

/*
  DEMO QUESTION ENGINE
  --------------------
  This makes the website work without an API.

  For REAL AI generation, replace the createDemoQuestions() call with
  a fetch() request to your backend. Never put a private AI API key
  directly inside this browser JavaScript file.

  Example backend flow:
  Browser -> your Node/Express server -> AI API -> Browser
*/

function createDemoQuestions(syllabus, difficulty, count) {
  const topics = extractTopics(syllabus);
  const selected = topics.length ? topics : ["the given syllabus"];

  const templates = {
    Easy: [
      topic => `What is ${topic}? Explain its basic concept with one suitable example.`,
      topic => `List the important features of ${topic} and briefly explain each one.`,
      topic => `Write a short note on ${topic} and mention where it is commonly used.`
    ],
    Medium: [
      topic => `Explain ${topic} in detail. Give an example and describe how it works step by step.`,
      topic => `Compare the important concepts related to ${topic}. Mention at least two differences.`,
      topic => `How would you apply ${topic} to solve a practical problem? Explain your approach.`
    ],
    Hard: [
      topic => `Analyse ${topic} and explain its limitations, edge cases, and possible solutions with examples.`,
      topic => `Design a practical problem based on ${topic} and explain an efficient solution.`,
      topic => `Critically examine ${topic}, including its internal working, trade-offs, and real-world use.`
    ],
    Mixed: [
      topic => `What is ${topic}? Explain its core idea with a suitable example.`,
      topic => `Explain how ${topic} works and demonstrate it with a practical example.`,
      topic => `Compare ${topic} with a closely related concept and explain when each should be used.`,
      topic => `Solve a practical problem using ${topic}. Describe the steps and expected result.`,
      topic => `Analyse ${topic} and discuss one advantage, one limitation, and a real-world use.`
    ]
  };

  const pool = templates[difficulty];
  const questions = [];

  for (let i = 0; i < count; i++) {
    const topic = selected[i % selected.length];
    const template = pool[i % pool.length];
    questions.push({
      text: template(topic),
      level: difficulty === "Mixed"
        ? ["EASY", "MEDIUM", "HARD"][i % 3]
        : difficulty.toUpperCase()
    });
  }

  return questions;
}

function extractTopics(text) {
  // Handles comma-separated syllabus topics and common list styles.
  let cleaned = text
    .replace(/\r/g, "\n")
    .replace(/[•|]/g, ",")
    .replace(/\n+/g, ",");

  let parts = cleaned
    .split(",")
    .map(item => item.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(item => item.length >= 2 && item.length <= 90);

  // If the user entered one paragraph, pick meaningful chunks.
  if (parts.length <= 1) {
    parts = text
      .split(/\band\b|\bwith\b/gi)
      .map(item => item.trim())
      .filter(item => item.length >= 2 && item.length <= 90);
  }

  return [...new Set(parts)].slice(0, 12);
}

function renderPaper(questions, difficulty) {
  const topicCount = new Set(
    questions.map(q => q.text)
  ).size;

  result.innerHTML = `
    <div class="paper-title">
      <h4>Generated Question Paper</h4>
      <p>${questions.length} questions • ${difficulty} difficulty • AI-assisted</p>
    </div>
    ${questions.map((q, index) => `
      <div class="question">
        <span class="question-number">${String(index + 1).padStart(2, "0")}</span>
        <div class="question-text">
          ${escapeHTML(q.text)}
          <span class="question-tag">${q.level}</span>
        </div>
      </div>
    `).join("")}
  `;
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById("copyBtn").addEventListener("click", async () => {
  const text = result.innerText;
  await navigator.clipboard.writeText(text);
  const btn = document.getElementById("copyBtn");
  const old = btn.textContent;
  btn.textContent = "Copied ✓";
  setTimeout(() => btn.textContent = old, 1400);
});

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});
