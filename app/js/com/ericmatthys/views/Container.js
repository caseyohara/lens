define(
	[
		'backbone',
		'com/ericmatthys/models/PlayerModel'
	],
	
    function (Backbone, PlayerModel) {
		var Container = Backbone.View.extend({
			
			//---------- Properties ----------
			el: '#' + PlayerModel.config.get('videoID'),

			events: {
				'loadedmetadata': 'onLoadedMetadata',
				'progress': 'onProgress',
				'canplaythrough': 'onCanPlayThrough',
				'timeupdate': 'onTimeUpdate',
				'ended': 'onEnded'
			},
			
			//---------- Init ----------
			initialize: function () {
				PlayerModel.video.set({width: this.$el.width()});
				
				if (typeof(this.el) === 'undefined') {
					throw('A video tag with the id, ' + PlayerModel.config.get('videoID') + ', was not found.');
				} else {
					// If there is already a duration, manually trigger onLoadedMetadata
					if (this.el.duration > 0) {
						this.onLoadedMetadata();
					}
				}
			},
			
			//---------- Control ----------
			playPause: function() {
				var el = this.el;
				
				if (el.paused === true) {
					// If the video has ended, restart from the beginning
					if (el.ended === true) {
						el.currentTime = 0;
					}
					
					PlayerModel.video.set({paused: false});
					el.play();
				} else {	
					PlayerModel.video.set({paused: true});
					el.pause();
				}
			},
			
			sync: function () {
				var el = this.el;
				var paused = PlayerModel.video.get('paused');
				
				if (paused !== el.paused) {
					this.playPause();
				}
			},
			
			seek: function (time) {
				this.el.currentTime = time;
			},
			
			setVolume: function (volume) {
				PlayerModel.video.set({volume: volume});
				this.el.volume = volume;
			},

			setPlaybackRate: function (playbackRate) {
				PlayerModel.video.set({playbackRate: playbackRate});
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
			},
			
			//---------- Listeners ----------
			onLoadedMetadata: function () {
				var duration = this.el.duration;
				var formattedDuration = PlayerModel.video.secondsToHms(duration);
				var time = this.el.currentTime;
				var formattedTime = PlayerModel.video.secondsToHms(time);
				
				PlayerModel.video.set({
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
					
						PlayerModel.video.set({
							startBuffer: startBuffer,
							endBuffer: endBuffer
						});
					}
				}
			},
			
			onCanPlayThrough: function () {
				if (this.el.autoplay === true) {
					PlayerModel.video.set({paused: false});
					this.el.play();
				}
			},
			
			onTimeUpdate: function () {
				var time = this.el.currentTime;
				var formattedTime = PlayerModel.video.secondsToHms(time);
				
				PlayerModel.video.set({currentTime: time});
				PlayerModel.video.set({formattedTime: formattedTime});
			},
			
			onEnded: function () {
				PlayerModel.video.set({paused: true});
				this.el.pause();
			}
		});
		
		return Container;
    }
);