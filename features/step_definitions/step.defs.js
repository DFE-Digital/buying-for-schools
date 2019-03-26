const { Given, When, Then, AfterAll } = require("cucumber");


Given(/^user is on page (.+)$/, {timeout: 30 * 1000}, async function(string) {
  // console.log('START: Given user is on page')
  await this.gotoPage(string)
  // console.log('END: Given user is on page')
})

Then("the service displays the following page content", async function(data) {
  // console.log('START: Then the service displays the following page content', data)
  await this.checkPageContent(data.raw())
  // console.log('END: Then the service displays the following page content')
})

Then('have radio buttons', async function (data) {
  // Write code here that turns the phrase above into concrete actions
  await this.haveRadioButtons(data.raw())
})