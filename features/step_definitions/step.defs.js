const { Given, When, Then, After, Before } = require("cucumber");

// Before(async function(testCase) {
//   return await this.openTodoPage();
// });

After(async function() {
  return await this.closeTodoPage();
});

Given(/^user is on page (.+)$/, async function(string) {
  return await this.gotoPage(string)
})

Given("I have a todo {string}", function(todo) {
  console.log('I have a todo', todo)
  this.setTodo(todo);
});

When("I write the todo in the input field", async function() {
  return await this.writeTodo();
});

When("I click enter", async function() {
  return await this.submit();
});

Then("I expect to see the todo in the list", async function() {
  return await this.checkTodoIsInList();
});

Then("the service displays the following page content", async function(data) {
  console.log('data', data)
  return await this.checkText('h1', data.raw()[0][1])
})
