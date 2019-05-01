# Data structures #

There are three json data structures in this project...

- [tree](#tree) which contains the question and answer structure and points specific answers to results (frameworks)
- [frameworks](#frameworks) this provides additional info about all the frameworks in the service
- [categories](#categories) is a simple list used to provide labels and other info around the grouping of frameworks.

## tree ##

Data for the `makeTree(treeData)` method should be supplied as a list of the following objects each one representing a branch in the tree.

Lets consider a section of a decision tree looking at the animal kingdom.

The first question for example might ask if we're interested in Vertebrate or Invertebrate animals...

```json
  {
    "ref": "type",
    "title": "Type of animal?",
    "options": [
      { 
        "ref": "invertebrate",
        "title": "Invertebrate",
        "next": "invtype"
      },
      { 
        "ref": "vertebrate",
        "title": "Vertebrate",
        "next": "verttype"
      }
    ]
  }
```

This will render something like...

>  ## Type of animal? ##
>
>  - [ ] Invertebrate
>  - [ ] Vertebrate


...where selecting *Invertebrate* would lead to the next question whose ref is identified by `invtype`...

```json
  {
    "ref": "invtype",
    "title": "Invertebrate type?",
    "options": [
      {
        "ref": "arthropods",
        "title": "Arthropods",
        "next": "arthtype"
      },
      {
        "ref": "cold",
        "title": "Cold blooded",
        "next": "cold"
      }
    ]
  }
```

This will render something like...

>  ## Invertebrate type? ##
>
>  - [ ] Arthropods
>  - [ ] Cold blooded

...if we chose *Cold blooded* we'd proceed to a question whose ref is `cold`...

```json
  {
    "ref": "cold",
    "title": "Cold blooded animals?",
    "options": [
      {
        "ref": "rep",
        "title": "Reptiles",
        "result": ["turtle", "crocodile", "snake"]
      },
      {
        "ref": "amp",
        "title": "Amphibians",
        "result": ["frog", "lizard"]
      }
    ]
  }
```

This will render something like...

>  ## Cold blooded animals? ##
>
>  - [ ] Reptiles
>  - [ ] Amphibians

...in this branch none of the options have a `next` ref, instead they have a `result` property which is an array of results which may be applicable to this route through the decision tree.

Choosing *Reptiles* in the above example would then show us *Turtle, Crocodile and Snake* as final choices.


## frameworks ##

Frameworks is a list of simple key/value pairs which provide data about specific results and are linked to the tree by matching the framework refs with the result refs.

```json
  {
    "ref": "snake",
    "title": "All about snakes",
    "supplier": "SnakesAreUs",
    "url": "https://snakes-are-us.example.com",
    "cat": "reptiles",
    "descr": "A description of the thing",
    "expiry": "2020-12-25"
  },
```

Each framework should have a template page which can be found in the [templates/frameworks directory](../templates/frameworks) and named *resultRef.njk* eg `snake.njk`


## categories ##

Categories is an array of key value pairs and is used to group the results, the `ref` in *categories.json* matches the `cat` in *frameworks.json*

```json
  {
    "ref": "books",
    "title": "Books and related materials"
  },
````