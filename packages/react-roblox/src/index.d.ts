import React from "@rbxts/react";

export interface RootOptions {
	hydrate?: boolean;
	hydrationOptions?: {
		onHydrated?: (suspenseNode: any) => void;
		onDeleted?: (suspenseNode: any) => void;
		mutableSources?: any[];
	};
}

export interface Root {
	render(children: React.Element): void;
	unmount(): void;
}

export function createRoot(container: Instance, options?: RootOptions): Root;

export function createBlockingRoot(container: Instance, options?: RootOptions): Root;

export function createLegacyRoot(container: Instance, options?: RootOptions): Root;

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
export function createPortal(children: React.Element, container: Instance, key?: string): React.Element;

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
export function act(callback: () => Promise<void>): Promise<undefined>;
export function act(callback: () => void): void;
