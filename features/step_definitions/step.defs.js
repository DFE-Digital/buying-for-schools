const { Given, When, Then, AfterAll } = require("cucumber");


Given(/^user is on page (.+)$/, {timeout: 30 * 1000}, async function(string) {
  await this.gotoPage(string)
})

Then("the service displays the following page content", async function(data) {
  await this.checkPageContent(data.raw())
})

Then('have radio buttons', async function (data) {
  await this.haveRadioButtons(data.raw())
})

Then('have links', async function (data) {
  await this.haveLinks(data.raw())
})

Then('have result card', async function (data) {
  await this.haveResultCard(data.raw())
})