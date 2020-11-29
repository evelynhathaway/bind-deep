/**
 * Bind a function or object deeply
 * @module bind-deep
 * @author Evelyn Hathaway
 * @license MIT
 */

/*
	Tuple helper types
*/
// Get all but first element of a tuple
type TupleTailElements<Tuple extends ReadonlyArray<unknown>> =
	Tuple extends [unknown, ...infer TailElements] ? TailElements : never;
// Return a tuple of the same length but with all elements `as any`'ed
type LoosenTuple<Tuple extends ReadonlyArray<unknown>> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Tuple extends [] ? Tuple : [unknown, ...LoosenTuple<TupleTailElements<Tuple>>];

/*
	Iterate through keys from the object/array/etc.
*/
export declare type BoundDeepProperties<
	ToBind,
	BoundArguments extends ReadonlyArray<unknown>,
// `object` is being used as the reverse of `Primitive` only for the conditional type, so this is a desired use case
// eslint-disable-next-line @typescript-eslint/ban-types
> = ToBind extends object ? {
	[key in keyof ToBind]: BoundDeepFunction<ToBind[key], BoundArguments>;
} : ToBind;

/*
	Return a bound function
	- Removes `this` while also removing the arguments provided to `bindDeep`
	- Existing arguments and return value are inferred, so if you will have to manually retype the function if you also
	  expect these values to be different after binding. `ReturnType<T>` and other TS util types are your friends!
	- `this` is removed to allow the bound function to be called (counterintuitive, I know)
	- TODO: Use throw types for unsafe expressions (https://github.com/microsoft/TypeScript/pull/40468)
*/
export declare type BoundDeepFunction<
	ToBind,
	BoundArguments extends ReadonlyArray<unknown>,
> = (
	// Is callable function? Infer arguments and return values
	ToBind extends (...args: infer OriginalArguments) => infer ReturnValue ? (
		// Infer arguments after bound arguments
		OriginalArguments extends [...LoosenTuple<BoundArguments>, ...infer RestArguments] ? (
			// Are the arguments assignable to the original arguments?
			[...BoundArguments, ...RestArguments] extends OriginalArguments ? (
				// Remove ThisType and any arguments from function
				(...args: RestArguments) => ReturnValue
			) : unknown // Not safe to call
		) : unknown // Not safe to call
	) :
	// Is newable function? Infer arguments and return values
	ToBind extends new (...args: infer OriginalArguments) => infer ReturnValue ? (
		// Infer arguments after bound arguments
		OriginalArguments extends [...LoosenTuple<BoundArguments>, ...infer RestArguments] ? (
			// Are the arguments assignable to the original arguments?
			[...BoundArguments, ...RestArguments] extends OriginalArguments ? (
				// Remove ThisType and any arguments from function
				new (...args: RestArguments) => ReturnValue
			) : unknown // Not safe to construct
		) : unknown // Not safe to construct
	) : unknown // Not a function
) & BoundDeepProperties<ToBind, BoundArguments>; // Bind properties of the object or return the primitive

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
	BoundArguments extends ReadonlyArray<unknown>,
> (
	object: ToBind, thisArg: ThisParameterType<ToBind>, ...args: BoundArguments,
) : BoundDeepFunction<ToBind, BoundArguments>;
