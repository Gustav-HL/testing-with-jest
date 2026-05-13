const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

// Här anger vi var testfilen ska hämtas. De konstiga replaceAll-funktionerna ersätter
// mellanslag med URL-säkra '%20' och backslash (\) på Windows med slash (/).
const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jest.setTimeout(500 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
const firefox = require('selenium-webdriver/firefox');

beforeAll(async () => {
    const options = new firefox.Options();
    options.addArguments("--headless"); // Kör utan fönster

    driver = await new Builder()
        .forBrowser('chrome')
        .setFirefoxOptions(options)
        .build();
    await driver.get(fileUnderTest);
});
// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});

test('Display the name of the last pushed item', async () => {
    let pushButton = await driver.findElement(By.id('push'));
    let display = await driver.findElement(By.id('top_of_stack'));
    await pushButton.click();
    
    let alert = await driver.switchTo().alert();
    await alert.sendKeys("Glongo"); 
    await alert.accept();

    let displayedText = await display.getText();
    expect(displayedText).toBe("Glongo");
});
// Ser ut som den funkar men testningen vill verkligen inte