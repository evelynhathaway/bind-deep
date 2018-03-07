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


	before(function() {
		/*
			Functions
		*/
		const bindTester = function() {
			expect(
				this
			).to.deep.equal(
				dummies.this
			);

			expect(
				Array.from(arguments)
			).to.deep.equal(
				dummies.args
			);
		};


		/*
			Fakes
		*/
		// Dummy function that returns `this`
		dummies.func = function() {bindTester.call(this, ...arguments);};

		// Fake object and function to bind-deep
		// Object for recursive testing against types as properties
		fakes.obj = {
			"undefined": undefined,
			"null": null,
			"string": "string",
			"array": [1, 2, 3, dummies.func], // TODO: check if still array
			"object": {"key": "value", "func": dummies.func}, // TODO: check if still object
			"function": dummies.func
		};
		// Array's function property
		fakes.obj.array.func = dummies.func;
		// Obj's function property
		fakes.obj.array.func = dummies.func;
		// Function - is another dummy function, but it's being assigned this time
		fakes.func = Object.assign(function() {bindTester.call(this, ...arguments);}, fakes.obj);
		// Non-enumerable
		fakes.nonenum = {"value": "nonenum"};
		Object.defineProperty(fakes.obj, "nonenum", fakes.nonenum);
		Object.defineProperty(fakes.func, "nonenum", fakes.nonenum);
		// Getters and setters
		fakes.accessor = {
			get() {
				bindTester.call(this, ...arguments);
			},
			set() {
				const args = Array.from(arguments);

				// Remove setter argument
				expect(
					args.pop()
				).to.equal(
					"set"
				);

				bindTester.call(this, ...args);
			}
		};

		// Dummy `thisArg` value
		dummies.this = {"whoami": "dummies.this"};
		// Dummy `args` value
		dummies.args = ["arg1", "arg2", "arg3"];
		// Dummy prototype
		dummies.proto = {"whoami": "dummies.proto"};
	});


	const checkProperties = function() {
		// Merge these tests with below, allow for array tests TODO
		for (const prop of ["undefined", "null", "string"]) {
			it(`should have a "${prop}" property equal with original data`, function() {
				expect(
					this.result.hasOwnProperty(prop)
				).to.be.true;

				expect(
					this.result[prop]
				).to.equal(
					fakes.obj[prop]
				);
			});
		}
		for (const prop of ["array", "object"]) {
			it(`should have a "${prop}" property with a bound function and original data`, function() {
				expect(
					this.result.hasOwnProperty(prop)
				).to.be.true;

				const object = this.result[prop];

				for (const key in fakes.obj) {
					if (typeof object[key] === "function") {
						object[key]();
					} else {
						expect(
							fakes.obj[prop][key]
						).to.equal(
							object[key]
						);
					}
				}
			});
		}
		it("should have a bound \"function\" property", function() {
			expect(
				this.result.hasOwnProperty("function")
			).to.be.true;

			this.result["function"]();
		});
		it("should not have a \"nonenum\" property", function() {
			expect(
				this.result.hasOwnProperty("nonenum")
			).to.be.false;
		});
	};


	context("when binding an function", function() {
		before("bind-deep the fake function", function() {
			this.result = bindDeep(fakes.func, dummies.this, ...dummies.args);
		});

		it("should return a bound function", function() {
			expect(typeof this.result === "function").to.be.true;

			this.result();
		});
		checkProperties();
	});


	context("when binding an object", function() {
		before("bind-deep the fake object", function() {
			this.result = bindDeep(fakes.obj, dummies.this, ...dummies.args);
		});

		it("should return an object", function() {
			expect(typeof this.result === "object").to.be.true;
		});
		checkProperties();
	});


	context("when binding an object with getters and setters", function() {
		before("bind-deep the fake object with accessors on \"prop\"", function() {
			this.result = bindDeep(Object.defineProperty({}, "prop", fakes.accessor), dummies.this, ...dummies.args);
		});

		it("should return an object", function() {
			expect(typeof this.result === "object").to.be.true;
		});
		it("should have a bound getter", function() {
			this.result.prop;
		});
		it("should have a bound setter", function() {
			this.result.prop = "set";
		});
	});


	// TODO
	context.skip("when binding an array", function() {
		before("bind-deep the fake array", function() {
			this.result = bindDeep(fakes.obj.array, dummies.this, ...dummies.args);
		});

		it("should return an array", function() {
			expect(Array.isArray(this.result)).to.be.true;
		});
		checkProperties();
	});


	// TODO
	context.skip("when binding objects with prototype changes", function() {

	});
});
