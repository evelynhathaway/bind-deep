"use strict";

const bindDeep = function(thisArg, object) {
	// Skip arrays
	if (Array.isArray(object)) {
		return object;
	}

	// Start binding or returning other types
	let bound;
	switch (typeof object) {
		case "function":
			bound = object.bind(thisArg);
			// fallthrough
		case "object":
			if (!bound) {
				bound = {};
			}
			for (const key in object) {
				if (object.hasOwnProperty(key)) {
					bound[key] = bindDeep(thisArg, object[key]);
				}
			}
			break;
		default: {
			return object;
		}
	}

	// Return the bound object or function
	return bound;
};


module.exports = bindDeep;
