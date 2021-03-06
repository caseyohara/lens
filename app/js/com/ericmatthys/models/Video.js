define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Video = Backbone.Model.extend({
			defaults: {
				width: 0,
				currentTime: 0,
				duration: 0,
				formattedTime: '0:00',
				formattedDuration: '0:00',
				volume: 1,
				playbackRate: 1,
				paused: true,
				startBuffer: 0,
				endBuffer: 0,
				fullscreen: false
			},
			
			secondsToHms: function (seconds) {
				seconds = Number(seconds);
				var h = Math.floor(seconds / 3600);
				var m = Math.floor(seconds % 3600 / 60);
				var s = Math.floor(seconds % 3600 % 60);
				return ((h > 0 ? h + ':' : '') + (m > 0 ? (h > 0 && m < 10 ? '0' : '') + m + ':' : '0:') + (s < 10 ? '0' : '') + s);
			},
			
			isFullscreen: function () {
				return (document.webkitIsFullScreen === true || 
						document.mozFullScreen === true || 
						document.fullScreen === true);
			}
		});
		
		return Video;
	}
);