import { randomInt } from 'crypto';
import { getQuestion, timedAsk } from './trivia.js';

export async function lanzarDado(player) {
  const roll = randomInt(1, 7); // 1..6
  console.log(`\n🎲 Dado: ${roll}`);
  const q = await getQuestion();
  const ok = await timedAsk(q, 15);
  if (roll <= 3) {
    if (!ok) {
      player.hp -= 10;
      console.log('Respuesta incorrecta. Pierdes 10 HP.');
    } else {
      console.log('Nada sucede.');
    }
  } else {
    if (ok) {
      player.hp += 10;
      console.log('Respuesta correcta. Ganas 10 HP.');
    } else {
      console.log('Nada sucede.');
    }
  }
}
