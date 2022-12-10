const { chromium } = require('playwright');
const expect = require('expect')

const { getBaseUrl } = require('./snippets/get-base-url');
const graphql = require('./snippets/graphql');

async function run() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const baseUrl = getBaseUrl();
  const signupUrl = `${baseUrl}/signup`
  
  await page.goto(signupUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('.page'); 
  
  // Did the page load
  expect(page.url()).toBe(signupUrl)

  // Sign up
  const email = "new-user-sign-up@finta.io";
  const password = "t3stIng123!";
  const displayName = "Test User";

  await page.type('#email-input', email)
  await page.type('#new-password-input', password)
  await page.type('#name-input', displayName)
  const navigationPromise =  page.waitForNavigation()
  await page.click('#submit-signup-button')

  // Did the page redirect
  await navigationPromise
  expect(page.url()).toBe(`${baseUrl}/accounts`);

  // Is the user id in local storage
  const localStorage = await page.context().storageState();
  const userId = localStorage.cookies.find(cookie => cookie.name === 'ajs_user_id')?.value;
  expect(userId).not.toBeUndefined()

  // Is the user data in the database
  const { user } = await graphql.getUser(userId);
  expect(user?.id).toBe(userId)

  await browser.close();

  // Delete the user
  await graphql.deleteUser(userId);
}

run();