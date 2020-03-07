<div align="center">

<img alt="Bind Deep icon" width="128" height="128" align="center" src=".github/icon.png"/>

# Bind Deep

**Lightweight module for binding a function or object deeply**

[![npm version](https://badgen.net/npm/v/bind-deep?icon=npm)](https://www.npmjs.com/package/bind-deep)
[![build status](https://badgen.net/travis/evelynhathaway/bind-deep/master?icon=travis)](https://travis-ci.com/evelynhathaway/bind-deep)
[![minified + gzip bundle size](https://badgen.net/bundlephobia/minzip/bind-deep)](https://bundlephobia.com/result?p=bind-deep)
[![license: MIT](https://badgen.net/badge/license/MIT/blue)](/LICENSE)

</div>

## Description

Bind an object to `this` in all methods in a function, object, or array. A simple, dependency-free alternative to [deep-bind](https://github.com/jonschlinkert/deep-bind).

## Features

- Works with functions, arrays, and other objects
	- Works with most custom classes, and array-like objects
- Binds root function (if passed a function) and all own, enumerable property functions
	- Includes binding accessors — getters and setters
- Copies objects and enumerable properties deeply
- Preserves and copies prototype for all types

## Installation

```bash
npm install bind-deep --save
```

---

## API

```js
bindDeep(object: Function | Object | Array, thisArg: Object, ...args:)
// => bound: Function | Object | Array
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

---

## License

Copyright Evelyn Hathaway, [MIT License](/LICENSE)
