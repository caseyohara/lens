({
	appDir: '../',
	baseUrl: 'js',
	dir: '../../build',
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/amd-underscore-1.3.1-min',
		backbone: 'libs/amd-backbone-0.9.1-min',
		templates: '../templates'
	},
	modules: [
		{
			name: 'main'
		}
	]
})