import fs from 'fs';
import path from 'path';

export default async function globalTeardown() {
  // On CI, remove saved auth state so stale sessions don't persist across job runs.
  // Locally the file is kept so subsequent runs skip re-authentication.
  if (process.env.CI) {
    const authDir = path.resolve(process.cwd(), '.auth');
    if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true });
  }
}
