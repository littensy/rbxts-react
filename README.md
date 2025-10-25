<p align="center">
  <p align="center">
    <img width="150" height="150" src="https://github.com/littensy/rbxts-react/blob/main/assets/logo.png?raw=true" alt="Logo">
  </p>
  <h1 align="center"><b>@rbxts/react</b></h1>
  <p align="center">
    TypeScript type definitions for React Lua.
    <br />
    <a href="https://npmjs.com/package/@rbxts/react"><strong>npm package →</strong></a>
  </p>
</p>

TypeScript type definitions for [React Lua](https://github.com/jsdotlua/react-lua) and [roblox-ts](https://roblox-ts.com), sourced from the official React types. Currently, only [`@rbxts/react`](https://npmjs.com/package/@rbxts/react) and
[`@rbxts/react-roblox`](https://npmjs.com/package/@rbxts/react-roblox) may be installed.

If we're missing any deviations from [React Lua](https://jsdotlua.github.io/react-lua/), please [open an issue or pull request](https://github.com/littensy/rbxts-react/issues/new) to let us know!

If you're encountering issues with `@rbxts/react`, please see the [Troubleshooting](#-troubleshooting) section for more information.

## 📦 Setup

### Installation

Get started by installing the alpha versions of `@rbxts/react` and `@rbxts/react-roblox`:

```sh
npm install @rbxts/react@alpha @rbxts/react-roblox@alpha
yarn add @rbxts/react@alpha @rbxts/react-roblox@alpha
pnpm add @rbxts/react@alpha @rbxts/react-roblox@alpha # 🔴 See below
```

Then, add the following to your Rojo project file, under the `node_modules` folder:

```json
"node_modules": {
  "$className": "Folder",
  "@rbxts": {
    "$path": "node_modules/@rbxts"
  },
  "@rbxts-js": {
    "$path": "node_modules/@rbxts-js"
  }
}
```

### Configuration

Set up your `tsconfig.json` JSX options to use React's `createElement` and `Fragment`:

```json
"compilerOptions": {
  "jsxFactory": "React.createElement",
  "jsxFragmentFactory": "React.Fragment"
}
```

### Usage with PNPM

If you're using PNPM as your package manager, you'll need to create a `.npmrc` file in the root of your project with the following content:

```ini
public-hoist-pattern[]=*@rbxts*
```

### React DevTools

To connect to DevTools from a new application, you need to import the backend portion of the stack. Add ReactDevtools and ReactGlobals as dependencies in your package manager:

```sh
npm install @rbxts/react-globals@alpha @rbxts/react-devtools-core@alpha
yarn add @rbxts/react-globals@alpha @rbxts/react-devtools-core@alpha
pnpm add @rbxts/react-globals@alpha @rbxts/react-devtools-core@alpha # 🔴 See above
```

Similar to when setting the `__DEV__` or `__PROFILE__` flags, DevTools must be initialized before React is imported.

```ts
import { backend } from "@rbxts/react-devtools-core";
import ReactGlobals from "@rbxts/react-globals";

// The DEV flag enables some DevTools features you otherwise wouldn't have
ReactGlobals.__DEV__ = true;
// The PROFILE flag allows you to run the DevTools profiler
ReactGlobals.__PROFILE__ = true;

backend.connectToDevtools();
```

Now, if you launch DevTools and then run your code, you should see your React component tree!

## 🚀 Examples

### Mounting your app

```tsx
import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";

const root = createRoot(new Instance("Folder"));

root.render(<StrictMode>{createPortal(<App />, playerGui)}</StrictMode>);
```

### Function Component

```tsx
import React, { useState } from "@rbxts/react";

interface CounterProps {
	initialCount: number;
}

export function Counter({ initialCount }: CounterProps) {
	const [count, setCount] = useState(initialCount);

	return (
		<textbutton
			Text={`Count: ${count}`}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={new UDim2(0, 100, 0, 50)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Event={{
				Activated: () => setCount(count + 1),
			}}
		/>
	);
}
```

### Class Component

```tsx
import React, { Component, ReactComponent } from "@rbxts/react";

interface CounterProps {
	initialCount: number;
}

interface CounterState {
	count: number;
}

@ReactComponent
export class Counter extends Component<CounterProps, CounterState> {
	state: CounterState = {
		count: this.props.initialCount,
	};

	render() {
		return (
			<textbutton
				Text={`Count: ${this.state.count}`}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={new UDim2(0, 100, 0, 50)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Event={{
					Activated: () => this.setState({ count: this.state.count + 1 }),
				}}
			/>
		);
	}
}
```

### Error Boundary

```tsx
import React, { Component, ErrorInfo, ReactComponent } from "@rbxts/react";

interface ErrorBoundaryProps {
	fallback: (error: unknown) => React.Element;
}

interface ErrorBoundaryState {
	hasError: boolean;
	message?: unknown;
}

@ReactComponent
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false,
	};

	componentDidCatch(message: unknown, info: ErrorInfo) {
		warn(message, info.componentStack);

		this.setState({
			hasError: true,
			message: `${message} ${info.componentStack}`,
		});
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback(this.state.message);
		} else {
			return this.props.children;
		}
	}
}
```

## 🔎 Troubleshooting

### compilerOptions.jsxFactory must be `Roact.createElement`!

If you encounter this error during compilation, it means that you're using an older version of `roblox-ts`. Make sure to install the latest version of `roblox-ts` and remove any global installations:

```sh
npm uninstall -g roblox-ts
npm install -D roblox-ts@latest
```

### `nil` cannot be used as a JSX component.

This error typically occurs when `tsconfig.json` has not been configured correctly. Make sure that your fragment factory is set to `React.Fragment`, and that your JSX factory is set to `React.createElement`:

```json
"compilerOptions": {
  "jsxFactory": "React.createElement",
  "jsxFragmentFactory": "React.Fragment"
}
```

### `(X)` cannot be used as a JSX component. Its return type `Element` is not a valid JSX element.

This error can occur when a conflicting installation of react-ts is present in your project. This can be for one of two reasons:

1. You have react-ts installed in your dependencies. (`npm uninstall @rbxts/roact`)
2. You have an outdated package installed that depends on react-ts.

The most common cause is an outdated package. To view the packages that depend on `@rbxts/react-ts` (which will be under the alias `@rbxts/roact`), run the following command:

```sh
npm ls @rbxts/roact
```

If you find any packages that depend on `@rbxts/react-ts`, you should update them to the latest version, or open an issue on their repository to request an update.

### Attempt to index nil with `useMemo` (or other hooks)

This error happens when a hook was called in an invalid environment. There are two common reasons for this error:

1. You're using a hook outside of a component, or using function components incorrectly.

Hooks must be used inside the body of a function component. A common mistake is to call hooks conditionally, or inside a callback function. Make sure you're calling hooks at the top level of your function component.

**Do not call a function component directly.** To render a function component, wrap it in a JSX tag:

```tsx
<App />; // 🟢 Good
App(); // 🔴 Bad
```

2. There's more than one version of React in your project.

When multiple versions of React are present in your node_modules, your packages might import hooks from the wrong version of React. Update your packages to the latest version that supports `@rbxts/react`, or remove the conflicting packages.

If you have no conflicting dependencies, or a fresh install doesn't remove the outdated package, see [the previous section](#x-cannot-be-used-as-a-jsx-component-its-return-type-element-is-not-a-valid-jsx-element) for more information.

### My issue isn't listed here!

If you're encountering an issue that isn't listed here, please [post your issue](https://discord.com/channels/476080952636997633/1006309509876162570) in the [roblox-ts Discord server](https://discord.roblox-ts.com/).

## 📚 Resources

- [React Documentation](https://react.dev) - Learn about React's core concepts and API
- [React Lua Documentation](https://jsdotlua.github.io/react-lua/) - A comprehensive guide for the differences between Roact and React
- [JS.Lua Repository](https://github.com/jsdotlua/react-lua) - The source code for React Lua

## 📝 License

This project is licensed under the [MIT license](LICENSE).
