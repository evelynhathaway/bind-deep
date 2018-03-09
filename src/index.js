"use strict";

const bindDeep = function(object, thisArg, ...args) {
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
			bound = object.bind(thisArg, ...args);
		}
	} else if (Array.isArray(object)) { // Create bound array
		// Run bindDeep over array if isArray ([1, 2, 3] but not {"0": 1, "0": 2, "0": 3, "Symbol.species": Array})
		// Add the array's indexed own properties, all other will be re-added as if it was an object
		// - Use standard for loop over using Array.prototype.map or iterator in case the prototype was overridden
		bound = [];
		for (let i = 0; i < object.length; i++) {
			bound[i] = bindDeep(object[i], thisArg, ...args);
		}

		// Change array prototype if needed
		// Object.setPrototypeOf is less prefered than Object.create but if the prototype was changed, it should be re-added after being made an array over an strict object
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
		if (Object.hasOwnProperty(bound, key)) {
			continue;
		}

		// Bind the getters, setters, and values of the original property
		// - Doesn't use bindDeep on the original descriptor to prevent infinite recursion
		const descriptor = Object.getOwnPropertyDescriptor(object, key);
		for (const key of ["value", "set", "get"]) {
			if (descriptor[key]) {
				descriptor[key] = bindDeep(descriptor[key], thisArg, ...args);
			}
		}

		// Add property to bound object
		Object.defineProperty(bound, key, descriptor);
	}


	// Return the bound object or function
	return bound;
};


module.exports = bindDeep;
