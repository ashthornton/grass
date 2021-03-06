// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type { import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		/* ... */
	},
	plugins: [
		['snowpack-plugin-glslify', { compress: true }]
	],
	packageOptions: {
		/* ... */
	},
	devOptions: {
		/* ... */
	},
	buildOptions: {
		/* ... */
	},
	optimize: {
		bundle: true,
		minify: true,
		treeshake: true,
		target: 'es2018'
	},
	exclude: ['**/.git/**/*']
}
