import * as PropTypes from "./prop-types";

declare const UNDEFINED_VOID_ONLY: unique symbol;
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

export = React;
export as namespace React;

declare namespace React {
	//
	// React Elements
	// ----------------------------------------------------------------------

	type ElementType<P = any> =
		| {
				[K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never;
		  }[keyof JSX.IntrinsicElements]
		| ComponentType<P>;
	type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

	type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any>) | (new (props: P) => Component<any, any>);

	interface RefObject<T> {
		readonly current: T | undefined;
	}

	type RefCallback<T> = (instance: T | undefined) => void;
	type Ref<T> = RefCallback<T> | RefObject<T> | undefined;
	type LegacyRef<T> = string | Ref<T>;
	/**
	 * Gets the instance type for a React element. The instance will be different for various component types:
	 *
	 * - React class components will be the class instance. So if you had `class Foo extends React.Component<{}> {}`
	 *   and used `React.ElementRef<typeof Foo>` then the type would be the instance of `Foo`.
	 * - React stateless functional components do not have a backing instance and so `React.ElementRef<typeof Bar>`
	 *   (when `Bar` is `function Bar() {}`) will give you the `undefined` type.
	 * - JSX intrinsics like `div` will give you their DOM instance. For `React.ElementRef<'div'>` that would be
	 *   `HTMLDivElement`. For `React.ElementRef<'input'>` that would be `HTMLInputElement`.
	 * - React stateless functional components that forward a `ref` will give you the `ElementRef` of the forwarded
	 *   to component.
	 *
	 * `C` must be the type _of_ a React component so you need to use typeof as in `React.ElementRef<typeof MyComponent>`.
	 *
	 * @todo In Flow, this works a little different with forwarded refs and the `AbstractComponent` that
	 *       `React.forwardRef()` returns.
	 */
	type ElementRef<
		C extends
			| ForwardRefExoticComponent<any>
			| { new (props: any): Component<any> }
			| ((props: any, context?: any) => ReactElement)
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

	type Key = string | number;

	/**
	 * @internal You shouldn't need to use this type since you never see these attributes
	 * inside your component or have to validate them.
	 */
	interface Attributes {
		key?: Key | undefined | undefined;
		children?: ReactNode;
	}
	interface RefAttributes<T> extends Attributes {
		ref?: Ref<T> | undefined;
	}
	interface ClassAttributes<T> extends Attributes {
		ref?: LegacyRef<T> | undefined;
	}

	export type Element<
		P = any,
		T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
	> = ReactElement<P, T>;

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
	// Factories
	// ----------------------------------------------------------------------

	type Factory<P> = (props?: Attributes & P, ...children: ReactNode[]) => ReactElement<P>;

	type FunctionComponentFactory<P> = (props?: Attributes & P, ...children: ReactNode[]) => FunctionComponentElement<P>;

	type ComponentFactory<P, T extends Component<P, ComponentState>> = (
		props?: ClassAttributes<T> & P,
		...children: ReactNode[]
	) => CElement<P, T>;

	type CFactory<P, T extends Component<P, ComponentState>> = ComponentFactory<P, T>;
	type ClassicFactory<P> = CFactory<P, ClassicComponent<P, ComponentState>>;

	//
	// React Nodes
	// ----------------------------------------------------------------------

	type ReactChild = ReactElement;

	type ReactFragment =
		| Map<Key, ReactNode>
		| ReadonlyMap<Key, ReactNode>
		| { readonly [key: Key]: ReactNode }
		| readonly ReactNode[];
	type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | undefined;

	//
	// Top Level API
	// ----------------------------------------------------------------------

	// Custom components
	function createFactory<P>(type: FunctionComponent<P>): FunctionComponentFactory<P>;
	function createFactory<P>(
		type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
	): CFactory<P, ClassicComponent<P, ComponentState>>;
	function createFactory<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
		type: ClassType<P, T, C>,
	): CFactory<P, T>;
	function createFactory<P>(type: ComponentClass<P>): Factory<P>;

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

	// Context via RenderProps
	interface ProviderProps<T> {
		value: T;
		children?: ReactNode | undefined;
	}

	interface ConsumerProps<T> {
		children: (value: T) => ReactNode;
	}

	// TODO: similar to how Fragment is actually a symbol, the values returned from createContext,
	// forwardRef and memo are actually objects that are treated specially by the renderer; see:
	// https://github.com/facebook/react/blob/v16.6.0/packages/react/src/ReactContext.js#L35-L48
	// https://github.com/facebook/react/blob/v16.6.0/packages/react/src/forwardRef.js#L42-L45
	// https://github.com/facebook/react/blob/v16.6.0/packages/react/src/memo.js#L27-L31
	// However, we have no way of telling the JSX parser that it's a JSX element type or its props other than
	// by pretending to be a normal component.
	//
	// We don't just use ComponentType or FunctionComponent types because you are not supposed to attach statics to this
	// object, but rather to the original function.
	interface ExoticComponent<P = {}> {
		/**
		 * **NOTE**: Exotic components are not callable.
		 */
		(props: P): ReactElement;
		readonly $$typeof: symbol;
	}

	interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
		displayName?: string | undefined;
	}

	interface ProviderExoticComponent<P> extends ExoticComponent<P> {
		propTypes?: WeakValidationMap<P> | undefined;
	}

	type ContextType<C extends Context<any>> = C extends Context<infer T> ? T : never;

	// NOTE: only the Context object itself can get a displayName
	// https://github.com/facebook/react-devtools/blob/e0b854e4c/backend/attachRendererFiber.js#L310-L325
	type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
	type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
	interface Context<T> {
		Provider: Provider<T>;
		Consumer: Consumer<T>;
		displayName?: string | undefined;
	}
	function createContext<T>(
		// If you thought this should be optional, see
		// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
		defaultValue: T,
	): Context<T>;

	function isValidElement<P>(object: {} | undefined | undefined): object is ReactElement<P>;

	const Children: ReactChildren;
	const Fragment: ExoticComponent<{ children?: ReactNode | undefined }>;
	const StrictMode: ExoticComponent<{ children?: ReactNode | undefined }>;

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
	const version: string;

	/**
	 * {@link https://react.dev/reference/react/Profiler#onrender-callback Profiler API}}
	 */
	type ProfilerOnRenderCallback = (
		id: string,
		phase: "mount" | "update",
		actualDuration: number,
		baseDuration: number,
		startTime: number,
		commitTime: number,
		interactions: Set<SchedulerInteraction>,
	) => void;
	interface ProfilerProps {
		children?: ReactNode | undefined;
		id: string;
		onRender: ProfilerOnRenderCallback;
	}

	const Profiler: ExoticComponent<ProfilerProps>;

	//
	// Component API
	// ----------------------------------------------------------------------

	type ReactInstance = Component<any> | Element;

	/**
	 * Decorator function that allows extending React Lua Components.
	 */
	export function ReactComponent<T extends ComponentClass<any, any>>(ctor: T): T;

	// Base component for plain JS classes
	interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
	class Component<P, S> {
		// tslint won't let me format the sample code in a way that vscode likes it :(
		/**
		 * If set, `this.context` will be set at runtime to the current value of the given Context.
		 *
		 * Usage:
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
		 * @see https://react.dev/reference/react/Component#static-contexttype
		 */
		static contextType?: Context<any> | undefined;

		/**
		 * If using the new style context, re-declare this in your class to be the
		 * `React.ContextType` of your `static contextType`.
		 * Should be used with type annotation or static contextType.
		 *
		 * ```ts
		 * static contextType = MyContext
		 * // For TS pre-3.7:
		 * context!: React.ContextType<typeof MyContext>
		 * // For TS 3.7 and above:
		 * declare context: React.ContextType<typeof MyContext>
		 * ```
		 *
		 * @see https://react.dev/reference/react/Component#context
		 */
		// TODO (TypeScript 3.0): unknown
		context: any;

		constructor(props: Readonly<P> | P);
		/**
		 * @deprecated
		 * @see https://legacy.reactjs.org/docs/legacy-context.html
		 */
		constructor(props: P, context: any);

		// We MUST keep setState() as a unified signature because it allows proper checking of the method return type.
		// See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18365#issuecomment-351013257
		// Also, the ` | S` allows intellisense to not be dumbisense
		setState<K extends keyof S>(
			state:
				| ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | undefined)
				| (Pick<S, K> | S | undefined),
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
		 * https://legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs
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

	type FC<P = {}> = FunctionComponent<P>;

	interface FunctionComponent<P = {}> {
		(props: PropsWithChildren<P>, context?: any): ReactElement<any, any>;
		propTypes?: WeakValidationMap<P> | undefined;
		contextTypes?: ValidationMap<any> | undefined;
		defaultProps?: Partial<P> | undefined;
		displayName?: string | undefined;
	}

	type VFC<P = {}> = VoidFunctionComponent<P>;

	interface VoidFunctionComponent<P = {}> {
		(props: P, context?: any): ReactElement<any, any>;
		propTypes?: WeakValidationMap<P> | undefined;
		contextTypes?: ValidationMap<any> | undefined;
		defaultProps?: Partial<P> | undefined;
		displayName?: string | undefined;
	}

	type ForwardedRef<T> = ((instance: T | undefined) => void) | MutableRefObject<T | undefined> | undefined;

	interface ForwardRefRenderFunction<T, P = {}> {
		(props: PropsWithChildren<P>, ref: ForwardedRef<T>): ReactElement;
		displayName?: string | undefined;
		// explicit rejected with `never` required due to
		// https://github.com/microsoft/TypeScript/issues/36826
		/**
		 * defaultProps are not supported on render functions
		 */
		defaultProps?: never | undefined;
		/**
		 * propTypes are not supported on render functions
		 */
		propTypes?: never | undefined;
	}

	interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
		new (props: P, context?: any): Component<P, S>;
		propTypes?: WeakValidationMap<P> | undefined;
		contextType?: Context<any> | undefined;
		contextTypes?: ValidationMap<any> | undefined;
		childContextTypes?: ValidationMap<any> | undefined;
		defaultProps?: Partial<P> | undefined;
		displayName?: string | undefined;
	}

	interface ClassicComponentClass<P = {}> extends ComponentClass<P> {
		new (props: P, context?: any): ClassicComponent<P, ComponentState>;
		getDefaultProps?(): P;
	}

	/**
	 * We use an intersection type to infer multiple type parameters from
	 * a single argument, which is useful for many top-level API defs.
	 * See https://github.com/Microsoft/TypeScript/issues/7234 for more info.
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
		 * If false is returned, `Component#render`, `componentWillUpdate`
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
		componentDidCatch?(error: unknown, errorInfo: ErrorInfo): void;
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
		(error: any) => Partial<S> | undefined;

	// This should be "infer SS" but can't use it yet
	interface NewLifecycle<P, S, SS> {
		/**
		 * Runs before React applies the result of `render` to the document, and
		 * returns an object to be given to componentDidUpdate. Useful for saving
		 * things such as scroll position before `render` causes changes to it.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
		 * lifecycle events from running.
		 */
		getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | undefined;
		/**
		 * Called immediately after updating occurs. Not called for the initial render.
		 *
		 * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
		 */
		componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
	}

	interface DeprecatedLifecycle<P, S> {
		/**
		 * Called immediately before mounting occurs, and before `Component#render`.
		 * Avoid introducing any side-effects or subscriptions in this method.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use componentDidMount or the constructor instead; will stop working in React 17
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		componentWillMount?(): void;
		/**
		 * Called immediately before mounting occurs, and before `Component#render`.
		 * Avoid introducing any side-effects or subscriptions in this method.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use componentDidMount or the constructor instead
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		UNSAFE_componentWillMount?(): void;
		/**
		 * Called when the component may be receiving new props.
		 * React may call this even if props have not changed, so be sure to compare new and existing
		 * props if you only want to handle changes.
		 *
		 * Calling `Component#setState` generally does not trigger this method.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use static getDerivedStateFromProps instead; will stop working in React 17
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
		/**
		 * Called when the component may be receiving new props.
		 * React may call this even if props have not changed, so be sure to compare new and existing
		 * props if you only want to handle changes.
		 *
		 * Calling `Component#setState` generally does not trigger this method.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use static getDerivedStateFromProps instead
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
		/**
		 * Called immediately before rendering when new props or state is received. Not called for the initial render.
		 *
		 * Note: You cannot call `Component#setState` here.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
		/**
		 * Called immediately before rendering when new props or state is received. Not called for the initial render.
		 *
		 * Note: You cannot call `Component#setState` here.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use getSnapshotBeforeUpdate instead
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
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

	// will show `ForwardRef(${Component.displayName || Component.name})` in devtools by default,
	// but can be given its own specific name
	interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
		defaultProps?: Partial<P> | undefined;
		propTypes?: WeakValidationMap<P> | undefined;
	}

	function forwardRef<T, P = {}>(
		render: ForwardRefRenderFunction<T, P>,
	): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

	/** Ensures that the props do not include ref at all */
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
	 * NOTE: prefer ComponentPropsWithRef, if the ref is forwarded,
	 * or ComponentPropsWithoutRef when refs are not supported.
	 */
	type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
		T extends JSXElementConstructor<infer P>
			? P
			: T extends keyof JSX.IntrinsicElements
				? JSX.IntrinsicElements[T]
				: {};
	type ComponentPropsWithRef<T extends ElementType> = T extends new (props: infer P) => Component<any, any>
		? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
		: PropsWithRef<ComponentProps<T>>;
	type ComponentPropsWithoutRef<T extends ElementType> = PropsWithoutRef<ComponentProps<T>>;

	type ComponentRef<T extends ElementType> =
		T extends NamedExoticComponent<ComponentPropsWithoutRef<T> & RefAttributes<infer Method>>
			? Method
			: ComponentPropsWithRef<T> extends RefAttributes<infer Method>
				? Method
				: never;

	// will show `Memo(${Component.displayName || Component.name})` in devtools by default,
	// but can be given its own specific name
	type MemoExoticComponent<T extends ComponentType<any>> = NamedExoticComponent<ComponentPropsWithRef<T>> & {
		readonly type: T;
	};

	function memo<P extends object>(
		Component: FunctionComponent<P>,
		propsAreEqual?: (prevProps: Readonly<PropsWithChildren<P>>, nextProps: Readonly<PropsWithChildren<P>>) => boolean,
	): NamedExoticComponent<P>;
	function memo<T extends ComponentType<any>>(
		Component: T,
		propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean,
	): MemoExoticComponent<T>;

	type LazyExoticComponent<T extends ComponentType<any>> = ExoticComponent<ComponentPropsWithRef<T>> & {
		readonly _result: T;
	};

	function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T>;

	//
	// React Hooks
	// ----------------------------------------------------------------------

	// based on the code in https://github.com/facebook/react/pull/13968

	// Unlike the class component setState, the updates are not allowed to be partial
	type SetStateAction<S> = S | ((prevState: S) => S);
	// this technically does accept a second argument, but it's already under a deprecation warning
	// and it's not even released so probably better to not define it.
	type Dispatch<A> = (value: A) => void;
	// Since action _can_ be undefined, dispatch may be called without any parameters.
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
	 * @see https://react.dev/reference/react/useContext
	 */
	function useContext<T>(context: Context<T> /*, (not public API) observedBits?: number|boolean */): T;
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useState
	 */
	function useState<S>(initialState: S | (() => S)): LuaTuple<[S, Dispatch<SetStateAction<S>>]>;
	// convenience overload when first argument is omitted
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useState
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
	 * @see https://react.dev/reference/react/useReducer
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
	 * @see https://react.dev/reference/react/useReducer
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
	 * @see https://react.dev/reference/react/useReducer
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
	 * @see https://react.dev/reference/react/useReducer
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
	 * @see https://react.dev/reference/react/useReducer
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
	 * @see https://react.dev/reference/react/useRef
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
	 * @see https://react.dev/reference/react/useRef
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
	 * @see https://react.dev/reference/react/useRef
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
	 * @see https://react.dev/reference/react/useLayoutEffect
	 */
	function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
	/**
	 * Accepts a function that contains imperative, possibly effectful code.
	 *
	 * @param effect Imperative function that can return a cleanup function
	 * @param deps If present, effect will only activate if the values in the list change.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useEffect
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
	 * @see https://react.dev/reference/react/useImperativeHandle
	 */
	function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;
	// I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
	// useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
	/**
	 * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
	 * has changed.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useCallback
	 */
	// TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
	function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
	/**
	 * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useMemo
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
	 * @see https://react.dev/reference/react/useDebugValue
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

	export type InstanceProps<T extends Instance> = InstanceAttributes<T> & {
		key?: Key;
		ref?: Ref<T>;
		children?: ReactNode;
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
			? Validator<T[K] | undefined | undefined>
			: undefined extends T[K]
				? Validator<T[K] | undefined | undefined>
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
		) => C extends undefined | undefined ? C : Array<Exclude<T, boolean | undefined | undefined>>;
		forEach: <C>(children: C | readonly C[], fn: (child: C, index: number) => void) => void;
		count: (children: any) => number;
		only: <C>(children: C) => C extends any[] ? never : C;
		toArray: (children: ReactNode | ReactNode[]) => Array<Exclude<ReactNode, boolean | undefined | undefined>>;
	}

	//
	// Error Interfaces
	// ----------------------------------------------------------------------
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

// Any prop that has a default prop becomes optional, but its type is unchanged
// Undeclared default props are augmented into the resulting allowable attributes
// If declared props have indexed properties, ignore default props entirely as keyof gets widened
// Wrap in an outer-level conditional type to allow distribution over props that are unions
type Defaultize<P, D> = P extends any
	? string extends keyof P
		? P
		: Pick<P, Exclude<keyof P, keyof D>> &
				Partial<Pick<P, Extract<keyof P, keyof D>>> &
				Partial<Pick<D, Exclude<keyof D, keyof P>>>
	: never;

type ReactManagedAttributes<C, P> = C extends { propTypes: infer T; defaultProps: infer D }
	? Defaultize<MergePropTypes<P, PropTypes.InferProps<T>>, D>
	: C extends { propTypes: infer T }
		? MergePropTypes<P, PropTypes.InferProps<T>>
		: C extends { defaultProps: infer D }
			? Defaultize<P, D>
			: P;

declare global {
	namespace JSX {
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

		interface IntrinsicElements {
			accessory: React.InstanceProps<Accessory>;
			accessorydescription: React.InstanceProps<AccessoryDescription>;
			accoutrement: React.InstanceProps<Accoutrement>;
			actor: React.InstanceProps<Actor>;
			adgui: React.InstanceProps<AdGui>;
			adportal: React.InstanceProps<AdPortal>;
			aircontroller: React.InstanceProps<AirController>;
			alignorientation: React.InstanceProps<AlignOrientation>;
			alignposition: React.InstanceProps<AlignPosition>;
			angularvelocity: React.InstanceProps<AngularVelocity>;
			animation: React.InstanceProps<Animation>;
			animationconstraint: React.InstanceProps<AnimationConstraint>;
			animationcontroller: React.InstanceProps<AnimationController>;
			animationrigdata: React.InstanceProps<AnimationRigData>;
			animator: React.InstanceProps<Animator>;
			archandles: React.InstanceProps<ArcHandles>;
			atmosphere: React.InstanceProps<Atmosphere>;
			attachment: React.InstanceProps<Attachment>;
			audioanalyzer: React.InstanceProps<AudioAnalyzer>;
			audiochorus: React.InstanceProps<AudioChorus>;
			audiocompressor: React.InstanceProps<AudioCompressor>;
			audiodeviceinput: React.InstanceProps<AudioDeviceInput>;
			audiodeviceoutput: React.InstanceProps<AudioDeviceOutput>;
			audiodistortion: React.InstanceProps<AudioDistortion>;
			audioecho: React.InstanceProps<AudioEcho>;
			audioemitter: React.InstanceProps<AudioEmitter>;
			audioequalizer: React.InstanceProps<AudioEqualizer>;
			audiofader: React.InstanceProps<AudioFader>;
			audioflanger: React.InstanceProps<AudioFlanger>;
			audiolistener: React.InstanceProps<AudioListener>;
			audiopitchshifter: React.InstanceProps<AudioPitchShifter>;
			audioplayer: React.InstanceProps<AudioPlayer>;
			audioreverb: React.InstanceProps<AudioReverb>;
			audiosearchparams: React.InstanceProps<AudioSearchParams>;
			backpack: React.InstanceProps<Backpack>;
			ballsocketconstraint: React.InstanceProps<BallSocketConstraint>;
			beam: React.InstanceProps<Beam>;
			billboardgui: React.InstanceProps<BillboardGui>;
			bindableevent: React.InstanceProps<BindableEvent>;
			bindablefunction: React.InstanceProps<BindableFunction>;
			blockmesh: React.InstanceProps<BlockMesh>;
			bloomeffect: React.InstanceProps<BloomEffect>;
			blureffect: React.InstanceProps<BlurEffect>;
			bodyangularvelocity: React.InstanceProps<BodyAngularVelocity>;
			bodycolors: React.InstanceProps<BodyColors>;
			bodyforce: React.InstanceProps<BodyForce>;
			bodygyro: React.InstanceProps<BodyGyro>;
			bodypartdescription: React.InstanceProps<BodyPartDescription>;
			bodyposition: React.InstanceProps<BodyPosition>;
			bodythrust: React.InstanceProps<BodyThrust>;
			bodyvelocity: React.InstanceProps<BodyVelocity>;
			bone: React.InstanceProps<Bone>;
			boolvalue: React.InstanceProps<BoolValue>;
			boxhandleadornment: React.InstanceProps<BoxHandleAdornment>;
			breakpoint: React.InstanceProps<Breakpoint>;
			brickcolorvalue: React.InstanceProps<BrickColorValue>;
			bubblechatmessageproperties: React.InstanceProps<BubbleChatMessageProperties>;
			buoyancysensor: React.InstanceProps<BuoyancySensor>;
			camera: React.InstanceProps<Camera>;
			canvasgroup: React.InstanceProps<CanvasGroup>;
			cframevalue: React.InstanceProps<CFrameValue>;
			charactermesh: React.InstanceProps<CharacterMesh>;
			chorussoundeffect: React.InstanceProps<ChorusSoundEffect>;
			clickdetector: React.InstanceProps<ClickDetector>;
			climbcontroller: React.InstanceProps<ClimbController>;
			clouds: React.InstanceProps<Clouds>;
			color3value: React.InstanceProps<Color3Value>;
			colorcorrectioneffect: React.InstanceProps<ColorCorrectionEffect>;
			compressorsoundeffect: React.InstanceProps<CompressorSoundEffect>;
			conehandleadornment: React.InstanceProps<ConeHandleAdornment>;
			configuration: React.InstanceProps<Configuration>;
			controllermanager: React.InstanceProps<ControllerManager>;
			controllerpartsensor: React.InstanceProps<ControllerPartSensor>;
			cornerwedgepart: React.InstanceProps<CornerWedgePart>;
			curveanimation: React.InstanceProps<CurveAnimation>;
			cylinderhandleadornment: React.InstanceProps<CylinderHandleAdornment>;
			cylindermesh: React.InstanceProps<CylinderMesh>;
			cylindricalconstraint: React.InstanceProps<CylindricalConstraint>;
			datastoregetoptions: React.InstanceProps<DataStoreGetOptions>;
			datastoreincrementoptions: React.InstanceProps<DataStoreIncrementOptions>;
			datastoreoptions: React.InstanceProps<DataStoreOptions>;
			datastoresetoptions: React.InstanceProps<DataStoreSetOptions>;
			decal: React.InstanceProps<Decal>;
			depthoffieldeffect: React.InstanceProps<DepthOfFieldEffect>;
			dialog: React.InstanceProps<Dialog>;
			dialogchoice: React.InstanceProps<DialogChoice>;
			distortionsoundeffect: React.InstanceProps<DistortionSoundEffect>;
			doubleconstrainedvalue: React.InstanceProps<DoubleConstrainedValue>;
			dragdetector: React.InstanceProps<DragDetector>;
			dragger: React.InstanceProps<Dragger>;
			echosoundeffect: React.InstanceProps<EchoSoundEffect>;
			editableimage: React.InstanceProps<EditableImage>;
			editablemesh: React.InstanceProps<EditableMesh>;
			equalizersoundeffect: React.InstanceProps<EqualizerSoundEffect>;
			eulerrotationcurve: React.InstanceProps<EulerRotationCurve>;
			experienceinviteoptions: React.InstanceProps<ExperienceInviteOptions>;
			explosion: React.InstanceProps<Explosion>;
			facecontrols: React.InstanceProps<FaceControls>;
			filemesh: React.InstanceProps<FileMesh>;
			fire: React.InstanceProps<Fire>;
			flangesoundeffect: React.InstanceProps<FlangeSoundEffect>;
			floatcurve: React.InstanceProps<FloatCurve>;
			floorwire: React.InstanceProps<FloorWire>;
			folder: React.InstanceProps<Folder>;
			forcefield: React.InstanceProps<ForceField>;
			frame: React.InstanceProps<Frame>;
			gettextboundsparams: React.InstanceProps<GetTextBoundsParams>;
			glue: React.InstanceProps<Glue>;
			groundcontroller: React.InstanceProps<GroundController>;
			handles: React.InstanceProps<Handles>;
			hat: React.InstanceProps<Hat>;
			hiddensurfaceremovalasset: React.InstanceProps<HiddenSurfaceRemovalAsset>;
			highlight: React.InstanceProps<Highlight>;
			hingeconstraint: React.InstanceProps<HingeConstraint>;
			hole: React.InstanceProps<Hole>;
			humanoid: React.InstanceProps<Humanoid>;
			humanoidcontroller: React.InstanceProps<HumanoidController>;
			humanoiddescription: React.InstanceProps<HumanoidDescription>;
			ikcontrol: React.InstanceProps<IKControl>;
			imagebutton: React.InstanceProps<ImageButton>;
			imagehandleadornment: React.InstanceProps<ImageHandleAdornment>;
			imagelabel: React.InstanceProps<ImageLabel>;
			intconstrainedvalue: React.InstanceProps<IntConstrainedValue>;
			internalsyncitem: React.InstanceProps<InternalSyncItem>;
			intersectoperation: React.InstanceProps<IntersectOperation>;
			intvalue: React.InstanceProps<IntValue>;
			keyframe: React.InstanceProps<Keyframe>;
			keyframemarker: React.InstanceProps<KeyframeMarker>;
			keyframesequence: React.InstanceProps<KeyframeSequence>;
			linearvelocity: React.InstanceProps<LinearVelocity>;
			lineforce: React.InstanceProps<LineForce>;
			linehandleadornment: React.InstanceProps<LineHandleAdornment>;
			localizationtable: React.InstanceProps<LocalizationTable>;
			localscript: React.InstanceProps<LocalScript>;
			manualglue: React.InstanceProps<ManualGlue>;
			manualweld: React.InstanceProps<ManualWeld>;
			markercurve: React.InstanceProps<MarkerCurve>;
			materialvariant: React.InstanceProps<MaterialVariant>;
			meshpart: React.InstanceProps<MeshPart>;
			model: React.InstanceProps<Model>;
			modulescript: React.InstanceProps<ModuleScript>;
			motor: React.InstanceProps<Motor>;
			motor6d: React.InstanceProps<Motor6D>;
			motorfeature: React.InstanceProps<MotorFeature>;
			negateoperation: React.InstanceProps<NegateOperation>;
			nocollisionconstraint: React.InstanceProps<NoCollisionConstraint>;
			numberpose: React.InstanceProps<NumberPose>;
			numbervalue: React.InstanceProps<NumberValue>;
			objectvalue: React.InstanceProps<ObjectValue>;
			operationgraph: React.InstanceProps<OperationGraph>;
			pants: React.InstanceProps<Pants>;
			part: React.InstanceProps<Part>;
			particleemitter: React.InstanceProps<ParticleEmitter>;
			partoperation: React.InstanceProps<PartOperation>;
			path2d: React.InstanceProps<Path2D>;
			pathfindinglink: React.InstanceProps<PathfindingLink>;
			pathfindingmodifier: React.InstanceProps<PathfindingModifier>;
			pitchshiftsoundeffect: React.InstanceProps<PitchShiftSoundEffect>;
			plane: React.InstanceProps<Plane>;
			planeconstraint: React.InstanceProps<PlaneConstraint>;
			plugincapabilities: React.InstanceProps<PluginCapabilities>;
			pointlight: React.InstanceProps<PointLight>;
			pose: React.InstanceProps<Pose>;
			prismaticconstraint: React.InstanceProps<PrismaticConstraint>;
			proximityprompt: React.InstanceProps<ProximityPrompt>;
			rayvalue: React.InstanceProps<RayValue>;
			remoteevent: React.InstanceProps<RemoteEvent>;
			remotefunction: React.InstanceProps<RemoteFunction>;
			reverbsoundeffect: React.InstanceProps<ReverbSoundEffect>;
			rigidconstraint: React.InstanceProps<RigidConstraint>;
			robloxeditableimage: React.InstanceProps<RobloxEditableImage>;
			rocketpropulsion: React.InstanceProps<RocketPropulsion>;
			rodconstraint: React.InstanceProps<RodConstraint>;
			ropeconstraint: React.InstanceProps<RopeConstraint>;
			rotate: React.InstanceProps<Rotate>;
			rotatep: React.InstanceProps<RotateP>;
			rotatev: React.InstanceProps<RotateV>;
			rotationcurve: React.InstanceProps<RotationCurve>;
			screengui: React.InstanceProps<ScreenGui>;
			script: React.InstanceProps<Script>;
			scrollingframe: React.InstanceProps<ScrollingFrame>;
			seat: React.InstanceProps<Seat>;
			selectionbox: React.InstanceProps<SelectionBox>;
			selectionpartlasso: React.InstanceProps<SelectionPartLasso>;
			selectionpointlasso: React.InstanceProps<SelectionPointLasso>;
			selectionsphere: React.InstanceProps<SelectionSphere>;
			shirt: React.InstanceProps<Shirt>;
			shirtgraphic: React.InstanceProps<ShirtGraphic>;
			skateboardcontroller: React.InstanceProps<SkateboardController>;
			skateboardplatform: React.InstanceProps<SkateboardPlatform>;
			sky: React.InstanceProps<Sky>;
			smoke: React.InstanceProps<Smoke>;
			snap: React.InstanceProps<Snap>;
			sound: React.InstanceProps<Sound>;
			soundgroup: React.InstanceProps<SoundGroup>;
			sparkles: React.InstanceProps<Sparkles>;
			spawnlocation: React.InstanceProps<SpawnLocation>;
			specialmesh: React.InstanceProps<SpecialMesh>;
			spherehandleadornment: React.InstanceProps<SphereHandleAdornment>;
			spotlight: React.InstanceProps<SpotLight>;
			springconstraint: React.InstanceProps<SpringConstraint>;
			startergear: React.InstanceProps<StarterGear>;
			stringvalue: React.InstanceProps<StringValue>;
			studioattachment: React.InstanceProps<StudioAttachment>;
			studiocallout: React.InstanceProps<StudioCallout>;
			stylederive: React.InstanceProps<StyleDerive>;
			stylelink: React.InstanceProps<StyleLink>;
			stylerule: React.InstanceProps<StyleRule>;
			stylesheet: React.InstanceProps<StyleSheet>;
			sunrayseffect: React.InstanceProps<SunRaysEffect>;
			surfaceappearance: React.InstanceProps<SurfaceAppearance>;
			surfacegui: React.InstanceProps<SurfaceGui>;
			surfacelight: React.InstanceProps<SurfaceLight>;
			surfaceselection: React.InstanceProps<SurfaceSelection>;
			swimcontroller: React.InstanceProps<SwimController>;
			team: React.InstanceProps<Team>;
			teleportoptions: React.InstanceProps<TeleportOptions>;
			terraindetail: React.InstanceProps<TerrainDetail>;
			terrainregion: React.InstanceProps<TerrainRegion>;
			textbox: React.InstanceProps<TextBox>;
			textbutton: React.InstanceProps<TextButton>;
			textchannel: React.InstanceProps<TextChannel>;
			textchatcommand: React.InstanceProps<TextChatCommand>;
			textchatmessageproperties: React.InstanceProps<TextChatMessageProperties>;
			textlabel: React.InstanceProps<TextLabel>;
			texture: React.InstanceProps<Texture>;
			tool: React.InstanceProps<Tool>;
			torque: React.InstanceProps<Torque>;
			torsionspringconstraint: React.InstanceProps<TorsionSpringConstraint>;
			trackerstreamanimation: React.InstanceProps<TrackerStreamAnimation>;
			trail: React.InstanceProps<Trail>;
			tremolosoundeffect: React.InstanceProps<TremoloSoundEffect>;
			trusspart: React.InstanceProps<TrussPart>;
			uiaspectratioconstraint: React.InstanceProps<UIAspectRatioConstraint>;
			uicorner: React.InstanceProps<UICorner>;
			uiflexitem: React.InstanceProps<UIFlexItem>;
			uigradient: React.InstanceProps<UIGradient>;
			uigridlayout: React.InstanceProps<UIGridLayout>;
			uilistlayout: React.InstanceProps<UIListLayout>;
			uipadding: React.InstanceProps<UIPadding>;
			uipagelayout: React.InstanceProps<UIPageLayout>;
			uiscale: React.InstanceProps<UIScale>;
			uisizeconstraint: React.InstanceProps<UISizeConstraint>;
			uistroke: React.InstanceProps<UIStroke>;
			uitablelayout: React.InstanceProps<UITableLayout>;
			uitextsizeconstraint: React.InstanceProps<UITextSizeConstraint>;
			unionoperation: React.InstanceProps<UnionOperation>;
			universalconstraint: React.InstanceProps<UniversalConstraint>;
			usernotification: React.InstanceProps<UserNotification>;
			usernotificationpayload: React.InstanceProps<UserNotificationPayload>;
			usernotificationpayloadanalyticsdata: React.InstanceProps<UserNotificationPayloadAnalyticsData>;
			usernotificationpayloadjoinexperience: React.InstanceProps<UserNotificationPayloadJoinExperience>;
			usernotificationpayloadparametervalue: React.InstanceProps<UserNotificationPayloadParameterValue>;
			vector3curve: React.InstanceProps<Vector3Curve>;
			vector3value: React.InstanceProps<Vector3Value>;
			vectorforce: React.InstanceProps<VectorForce>;
			vehiclecontroller: React.InstanceProps<VehicleController>;
			vehicleseat: React.InstanceProps<VehicleSeat>;
			velocitymotor: React.InstanceProps<VelocityMotor>;
			videoframe: React.InstanceProps<VideoFrame>;
			viewportframe: React.InstanceProps<ViewportFrame>;
			wedgepart: React.InstanceProps<WedgePart>;
			weld: React.InstanceProps<Weld>;
			weldconstraint: React.InstanceProps<WeldConstraint>;
			wire: React.InstanceProps<Wire>;
			wireframehandleadornment: React.InstanceProps<WireframeHandleAdornment>;
			worldmodel: React.InstanceProps<WorldModel>;
			wraplayer: React.InstanceProps<WrapLayer>;
			wraptarget: React.InstanceProps<WrapTarget>;
		}
	}
}
