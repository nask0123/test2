const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Login & Logout Tests for nodedatabase.onrender.com', function () {
  let driver;

  this.timeout(40000); // 40 seconds
 // 20 seconds timeout for slow page loads

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
 // You can use 'chrome' if preferred
    await driver.manage().window().maximize();
  });

  it('should login successfully with valid credentials', async function () {
    await driver.get('https://nodedatabase.onrender.com/users');

    const username = await driver.findElement(By.id('name'));
    const password = await driver.findElement(By.id('password'));

    await username.sendKeys('abubakir12');
    await password.sendKeys('abubakir12!');
    await password.submit(); // submits the form

    await driver.wait(until.titleIs('Dashboard'), 5000);

    const title = await driver.getTitle();
    expect(title).to.equal('Dashboard');
  });

  it('should NOT login with invalid credentials', async function () {
    await driver.get('https://nodedatabase.onrender.com/users');

    const username = await driver.findElement(By.id('name'));
    const password = await driver.findElement(By.id('password'));

    await username.clear();
    await password.clear();

    await username.sendKeys('wronguser');
    await password.sendKeys('wrongpass');
    await password.submit();

    await driver.wait(until.titleIs('Login'), 5000);

    const title = await driver.getTitle();
    expect(title).to.equal('Login');
  });

  it('should logout successfully', async function () {
    await driver.get('https://nodedatabase.onrender.com/users');

    const username = await driver.findElement(By.id('name'));
    const password = await driver.findElement(By.id('password'));

    await username.sendKeys('alikhan12');
    await password.sendKeys('Alikhan12!');
    await password.submit();

    await driver.wait(until.titleIs('Dashboard'), 5000);

    const logoutButton = await driver.findElement(By.id('logout'));
    await logoutButton.click();

    await driver.wait(until.titleIs('Login'), 5000);
    const title = await driver.getTitle();
    expect(title).to.equal('Login');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});