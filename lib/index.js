"use strict";

var bindDeep = function bindDeep(object, thisArg) {
	// Early return when not object-like
	// - Includes null even though `typeof null === "object"`
	if (!(object instanceof Object)) {
		return object;
	}

	// Hoist bound
	var bound = void 0;
	// Get prototype of the Functions, Arrays, and Objects
	var prototype = Object.getPrototypeOf(object);

	// Bind function or array

	for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		args[_key - 2] = arguments[_key];
	}

	if (object instanceof Function) {
		// Run bind if has the bind method (own or prototype) - objects of the species Function should have this unless overridden the bind property or manually added Symbol.species
		if (typeof object.bind === "function") {
			// Function.prototype.bind retains the prototype but properties will be re-added as if it was an object
			bound = object.bind.apply(object, [thisArg].concat(args));
		}
	} else if (Array.isArray(object)) {
		// Create bound array
		// Run bindDeep over array if isArray ([1, 2, 3] but not {"0": 1, "0": 2, "0": 3, "Symbol.species": Array})
		// Add the array's indexed own properties, all other will be re-added as if it was an object
		// - Use standard for loop over using Array.prototype.map or iterator in case the prototype was overridden
		bound = [];
		for (var i = 0; i < object.length; i++) {
			bound[i] = bindDeep.apply(undefined, [object[i], thisArg].concat(args));
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
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(object)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			// Skip existing own properties (i.e. when binding an array)
			if (Object.hasOwnProperty(bound, key)) {
				continue;
			}

			// Bind the getters, setters, and values of the original property
			// - Doesn't use bindDeep on the original descriptor to prevent infinite recursion
			var descriptor = Object.getOwnPropertyDescriptor(object, key);
			var _arr = ["value", "set", "get"];
			for (var _i = 0; _i < _arr.length; _i++) {
				var _key2 = _arr[_i];
				if (descriptor[_key2]) {
					descriptor[_key2] = bindDeep.apply(undefined, [descriptor[_key2], thisArg].concat(args));
				}
			}

			// Add property to bound object
			Object.defineProperty(bound, key, descriptor);
		}

		// Return the bound object or function
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return bound;
};

module.exports = bindDeep;