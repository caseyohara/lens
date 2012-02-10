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
				'timeupdate': 'onTimeUpdate',
				'ended': 'onEnded'
			},
			
			onLoadedMetadata: function () {
				var duration = this.el.duration;
				var formattedDuration = AppModel.video.secondsToHms(duration);
				
				AppModel.video.set({duration: duration});
				AppModel.video.set({formattedDuration: formattedDuration});
			},
			
			onTimeUpdate: function () {
				var time = this.el.currentTime;
				var formattedTime = AppModel.video.secondsToHms(time);
				
				AppModel.video.set({currentTime: time});
				AppModel.video.set({formattedTime: formattedTime});
			},
			
			onEnded: function () {
				AppModel.video.set({'paused': true});
			}
		});
		
		return {
			viewConstructor: Container,
			
			initialize: function () {
				view = new Container();
				view.setElement($('#' + view.idName));
				
				return view;
			},

			playPause: function() {
				var el = view.el;
				
				if (el.paused === true || el.ended === true) {
					// If the video has ended, restart from the beginning
					if (el.ended === true) {
						view.el.currentTime = 0;
					}
					
					AppModel.video.set({'paused': false});
					el.play();
				} else {
					AppModel.video.set({'paused': true});
					el.pause();
				}
			},
			
			seek: function (time) {
				view.el.currentTime = time;
			},
			
			setVolume: function (volume) {
				AppModel.video.set({'volume': volume});
				view.el.volume = volume;
			}
		}
    }
);