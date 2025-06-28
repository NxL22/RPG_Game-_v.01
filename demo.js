import { initTriviaSession, getQuestion, timedAsk } from './src/trivia.js';

(async () => {
  await initTriviaSession();
  for (let i = 0; i < 3; i++) {
    const q = await getQuestion();
    const ok = await timedAsk(q, 10);
    console.log(ok ? '✅ Correcto\n' : '❌ Fallo\n');
  }
  process.exit(0);
})();
