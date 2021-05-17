<div align="center">

<img alt="Bind Deep icon" width="128" height="128" align="center" src=".github/icon.png"/>

# Bind Deep

**Lightweight module for binding a function or object deeply**

[![npm version](https://badgen.net/npm/v/bind-deep?icon=npm)](https://www.npmjs.com/package/bind-deep)
[![check status](https://badgen.net/github/checks/evelynhathaway/bind-deep/main?icon=github)](https://github.com/evelynhathaway/bind-deep/actions)
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

### TypeScript

All types inferred or annotated are preserved from the original functions and objects. The type definitions are incredibly strong deep types as the only negative side-effects are:

- If bound arguments are added, the arguments in call signatures are renamed by their bound position.
- If more than around 39 bound arguments are added, TypeScript will error `Type instantiation is excessively deep and possibly infinite.`
    - If you somehow do this, slap on an `as any` or your manually created type

An in-depth explanation is commented inside of [`index.d.ts`](./index.d.ts) and below with example code.

```ts
// Import bind-deep
import bindDeep from "bind-deep";


interface OriginalThis {
    discriminator: string;
}

// Original function
const myFunction = function (this: OriginalThis, arg1: string, arg2: number) {
    return this;
};
myFunction.method = function (this: OriginalThis, arg1: string) {
    return this;
};
myFunction.primitive = "string";

// `thisArg` value
const newThis = { newThis: "that's me!"};

// Deeply bound functions
const boundFunction = bindDeep(myFunction, newThis);
const boundFunctionWithArgs = bindDeep(myFunction, newThis, "add arg1 for each function");

/*
    Root call signature: `(arg1: string, arg2: number) => OriginalThis`
    - `this` argument type omitted from the original call signature as it is now bound
    - All other argument types and names are preserved
    - Returns `newThis` as `OriginalThis` due to the return value inferred by TypeScript
*/
boundFunction("arg1", 10); // returns `newThis`
/*
    Root call signature when passing an argument: `((args_0: number) => OriginalThis)`
    - Similar explanation to the root call signature
    - `arg1` argument type omitted from the original call signature as it is now bound
    - `arg2` is represented as `args_0` with the number type preserved
        - This unfortunate renaming only occurs when binding arguments
*/
boundFunctionWithArgs(10); // returns `newThis`

/*
    Method call signature: `(method) method(arg1: string): OriginalThis`
*/
boundFunction.method("arg1"); // returns `newThis`
/*
    Method call signature when passing an argument: `(method) method(): OriginalThis`
*/
boundFunctionWithArgs.method(); // returns `newThis`

/*
    Primitive property type: `primitive: string`
*/
const myString: string = boundFunction.primitive; // still "string", typings preserved
```

---

## License

Copyright Evelyn Hathaway, [MIT License](/LICENSE)
