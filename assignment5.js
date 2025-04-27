const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const log4js = require('log4js');
const fs = require('fs');
const path = require('path');
const { describe, it, before, after, beforeEach, afterEach } = require('mocha');

// Настройка логирования
log4js.configure({
  appenders: {
    out: { type: 'console' },
    file: { type: 'file', filename: 'assignment5.log' }
  },
  categories: { default: { appenders: ['out', 'file'], level: 'info' } }
});
const logger = log4js.getLogger('assignment5');

let driver;

describe('Assignment 5 - Selenium with JS', function () {
  this.timeout(60000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    logger.info('WebDriver Initialized');
  });

  beforeEach(function () {
    logger.info(`Starting test: ${this.currentTest.title}`);
  });

  it('should open demoqa and fill the form', async function () {
    await driver.manage().setTimeouts({ implicit: 10000 });

    await driver.get('https://demoqa.com/text-box');
    logger.info('Navigated to demoqa');

    await driver.findElement(By.id('userName')).sendKeys('abuabkair Test');
    await driver.findElement(By.id('userEmail')).sendKeys('abu@test.com');
    await driver.findElement(By.id('currentAddress')).sendKeys('aitu like 12222');
    await driver.findElement(By.id('submit')).click();
    logger.info('Form submitted');

    const output = await driver.wait(until.elementLocated(By.id('output')), 10000);
    const text = await output.getText();
    expect(text).to.include('Alikhan');
    logger.info('Form output verified');
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      logger.error(`Test FAILED: ${this.currentTest.title}`);
      
      let screenshot = await driver.takeScreenshot();
      const filePath = path.join(__dirname, `screenshots/${this.currentTest.title.replace(/\s+/g, '_')}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      
      logger.info(`Screenshot saved: ${filePath}`);
    } else {
      logger.info(`Test PASSED: ${this.currentTest.title}`);
    }
  });
  
  after(async function () {
    if (driver) {
      await driver.quit();
      logger.info('WebDriver Closed');
    }
  });
});
