<div align="center">

<img alt="Bind Deep icon" width="128" height="128" align="center" src=".github/icon.png"/>

# Bind Deep

**Lightweight module for binding a function or object deeply**

[![npm version](https://badgen.net/npm/v/bind-deep?icon=npm)](https://www.npmjs.com/package/bind-deep)
[![check status](https://badgen.net/github/checks/evelynhathaway/bind-deep/master?icon=github)](https://github.com/evelynhathaway/bind-deep/actions)
[![minified + gzip bundle size](https://badgen.net/bundlephobia/minzip/bind-deep)](https://bundlephobia.com/result?p=bind-deep)
[![license: MIT](https://badgen.net/badge/license/MIT/blue)](/LICENSE)

</div>

## Description

Bind an object to `this` in all methods in a function, object, or array. A simple, single-dependency (only for TypeScript types) alternative to [deep-bind](https://github.com/jonschlinkert/deep-bind).

## Features

- Binds the root function and all own, enumerable property functions including property accessors
- Compatible with functions, arrays, objects, custom classes, and array-likes
- Binds the `this` value and optionally, additional arguments just like [`func.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)
- Copies objects and enumerable properties deeply
- Preserves and copies prototypes for all types
- **New in `v2.1.0`:** Strict TypeScript type definitions

## Installation

```bash
npm install bind-deep --save
```

---

## Usage

### `bindDeep(object, thisArg, [...args])`

**Returns**: `Function` \| `Object` \| `Array` - The function or object passed as `object` but with
itself and all methods bound to `thisArg`

| Parameter | Type                              | Description                                                                 |
| --------- | --------------------------------- | --------------------------------------------------------------------------- |
| object    | `Function` \| `Object` \| `Array` | Function or object to bind itself and all of its methods                    |
| thisArg   | `Object`                          | The value bound to `this` for each bound function and method when called    |
| [...args] | `any`                             | Arguments provided to the bound function when the bound function is invoked |

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
