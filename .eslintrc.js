module.exports = {
	"plugins": [
		"evelyn",
	],
	"extends": [
		"plugin:evelyn/source",
		"plugin:evelyn/node",
		"plugin:evelyn/auto",
	],
	"overrides": [
		{
			"files": [
				"lib/**/*.js",
			],
			"extends": [
				"plugin:evelyn/built",
			],
		},
	],
};
