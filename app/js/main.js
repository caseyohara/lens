require.config({
	baseUrl: 'js',
	//urlArgs: 'dc=' + (new Date()).getTime(),
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore-1.3.1-min',
		backbone: 'libs/backbone-0.9.1-min',
		templates: '../templates'
	}
});

require(
	[
	'com/ericmatthys/Player'
	],
	
	function (Player) {
		Player.initialize();
	}
);