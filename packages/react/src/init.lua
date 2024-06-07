local script: any = script

local React = require(script.Parent:WaitForChild("ReactLua").React)
local tags = require(script.tags)

local exports = table.clone(React)

function exports.Component.constructor() end

function exports.ReactComponent(class)
	local componentClass = exports.Component:extend(tostring(class))
	setmetatable(class, nil)

	for key, value in class do
		-- need to use componentClass as __index
		if key == "__index" then
			continue
		end
		-- map constructor onto :init()
		if key == "constructor" then
			key = "init"
		end
		componentClass[key] = value
	end

	return componentClass
end

function exports.PureComponent.constructor() end

function exports.ReactPureComponent(class)
	local componentClass = exports.PureComponent:extend(tostring(class))
	setmetatable(class, nil)

	for key, value in class do
		-- need to use componentClass as __index
		if key == "__index" then
			continue
		end
		-- map constructor onto :init()
		if key == "constructor" then
			key = "init"
		end
		componentClass[key] = value
	end

	return componentClass
end

function exports.createElement(component, props, ...)
	component = tags[component] or component

	if props and type(component) == "string" then
		if props.Change then
			for key, value in props.Change do
				props[React.Change[key]] = value
			end
			props.Change = nil
		end

		if props.Event then
			for key, value in props.Event do
				props[React.Event[key]] = value
			end
			props.Event = nil
		end

		if props.Tag then
			props[React.Tag] = props.Tag
			props.Tag = nil
		end
	end

	return React.createElement(component, props, ...)
end

return exports
