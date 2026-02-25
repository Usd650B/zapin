const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const base = 'https://studio-5454762906-4abc1.web.app';

  console.log('Visiting /admin to check redirect for unauthenticated user...');
  try {
    await page.goto(base + '/admin', { waitUntil: 'load', timeout: 60000 });
  } catch (err) {
    console.warn('Warning: initial goto timed out, trying with slower load strategy');
    await page.goto(base + '/admin', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  }

  // Wait a short moment for client-side redirects to occur
  await page.waitForTimeout(3000);

  const url = page.url();
  console.log('Final URL after visiting /admin ->', url);

  if (url.includes('/login')) {
    console.log('PASS: Unauthenticated visit to /admin redirected to /login');
  } else {
    console.error('FAIL: Unauthenticated visit to /admin did NOT redirect to /login');
    process.exitCode = 2;
  }

  console.log('Checking homepage shows Login link in navigation...');
  await page.goto(base, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  const loginLink = await page.locator('text=Login').first().innerText().catch(() => null);
  if (loginLink && loginLink.toLowerCase().includes('login')) {
    console.log('PASS: Homepage shows Login link');
  } else {
    console.error('FAIL: Homepage does not show Login link');
    process.exitCode = 3;
  }

  await browser.close();
}

run().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
