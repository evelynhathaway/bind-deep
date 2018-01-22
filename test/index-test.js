"use strict";
/*
	Tests for the bind-deep module
*/


/*
	Module dependencies
*/
// Assertion library
const expect = require("chai").expect;
// Module to test
const bindDeep = require("../lib/index.js");


describe("bind-deep", function() {
	/*
		Object definitions
	*/
	const fakes = {};
	const dummies = {};

	/*
		Hoisting
	*/
	let checkDeep;
	let matchDeep;


	before(function() {
		/*
			Functions
		*/
		checkDeep = function(object) {
			// Record amount of functions
			let functions = 0;

			// Skip arrays
			if (Array.isArray(object)) {
				return 0;
			}

			// Assert each function
			if (typeof object === "function") {
				expect(
					object()
				).to.equal(
					dummies.this
				);
				// Record amount of functions
				functions++;
			}

			// Check functions and objects (not arrays) recursively
			if (typeof object === "object" || typeof object === "function") {
				for (const key in object) {
					if (object.hasOwnProperty(key)) {
						// Record amount of functions
						functions += checkDeep(object[key]);
					}
				}
			}

			return functions;
		};

		matchDeep = function(object, template) {
			// Assert each !function !object
			if (typeof object !== "function" && typeof object !== "object") {
				expect(
					object
				).to.equal(
					template
				);
			}

			// Check functions and objects (not arrays) recursively
			if (typeof object === "object" || typeof object === "function") {
				for (const key in object) {
					if (object.hasOwnProperty(key)) {
						// Record amount of functions
						matchDeep(object[key], template[key]);
					}
				}
			}
		};


		/*
			Fakes
		*/
		// Fake object and functions to bind-deep
		fakes.obj = {
			"string": "Test me already!",
			"array": [1, 2, 3],
			"object": {"key": "value"},
			"function": function() {return this;},
			method() {return this;},
			"object with function": {"function": function() {return this;}}
		};
		fakes.func = Object.assign(function() {
			return this;
		}, fakes.obj);

		// Dummy `thisArg` value
		dummies.this = {
			"whoami": "I am the `this` dummy you made, master."
		};
	});


	context("when using an function", function() {
		let result;
		before("bind-deep the fake function", function() {
			result = bindDeep(dummies.this, fakes.func);
		});

		it("should return a function", function() {
			expect(typeof result === "function").to.be.true;
		});
		it("should have all functions and methods bound and have 4 of them", function() {
			expect(checkDeep(result)).to.equal(4);
		});
		it("should still have same strings, arrays, etc.", function() {
			matchDeep(result, fakes.func);
		});
	});


	context("when using an object", function() {
		let result;
		before("bind-deep the fake object", function() {
			result = bindDeep(dummies.this, fakes.obj);
		});

		it("should return an object", function() {
			expect(typeof result === "object").to.be.true;
		});
		it("should have all functions and methods bound and have 3 of them", function() {
			expect(checkDeep(result)).to.equal(3);
		});
		it("should still have same strings, arrays, etc.", function() {
			matchDeep(result, fakes.obj);
		});
	});
});
