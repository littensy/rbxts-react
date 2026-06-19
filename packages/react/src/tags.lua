local tags = {}

for _, class in game:GetService("ReflectionService"):GetClasses() do
	tags[string.lower(class.Name)] = class.Name
end

return tags
