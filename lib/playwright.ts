import { chromium, Browser } from 'playwright';
import { spawnSync } from 'child_process';

/**
 * Launches a Playwright browser instance.
 * Includes self-healing logic to install 'chromium' if it's missing.
 *
 * Fix: replaced execSync (blocks entire Node.js event loop) with spawnSync
 * which has a hard timeout to prevent infinite hangs on slow environments.
 */
export async function getBrowser(): Promise<Browser> {
    try {
        return await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage', // Prevents crashes in low-memory environments
            ],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const isMissingBrowser =
            error.message?.includes("Executable doesn't exist") ||
            error.message?.includes('browserType.launch') ||
            error.message?.includes('executable doesn\'t exist');

        if (isMissingBrowser) {
            console.log('Playwright browser not found. Attempting self-healing install...');
            const result = spawnSync(
                'npx',
                ['playwright', 'install', 'chromium', '--with-deps'],
                {
                    stdio: 'inherit',
                    timeout: 120000, // 2 minute hard cap — prevents hanging the server
                    shell: true,
                }
            );

            if (result.status !== 0) {
                const msg = 'Self-healing browser install failed. Run `npx playwright install chromium` manually.';
                console.error(msg, result.error);
                throw new Error(msg);
            }

            console.log('Browser installed successfully. Retrying launch...');
            return await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            });
        }

        throw error;
    }
}
