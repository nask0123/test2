const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');

describe('Flight Search on Aviasales.kz', function () {
  let driver;
  this.timeout(60000); // long timeout to be safe

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--ignore-certificate-errors');
    // options.addArguments('--headless'); // optional

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().maximize();
  });

  it('should search for flights from Астана to Актобе and open results', async function () {
    await driver.get('https://www.aviasales.kz');

    const fromInput = await driver.wait(until.elementLocated(By.css("input[placeholder='Откуда']")), 20000);
    await fromInput.click();
    await fromInput.sendKeys('Астана');
    await driver.sleep(1000);
    await fromInput.sendKeys(Key.ENTER);

    const toInput = await driver.wait(until.elementLocated(By.css("input[placeholder='Куда']")), 20000);
    await toInput.click();
    await toInput.sendKeys('Актобе');
    await driver.sleep(1000);
    await toInput.sendKeys(Key.ENTER);

    // Click date input
    const dateButton = await driver.wait(until.elementLocated(By.css("button[data-test-id='departure-date-input']")), 20000);
    await dateButton.click();

    // Wait for any active date button and click it
    const activeDate = await driver.wait(until.elementLocated(By.css("button[aria-label*='выбрать']")), 10000);
    await activeDate.click();

    // Click search
    const searchButton = await driver.wait(until.elementLocated(By.css("button[data-test-id='form-submit']")), 20000);
    await searchButton.click();

    // Wait for redirect to new tab
    await driver.sleep(5000);

    const originalWindow = await driver.getWindowHandle();
    const allWindows = await driver.getAllWindowHandles();

    for (let handle of allWindows) {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
        break;
      }
    }

    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.include('Астана');

    await driver.sleep(3000);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('🧹 WebDriver closed');
    }
  });
});
