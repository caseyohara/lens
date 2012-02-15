define(
	[
		'backbone',
		'com/ericmatthys/models/PlayerModel'
	],
	
	function (Backbone, PlayerModel) {
		//---------- Constants ----------
		var WRAPPER_CLASS = 'emp-player-wrapper';
		var FULLSCREEN_VIDEO_CLASS = 'emp-video-fullscreen';
		
		var Container = Backbone.View.extend({
			
			//---------- Properties ----------
			el: '#' + PlayerModel.config.get('videoID'),
			wrapper: null,
			$wrapper: null,

			events: {
				'loadedmetadata': 'onLoadedMetadata',
				'progress': 'onProgress',
				'canplaythrough': 'onCanPlayThrough',
				'timeupdate': 'onTimeUpdate',
				'ended': 'onEnded'
			},
			
			//---------- Init ----------
			initialize: function () {
				_.bindAll(this, 'onFullscreenChange');
				
				if (typeof(this.el) === 'undefined') {
					throw('A video tag with the id, ' + PlayerModel.config.get('videoID') + ', was not found.');
				} else {
					// Store the initial width of the video
					var videoWidth = this.$el.width();
					
					PlayerModel.video.set({width: videoWidth});

					// Create a div to wrap the video and controls in
					var wrapperID = PlayerModel.config.get('videoID') + '-wrapper';
					var wrapperEl = this.make('div', {'id': wrapperID, 'class': WRAPPER_CLASS});

					this.$el.wrap(wrapperEl);

					this.$wrapper = $('#' + wrapperID);
					this.wrapper = this.$wrapper.get(0);

					// Adjust the width of the wrapper to the width of the video
					this.$wrapper.css('width', videoWidth);
					
					// Listen for fullscreen changes
					this.$wrapper.bind('webkitfullscreenchange', this.onFullscreenChange);
					this.$wrapper.bind('mozfullscreenchange', this.onFullscreenChange);
					
					// If the video is muted, make sure the controls reflect this
					if (this.el.muted === true) {
						this.setVolume(0);
						this.el.muted = false;
					}
					
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
			
			enterFullscreen: function () {
				// A wrapper with a set width will not allow fullscreen
				this.$wrapper.css('width', '100%');
				this.$el.addClass(FULLSCREEN_VIDEO_CLASS);
				
				if (this.wrapper.requestFullScreen) {
					this.wrapper.requestFullScreen();
				} else if (this.wrapper.requestFullscreen) {
					this.wrapper.requestFullscreen();
				} else if (this.wrapper.mozRequestFullScreen) {
					this.wrapper.mozRequestFullScreen();
				} else if (this.wrapper.webkitRequestFullScreen) {
					this.wrapper.webkitRequestFullScreen();
				} else {
					// Default back to the normal width if a function is not available
					this.$wrapper.css('width', PlayerModel.video.get('width'));
					this.$el.removeClass(FULLSCREEN_VIDEO_CLASS);
				}
			},
			
			exitFullscreen: function () {
				if (typeof(document.cancelFullScreen) === 'function') {
					document.cancelFullScreen();
				} else if (typeof(document.exitFullscreen) === 'function') {
					document.exitFullscreen();
				} else if (typeof(document.mozCancelFullScreen) === 'function') {
					document.mozCancelFullScreen();
				} else if (typeof(document.webkitCancelFullScreen) === 'function') {
					document.webkitCancelFullScreen();
				}
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
			},
			
			onFullscreenChange: function () {
				if (PlayerModel.video.isFullscreen() === true) {
					PlayerModel.video.set({fullscreen: true});
					this.$el.addClass(FULLSCREEN_VIDEO_CLASS);
				} else {
					PlayerModel.video.set({fullscreen: false});
					this.$el.removeClass(FULLSCREEN_VIDEO_CLASS);
					
					// Restore the wrapper to fit the original width
					this.$wrapper.css('width', PlayerModel.video.get('width'));
				}
			}
		});
		
		return Container;
    }
);