declare module "bind-deep" {
	import {List, Number} from "ts-toolbelt";


	/*
		Iterate through keys from the object/array/etc.
	*/
	export type BoundDeepProperties<
		ToBind,
		BoundArguments extends Array<unknown>
	> = ToBind extends object ? {
		[key in keyof ToBind]: BoundDeepFunction<ToBind[key], BoundArguments>;
	} : ToBind;

	/*
		Return a bound function
	*/
	export type BoundDeepFunction<
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
	export default function bindDeep<
		ToBind,
		BoundArguments extends Array<unknown>
	>
	(object: ToBind, thisArg: unknown, ...args: BoundArguments)
	: BoundDeepFunction<ToBind, BoundArguments>;
}
