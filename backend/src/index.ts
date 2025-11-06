import { createServer } from './server';
import { loadEnv } from './utils/env';

const env = loadEnv();
const app = createServer();

const PORT = Number(env.PORT || 4000);

app.listen(PORT, () => {
  console.log(`HelpDesk backend listening on http://localhost:${PORT}`);
});