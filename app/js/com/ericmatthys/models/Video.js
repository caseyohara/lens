define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Video = Backbone.Model.extend({
			defaults: {
				duration: 10
			},
			initialize: function () {
				console.log('initialize');
			}
		});
		
		return Video;
	}
);