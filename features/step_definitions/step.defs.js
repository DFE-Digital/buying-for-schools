const { Given, When, Then, AfterAll } = require("cucumber");


Given(/^user is on page (.+)$/, async function(string) {
  console.log('START: Given user is on page')
  await this.gotoPage(string)
  console.log('END: Given user is on page')
})

Then("the service displays the following page content", async function(data) {
  console.log('START: Then the service displays the following page content', data)
  await this.checkText('h1', data.raw()[0][1])
  console.log('END: Then the service displays the following page content')
})
