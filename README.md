# bind-deep
[![npm version](https://img.shields.io/npm/v/bind-deep.svg)](https://www.npmjs.com/package/bind-deep)
[![Travis](https://img.shields.io/travis/com/evelynhathaway/bind-deep.svg)](https://travis-ci.com/evelynhathaway/bind-deep/)
[![license](https://img.shields.io/github/license/evelynhathaway/bind-deep.svg)](/LICENSE)

## Description
Bind an object to `this` in all methods in a function or object. Simple, dependency-free alternative to [deep-bind](https://github.com/jonschlinkert/deep-bind).


## Features
- Works with functions, arrays, and other objects
	- Works with most custom classes, array-like objects, etc.
- Binds root function and all own, enumerable property functions
	- Includes binding accessors — getters and setters
- Copies objects and enumerable properties deeply
- Preserves and copies prototype for all types

## Installation
###### From npm
```bash
$ npm install bind-deep
```
###### As a dependency
```bash
# Create package.json for your own module if you haven't already
$ npm init

# Install bind-deep and add to dependencies
$ npm install bind-deep --save
```
###### From source
```bash
$ git clone https://github.com/evelynhathaway/bind-deep
$ cd bind-deep/
$ npm install
```


---


## API

```js
bindDeep(object [Function, Object, Array], thisArg [Object], ...args)
// => bound [Function, Object, Array]
```


## Example
```js
// Require bind-deep
const bindDeep = require("bind-deep");


// Original object and function
// Could also be an actual object
const func = function() {
    // Use `this`
};
func.method = function() {
    // Use `this` again
};

const obj = {
    method() {
        // Use `this`
    }
};


// Deeply bound object and function
// `thisArg` will be what every function and method will see as `this`
const boundObj = bindDeep(obj, thisArg);
// => {method: [Function: bound]}

const boundFunc = bindDeep(func, thisArg);
// => {[Function: bound] method: [Function: bound]}
```


## License
Copyright Evelyn Hathaway, [MIT License](https://github.com/evelynhathaway/bind-deep/blob/master/LICENSE)
