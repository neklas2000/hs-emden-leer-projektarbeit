import { bootstrap } from './src/main';

setTimeout(() => {
  bootstrap(Number.parseInt(process.env.API_PORT || '3000'));
}, 2500);
