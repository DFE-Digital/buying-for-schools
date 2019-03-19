const { Given, When, Then, After, Before } = require("cucumber");

// Before(async function(testCase) {
//   return await this.openTodoPage();
// });

After(function() {
  return this.closeTodoPage();
});

Given(/^user is on page (.+)$/, function(string) {
  return this.gotoPage(string)
})

Then("the service displays the following page content", function(data) {
  console.log('data', data)
  return this.checkText('h1', data.raw()[0][1])
})
