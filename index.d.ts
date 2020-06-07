/**
 * Bind a function or object deeply
 * @module bind-deep
 * @author Evelyn Hathaway
 * @license MIT
 */

import type {List, Number} from "ts-toolbelt";


/*
	Iterate through keys from the object/array/etc.
*/
export declare type BoundDeepProperties<
		ToBind,
		BoundArguments extends Array<unknown>
	// `object` is being used as the reverse of `Primitive` only for the conditional type, so this is a desired use case
	// eslint-disable-next-line @typescript-eslint/ban-types
	> = ToBind extends object ? {
		[key in keyof ToBind]: BoundDeepFunction<ToBind[key], BoundArguments>;
	} : ToBind;

/*
	Return a bound function
*/
export declare type BoundDeepFunction<
		ToBind,
		BoundArguments extends Array<unknown>
	> = ToBind extends (...args: infer OriginalArguments) => infer ReturnValue ? (
		/*
			Remove `this` while also removing the arguments provided to `bindDeep`
			- These `ts-toolbelt` utils use iteration magic, so if issues arise from long argument lists, type the
			  function manually
			- Existing arguments and return value are inferred (similar to `OmitThisParameter<T>`), so if you will have
			  to manually retype the function if you also expect these values to be different after binding
				- `ReturnType<T>` and other TS util types are your friends!
			- `this` is removed to allow the bound function to be called (counterintuitive, I know); however you can
			  add a type parameter for `this` and make the following line `((this: ThisType, ...args [...]` if you'd
			  like to repurpose this type
		*/
		((...args: List.Remove<
			OriginalArguments,
			"0",
			Number.Minus<
				Number.NumberOf<BoundArguments["length"]>,
				"1"
			>
		>) => ReturnValue)
		&
		BoundDeepProperties<ToBind, BoundArguments> // Bind properties of the function
	) : BoundDeepProperties<ToBind, BoundArguments>; // Bind properties of the object or return the primitive

/*
	Call signature for `bindDeep`
*/
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
export default function bindDeep<
		ToBind,
		BoundArguments extends Array<unknown>
	>
	(object: ToBind, thisArg: unknown, ...args: BoundArguments)
	: BoundDeepFunction<ToBind, BoundArguments>;
