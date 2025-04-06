const { Builder } = require('selenium-webdriver');

(async function testGoogle() {
  let driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://www.google.com');
  console.log('Page title:', await driver.getTitle());
  await driver.quit();
})();
