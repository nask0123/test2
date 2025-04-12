// 📁 test/assignment4.test.js
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');

// Mochawesome Reporter requires Mocha to run this with --reporter mochawesome

describe('Assignment 4: Selenium WebDriver Practice on demoqa.com', function () {
  let driver;
  this.timeout(60000);

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--ignore-certificate-errors');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    // ✅ Implicit Wait (10 seconds)
    await driver.manage().setTimeouts({ implicit: 10000 });
  });

  after(async function () {
    if (driver) await driver.quit();
  });
  it('1️⃣ Explicit Wait + Select interaction', async function () {
    await driver.get('https://demoqa.com/select-menu');
  
    // Ждём <select id="cars">
    const dropdown = await driver.wait(until.elementLocated(By.id('cars')), 10000);
    await dropdown.findElement(By.css("option[value='audi']")).click();
  
    const selected = await dropdown.getAttribute('value');
    expect(selected).to.equal('audi');
  });
  

  it('2️⃣ Fluent Wait simulated + Form Submission', async function () {
    await driver.get('https://demoqa.com/automation-practice-form');

    const waitForElement = async (locator, timeout = 15000, interval = 500) => {
      const end = Date.now() + timeout;
      while (Date.now() < end) {
        try {
          const element = await driver.findElement(locator);
          if (await element.isDisplayed()) return element;
        } catch (e) {}
        await driver.sleep(interval);
      }
      throw new Error('Element not found with fluent wait: ' + locator);
    };

    const firstNameInput = await waitForElement(By.id('firstName'));
    await firstNameInput.sendKeys('Abubakir');
    await driver.findElement(By.id('lastName')).sendKeys('Tester');
    await driver.findElement(By.id('userEmail')).sendKeys('abu@example.com');
    await driver.findElement(By.css("label[for='gender-radio-1']")).click();
    await driver.findElement(By.id('userNumber')).sendKeys('87001234567');
  });

  it('3️⃣ Action Class - Drag and Drop', async function () {
    await driver.get('https://demoqa.com/droppable');

    const source = await driver.findElement(By.id('draggable'));
    const target = await driver.findElement(By.id('droppable'));

    const actions = driver.actions({ async: true });
    await actions.dragAndDrop(source, target).perform();

    const text = await target.getText();
    expect(text).to.include('Dropped');
  });
});
