define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var video = Backbone.Model.extend({
			defaults: {
				duration: 10
			},
			initialize: function () {
				console.log('initialize');
			}
		});
		
		return video;
	}
);