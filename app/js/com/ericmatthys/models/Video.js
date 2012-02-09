define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Video = Backbone.Model.extend({
			defaults: {
				currentTime: 0,
				duration: 0,
				formattedTime: '0:00',
				formattedDuration: '0:00',
			},
			
			initialize: function () {
				console.log('initialize');
			},
			
			secondsToHms: function (seconds) {
				seconds = Number(seconds);
				var h = Math.floor(seconds / 3600);
				var m = Math.floor(seconds % 3600 / 60);
				var s = Math.floor(seconds % 3600 % 60);
				return ((h > 0 ? h + ':' : '') + (m > 0 ? (h > 0 && m < 10 ? '0' : '') + m + ':' : '0:') + (s < 10 ? '0' : '') + s);
			}
		});
		
		return Video;
	}
);