"use strict";
/*
	Tests for the bind-deep module
*/
/*
	Module dependencies
*/
const {expect} = require("chai");
// Module to test
const bindDeep = require("../lib/index.js");


describe("bind-deep", function() {
	/*
		Object definitions
	*/
	const fakes = {};
	const dummies = {};


	/*
		Functions
	*/
	// Test maker for all contexts
	const check = function(result, template, path = "result") {
		describe(path, function() {
			if (template instanceof Object) {
				// typeof
				const templateType = typeof template;
				it(`should be typeof ${templateType}`, function() {
					expect(typeof result).to.equal(templateType);
				});

				// instanceof
				for (const ClassType of [Function, Array]) {
					const templateInstance = template instanceof ClassType;
					it(`should ${templateInstance ? "" : "not "}be instanceof ${ClassType}`, function() {
						expect(result instanceof ClassType).to.equal(templateInstance);
					});
				}

				// isArray
				const templateIsArray = Array.isArray(template);
				it(`should ${templateIsArray ? "" : "not "}be an array`, function() {
					expect(Array.isArray(result)).to.equal(templateIsArray);
				});

				// Is bound? - assume function is `bindTester`
				const hasClassName = template.hasOwnProperty("prototype") && template.prototype.constructor.name;
				if (template instanceof Function && !hasClassName) {
					it("should be bound to thisArg and have the correct arguments", function() {
						result();
					});
				}

				// Has same prototype
				it("should have the same prototype", function() {
					expect(Object.getPrototypeOf(result) === Object.getPrototypeOf(template)).to.be.true;
				});

				// Properties - get both enumerable and non own props
				for (const key of Object.getOwnPropertyNames(template)) {
					// Look for non-enumerable properties from template on result
					if (template.propertyIsEnumerable(key)) {
						const descriptor = Object.getOwnPropertyDescriptor(template, key);
						if (descriptor.get || descriptor.set) {
							// Accessors
							if (descriptor.get) {
								describe(`${path}.${key} (getter)`, function() {
									it("should have a bound getter", function() {
										result[key];
									});
								});
							}
							if (descriptor.set) {
								describe(`${path}.${key} (setter)`, function() {
									it("should have a bound setter", function() {
										result[key] = "set";
									});
								});
							}
						} else {
							// Recursive
							check(result[key], template[key], `${path}${isNaN(parseInt(key)) ? `.${key}` : `[${key}]`}`);
						}
					} else {
						if (key !== "name" && key !== "length") {
							it(`should not have a copied non-enumerable property "${key}"`, function() {
								expect(result.hasOwnProperty(key)).to.be.false;
							});
						}
					}


				}
			} else {
				it("should equal the template", function() {
					expect(result).to.equal(template);
				});
			}
		});
	};

	// Assertion maker for bindings and arguments used as the function to be called when testing
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
		Dummies
	*/
	// Dummy function that returns `this`
	dummies["function"] = function() {bindTester.call(this, ...arguments);};
	// Dummy `thisArg` value
	dummies.this = {"whoami": "dummies.this"};
	// Dummy `args` value
	dummies.args = ["arg1", "arg2", "arg3"];
	// Dummy prototype
	dummies.proto = {"whoami": "dummies.proto"};

	dummies.true =  true;
	dummies.false =  false;
	dummies.undefined =  undefined;
	dummies.null =  null;
	dummies.string =  "string";
	// Array
	dummies.array = [1, 2, 3, dummies["function"]];
	dummies.array["function"] = dummies["function"]; // Non-indexed property
	// Object
	dummies.object =  {"key": "value", "function": dummies["function"]};
	// Array without the array proto
	dummies.protoarray = Object.setPrototypeOf([], dummies.proto);
	// Class and instance
	dummies.Class = class DummyClass {
		constructor() {this["function"] = dummies["function"];}
	};
	dummies.Class["function"] = dummies["function"]; // Static
	dummies.instance = new dummies.Class();
	// Getters and setters
	dummies.accessor = {
		get prop() {
			bindTester.call(this, ...arguments);
		},
		set prop(arg) {
			const args = Array.from(arguments);

			// Remove setter argument
			expect(args.pop()).to.equal("set");

			bindTester.call(this, ...args);
		}
	};
	// Non-enumerable descriptor
	dummies.descriptor = {
		"value": "nonenum",
		"enumerable": false
	};


	/*
		Fakes
	*/
	// Top-level fakes
	// - These objects I determinded are important to test that they functioned correctly on the first go
	// Function
	fakes["function"] = Object.assign(function() {bindTester.call(this, ...arguments);}, dummies);
	Object.defineProperty(fakes["function"], "nonenum", dummies.descriptor);
	// Object
	fakes.object = Object.assign({}, dummies);
	Object.defineProperty(fakes.object, "nonenum", dummies.descriptor);


	/*
		Contexts
	*/
	context("when binding an function", function() {
		const result = bindDeep(fakes["function"], dummies.this, ...dummies.args);
		check(result, fakes["function"]);
	});

	context("when binding an object", function() {
		const result = bindDeep(fakes.object, dummies.this, ...dummies.args);
		check(result, fakes.object);
	});
});
