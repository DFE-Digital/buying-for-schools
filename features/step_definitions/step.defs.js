const { Given, When, Then, AfterAll } = require("cucumber");


Given(/^user is on page (.+)$/, async function(string) {
  return await this.gotoPage(string)
})

Then("the service displays the following page content", async function(data) {
  console.log('data', data)
  return await this.checkText('h1', data.raw()[0][1])
})
