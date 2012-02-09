define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Playlist = Backbone.Model.extend({
			defaults: {
				videos: []
			},
			initialize: function () {
				console.log('initialize');
			}
		});
		
		return Playlist;
	}
);