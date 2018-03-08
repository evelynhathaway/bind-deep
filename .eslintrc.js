module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"plugins": [
		"node",
		"mocha"
	],
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 2018
	},
	"extends": [
		"eslint:recommended", "plugin:node/recommended"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"warn",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-var": "error",
		"no-console": "error",
		"no-throw-literal": "error",
		"quote-props": [
			"warn",
			"as-needed",
			{
				"unnecessary": false,
				"numbers": true
			}
		],
		"no-fallthrough": [
			"error",
			{
				"commentPattern": "falls?\\s?through|break"
			}
		],
		// Allow unsupported features without Babel
		"node/no-unsupported-features": [
			"off"
		]
	},
	"overrides": [
		// Babel built files
		{
			"files": [
				"lib/**/*.js"
			],
			"rules": {
				"node/no-unsupported-features": "error",
				"no-var": "off",
				"no-unsafe-finally": "off"
			},
		},
		// Mocha tests
		{
			"files": [
				"test/**/*.js"
			],
			"env": {
				"mocha": true
			},
			"rules": {
				"mocha/handle-done-callback": "error",
				"mocha/no-exclusive-tests": "error",
				"mocha/no-global-tests": "warn",
				"mocha/no-identical-title": "error",
				"mocha/no-mocha-arrows": "warn",
				"mocha/no-nested-tests": "error",
				"mocha/no-pending-tests": "warn",
				"mocha/no-return-and-callback": "error",
				"mocha/no-sibling-hooks": "error",
				"mocha/no-skipped-tests": "warn",
				"mocha/no-top-level-hooks": "error",
				// Allow for dev dependencies
				"node/no-unpublished-require": "off"
			}
		}
	]
};
