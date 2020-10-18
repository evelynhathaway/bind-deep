/**
 * Bind a function or object deeply
 * @module bind-deep
 * @author Evelyn Hathaway
 * @license MIT
 */

/*
	Type flag for if the `strictBindCallApply` compiler flag is enabled
*/
// eslint-disable-next-line @typescript-eslint/ban-types
type StrictBindCallApply = Function extends CallableFunction & NewableFunction ? true : false;

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
	- Removes `this` while also removing the arguments provided to `bindDeep`
	- Existing arguments and return value are inferred, so if you will have to manually retype the function if you also
	  expect these values to be different after binding. `ReturnType<T>` and other TS util types are your friends!
	- `this` is removed to allow the bound function to be called (counterintuitive, I know)
*/
export declare type BoundDeepFunction<
	ToBind,
	BoundArguments extends Array<unknown>
> = (
	// Return `any` type if not in strict mode
	StrictBindCallApply extends false ? any : // eslint-disable-line @typescript-eslint/no-explicit-any
	// Remove ThisType and any arguments from function
	ToBind extends (...args: infer OriginalArguments) => infer ReturnValue ? (
		ToBind extends (...args: [...BoundArguments, ...infer RestArguments]) => infer R ? (
			[...BoundArguments, ...RestArguments] extends OriginalArguments ? (
				(...args: RestArguments) => ReturnValue
			) : unknown // Not safe to call
		) : unknown// Not safe to call except when using unions of nonassignable types
	) :
	// Remove ThisType and any arguments from class
	ToBind extends new (...args: infer OriginalArguments) => infer ReturnValue ? (
		ToBind extends new (...args:[...BoundArguments, ...infer RestArguments]) => infer R ? (
			[...BoundArguments, ...RestArguments] extends OriginalArguments ? (
				new (...args: RestArguments) => ReturnValue
			) : unknown // Not safe to construct
		) : unknown// Not safe to construct except when using unions of nonassignable types
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
	BoundArguments extends Array<unknown>,
> (
	object: ToBind, thisArg: ThisParameterType<ToBind>, ...args: BoundArguments,
) : BoundDeepFunction<ToBind, BoundArguments>;
