const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');

describe('Search Functionality on Liquipedia Mobile Legends EMEA', function () {
  let driver;
  this.timeout(60000); // Increased timeout to avoid early fail

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--ignore-certificate-errors');
    // options.addArguments('--headless'); // Optional headless mode

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().maximize();
  });

  it('should search for "RRQ" and display relevant results', async function () {
    await driver.get('https://liquipedia.net/mobilelegends/Portal:Teams/EMEA');

    const searchInput = await driver.wait(
      until.elementLocated(By.name('search')),
      10000
    );

    await searchInput.sendKeys('Team Spirit', Key.RETURN);

    // Wait for content block to load (article or search result)
    const contentBlock = await driver.wait(
      until.elementLocated(By.id('mw-content-text')),
      10000
    );

    const contentText = await contentBlock.getText();
    expect(contentText.toLowerCase()).to.include('team spirit');

    await driver.sleep(3000); // Optional: wait to visually see result
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('🧹 WebDriver closed');
    }
  });
});
