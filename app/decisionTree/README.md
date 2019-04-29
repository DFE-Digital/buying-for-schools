# Decision Tree #

The decision tree object is designed for the very small question/answer structure required for this project as such...

- it is loaded once when the node app starts
- it's data does not change at any time throughout the app
- it does not expose any methods to change the data within


## usage ##

```js
  const seed = require('./decisionTree/tree')
  const tree = seed.makeTree(jsonData)
  const branch = tree.getBranch('myBranchRef')
  const option = branch.getOption('myOptionRef')
  const answerText = option.getTitle()
```


## tree ##

The tree contains a list of branches which represent questions, each question has multiple choice answers called options. The tree has getter methods only as the tree is intended in this project to be initialised once when the application is first started and shared between all requests.

tree.js also exports `makeBranch(branchData)` and `makeOption(optionData)` these are exported for the purposes of testing, but are not called expernally during the application they are called by `makeTree` as it traverses all branches and options.


### makeTree(treeData) ###

A tree is created by passing json data to the `makeTree(treeData)` function within the tree.js file.

```js
  const seed = require('./decisionTree/tree')
  const tree = seed.makeTree(jsonData)
```

The data format required for the tree is documented in the [app/data directory](../data#tree).


### tree.getFirst() ###

As the name implies gets the first [branch](#branch) in the tree - the first entry in the json supplied when the `makeTree` method was called.

```js
  const firstBranch = tree.getFirst()
```


### tree.getBranch(ref) ###

Returns a branch specified by it's `ref`

```js
  const branchRef = 'myBranchRef'
  const branch = tree.getBranch(branchRef)
```


### tree.getBranches() ###

Returns a [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) array consisting of all the [branch](#branch) objects in the tree.

```js
  const branches = tree.getBranches()
```


## branch ##

The branch in this project represents a question being presented to the user. The object has only getter methods to protect it from being accidentally mutated during the application lifecycle.

### branch.getRef() ###

Returns the unique `ref` (string) that identifies a specific branch within the tree.

```js
  const ref = branch.getRef()
```


### branch.getTitle() ###

Returns the `title` (string) of this branch.

```js
  const title = branch.getTitle()
```


### branch.getErr() ###

Returns the `err` (string) that should be displayed when this branch/question hasn't been answered.

```js
  const errorMessage = branch.getErr()
```


### branch.getHint() ###

Returns the `hint` (string) that is displayed below the branch/question title.

```js
  const branch.getHint()
```


### branch.getSuffix() ###

Returns the `suffix` (string) which is a path to a [nunjucks](https://mozilla.github.io/nunjucks/) template file to be displayed after the question.

```js
  const suffixTemplate = branch.getSuffix()
```


### branch.getOptions() ###

Returns a [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) array consisting of all the option objects (answers) available to each branch (question).

```js
  const allOptions = branch.getOptions()
```


### branch.getOption(ref) ###

Returns a specific [option](#option) by `ref` or `null` if the option does not exist

```js
  const optionRef = 'myOptionRef'
  const option = branch.getOption()
```


### branch.toObject() ###

Returns a plain object structure which contains all the properties of the branch available via it's getter methods. Protects the static instance of the branch from being mutated, by providing a mutatable verion of the branch.

```js
  const obj = branch.toObject()
  obj.title = 'I can now set a new title on this object without changing the branch within the tree'
```


## option ##

The option object is used to represent answers to the branches' question, the object contains only getters to protect the data from accidental mutation during the application lifecycle.

### option.getRef() ###

Returns the unique `ref` (string) that identifies a specific option within the branches available options.

```js
  const ref = option.getRef()
```


### option.getTitle() ###

Returns the `title` (string) of this option.

```js
  const title = option.getTitle()
```


### option.getHint() ###

Returns the `hint` (string) that is displayed below the option/answer title.

```js
  const option.getHint()
```


### option.getNext() ###

Returns the `next` (string) which corresponds to the next branch/question's `ref` which should now be visited.

```js
  const option.getNext()
```

       
### option.getResult() ###

Returns a [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) array of result references which can be used to determine an appropriate result/s to display.

```js
  const resultReferences = option.getResult()
```


## treeUtils ##

This file contains methods to collate data from a given [tree](#tree).


### getAllBranchPaths(tree) ###

Returns an object containing a number of arrays of paths derived from the tree structure and grouped into different categories.

```js
  const treeData = require('./tree.json')
  const treeUtils = require('./treeUtils')
  const seed = require('./tree')
  const tree = seed.makeTree(treeData)

  const allPaths = treeUtils.getAllBranchPaths(tree)
```

The return object contains the following properties...

- `questions` the urls of each question
- `redirectToQuestion` urls which contains an answer to the last question and therefore should redirect to the next question
- `redirectToResult` urls where a question is answered but leads to one single result which it should redirect to 
- `multiple` urls where more than one result should be displayed
- `results` urls of a specific result


### getQuestionAnswerSummary(tree, pairs, baseUrl) ###

Returns data in a format suitable for the [GDS Check Answers pattern](https://design-system.service.gov.uk/patterns/check-answers/).

Parameters...

- `tree` the tree object created by passing json object data into `makeTree(treeData)`
- `pairs` the urls for this project follow this pattern `/question1/answer1/question2/answer2/question3/answer3/result`, pairs is an object whose properties match the refs of the questions and whose values match the ref of the choosen answer/option. For example pairs in the above url would be...
```js
  [
    { question1: 'answer1'},
    { question2: 'answer2'},
    { question3: 'answer3'},
    { result: undefined }
  ]
```
- `baseUrl` the url path preceeding the decision tree structure

```js
  const treeData = require('./recommendADogTree.json')
  const treeUtils = require('./treeUtils')
  const seed = require('./tree')
  const tree = seed.makeTree(treeData)
  const baseUrl = '/myDecisionTree'
  const pairs = { dogType: 'pet', characteristics: 'goodnature', labrador: undefined }
  const summary = getQuestionAnswerSummary = (tree, pairs, baseUrl)
```
