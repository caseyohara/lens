define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Playlist = Backbone.Model.extend({
			defaults: {
				videos: []
			}
		});
		
		return Playlist;
	}
);