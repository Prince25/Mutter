/**
 * Dependency Modules
 */
var assert = require("assert");
var webdriver = require("selenium-webdriver");
require('chromedriver')

// Application Server
const serverUri = "http://localhost:3000/#";
const appTitle = "Mutter";


/**
 * Config for Chrome browser
 * @type {webdriver}
 */
var browser = new webdriver.Builder()
	.usingServer()
	.withCapabilities({ browserName: "chrome" })
	.build();



/**
 * Function to get the title and resolve it it promise.
 * @return {[type]} [description]
 */
function logTitle() {
	return new Promise((resolve, reject) => {
		browser.getTitle().then(function(title) {
			resolve(title);
		});
	});
}


/**
 * Test Cases for Splash Page
 */
describe("Splash Page", function() {
	/**
	 * Test case to load our web app and check the title.
	 */
	it("Should load the splash page and get title", function() {
		return new Promise((resolve, reject) => {
			browser
				.get(serverUri)
				.then(logTitle)
				.then(title => {
					assert.strictEqual(title, appTitle);
					resolve();
				})
				.catch(err => reject(err));
		});
	});

	/**
	 * Test case to wait for elements to be loaded
	 */
	it("Wait for all elements on the page to load", function() {
		return browser.wait(webdriver.until.elementLocated(webdriver.By.id('email')), 5 * 1000)
	});

	/**
	 * Test case to check whether the "email" element is loaded.
	 */
	it("Double Check whether the email element is loaded", function() {
		return new Promise((resolve, reject) => {
			browser
				.findElement({ id: "email" })
				.then(elem => resolve())
				.catch(err => reject(err));
		});
	});

	/**
	 * Test case to check whether an invalid email works
	 */
	it("Try out an invalid email", function() {
		browser
				.findElement({ id: "email" })
				.then(elem => 
					elem.sendKeys("Prince"),
				)

		var msg = browser.findElement(webdriver.By.id("email")).getAttribute("validationMessage");

		browser
		.findElement({ id: "password" })
		.then(elem => 
			elem.sendKeys("123456")
		)

		browser
				.findElement({ id: "signin_btn" })
				.then(elem => 
					elem.click(),
				)

		return assert.notEqual(browser.getCurrentUrl().toString(), "http://localhost:3000/splash");
	});

});


/**
	 * Logging in properly
	 */
describe("Logging in correctly", function() {
	// it("Wait for all elements on the page to load", function() {
	// 	return browser.wait(webdriver.until.elementLocated(webdriver.By.id('email')), 5 * 1000)
	// });

	it("Type in correct information", function() {

		browser.wait(webdriver.until.elementLocated(webdriver.By.id('email')), 5 * 1000).then(elem => {
			elem.clear()
			elem.sendKeys("Prince@test.com");
		})

		browser
			.findElement({ id: "signin_btn" })
			.then(elem => 
				elem.click()
			)
	});

	it("Should load the discover page", function() {
		browser.wait(webdriver.until.elementLocated(webdriver.By.id('searchartists_input')), 5 * 1000).then( () =>
			browser
				.getCurrentUrl()
				.then(url => {
					return assert.strictEqual(url, "http://localhost:3000/");
				})
			)
		})

});




	// /**
	//  * End of test cases use.
	//  * Closing the browser and exit.
	//  */
	// after(function() {
	// 	// End of test use this.
	// 	browser.quit();
	// });