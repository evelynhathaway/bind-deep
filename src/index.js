/**
 * Bind a function or object deeply
 * @module bind-deep
 * @author Evelyn Hathaway
 * @license MIT
 */

"use strict";

/**
 * Bind a function or object deeply
 * @function
 * @param {Function|Object|Array} object Function or object to bind itself and all of its methods
 * @param {Object} thisArg The value bound to `this` for each bound function and method when called
 * @param {...*} [args] Arguments provided to the bound function when the bound function is invoked
 * @returns {Function|Object|Array} The function or object passed as `object` but with itself and all methods bound to `thisArg`
 * @example <caption>Binding a function and methods with arguments</caption>
 * const myFunction = function (arg1, arg2) { return this; };
 * myFunction.primitive = "string";
 * myFunction.method = function (arg1) { return this; };
 *
 * const newThis = { newThis: "that's me!"};
 *
 * const boundFunction = bindDeep(myFunction, newThis, "add arg1 for each function");
 * boundFunction("arg2 goes here"); // returns `newThis`
 * boundFunction.primitive; // still "string"
 * boundFunction.method(); // returns `newThis`
 */
const bindDeep = function (object, thisArgument, ...args) {
	// Early return when not object-like
	// - Includes null even though `typeof null === "object"`
	if (!(object instanceof Object)) {
		return object;
	}

	// Hoist bound
	let bound;
	// Get prototype of the Functions, Arrays, and Objects
	const prototype = Object.getPrototypeOf(object);


	// Bind function or array
	if (object instanceof Function) {
		// Run bind if has the bind method (own or prototype) - objects of the species Function should have this unless overridden the bind property or manually added Symbol.species
		if (typeof object.bind === "function") {
			// Function.prototype.bind retains the prototype but properties will be re-added as if it was an object
			bound = object.bind(thisArgument, ...args);
		}
	} else if (Array.isArray(object)) { // Create bound array
		// Run bindDeep over array if isArray ([1, 2, 3] but not {"0": 1, "1": 2, "2": 3, "Symbol.species": Array})
		// Add the array's indexed own properties, all others will be re-added as if it was an object
		// - Use standard for loop over using Array.prototype.map or iterator in case the prototype was overridden
		bound = [];
		// eslint-disable-next-line unicorn/no-for-loop
		for (let index = 0; index < object.length; index++) {
			bound[index] = bindDeep(object[index], thisArgument, ...args);
		}

		// Change array prototype if needed
		// Object.setPrototypeOf is less preferred than Object.create but if the prototype was changed, it should be re-added after being made an array over an strict object
		if (prototype !== Array.prototype) {
			Object.setPrototypeOf(bound, prototype);
		}
	}


	// Bind object (including function and array properties)
	// Create bound object using the original prototype
	// - Functions retain their prototype (modified or not) when bound
	if (typeof bound === "undefined") {
		bound = Object.create(prototype);
	}

	// Add own enumerable properties to bound object (shortcut for for-in-ownprop loop)
	for (const key of Object.keys(object)) {
		// Skip existing own properties (i.e. when binding an array)
		if (Object.prototype.hasOwnProperty.call(bound, key)) {
			continue;
		}

		// Bind the getters, setters, and values of the original property
		// - Doesn't use bindDeep on the original descriptor to prevent infinite recursion
		const descriptor = Object.getOwnPropertyDescriptor(object, key);
		for (const key of ["value", "set", "get"]) {
			if (descriptor[key]) {
				descriptor[key] = bindDeep(descriptor[key], thisArgument, ...args);
			}
		}

		// Add property to bound object
		Object.defineProperty(bound, key, descriptor);
	}


	// Return the bound object or function
	return bound;
};


module.exports = bindDeep;
