/**
 * Defines all React globals in a type-safe manner that's scoped to each
 * copy of React. For backwards compatibility, this module will load the
 * initial values for each flag from _G. However, this is considered legacy
 * behavior and new code should import this package and set the flags directly.
 */
declare const ReactGlobals: {
	// General debug-related flags:
	__DEV__: boolean;
	__PROFILE__: boolean;
	__EXPERIMENTAL__: boolean;
	__DEBUG__: boolean;
	__YOLO__: boolean;
	__DISABLE_ALL_WARNINGS_EXCEPT_PROP_VALIDATION__: boolean;

	// Devtools flags:
	__REACT_DEVTOOLS_GLOBAL_HOOK__: boolean;
	__REACT_DEVTOOLS_ATTACH__: boolean;
	__REACT_DEVTOOLS_COMPONENT_FILTERS__: boolean;
	__REACT_DEVTOOLS_APPEND_COMPONENT_STACK__: boolean;
	__REACT_DEVTOOLS_BREAK_ON_CONSOLE_ERRORS__: boolean;
	__LOCALSTORAGE__: boolean;
	__SESSIONSTORAGE__: boolean;

	// Misc flags:
	__COMPAT_WARNINGS__: boolean;
	__TESTEZ_RUNNING_TEST__: boolean;
	__ROACT_17_MOCK_SCHEDULER__: boolean;
	__ROACT_17_INLINE_ACT__: boolean;
};

export = ReactGlobals;
