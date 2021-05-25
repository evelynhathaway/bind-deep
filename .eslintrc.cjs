module.exports = {
	"plugins": [
		"evelyn",
	],

	"extends": [
		"plugin:evelyn/default",
		"plugin:evelyn/typescript",
	],

	"overrides": [
		{
			"files": "test/**/*.js",
			"extends": [
				"plugin:evelyn/mocha",
			],
			"rules": {
				"mocha/no-setup-in-describe": "off", // Wow my tests are way too meta
				"no-unused-expressions": "off", // `.to.be.true` and getter side effects
			},
		},
	],

	"ignorePatterns": [
		"/lib",
	],
};
