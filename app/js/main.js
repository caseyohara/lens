require.config({
	baseUrl: 'js',
	//urlArgs: 'dc=' + (new Date()).getTime(),
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/amd-underscore-1.3.1-min',
		backbone: 'libs/amd-backbone-0.9.1-min',
		templates: '../templates'
	}
});

require(
	[
	'com/ericmatthys/Lens'
	],
	
	function (Lens) {
		Lens.initialize();
	}
);