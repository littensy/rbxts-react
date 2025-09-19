import * as PropTypes from "./prop-types";

declare const UNDEFINED_VOID_ONLY: unique symbol;
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

type InferNone<T> = T extends undefined ? typeof React.None : T;
type MapToNone<T> = { [K in keyof T]-?: InferNone<T[K]> };

export = React;
export as namespace React;

declare namespace React {
	//
	// React Elements
	// ----------------------------------------------------------------------

	/**
	 * Used to retrieve the possible components which accept a given set of props.
	 *
	 * Can be passed no type parameters to get a union of all possible components
	 * and tags.
	 *
	 * Is a superset of {@link ComponentType}.
	 *
	 * @template P The props to match against. If not passed, defaults to any.
	 * @template Tag An optional tag to match against. If not passed, attempts to match against all possible tags.
	 *
	 * @example
	 *
	 * ```tsx
	 * // All components and tags (imagelabel, imagebutton etc.)
	 * // which accept `Image`
	 * type ImageComponents = ElementType<{ Image: string }>;
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * // All components
	 * type AllComponents = ElementType;
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * // All custom components which match `Image`, and tags which
	 * // match `Image`, narrowed down to just `imagelabel` and `imagebutton`
	 * type ImageComponents = ElementType<{ Image: string }, "imagelabel" | "imagebutton">;
	 * ```
	 */
	type ElementType<P = any, Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements> =
		| { [K in Tag]: P extends JSX.IntrinsicElements[K] ? K : never }[Tag]
		| ComponentType<P>;

	/**
	 * Represents any user-defined component, either as a function or a class.
	 *
	 * Similar to {@link JSXElementConstructor}, but with extra properties like
	 * {@link FunctionComponent.defaultProps defaultProps } and
	 * {@link ComponentClass.contextTypes contextTypes}.
	 *
	 * @template P The props the component accepts.
	 *
	 * @see {@link ComponentClass}
	 * @see {@link FunctionComponent}
	 */
	type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

	/**
	 * Represents any user-defined component, either as a function or a class.
	 *
	 * Similar to {@link ComponentType}, but without extra properties like
	 * {@link FunctionComponent.defaultProps defaultProps } and
	 * {@link ComponentClass.contextTypes contextTypes}.
	 *
	 * @template P The props the component accepts.
	 */
	type JSXElementConstructor<P> =
		| ((props: P, context?: any) => ReactNode)
		| (new (props: P, context?: any) => Component<any, any>);

	/**
	 * A readonly ref container where {@link current} cannot be mutated.
	 *
	 * Created by {@link createRef}, or {@link useRef} when passed `null`.
	 *
	 * @template T The type of the ref's value.
	 *
	 * @example
	 *
	 * ```tsx
	 * const ref = createRef<Frame>();
	 *
	 * ref.current = React.createElement("Frame"); // Error
	 * ```
	 */
	interface RefObject<T> {
		/**
		 * The current value of the ref.
		 */
		readonly current: T | undefined;
	}

	/**
	 * A callback fired whenever the ref's value changes.
	 *
	 * @template T The type of the ref's value.
	 *
	 * @see {@link https://react.dev/reference/react-dom/components/common#ref-callback React Docs}
	 *
	 * @example
	 *
	 * ```tsx
	 * <frame ref={(current) => print(current)} />
	 * ```
	 */
	type RefCallback<T> = (instance: T | undefined) => void;

	/**
	 * A union type of all possible shapes for React refs.
	 *
	 * @see {@link RefCallback}
	 * @see {@link RefObject}
	 */
	type Ref<T> = RefCallback<T> | RefObject<T> | undefined;

	/**
	 * A legacy implementation of refs where you can pass a string to a ref prop.
	 *
	 * @see {@link https://react.dev/reference/react/Component#refs React Docs}
	 *
	 * @example
	 *
	 * ```tsx
	 * <frame ref="myRef" />
	 * ```
	 */
	type LegacyRef<T> = string | Ref<T>;

	/**
	 * Retrieves the type of the "ref" prop for a given component type or tag name.
	 *
	 * @template C The component type.
	 *
	 * @example
	 *
	 * ```tsx
	 * type MyComponentRef = React.ElementRef<typeof MyComponent>;
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * type FrameRef = React.ElementRef<"frame">;
	 * ```
	 */
	type ElementRef<
		C extends
			| ForwardRefExoticComponent<any>
			| { new (props: any): Component<any> }
			| ((props: any, context?: any) => ReactNode)
			| keyof JSX.IntrinsicElements,
	> =
		// need to check first if `ref` is a valid prop for ts@3.0
		// otherwise it will infer `{}` instead of `never`
		"ref" extends keyof ComponentPropsWithRef<C>
			? NonNullable<ComponentPropsWithRef<C>["ref"]> extends Ref<infer Instance>
				? Instance
				: never
			: never;

	type ComponentState = any;

	/**
	 * A value which uniquely identifies a node among items in an array.
	 *
	 * @see {@link https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key React Docs}
	 */
	type Key = string | number;

	/**
	 * @internal The props any component can receive.
	 * You don't have to add this type. All components automatically accept these props.
	 * ```tsx
	 * const Component = () => <frame />;
	 * <Component key="one" />
	 * ```
	 *
	 * WARNING: The implementation of a component will never have access to these attributes.
	 * The following example would be incorrect usage because {@link Component} would never have access to `key`:
	 * ```tsx
	 * const Component = (props: React.Attributes) => props.key;
	 * ```
	 */
	interface Attributes {
		key?: Key | undefined;
		children?: ReactNode;
	}
	/**
	 * The props any component accepting refs can receive.
	 * Class components, built-in components (e.g. `frame`) and forwardRef components can receive refs and automatically accept these props.
	 * ```tsx
	 * const Component = forwardRef(() => <frame />);
	 * <Component ref={(current) => print(current)} />
	 * ```
	 *
	 * You only need this type if you manually author the types of props that need to be compatible with legacy refs.
	 * ```tsx
	 * interface Props extends React.RefAttributes<Frame> {}
	 * declare const Component: React.FunctionComponent<Props>;
	 * ```
	 *
	 * Otherwise it's simpler to directly use {@link Ref} since you can safely use the
	 * props type to describe to props that a consumer can pass to the component
	 * as well as describing the props the implementation of a component "sees".
	 * {@link RefAttributes} is generally not safe to describe both consumer and seen props.
	 *
	 * ```tsx
	 * interface Props extends {
	 *   ref?: React.Ref<Frame> | undefined;
	 * }
	 * declare const Component: React.FunctionComponent<Props>;
	 * ```
	 *
	 * WARNING: The implementation of a component will not have access to the same type in versions of React supporting string refs.
	 * The following example would be incorrect usage because {@link Component} would never have access to a `ref` with type `string`
	 * ```tsx
	 * const Component = (props: React.RefAttributes) => props.ref;
	 * ```
	 */
	interface RefAttributes<T> extends Attributes {
		/**
		 * Allows getting a ref to the component instance.
		 * Once the component unmounts, React will set `ref.current` to `undefined`
		 * (or call the ref with `undefined` if you passed a callback ref).
		 *
		 * @see {@link https://react.dev/learn/referencing-values-with-refs#refs-and-the-dom React Docs}
		 */
		ref?: Ref<T> | undefined;
	}

	/**
	 * Represents the built-in attributes available to class components.
	 */
	interface ClassAttributes<T> extends Attributes {
		/**
		 * Allows getting a ref to the component instance.
		 * Once the component unmounts, React will set `ref.current` to `undefined`
		 * (or call the ref with `undefined` if you passed a callback ref).
		 *
		 * @see {@link https://react.dev/learn/referencing-values-with-refs#refs-and-the-dom React Docs}
		 */
		ref?: LegacyRef<T> | undefined;
	}

	export type Element<
		P = any,
		T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
	> = ReactElement<P, T>;

	/**
	 * Represents a JSX element.
	 *
	 * Where {@link ReactNode} represents everything that can be rendered, `ReactElement`
	 * only represents JSX.
	 *
	 * @template P The type of the props object
	 * @template T The type of the component or tag
	 *
	 * @example
	 *
	 * ```tsx
	 * const element: ReactElement = <frame />;
	 * ```
	 */
	interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
		type: T;
		props: P;
		key: string | undefined;
	}

	interface ReactComponentElement<
		T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
		P = Pick<ComponentProps<T>, Exclude<keyof ComponentProps<T>, "key" | "ref">>,
	> extends ReactElement<P, Exclude<T, number>> {}

	interface FunctionComponentElement<P> extends ReactElement<P, FunctionComponent<P>> {
		ref?: ("ref" extends keyof P ? (P extends { ref?: infer R | undefined } ? R : never) : never) | undefined;
	}

	type CElement<P, T extends Component<P, ComponentState>> = ComponentElement<P, T>;
	interface ComponentElement<P, T extends Component<P, ComponentState>> extends ReactElement<P, ComponentClass<P>> {
		ref?: LegacyRef<T> | undefined;
	}

	type ClassicElement<P> = CElement<P, ClassicComponent<P, ComponentState>>;

	interface ReactPortal extends ReactElement {
		children: ReactNode;
	}

	//
	// React Nodes
	// ----------------------------------------------------------------------

	type ReactChild = ReactElement;

	type ReactFragment =
		| Map<Key, ReactNode>
		| ReadonlyMap<Key, ReactNode>
		| { readonly [key: Key]: ReactNode }
		| readonly ReactNode[];
	type ReactNode = ReactElement | ReactFragment | ReactPortal | boolean | undefined;

	//
	// Top Level API
	// ----------------------------------------------------------------------

	// Custom components

	function createElement<P extends {}>(
		type: FunctionComponent<P>,
		props?: (Attributes & P) | undefined,
		...children: ReactNode[]
	): FunctionComponentElement<P>;
	function createElement<P extends {}>(
		type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
		props?: (ClassAttributes<ClassicComponent<P, ComponentState>> & P) | undefined,
		...children: ReactNode[]
	): CElement<P, ClassicComponent<P, ComponentState>>;
	function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
		type: ClassType<P, T, C>,
		props?: (ClassAttributes<T> & P) | undefined,
		...children: ReactNode[]
	): CElement<P, T>;
	function createElement<P extends {}>(
		type: FunctionComponent<P> | ComponentClass<P> | string,
		props?: (Attributes & P) | undefined,
		...children: ReactNode[]
	): ReactElement<P>;

	// Custom components
	function cloneElement<P>(
		element: FunctionComponentElement<P>,
		props?: Partial<P> & Attributes,
		...children: ReactNode[]
	): FunctionComponentElement<P>;
	function cloneElement<P, T extends Component<P, ComponentState>>(
		element: CElement<P, T>,
		props?: Partial<P> & ClassAttributes<T>,
		...children: ReactNode[]
	): CElement<P, T>;
	function cloneElement<P>(
		element: ReactElement<P>,
		props?: Partial<P> & Attributes,
		...children: ReactNode[]
	): ReactElement<P>;

	/**
	 * Describes the props accepted by a Context {@link Provider}.
	 *
	 * @template T The type of the value the context provides.
	 */
	interface ProviderProps<T> {
		value: T;
		children?: ReactNode | undefined;
	}

	/**
	 * Describes the props accepted by a Context {@link Consumer}.
	 *
	 * @template T The type of the value the context provides.
	 */
	interface ConsumerProps<T> {
		children: (value: T) => ReactNode;
	}

	/**
	 * An object masquerading as a component. These are created by functions
	 * like {@link forwardRef}, {@link memo}, and {@link createContext}.
	 *
	 * In order to make TypeScript work, we pretend that they are normal
	 * components.
	 *
	 * But they are, in fact, not callable - instead, they are objects which
	 * are treated specially by the renderer.
	 *
	 * @template P The props the component accepts.
	 */
	interface ExoticComponent<P = {}> {
		(props: P): ReactNode;
		readonly $$typeof: symbol;
	}

	/**
	 * An {@link ExoticComponent} with a `displayName` property applied to it.
	 *
	 * @template P The props the component accepts.
	 */
	interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
		/**
		 * Used in debugging messages. You might want to set it
		 * explicitly if you want to display a different name for
		 * debugging purposes.
		 *
		 * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
		 */
		displayName?: string | undefined;
	}

	/**
	 * An {@link ExoticComponent} with a `propTypes` property applied to it.
	 *
	 * @template P The props the component accepts.
	 */
	interface ProviderExoticComponent<P> extends ExoticComponent<P> {
		propTypes?: WeakValidationMap<P> | undefined;
	}

	/**
	 * Used to retrieve the type of a context object from a {@link Context}.
	 *
	 * @template C The context object.
	 *
	 * @example
	 *
	 * ```tsx
	 * import { createContext } from "@rbxts/react";
	 *
	 * const MyContext = createContext({ foo: "bar" });
	 *
	 * type ContextType = ContextType<typeof MyContext>;
	 * // ContextType = { foo: string }
	 * ```
	 */
	type ContextType<C extends Context<any>> = C extends Context<infer T> ? T : never;

	/**
	 * Wraps your components to specify the value of this context for all components inside.
	 *
	 * @see {@link https://react.dev/reference/react/createContext#provider React Docs}
	 *
	 * @example
	 *
	 * ```tsx
	 * import React, { createContext } from "@rbxts/react";
	 *
	 * const ThemeContext = createContext("light");
	 *
	 * function App() {
	 *   return (
	 *     <ThemeContext.Provider value="dark">
	 *       <ThemeFrame />
	 *     </ThemeContext.Provider>
	 *   );
	 * }
	 * ```
	 */
	type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;

	/**
	 * The old way to read context, before {@link useContext} existed.
	 *
	 * @see {@link https://react.dev/reference/react/createContext#consumer React Docs}
	 *
	 * @example
	 *
	 * ```tsx
	 * import React, { createContext } from "@rbxts/react";
	 *
	 * const ThemeContext = createContext("light");
	 *
	 * function ThemeFrame() {
	 *   const theme = useContext(ThemeContext);
	 *   return <frame BackgroundColor3={theme === "light" ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(18, 18, 18)} />;
	 * }
	 * ```
	 */
	type Consumer<T> = ExoticComponent<ConsumerProps<T>>;

	/**
	 * Context lets components pass information deep down without explicitly
	 * passing props.
	 *
	 * Created from {@link createContext}
	 *
	 * @see {@link https://react.dev/learn/passing-data-deeply-with-context React Docs}
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/ React TypeScript Cheatsheet}
	 *
	 * @example
	 *
	 * ```tsx
	 * import { createContext } from "@rbxts/react";
	 *
	 * const ThemeContext = createContext("light");
	 * ```
	 */
	interface Context<T> {
		Provider: Provider<T>;
		Consumer: Consumer<T>;
		/**
		 * Used in debugging messages. You might want to set it
		 * explicitly if you want to display a different name for
		 * debugging purposes.
		 *
		 * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
		 */
		displayName?: string | undefined;
	}

	/**
	 * Lets you create a {@link Context} that components can provide or read.
	 *
	 * @param defaultValue The value you want the context to have when there is no matching
	 * {@link Provider} in the tree above the component reading the context. This is meant
	 * as a "last resort" fallback.
	 *
	 * @see {@link https://react.dev/reference/react/createContext#reference React Docs}
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/ React TypeScript Cheatsheet}
	 *
	 * @example
	 *
	 * ```tsx
	 * import { createContext } from "@rbxts/react";
	 *
	 * const ThemeContext = createContext("light");
	 * ```
	 */
	function createContext<T>(
		// If you thought this should be optional, see
		// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
		defaultValue: T,
	): Context<T>;

	function isValidElement<P>(object: {} | undefined): object is ReactElement<P>;

	const Children: ReactChildren;
	/**
	 * Lets you group elements without a wrapper node.
	 *
	 * @see {@link https://react.dev/reference/react/Fragment React Docs}
	 *
	 * @example
	 *
	 * ```tsx
	 * import React, { Fragment } from "@rbxts/react";
	 *
	 * <Fragment>
	 *   <uilistlayout key="UIListLayout" FillDirection="Horizontal" SortOrder="LayoutOrder" />
	 *   <textlabel key="Text1" Text="Hello" LayoutOrder={1} />
	 *   <textlabel key="Text2" Text="World" LayoutOrder={2} />
	 * </Fragment>
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * // Using the <></> shorthand syntax:
	 *
	 * <>
	 *   <uilistlayout key="UIListLayout" FillDirection="Horizontal" SortOrder="LayoutOrder" />
	 *   <textlabel key="Text1" Text="Hello" LayoutOrder={1} />
	 *   <textlabel key="Text2" Text="World" LayoutOrder={2} />
	 * </>
	 * ```
	 */
	const Fragment: ExoticComponent<{ children?: ReactNode | undefined }>;

	/**
	 * Lets you find common bugs in your components early during development.
	 *
	 * @see {@link https://react.dev/reference/react/StrictMode React Docs}
	 *
	 * @example
	 *
	 * ```tsx
	 * import React, { StrictMode } from "@rbxts/react";
	 *
	 * <StrictMode>
	 *   <App />
	 * </StrictMode>
	 * ```
	 */
	const StrictMode: ExoticComponent<{ children?: ReactNode | undefined }>;

	/**
	 * The props accepted by {@link Suspense}.
	 *
	 * @see {@link https://react.dev/reference/react/Suspense React Docs}
	 */
	interface SuspenseProps {
		children?: ReactNode | undefined;

		// TODO(react18): `fallback?: ReactNode;`
		/** A fallback react tree to show when a Suspense child (like React.lazy) suspends */
		fallback: NonNullable<ReactNode> | undefined;
	}

	// TODO(react18): Updated JSDoc to reflect that Suspense works on the server.
	/**
	 * This feature is not yet available for server-side rendering.
	 * Suspense support will be added in a later release.
	 */
	const Suspense: ExoticComponent<SuspenseProps>;

	/**
	 * The callback passed to {@link ProfilerProps.onRender}.
	 *
	 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
	 */
	type ProfilerOnRenderCallback = (
		/**
		 * The string id prop of the {@link Profiler} tree that has just committed. This lets
		 * you identify which part of the tree was committed if you are using multiple
		 * profilers.
		 *
		 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
		 */
		id: string,
		/**
		 * This lets you know whether the tree has just been mounted for the first time
		 * or re-rendered due to a change in props, state, or hooks.
		 *
		 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
		 */
		phase: "mount" | "update",
		/**
		 * The number of milliseconds spent rendering the {@link Profiler} and its descendants
		 * for the current update. This indicates how well the subtree makes use of
		 * memoization (e.g. {@link memo} and {@link useMemo}). Ideally this value should decrease
		 * significantly after the initial mount as many of the descendants will only need to
		 * re-render if their specific props change.
		 *
		 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
		 */
		actualDuration: number,
		/**
		 * The number of milliseconds estimating how much time it would take to re-render the entire
		 * {@link Profiler} subtree without any optimizations. It is calculated by summing up the most
		 * recent render durations of each component in the tree. This value estimates a worst-case
		 * cost of rendering (e.g. the initial mount or a tree with no memoization). Compare
		 * {@link actualDuration} against it to see if memoization is working.
		 *
		 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
		 */
		baseDuration: number,
		/**
		 * A numeric timestamp for when React began rendering the current update.
		 *
		 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
		 */
		startTime: number,
		/**
		 * A numeric timestamp for when React committed the current update. This value is shared
		 * between all profilers in a commit, enabling them to be grouped if desirable.
		 *
		 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
		 */
		commitTime: number,
		interactions?: Set<SchedulerInteraction>,
	) => void;
	interface ProfilerProps {
		children?: ReactNode | undefined;
		id: string;
		onRender: ProfilerOnRenderCallback;
	}

	/**
	 * Lets you measure rendering performance of a React tree programmatically.
	 *
	 * @see {@link https://react.dev/reference/react/Profiler#onrender-callback React Docs}
	 *
	 * @example
	 *
	 * ```tsx
	 * <Profiler id="App" onRender={onRender}>
	 *   <App />
	 * </Profiler>
	 * ```
	 */
	const Profiler: ExoticComponent<ProfilerProps>;

	//
	// Component API
	// ----------------------------------------------------------------------

	type ReactInstance = Component<any> | Element;

	/**
	 * Decorator function that allows extending React Lua Components.
	 */
	export function ReactComponent<T extends ComponentClass<any, any>>(ctor: T): T;

	/**
	 * Decorator function that allows extending React Lua PureComponents.
	 */
	export function ReactPureComponent<T extends ComponentClass<any, any>>(ctor: T): T;

	// Base component for plain JS classes
	interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
	class Component<P, S> {
		/**
		 * If set, `this.context` will be set at runtime to the current value of the given Context.
		 *
		 * @example
		 *
		 * ```ts
		 * type MyContext = number
		 * const Ctx = React.createContext<MyContext>(0)
		 *
		 * class Foo extends React.Component {
		 *   static contextType = Ctx
		 *   context!: React.ContextType<typeof Ctx>
		 *   render () {
		 *     return <>My context's value: {this.context}</>;
		 *   }
		 * }
		 * ```
		 *
		 * @see {@link https://react.dev/reference/react/Component#static-contexttype}
		 */
		static contextType?: Context<any> | undefined;

		/**
		 * If using the new style context, re-declare this in your class to be the
		 * `React.ContextType` of your `static contextType`.
		 * Should be used with type annotation or static contextType.
		 *
		 * @example
		 * ```ts
		 * static contextType = MyContext
		 * // For TS pre-3.7:
		 * context!: React.ContextType<typeof MyContext>
		 * // For TS 3.7 and above:
		 * declare context: React.ContextType<typeof MyContext>
		 * ```
		 *
		 * @see {@link https://react.dev/reference/react/Component#context React Docs}
		 */
		// TODO (TypeScript 3.0): unknown
		context: any;

		constructor(props: Readonly<P> | P);
		/**
		 * @deprecated
		 * @see {@link https://legacy.reactjs.org/docs/legacy-context.html React Docs}
		 */
		constructor(props: P, context: any);

		// We MUST keep setState() as a unified signature because it allows proper checking of the method return type.
		// Setting a field in the state to `React.None` will clear it from the state. This is the only way to remove a field
		// from a component's state!
		// See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18365#issuecomment-351013257
		// Also, the ` | S` allows intellisense to not be dumbisense
		setState<K extends keyof S>(
			state:
				| ((prevState: Readonly<S>, props: Readonly<P>) => Pick<MapToNone<S>, K> | MapToNone<S> | undefined)
				| (Pick<MapToNone<S>, K> | MapToNone<S> | undefined),
			callback?: () => void,
		): void;

		forceUpdate(callback?: () => void): void;
		render(): ReactNode;

		// React.Props<T> is now deprecated, which means that the `children`
		// property is not available on `P` by default, even though you can
		// always pass children as variadic arguments to `createElement`.
		// In the future, if we can define its call signature conditionally
		// on the existence of `children` in `P`, then we should remove this.
		readonly props: Readonly<P> & Readonly<{ children?: ReactNode | undefined }>;
		state: Readonly<S>;
		/**
		 * @deprecated
		 *
		 * @see {@link https://legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs Legacy React Docs}
		 */
		refs: {
			[key: string]: ReactInstance;
		};
	}

	class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}

	interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {
		replaceState(nextState: S, callback?: () => void): void;
		isMounted(): boolean;
		getInitialState?(): S;
	}

	interface ChildContextProvider<CC> {
		getChildContext(): CC;
	}

	//
	// Class Interfaces
	// ----------------------------------------------------------------------

	/**
	 * Represents the type of a function component. Can optionally
	 * receive a type argument that represents the props the component
	 * receives.
	 *
	 * @template P The props the component accepts.
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components React TypeScript Cheatsheet}
	 * @alias for {@link FunctionComponent}
	 *
	 * @example
	 *
	 * ```tsx
	 * // With props:
	 * type Props = { name: string }
	 *
	 * const MyComponent: FC<Props> = (props) => {
	 *  return <textlabel Text={props.name} />
	 * }
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * // Without props:
	 * const MyComponentWithoutProps: FC = () => {
	 *   return <frame>MyComponentWithoutProps</frame>
	 * }
	 * ```
	 */
	type FC<P = {}> = FunctionComponent<P>;

	/**
	 * Represents the type of a function component. Can optionally
	 * receive a type argument that represents the props the component
	 * accepts.
	 *
	 * @template P The props the component accepts.
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components React TypeScript Cheatsheet}
	 *
	 * @example
	 *
	 * ```tsx
	 * // With props:
	 * type Props = { name: string }
	 *
	 * const MyComponent: FunctionComponent<Props> = (props) => {
	 *  return <textlabel Text={props.name} />
	 * }
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * // Without props:
	 * const MyComponentWithoutProps: FunctionComponent = () => {
	 *   return <frame>MyComponentWithoutProps</frame>
	 * }
	 * ```
	 */
	interface FunctionComponent<P = {}> {
		(props: P, context?: any): ReactNode;
		/**
		 * Used to declare the types of the props accepted by the
		 * component. These types will be checked during rendering
		 * and in development only.
		 *
		 * We recommend using TypeScript instead of checking prop
		 * types at runtime.
		 *
		 * @see {@link https://react.dev/reference/react/Component#static-proptypes React Docs}
		 */
		propTypes?: WeakValidationMap<P> | undefined;
		/**
		 * Lets you specify which legacy context is consumed by
		 * this component.
		 *
		 * @see {@link https://legacy.reactjs.org/docs/legacy-context.html Legacy React Docs}
		 */
		contextTypes?: ValidationMap<any> | undefined;
		/**
		 * Used to define default values for the props accepted by
		 * the component.
		 *
		 * @see {@link https://react.dev/reference/react/Component#static-defaultprops React Docs}
		 *
		 * @example
		 *
		 * ```tsx
		 * type Props = { name?: string }
		 *
		 * const MyComponent: FC<Props> = (props) => {
		 *   return <textlabel Text={props.name} />
		 * }
		 *
		 * MyComponent.defaultProps = {
		 *   name: "John Doe"
		 * }
		 * ```
		 *
		 * @deprecated Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value|default values for destructuring assignments instead}.
		 */
		defaultProps?: Partial<P> | undefined;
		/**
		 * Used in debugging messages. You might want to set it
		 * explicitly if you want to display a different name for
		 * debugging purposes.
		 *
		 * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
		 *
		 * @example
		 *
		 * ```tsx
		 *
		 * const MyComponent: FC = () => {
		 *   return <textlabel Text="Hello!" />
		 * }
		 *
		 * MyComponent.displayName = "MyAwesomeComponent"
		 * ```
		 */
		displayName?: string | undefined;
	}

	type VFC<P = {}> = VoidFunctionComponent<P>;

	interface VoidFunctionComponent<P = {}> {
		(props: P, context?: any): ReactNode;
		propTypes?: WeakValidationMap<P> | undefined;
		contextTypes?: ValidationMap<any> | undefined;
		defaultProps?: Partial<P> | undefined;
		displayName?: string | undefined;
	}

	/**
	 * The type of the ref received by a {@link ForwardRefRenderFunction}.
	 *
	 * @see {@link ForwardRefRenderFunction}
	 */
	type ForwardedRef<T> = ((instance: T | undefined) => void) | MutableRefObject<T | undefined> | undefined;

	/**
	 * The type of the function passed to {@link forwardRef}. This is considered different
	 * to a normal {@link FunctionComponent} because it receives an additional argument,
	 *
	 * @param props Props passed to the component, if any.
	 * @param ref A ref forwarded to the component of type {@link ForwardedRef}.
	 *
	 * @template T The type of the forwarded ref.
	 * @template P The type of the props the component accepts.
	 *
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/ React TypeScript Cheatsheet}
	 * @see {@link forwardRef}
	 */
	interface ForwardRefRenderFunction<T, P = {}> {
		(props: PropsWithChildren<P>, ref: ForwardedRef<T>): ReactElement;
		/**
		 * Used in debugging messages. You might want to set it
		 * explicitly if you want to display a different name for
		 * debugging purposes.
		 *
		 * Will show `ForwardRef(${Component.displayName || Component.name})`
		 * in devtools by default, but can be given its own specific name.
		 *
		 * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
		 */
		displayName?: string | undefined;
		/**
		 * defaultProps are not supported on render functions passed to forwardRef.
		 *
		 * @see {@link https://github.com/microsoft/TypeScript/issues/36826 linked GitHub issue} for context
		 * @see {@link https://react.dev/reference/react/Component#static-defaultprops React Docs}
		 */
		defaultProps?: never | undefined;
		/**
		 * propTypes are not supported on render functions passed to forwardRef.
		 *
		 * @see {@link https://github.com/microsoft/TypeScript/issues/36826 linked GitHub issue} for context
		 * @see {@link https://react.dev/reference/react/Component#static-proptypes React Docs}
		 */
		propTypes?: never | undefined;
	}

	/**
	 * Represents a component class in React.
	 *
	 * @template P The props the component accepts.
	 * @template S The internal state of the component.
	 */
	interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
		new (props: P, context?: any): Component<P, S>;
		/**
		 * Used to declare the types of the props accepted by the
		 * component. These types will be checked during rendering
		 * and in development only.
		 *
		 * We recommend using TypeScript instead of checking prop
		 * types at runtime.
		 *
		 * @see {@link https://react.dev/reference/react/Component#static-proptypes React Docs}
		 */
		propTypes?: WeakValidationMap<P> | undefined;
		contextType?: Context<any> | undefined;
		/**
		 * Lets you specify which legacy context is consumed by
		 * this component.
		 *
		 * @see {@link https://legacy.reactjs.org/docs/legacy-context.html Legacy React Docs}
		 */
		contextTypes?: ValidationMap<any> | undefined;
		childContextTypes?: ValidationMap<any> | undefined;
		/**
		 * Used to define default values for the props accepted by
		 * the component.
		 *
		 * @see {@link https://react.dev/reference/react/Component#static-defaultprops React Docs}
		 */
		defaultProps?: Partial<P> | undefined;
		/**
		 * Used in debugging messages. You might want to set it
		 * explicitly if you want to display a different name for
		 * debugging purposes.
		 *
		 * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
		 */
		displayName?: string | undefined;
	}

	interface ClassicComponentClass<P = {}> extends ComponentClass<P> {
		new (props: P, context?: any): ClassicComponent<P, ComponentState>;
		getDefaultProps?(): P;
	}

	/**
	 * Used in {@link createElement} to represent
	 * a class.
	 *
	 * An intersection type is used to infer multiple type parameters from
	 * a single argument, which is useful for many top-level API defs.
	 * See {@link https://github.com/Microsoft/TypeScript/issues/7234 this GitHub issue}
	 * for more info.
	 */
	type ClassType<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>> = C &
		(new (props: P, context?: any) => T);

	//
	// Component Specs and Lifecycle
	// ----------------------------------------------------------------------

	// This should actually be something like `Lifecycle<P, S> | DeprecatedLifecycle<P, S>`,
	// as React will _not_ call the deprecated lifecycle methods if any of the new lifecycle
	// methods are present.
	interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
		/**
		 * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
		 */
		componentDidMount?(): void;
		/**
		 * Called to determine whether the change in props and state should trigger a re-render.
		 *
		 * `Component` always returns true.
		 * `PureComponent` implements a shallow comparison on props and state and returns true if any
		 * props or states have changed.
		 *
		 * If false is returned, {@link Component.render}, `componentWillUpdate`
		 * and `componentDidUpdate` will not be called.
		 */
		shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
		/**
		 * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
		 * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
		 */
		componentWillUnmount?(): void;
		/**
		 * Catches exceptions generated in descendant components. Unhandled exceptions will cause
		 * the entire component tree to unmount.
		 */
		componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
	}

	// Unfortunately, we have no way of declaring that the component constructor must implement this
	interface StaticLifecycle<P, S> {
		getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | undefined;
		getDerivedStateFromError?: GetDerivedStateFromError<P, S> | undefined;
	}

	type GetDerivedStateFromProps<P, S> =
		/**
		 * Returns an update to a component's state based on its new props and old state.
		 *
		 * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
		 */
		(nextProps: Readonly<P>, prevState: S) => Partial<S> | undefined;

	type GetDerivedStateFromError<P, S> =
		/**
		 * This lifecycle is invoked after an error has been thrown by a descendant component.
		 * It receives the error that was thrown as a parameter and should return a value to update state.
		 *
		 * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
		 */
		(error: Error) => Partial<S> | undefined;

	// This should be "infer SS" but can't use it yet
	interface NewLifecycle<P, S, SS> {
		/**
		 * Runs before React applies the result of {@link Component.render render} to the document, and
		 * returns an object to be given to {@link componentDidUpdate}. Useful for saving
		 * things such as scroll position before {@link Component.render render} causes changes to it.
		 *
		 * Note: the presence of this method prevents any of the deprecated
		 * lifecycle events from running.
		 */
		getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | undefined;
		/**
		 * Called immediately after updating occurs. Not called for the initial render.
		 *
		 * The snapshot is only present if {@link getSnapshotBeforeUpdate} is present and returns non-null.
		 */
		componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
	}

	interface DeprecatedLifecycle<P, S> {
		/**
		 * Called immediately before mounting occurs, and before {@link Component.render}.
		 * Avoid introducing any side-effects or subscriptions in this method.
		 *
		 * Note: the presence of {@link NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate}
		 * or {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} prevents
		 * this from being invoked.
		 *
		 * @deprecated 16.3, use {@link ComponentLifecycle.componentDidMount componentDidMount} or the constructor instead; will stop working in React 17
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state}
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path}
		 */
		componentWillMount?(): void;
		/**
		 * Called immediately before mounting occurs, and before {@link Component.render}.
		 * Avoid introducing any side-effects or subscriptions in this method.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of {@link NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate}
		 * or {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} prevents
		 * this from being invoked.
		 *
		 * @deprecated 16.3, use {@link ComponentLifecycle.componentDidMount componentDidMount} or the constructor instead
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state}
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path}
		 */
		UNSAFE_componentWillMount?(): void;
		/**
		 * Called when the component may be receiving new props.
		 * React may call this even if props have not changed, so be sure to compare new and existing
		 * props if you only want to handle changes.
		 *
		 * Calling {@link Component.setState} generally does not trigger this method.
		 *
		 * Note: the presence of {@link NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate}
		 * or {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} prevents
		 * this from being invoked.
		 *
		 * @deprecated 16.3, use static {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} instead; will stop working in React 17
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props}
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path}
		 */
		componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
		/**
		 * Called when the component may be receiving new props.
		 * React may call this even if props have not changed, so be sure to compare new and existing
		 * props if you only want to handle changes.
		 *
		 * Calling {@link Component.setState} generally does not trigger this method.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of {@link NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate}
		 * or {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} prevents
		 * this from being invoked.
		 *
		 * @deprecated 16.3, use static {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} instead
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props}
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path}
		 */
		UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
		/**
		 * Called immediately before rendering when new props or state is received. Not called for the initial render.
		 *
		 * Note: You cannot call {@link Component.setState} here.
		 *
		 * Note: the presence of {@link NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate}
		 * or {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} prevents
		 * this from being invoked.
		 *
		 * @deprecated 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update}
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path}
		 */
		componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
		/**
		 * Called immediately before rendering when new props or state is received. Not called for the initial render.
		 *
		 * Note: You cannot call {@link Component.setState} here.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of {@link NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate}
		 * or {@link StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps} prevents
		 * this from being invoked.
		 *
		 * @deprecated 16.3, use getSnapshotBeforeUpdate instead
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update}
		 * @see {@link https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path}
		 */
		UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
	}

	interface Mixin<P, S> extends ComponentLifecycle<P, S> {
		mixins?: Array<Mixin<P, S>> | undefined;
		statics?:
			| {
					[key: string]: any;
			  }
			| undefined;

		displayName?: string | undefined;
		propTypes?: ValidationMap<any> | undefined;
		contextTypes?: ValidationMap<any> | undefined;
		childContextTypes?: ValidationMap<any> | undefined;

		getDefaultProps?(): P;
		getInitialState?(): S;
	}

	interface ComponentSpec<P, S> extends Mixin<P, S> {
		render(): ReactNode;

		[propertyName: string]: any;
	}

	function createRef<T>(): RefObject<T>;

	/**
	 * The type of the component returned from {@link forwardRef}.
	 *
	 * @template P The props the component accepts, if any.
	 *
	 * @see {@link ExoticComponent}
	 */
	interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
		/**
		 * @deprecated Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value|default values for destructuring assignments instead}.
		 */
		defaultProps?: Partial<P> | undefined;
		propTypes?: WeakValidationMap<P> | undefined;
	}

	/**
	 * Lets your component expose a DOM node to a parent component
	 * using a ref.
	 *
	 * @see {@link https://react.dev/reference/react/forwardRef React Docs}
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/ React TypeScript Cheatsheet}
	 *
	 * @param render See the {@link ForwardRefRenderFunction}.
	 *
	 * @template T The type of the DOM node.
	 * @template P The props the component accepts, if any.
	 *
	 * @example
	 *
	 * ```tsx
	 * export const FancyButton = forwardRef<TextButton>((props, ref) => (
	 *   <textbutton ref={ref}>
	 *     {props.children}
	 *   </textbutton>
	 * ));
	 * ```
	 */
	function forwardRef<T, P = {}>(
		render: ForwardRefRenderFunction<T, P>,
	): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

	/**
	 * Omits the "ref" attribute from the given props object.
	 *
	 * @template P The props object type.
	 */
	type PropsWithoutRef<P> =
		// Omit would not be sufficient for this. We'd like to avoid unnecessary mapping and need a distributive conditional to support unions.
		// see: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
		// https://github.com/Microsoft/TypeScript/issues/28339
		P extends any ? ("ref" extends keyof P ? Omit<P, "ref"> : P) : P;
	/** Ensures that the props do not include string ref, which cannot be forwarded */
	type PropsWithRef<P> =
		// Just "P extends { ref?: infer R }" looks sufficient, but R will infer as {} if P is {}.
		"ref" extends keyof P
			? P extends { ref?: infer R | undefined }
				? string extends R
					? PropsWithoutRef<P> & { ref?: Exclude<R, string> | undefined }
					: P
				: P
			: P;

	type PropsWithChildren<P = {}> = P & { children?: ReactNode | undefined };

	/**
	 * Used to retrieve the props a component accepts. Can either be passed a string,
	 * indicating a Roblox element (e.g. "frame", "screengui", etc.) or the type of a React
	 * component.
	 *
	 * It's usually better to use {@link ComponentPropsWithRef} or {@link ComponentPropsWithoutRef}
	 * instead of this type, as they let you be explicit about whether or not to include
	 * the `ref` prop.
	 *
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/ React TypeScript Cheatsheet}
	 *
	 * @example
	 *
	 * ```tsx
	 * // Retrieves the props an "frame" element accepts
	 * type FrameProps = React.ComponentProps<"frame">;
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * const MyComponent = (props: { foo: number, bar: string }) => <frame />;
	 *
	 * // Retrieves the props "MyComponent" accepts
	 * type MyComponentProps = React.ComponentProps<typeof MyComponent>;
	 * ```
	 */
	type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
		T extends JSXElementConstructor<infer P>
			? P
			: T extends keyof JSX.IntrinsicElements
				? JSX.IntrinsicElements[T]
				: {};
	/**
	 * Used to retrieve the props a component accepts with its ref. Can either be
	 * passed a string, indicating a Roblox element (e.g. "frame", "screengui", etc.) or the
	 * type of a React component.
	 *
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/ React TypeScript Cheatsheet}
	 *
	 * @example
	 *
	 * ```tsx
	 * // Retrieves the props an "frame" element accepts
	 * type FrameProps = React.ComponentPropsWithRef<"frame">;
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * const MyComponent = (props: { foo: number, bar: string }) => <frame />;
	 *
	 * // Retrieves the props "MyComponent" accepts
	 * type MyComponentPropsWithRef = React.ComponentPropsWithRef<typeof MyComponent>;
	 * ```
	 */
	type ComponentPropsWithRef<T extends ElementType> = T extends new (props: infer P) => Component<any, any>
		? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
		: PropsWithRef<ComponentProps<T>>;
	/**
	 * Used to retrieve the props a custom component accepts with its ref.
	 *
	 * Unlike {@link ComponentPropsWithRef}, this only works with custom
	 * components, i.e. components you define yourself. This is to improve
	 * type-checking performance.
	 *
	 * @example
	 *
	 * ```tsx
	 * const MyComponent = (props: { foo: number, bar: string }) => <frame />;
	 *
	 * // Retrieves the props "MyComponent" accepts
	 * type MyComponentPropsWithRef = React.CustomComponentPropsWithRef<typeof MyComponent>;
	 * ```
	 */
	type CustomComponentPropsWithRef<T extends ComponentType> = T extends new (props: infer P) => Component<any, any>
		? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
		: T extends (props: infer P, context?: any) => ReactNode
			? PropsWithRef<P>
			: never;

	/**
	 * Used to retrieve the props a component accepts without its ref. Can either be
	 * passed a string, indicating a Roblox element (e.g. "frame", "screengui", etc.) or the
	 * type of a React component.
	 *
	 * @see {@link https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/ React TypeScript Cheatsheet}
	 *
	 * @example
	 *
	 * ```tsx
	 * // Retrieves the props an "Frame" element accepts
	 * type FrameProps = React.ComponentPropsWithoutRef<"Frame">;
	 * ```
	 *
	 * @example
	 *
	 * ```tsx
	 * const MyComponent = (props: { foo: number, bar: string }) => <frame />;
	 *
	 * // Retrieves the props "MyComponent" accepts
	 * type MyComponentPropsWithoutRef = React.ComponentPropsWithoutRef<typeof MyComponent>;
	 * ```
	 */
	type ComponentPropsWithoutRef<T extends ElementType> = PropsWithoutRef<ComponentProps<T>>;

	type ComponentRef<T extends ElementType> =
		T extends NamedExoticComponent<ComponentPropsWithoutRef<T> & RefAttributes<infer Method>>
			? Method
			: ComponentPropsWithRef<T> extends RefAttributes<infer Method>
				? Method
				: never;

	// will show `Memo(${Component.displayName || Component.name})` in devtools by default,
	// but can be given its own specific name
	type MemoExoticComponent<T extends ComponentType<any>> = NamedExoticComponent<CustomComponentPropsWithRef<T>> & {
		readonly type: T;
	};

	/**
	 * Lets you skip re-rendering a component when its props are unchanged.
	 *
	 * @see {@link https://react.dev/reference/react/memo React Docs}
	 *
	 * @param Component The component to memoize.
	 * @param propsAreEqual A function that will be used to determine if the props have changed.
	 *
	 * @example
	 *
	 * ```tsx
	 * import { memo } from "@rbxts/react";
	 *
	 * const SomeComponent = memo(function SomeComponent(props: { foo: string }) {
	 *   // ...
	 * });
	 * ```
	 */
	function memo<P extends object>(
		Component: FunctionComponent<P>,
		propsAreEqual?: (prevProps: Readonly<PropsWithChildren<P>>, nextProps: Readonly<PropsWithChildren<P>>) => boolean,
	): NamedExoticComponent<P>;
	function memo<T extends ComponentType<any>>(
		Component: T,
		propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean,
	): MemoExoticComponent<T>;

	interface LazyExoticComponent<T extends ComponentType<any>> extends ExoticComponent<CustomComponentPropsWithRef<T>> {
		readonly _result: T;
	}

	/**
	 * Lets you defer loading a component’s code until it is rendered for the first time.
	 *
	 * @see {@link https://react.dev/reference/react/lazy React Docs}
	 *
	 * @param load A function that returns a `Promise` or another thenable (a `Promise`-like object with a
	 * then method). React will not call `load` until the first time you attempt to render the returned
	 * component. After React first calls load, it will wait for it to resolve, and then render the
	 * resolved value’s `.default` as a React component. Both the returned `Promise` and the `Promise`’s
	 * resolved value will be cached, so React will not call load more than once. If the `Promise` rejects,
	 * React will throw the rejection reason for the nearest Error Boundary to handle.
	 *
	 * @example
	 *
	 * ```tsx
	 * import { lazy } from "@rbxts/react";
	 *
	 * const MyComponent = lazy(() => import("./MyComponent"));
	 * ```
	 */
	function lazy<T extends ComponentType<any>>(load: () => Promise<{ default: T }>): LazyExoticComponent<T>;

	//
	// React Hooks
	// ----------------------------------------------------------------------

	/**
	 * The instruction passed to a {@link Dispatch} function in {@link useState}
	 * to tell React what the next value of the {@link useState} should be.
	 *
	 * Often found wrapped in {@link Dispatch}.
	 *
	 * @template S The type of the state.
	 *
	 * @example
	 *
	 * ```tsx
	 * // This return type correctly represents the type of
	 * // `setCount` in the example below.
	 * const useCustomState = (): Dispatch<SetStateAction<number>> => {
	 *   const [count, setCount] = useState(0);
	 *
	 *   return setCount;
	 * }
	 * ```
	 */
	type SetStateAction<S> = S | ((prevState: S) => S);

	/**
	 * A function that can be used to update the state of a {@link useState}
	 * or {@link useReducer} hook.
	 */
	type Dispatch<A> = (value: A) => void;
	/**
	 * A {@link Dispatch} function can sometimes be called without any arguments.
	 */
	type DispatchWithoutAction = () => void;
	// Unlike redux, the actions _can_ be anything
	type Reducer<S, A> = (prevState: S, action: A) => S;
	// If useReducer accepts a reducer without action, dispatch may be called without any parameters.
	type ReducerWithoutAction<S> = (prevState: S) => S;
	// types used to try and prevent the compiler from reducing S
	// to a supertype common with the second argument to useReducer()
	type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
	type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
	// The identity check is done with the SameValue algorithm (Object.is), which is stricter than ===
	type ReducerStateWithoutAction<R extends ReducerWithoutAction<any>> =
		R extends ReducerWithoutAction<infer S> ? S : never;
	// TODO (TypeScript 3.0): ReadonlyArray<unknown>
	type DependencyList = readonly any[];

	// NOTE: callbacks are _only_ allowed to return either void, or a destructor.
	type EffectCallback = () => void | Destructor;

	interface MutableRefObject<T> {
		current: T;
	}

	// This will technically work if you give a Consumer<T> or Provider<T> but it's deprecated and warns
	/**
	 * Accepts a context object (the value returned from `React.createContext`) and returns the current
	 * context value, as given by the nearest context provider for the given context.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useContext}
	 */
	function useContext<T>(context: Context<T> /*, (not public API) observedBits?: number|boolean */): T;
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useState}
	 */
	function useState<S>(initialState: S | (() => S)): LuaTuple<[S, Dispatch<SetStateAction<S>>]>;
	// convenience overload when first argument is omitted
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useState}
	 */
	function useState<S = undefined>(): LuaTuple<[S | undefined, Dispatch<SetStateAction<S | undefined>>]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useReducer}
	 */
	// overload where dispatch could accept 0 arguments.
	function useReducer<R extends ReducerWithoutAction<any>, I>(
		reducer: R,
		initializerArg: I,
		initializer: (arg: I) => ReducerStateWithoutAction<R>,
	): LuaTuple<[ReducerStateWithoutAction<R>, DispatchWithoutAction]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useReducer}
	 */
	// overload where dispatch could accept 0 arguments.
	function useReducer<R extends ReducerWithoutAction<any>>(
		reducer: R,
		initializerArg: ReducerStateWithoutAction<R>,
		initializer?: undefined,
	): LuaTuple<[ReducerStateWithoutAction<R>, DispatchWithoutAction]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useReducer}
	 */
	// overload where "I" may be a subset of ReducerState<R>; used to provide autocompletion.
	// If "I" matches ReducerState<R> exactly then the last overload will allow initializer to be omitted.
	// the last overload effectively behaves as if the identity function (x => x) is the initializer.
	function useReducer<R extends Reducer<any, any>, I>(
		reducer: R,
		initializerArg: I & ReducerState<R>,
		initializer: (arg: I & ReducerState<R>) => ReducerState<R>,
	): LuaTuple<[ReducerState<R>, Dispatch<ReducerAction<R>>]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useReducer}
	 */
	// overload for free "I"; all goes as long as initializer converts it into "ReducerState<R>".
	function useReducer<R extends Reducer<any, any>, I>(
		reducer: R,
		initializerArg: I,
		initializer: (arg: I) => ReducerState<R>,
	): LuaTuple<[ReducerState<R>, Dispatch<ReducerAction<R>>]>;
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useReducer}
	 */

	// I'm not sure if I keep this 2-ary or if I make it (2,3)-ary; it's currently (2,3)-ary.
	// The Flow types do have an overload for 3-ary invocation with undefined initializer.

	// NOTE: without the ReducerState indirection, TypeScript would reduce S to be the most common
	// supertype between the reducer's return type and the initialState (or the initializer's return type),
	// which would prevent autocompletion from ever working.

	// TODO: double-check if this weird overload logic is necessary. It is possible it's either a bug
	// in older versions, or a regression in newer versions of the typescript completion service.
	function useReducer<R extends Reducer<any, any>>(
		reducer: R,
		initialState: ReducerState<R>,
		initializer?: undefined,
	): LuaTuple<[ReducerState<R>, Dispatch<ReducerAction<R>>]>;
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useRef}
	 */
	function useRef<T>(initialValue: T): MutableRefObject<T>;
	// convenience overload for refs given as a ref prop as they typically start with a null value
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
	 * of the generic argument.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useRef}
	 */
	function useRef<T>(initialValue: T | undefined): RefObject<T>;
	// convenience overload for potentially undefined initialValue / call with 0 arguments
	// has a default to stop it from defaulting to {} instead
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useRef}
	 */
	function useRef<T = undefined>(): MutableRefObject<T | undefined>;
	/**
	 * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
	 * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
	 * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
	 *
	 * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
	 *
	 * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
	 * `componentDidMount` and `componentDidUpdate`.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useLayoutEffect}
	 */
	function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
	/**
	 * Accepts a function that contains imperative, possibly effectful code.
	 *
	 * @param effect Imperative function that can return a cleanup function
	 * @param deps If present, effect will only activate if the values in the list change.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useEffect}
	 */
	function useEffect(effect: EffectCallback, deps?: DependencyList): void;
	// NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
	/**
	 * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
	 * `ref`. As always, imperative code using refs should be avoided in most cases.
	 *
	 * `useImperativeHandle` should be used with `React.forwardRef`.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useImperativeHandle}
	 */
	function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;
	// I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
	// useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
	/**
	 * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
	 * has changed.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useCallback}
	 */
	// TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
	function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
	/**
	 * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useMemo}
	 */
	// allow undefined, but don't make it optional as that is very likely a mistake
	function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
	/**
	 * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
	 *
	 * NOTE: We don’t recommend adding debug values to every custom hook.
	 * It’s most valuable for custom hooks that are part of shared libraries.
	 *
	 * @version 16.8.0
	 * @see {@link https://react.dev/reference/react/useDebugValue}
	 */
	// the name of the custom hook is itself derived from the function name at runtime:
	// it's just the function name without the "use" prefix.
	function useDebugValue<T>(value: T, format?: (value: T) => any): void;
	/**
	 * `useBinding` lets you create a binding object that can be used to store a
	 * value and update it without causing a re-render.
	 */
	function useBinding<T>(initialValue: T): LuaTuple<[Binding<T>, (newValue: T) => void]>;

	//
	// Bindings
	// ----------------------------------------------------------------------

	export interface Binding<T> {
		/**
		 * Returns the internal value of the binding. This is helpful when updating a binding relative to its current value.
		 */
		getValue(): T;

		/**
		 * Returns a new binding that maps the existing binding's value to something else. For example, `map` can be used to
		 * transform an animation progress value like `0.4` into a property that can be consumed by a Roblox Instance like
		 * `UDim2.new(0.4, 0, 1, 0)`.
		 */
		map<U>(predicate: (value: T) => U): Binding<U>;
	}

	/**
	 * The first value returned is a `Binding` object, which will typically be passed as a prop to a Roact host
	 * component. The second is a function that can be called with a new value to update the binding.
	 */
	export function createBinding<T>(initialValue: T): LuaTuple<[Binding<T>, (newValue: T) => void]>;

	/**
	 * Combines multiple bindings into a single binding. The new binding's value will have the same keys as the input
	 * table of bindings.
	 */
	export function joinBindings<T extends { [index: string]: Binding<U> }, U>(
		bindings: T,
	): Binding<{ [K in keyof T]: T[K] extends Binding<infer V> ? V : never }>;
	export function joinBindings<T>(bindings: ReadonlyArray<Binding<T>>): Binding<Array<T>>;
	export function joinBindings<T>(
		bindings: ReadonlyMap<string | number, Binding<T>>,
	): Binding<Map<string | number, Binding<T>>>;

	//
	// Roblox Symbols
	// ----------------------------------------------------------------------

	export const None: {
		/**
		 * **DO NOT USE!**
		 *
		 * This field exists to force TypeScript to recognize this as a nominal type
		 * @hidden
		 * @deprecated
		 */
		readonly _nominal_ReactNone: unique symbol;
	};

	//
	// Props / DOM Attributes
	// ----------------------------------------------------------------------

	type AllowRefs<T> = T extends Instance ? Ref<T> : never;
	type InferEnumNames<T> = T extends EnumItem ? T["Name"] : never;

	export type InstanceAttributes<T extends Instance> = {
		[P in Exclude<WritablePropertyNames<T>, "Parent" | "Name">]?:
			| T[P]
			| AllowRefs<T[P]>
			| InferEnumNames<T[P]>
			| Binding<T[P]>;
	};

	export type InstanceEvent<T extends Instance> = {
		[K in ExtractKeys<T, RBXScriptSignal>]?: T[K] extends RBXScriptSignal<infer F>
			? (rbx: T, ...args: Parameters<F>) => void
			: never;
	};

	export type InstanceChangeEvent<T extends Instance> = {
		[key in InstancePropertyNames<T>]?: (rbx: T) => void;
	};

	export type InstanceProps<T extends Instance> = RefAttributes<T> &
		InstanceAttributes<T> & {
			Event?: InstanceEvent<T>;
			Change?: InstanceChangeEvent<T>;
			Tag?: string;
		};

	//
	// React.PropTypes
	// ----------------------------------------------------------------------

	type Validator<T> = PropTypes.Validator<T>;

	type Requireable<T> = PropTypes.Requireable<T>;

	type ValidationMap<T> = PropTypes.ValidationMap<T>;

	type WeakValidationMap<T> = {
		[K in keyof T]?: undefined extends T[K]
			? Validator<T[K] | undefined>
			: undefined extends T[K]
				? Validator<T[K] | undefined>
				: Validator<T[K]>;
	};

	interface ReactPropTypes {
		any: typeof PropTypes.any;
		array: typeof PropTypes.array;
		bool: typeof PropTypes.bool;
		func: typeof PropTypes.func;
		number: typeof PropTypes.number;
		object: typeof PropTypes.object;
		string: typeof PropTypes.string;
		node: typeof PropTypes.node;
		element: typeof PropTypes.element;
		instanceOf: typeof PropTypes.instanceOf;
		oneOf: typeof PropTypes.oneOf;
		oneOfType: typeof PropTypes.oneOfType;
		arrayOf: typeof PropTypes.arrayOf;
		objectOf: typeof PropTypes.objectOf;
		shape: typeof PropTypes.shape;
		exact: typeof PropTypes.exact;
	}

	//
	// React.Children
	// ----------------------------------------------------------------------

	interface ReactChildren {
		map: <T, C>(
			children: C | readonly C[],
			fn: (child: C, index: number) => T,
		) => C extends undefined ? C : Array<Exclude<T, boolean | undefined>>;
		forEach: <C>(children: C | readonly C[], fn: (child: C, index: number) => void) => void;
		count: (children: any) => number;
		only: <C>(children: C) => C extends any[] ? never : C;
		toArray: (children: ReactNode | ReactNode[]) => Array<Exclude<ReactNode, boolean | undefined>>;
	}

	//
	// Error Interfaces
	// ----------------------------------------------------------------------
	interface Error {
		name: string;
		message: string;
		stack?: string | undefined;
	}

	interface ErrorInfo {
		/**
		 * Captures which component contained the exception, and its ancestors.
		 */
		componentStack: string;
	}

	//
	// Miscellaneous
	// ----------------------------------------------------------------------

	interface SchedulerInteraction {
		__count: number;
		id: number;
		name: string;
		timestamp: number;
	}

	namespace JSX {
		type ElementType = string | React.JSXElementConstructor<any>;
		interface Element extends React.ReactElement<any, any> {}
		interface ElementClass extends React.Component<any> {
			render(): React.ReactNode;
		}
		interface ElementAttributesProperty {
			props: {};
		}
		interface ElementChildrenAttribute {
			children: {};
		}

		// We can't recurse forever because `type` can't be self-referential;
		// let's assume it's reasonable to do a single React.lazy() around a single React.memo() / vice-versa
		type LibraryManagedAttributes<C, P> = C extends
			| React.MemoExoticComponent<infer T>
			| React.LazyExoticComponent<infer T>
			? T extends React.MemoExoticComponent<infer U> | React.LazyExoticComponent<infer U>
				? ReactManagedAttributes<U, P>
				: ReactManagedAttributes<T, P>
			: ReactManagedAttributes<C, P>;

		interface IntrinsicAttributes extends React.Attributes {}
		interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}

		type IntrinsicElements = {
			[K in Exclude<keyof CreatableInstances, ExcludedClassNames> as Lowercase<K>]: React.InstanceProps<
				CreatableInstances[K]
			>;
		};
	}
}

// naked 'any' type in a conditional type will short circuit and union both the then/else branches
// so boolean is only resolved for T = any
type IsExactlyAny<T> = boolean extends (T extends never ? true : false) ? true : false;

type ExactlyAnyPropertyKeys<T> = { [K in keyof T]: IsExactlyAny<T[K]> extends true ? K : never }[keyof T];
type NotExactlyAnyPropertyKeys<T> = Exclude<keyof T, ExactlyAnyPropertyKeys<T>>;

// Try to resolve ill-defined props like for JS users: props can be any, or sometimes objects with properties of type any
type MergePropTypes<P, T> =
	// Distribute over P in case it is a union type
	P extends any
		? // If props is type any, use propTypes definitions
			IsExactlyAny<P> extends true
			? T
			: // If declared props have indexed properties, ignore inferred props entirely as keyof gets widened
				string extends keyof P
				? P
				: // Prefer declared types which are not exactly any
					Pick<P, NotExactlyAnyPropertyKeys<P>> &
						// For props which are exactly any, use the type inferred from propTypes if present
						Pick<T, Exclude<keyof T, NotExactlyAnyPropertyKeys<P>>> &
						// Keep leftover props not specified in propTypes
						Pick<P, Exclude<keyof P, keyof T>>
		: never;

type InexactPartial<T> = { [K in keyof T]?: T[K] | undefined };

// Any prop that has a default prop becomes optional, but its type is unchanged
// Undeclared default props are augmented into the resulting allowable attributes
// If declared props have indexed properties, ignore default props entirely as keyof gets widened
// Wrap in an outer-level conditional type to allow distribution over props that are unions
type Defaultize<P, D> = P extends any
	? string extends keyof P
		? P
		: Pick<P, Exclude<keyof P, keyof D>> &
				InexactPartial<Pick<P, Extract<keyof P, keyof D>>> &
				InexactPartial<Pick<D, Exclude<keyof D, keyof P>>>
	: never;

type ReactManagedAttributes<C, P> = C extends { propTypes: infer T; defaultProps: infer D }
	? Defaultize<MergePropTypes<P, PropTypes.InferProps<T>>, D>
	: C extends { propTypes: infer T }
		? MergePropTypes<P, PropTypes.InferProps<T>>
		: C extends { defaultProps: infer D }
			? Defaultize<P, D>
			: P;

type ExcludedClassNames =
	| "Accessory"
	| "AccessoryDescription"
	| "Accoutrement"
	| "Actor"
	| "AirController"
	| "AnimationRigData"
	| "Annotation"
	| "Atmosphere"
	| "AtmosphereSensor"
	| "AudioSearchParams"
	| "Backpack"
	| "BindableEvent"
	| "BindableFunction"
	| "Breakpoint"
	| "BubbleChatMessageProperties"
	| "BuoyancySensor"
	| "ClimbController"
	| "Clouds"
	| "ControllerManager"
	| "ControllerPartSensor"
	| "DataStoreGetOptions"
	| "DataStoreIncrementOptions"
	| "DataStoreOptions"
	| "DataStoreSetOptions"
	| "Dialog"
	| "DialogChoice"
	| "ExperienceInviteOptions"
	| "ExplorerFilterInstance"
	| "Explosion"
	| "FluidForceSensor"
	| "GetTextBoundsParams"
	| "Glue"
	| "GroundController"
	| "Hat"
	| "HiddenSurfaceRemovalAsset"
	| "Hole"
	| "InternalSyncItem"
	| "IntersectOperation"
	| "Keyframe"
	| "KeyframeMarker"
	| "KeyframeSequence"
	| "LocalScript"
	| "ManualGlue"
	| "ManualWeld"
	| "MarkerCurve"
	| "ModuleScript"
	| "NegateOperation"
	| "OperationGraph"
	| "PartOperation"
	| "PathfindingLink"
	| "PathfindingModifier"
	| "Plane"
	| "PluginCapabilities"
	| "Pose"
	| "RemoteEvent"
	| "RemoteFunction"
	| "RTAnimationTracker"
	| "Script"
	| "SkateboardController"
	| "SkateboardPlatform"
	| "Snap"
	| "SpawnLocation"
	| "StarterGear"
	| "StudioAttachment"
	| "StudioCallout"
	| "SurfaceSelection"
	| "SwimController"
	| "Team"
	| "TeleportOptions"
	| "TerrainDetail"
	| "TerrainRegion"
	| "TextChannel"
	| "TextChatCommand"
	| "TextChatMessageProperties"
	| "TrackerStreamAnimation"
	| "UnionOperation"
	| "UnreliableRemoteEvent"
	| "VehicleController"
	| "VideoDeviceInput"
	| "VisualizationMode"
	| "VisualizationModeCategory"
	| "WorkspaceAnnotation";
