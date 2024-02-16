local script: any = script

local React = require(script.Parent:WaitForChild("React"))
local tags = require(script.tags)

local exports = table.clone(React)

function exports.createElement(component, props, ...)
	component = tags[component] or component

	if props then
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
