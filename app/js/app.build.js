({
	appDir: '../',
	baseUrl: 'js',
	dir: '../../build',
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/amd-underscore-1.3.1-min',
		backbone: 'libs/amd-backbone-0.9.1-min',
		requireLib: 'libs/require-1.0.5-min',
		templates: '../templates'
	},
	modules: [
		{
			name: 'lens-0.1-min',
			include: ['requireLib', 'main'],
			create: true
		}
	]
})