import fetch from 'node-fetch';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const API_ROOT = 'https://opentdb.com';
let TRIVIA_TOKEN = null;
const asked = new Set();

export async function initTriviaSession() {
  const r = await fetch(`${API_ROOT}/api_token.php?command=request`);
  const { token } = await r.json();
  TRIVIA_TOKEN = token;
}

export async function getQuestion({ category = null, difficulty = null } = {}) {
  if (!TRIVIA_TOKEN) await initTriviaSession();
  let url = `${API_ROOT}/api.php?amount=1&token=${TRIVIA_TOKEN}`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;
  let data = await fetch(url).then(r => r.json());
  if (data.response_code === 4) {
    await fetch(`${API_ROOT}/api_token.php?command=reset&token=${TRIVIA_TOKEN}`);
    data = await fetch(url).then(r => r.json());
  }
  const q = data.results[0];
  const decodedQ = {
    ...q,
    question: htmlDecode(q.question),
    correct_answer: htmlDecode(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map(htmlDecode)
  };
  if (asked.has(decodedQ.question)) return getQuestion({ category, difficulty });
  asked.add(decodedQ.question);
  return decodedQ;
}

export async function timedAsk(qObj, seconds = 15) {
  const choices = shuffle([qObj.correct_answer, ...qObj.incorrect_answers]);
  console.log(`\n${qObj.question}`);
  choices.forEach((c, i) => console.log(`${i + 1}) ${c}`));
  const rl = readline.createInterface({ input, output });
  const timer = setTimeout(() => rl.close(), seconds * 1000);
  try {
    const answer = await rl.question(`\nTienes ${seconds}s → elige 1-${choices.length}: `);
    clearTimeout(timer);
    return choices[Number(answer) - 1] === qObj.correct_answer;
  } catch {
    console.log('\n⏰ ¡Tiempo agotado!');
    return false;
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function htmlDecode(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}
