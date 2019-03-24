const extend = require("eslint-plugin-evelyn/lib/extend");

module.exports = {
	"plugins": [
		"evelyn",
	],
	"extends": [
		"plugin:evelyn/auto",
		"plugin:evelyn/source",
		"plugin:evelyn/node",
	],
	"overrides": [
		extend(
			"built",
			{
				"files": [
					"lib/**/*.js",
				],
			},
		),
	],
};
