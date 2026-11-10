// `npm run dev` starts the API server (port 5000) and the Vite dev server (port 5173) together.
import { spawn } from 'node:child_process';

const run = (args) => spawn(process.execPath, args, { stdio: 'inherit' });
const api = run(['server/index.js']);
const web = run(['node_modules/vite/bin/vite.js']);

const stop = () => { api.kill(); web.kill(); process.exit(); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
api.on('exit', (code) => { if (code) { web.kill(); process.exit(code); } });
web.on('exit', (code) => { if (code) { api.kill(); process.exit(code); } });
