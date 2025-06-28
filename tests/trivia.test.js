import { initTriviaSession, getQuestion } from '../src/trivia.js';

test('no se repite en 50 llamadas', async () => {
  await initTriviaSession();
  const texts = new Set();
  for (let i = 0; i < 50; i++) {
    const q = await getQuestion();
    expect(texts.has(q.question)).toBe(false);
    texts.add(q.question);
  }
});
