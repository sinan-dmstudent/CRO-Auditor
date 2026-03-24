import { chromium, Browser } from 'playwright';
import { execSync } from 'child_process';

/**
 * Launches a Playwright browser instance.
 * Includes self-healing logic to install 'chromium' if it's missing.
 */
export async function getBrowser(): Promise<Browser> {
    try {
        return await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'], // Recommended for some envs
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Check if error implies missing executable
        if (error.message.includes('Executable doesn\'t exist') || error.message.includes('browserType.launch')) {
            console.log('Playwright browser not found. Attempting self-healing...');
            try {
                // Attempt to install only chromium to save time/space
                execSync('npx playwright install chromium --with-deps', { stdio: 'inherit' });
                console.log('Browser installed. Retrying launch...');

                return await chromium.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
            } catch (installError) {
                console.error('Self-healing failed:', installError);
                throw installError;
            }
        }
        // Re-throw if it's a different error
        throw error;
    }
}
