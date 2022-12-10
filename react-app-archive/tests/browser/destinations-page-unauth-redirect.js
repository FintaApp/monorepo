const { chromium } = require('playwright');
const expect = require('expect')

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const url = process.env.ENVIRONMENT_URL || 'https://app.finta.io';
  const targetUrl = url.includes('http') ? url : `https://${url}`
  
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('.page'); 
  
  expect(page.url()).toBe(targetUrl +'/login')

  await browser.close();
}

run();