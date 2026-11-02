// Local-only override (excluded via .git/info/exclude): serve fixtures with
// plain python3 rather than `uv run`, and run Chromium only.
import base from './playwright.config';
import { defineConfig, devices } from '@playwright/test';
import { fixtureServerPort, fixtureServerUrl } from './src/utils';

export default defineConfig({
  ...base,
  reporter: [['line']],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [{
    command: `python3 -m http.server ${fixtureServerPort} --bind 127.0.0.1`,
    url: fixtureServerUrl,
    reuseExistingServer: false,
    cwd: '../../docs/playwright',
    timeout: 120000,
    stderr: 'ignore',
  }],
});
