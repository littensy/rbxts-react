import { ReactNode, ReactPortal } from "@rbxts/react";

export as namespace ReactRoblox;
export = ReactRoblox;

declare namespace ReactRoblox {
	interface RootOptions {
		hydrate?: boolean;
		hydrationOptions?: {
			onHydrated?: (suspenseNode: any) => void;
			onDeleted?: (suspenseNode: any) => void;
			mutableSources?: any[];
		};
	}

	interface Root {
		render(children: ReactNode): void;
		unmount(): void;
	}

	const version: string;

	/**
	 * createRoot lets you create a root to display React components inside a Roblox instance.
	 *
	 * @see {@link https://react.dev/reference/react-dom/client/createRoot API Reference for `createRoot`}
	 */
	function createRoot(container: Instance, options?: RootOptions): Root;

	function createBlockingRoot(container: Instance, options?: RootOptions): Root;

	function createLegacyRoot(container: Instance, options?: RootOptions): Root;

	/**
	 *
	 * @param children Anything that can be rendered with React, such as a piece
	 * of JSX (e.g. `<div />` or `<SomeComponent />`), a
	 * [Fragment](https://react.dev/reference/react/Fragment) (`<>...</>`), a
	 * string or a number, or an array of these.
	 * @param container The Roblox instance to portal to.
	 * @param key A unique string or number to be used as the portal’s [key](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key).
	 * @returns A React element that can be included into JSX or returned from a React component.
	 */
	function createPortal(children: ReactNode, container: Instance, key?: string): ReactPortal;

	/**
	 * Wrap any code rendering and triggering updates to your components into `act()` calls.
	 *
	 * Ensures that the behavior in your tests matches what happens in the browser
	 * more closely by executing pending `useEffect`s before returning. This also
	 * reduces the amount of re-renders done.
	 *
	 * @param callback A synchronous, void callback that will execute as a single, complete React commit.
	 *
	 * @see https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks
	 */
	function act(callback: () => Promise<void>): Promise<undefined>;
	function act(callback: () => void): void;
}
