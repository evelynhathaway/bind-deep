module.exports = {
	"plugins": [
		"evelyn",
	],
	"extends": [
		"plugin:evelyn/default",
		"plugin:evelyn/node",
		"plugin:evelyn/source",
	],
	"overrides": [
		{
			"files": "**/*.ts",
			"extends": [
				"plugin:evelyn/typescript",
			],
		},
		{
			"files": "test/**/*.js",
			"extends": [
				"plugin:evelyn/mocha",
				"plugin:evelyn/source",
			],
			"rules": {
				"unicorn/no-null": "off",
				"mocha/no-setup-in-describe": "off", // Wow my tests are way too meta
			},
		},
	],
	"ignorePatterns": [
		"/lib",
	],
};
