const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const firefox = require('selenium-webdriver/firefox');

describe('Flight Search on Aviasales.kz (Астана ➡ Шымкент)', function () {
  let driver;
  this.timeout(60000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build(); // use Firefox like your Java code
    await driver.manage().window().maximize();
  });

  it('should search for flights and verify title contains Астана', async function () {
    await driver.get('https://www.aviasales.kz');

    const wait = (locator) =>
      driver.wait(until.elementLocated(locator), 20000).then(() =>
        driver.wait(until.elementIsVisible(driver.findElement(locator)), 10000)
      );

    // "Откуда" field
    const fromInput = await wait(By.css("input[placeholder='Откуда']"));
    await fromInput.click();
    await fromInput.sendKeys('Астана');
    await driver.sleep(1000);
    await fromInput.sendKeys(Key.ENTER);

    // "Куда" field
    const toInput = await wait(By.css("input[placeholder='Куда']"));
    await toInput.click();
    await toInput.sendKeys('Шымкент'); // Change to 'Шымкент' if needed
    await driver.sleep(1000);
    await toInput.sendKeys(Key.ENTER);

    // Open calendar — like Java version
    const calendarButton = await wait(By.css('button.s__baueeRnAUu_J55n12MRS:nth-child(1)'));
    await calendarButton.click();

    // Select departure date (like Java version)
    const day21 = await wait(By.css('.boundedFrom'));
    await day21.click();

    const day22 = await wait(
      By.css('div.s__QIpl4HSgk6PrStnNFAwQ:nth-child(1) > div:nth-child(3) > div:nth-child(4) > div:nth-child(2)')
    );
    await day22.click();

    // Submit search
    const searchBtn = await wait(By.css("button[data-test-id='form-submit']"));
    await searchBtn.click();

    // Wait for new tab
    await driver.sleep(3000);
    const originalTab = await driver.getWindowHandle();
    const allTabs = await driver.getAllWindowHandles();

    for (const handle of allTabs) {
      if (handle !== originalTab) {
        await driver.switchTo().window(handle);
        break;
      }
    }

 // ...
// ✅ Final title check
const title = await driver.getTitle();
console.log('🔍 Page title:', title);
expect(title).to.include('NQZ'); // Astana = NQZ



    await driver.sleep(2000);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('🧹 WebDriver closed');
    }
  });
});
