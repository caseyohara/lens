define(
	[
		'backbone',
		'com/ericmatthys/Config',
		'com/ericmatthys/models/AppModel'
	],
	
    function (Backbone, Config, AppModel) {
		var view;
		
		var Container = Backbone.View.extend({
			idName: Config.getVideoID(),

			events: {
				'loadedmetadata': 'onLoadedMetadata',
				'progress': 'onProgress',
				'timeupdate': 'onTimeUpdate',
				'ended': 'onEnded'
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
			}
		});
		
		return {
			viewConstructor: Container,
			
			initialize: function () {
				view = new Container();
				view.setElement($('#' + view.idName));
				
				if (view.el.duration > 0) {
					console.log('metadata already loaded');
					view.onLoadedMetadata();
				}
				
				return view;
			},

			playPause: function() {
				var el = view.el;
				
				if (el.paused === true) {
					// If the video has ended, restart from the beginning
					if (el.ended === true) {
						view.el.currentTime = 0;
					}
					
					console.log('play');
					AppModel.video.set({paused: false});
					el.play();
				} else {	
					console.log('pause');
					AppModel.video.set({paused: true});
					el.pause();
				}
			},
			
			sync: function () {
				console.log('sync');
				var el = view.el;
				var paused = AppModel.video.get('paused');
				
				console.log(paused + ' !== ' + el.paused);
				if (paused !== el.paused) {
					this.playPause();
				}
			},
			
			seek: function (time) {
				view.el.currentTime = time;
			},
			
			setVolume: function (volume) {
				AppModel.video.set({volume: volume});
				view.el.volume = volume;
			},

			setPlaybackRate: function (playbackRate) {
				AppModel.video.set({playbackRate: playbackRate});
				view.el.playbackRate = playbackRate;
			},
			
			supportsPlaybackRate: function () {
				return (typeof(view.el.playbackRate) !== 'undefined');
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
			}
		}
    }
);