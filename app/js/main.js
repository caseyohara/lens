require.config({
	baseUrl: 'js',
	//urlArgs: 'dc=' + (new Date()).getTime(),
	paths: {
		jquery: 'libs/jquery-1.7.1-min',
		underscore: 'libs/underscore-1.3.1-min',
		backbone: 'libs/backbone-0.9.1-min',
		templates: '../templates'
	}
});

require(
	[
	'jquery',
	'com/ericmatthys/app'
	],
	
	function ($, app) {
		$(document).ready(app.ready);
	}
);