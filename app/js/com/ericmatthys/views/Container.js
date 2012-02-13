define(
	[
		'backbone',
		'com/ericmatthys/models/AppModel'
	],
	
    function (Backbone, AppModel) {
		var Container = Backbone.View.extend({
			el: '#' + AppModel.config.get('videoID'),

			events: {
				'loadedmetadata': 'onLoadedMetadata',
				'progress': 'onProgress',
				'timeupdate': 'onTimeUpdate',
				'ended': 'onEnded'
			},
			
			initialize: function () {
				// If there is already a duration, manually trigger onLoadedMetadata
				if (this.el.duration > 0) {
					this.onLoadedMetadata();
				}
			},
			
			onLoadedMetadata: function () {
				var duration = this.el.duration;
				var formattedDuration = AppModel.video.secondsToHms(duration);
				var time = this.el.currentTime;
				var formattedTime = AppModel.video.secondsToHms(time);
				
				AppModel.video.set({
					duration: duration,
					formattedDuration: formattedDuration,
					currentTime: time,
					formattedTime: formattedTime,
					volume: this.el.volume,
					playbackRate: this.el.playbackRate
				});
			},
			
			onProgress: function () {
				if (typeof(this.el.buffered) !== 'undefined') {
					var buffered = this.el.buffered;
				
					if (buffered.length > 0) {
						var startBuffer = buffered.start(0);
						var endBuffer = buffered.end(0);
					
						AppModel.video.set({
							startBuffer: startBuffer,
							endBuffer: endBuffer
						});
					}
				}
			},
			
			onTimeUpdate: function () {
				var time = this.el.currentTime;
				var formattedTime = AppModel.video.secondsToHms(time);
				
				AppModel.video.set({currentTime: time});
				AppModel.video.set({formattedTime: formattedTime});
			},
			
			onEnded: function () {
				AppModel.video.set({paused: true});
				this.el.pause();
			},
			
			playPause: function() {
				var el = this.el;
				
				if (el.paused === true) {
					// If the video has ended, restart from the beginning
					if (el.ended === true) {
						el.currentTime = 0;
					}
					
					AppModel.video.set({paused: false});
					el.play();
				} else {	
					AppModel.video.set({paused: true});
					el.pause();
				}
			},
			
			sync: function () {
				var el = this.el;
				var paused = AppModel.video.get('paused');
				
				if (paused !== el.paused) {
					this.playPause();
				}
			},
			
			seek: function (time) {
				this.el.currentTime = time;
			},
			
			setVolume: function (volume) {
				AppModel.video.set({volume: volume});
				this.el.volume = volume;
			},

			setPlaybackRate: function (playbackRate) {
				AppModel.video.set({playbackRate: playbackRate});
				this.el.playbackRate = playbackRate;
			},
			
			supportsFullscreen: function () {
				if( typeof(document.webkitCancelFullScreen) === 'function' ||
					typeof(document.mozCancelFullScreen) === 'function' ||
					typeof(document.cancelFullScreen) === 'function' ||
					typeof(document.exitFullscreen) === 'function' ) {
					return true;	
				} else {
					return false;
				}
			},

			supportsPlaybackRate: function () {
				return (typeof(this.el.playbackRate) !== 'undefined');
			}
		});
		
		return Container;
    }
);