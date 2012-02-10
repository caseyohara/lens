define(
	[
		'backbone',
		'com/ericmatthys/Config',
		'com/ericmatthys/models/AppModel',
		'com/ericmatthys/views/Container',
		'text!templates/controls.html'
	],
	
    function (Backbone, Config, AppModel, Container, template) {
		var PLAY_PAUSE_CLASS = 'emp-play-pause-button';
		var PAUSE_CLASS = 'emp-pause-button';
		
		var CURRENT_TIME_CLASS = 'emp-current-time';
		var DURATION_CLASS = 'emp-duration';
		
		var SEEK_BAR_CLASS = 'emp-seek-bar';
		var PROGRESS_BAR_CLASS = 'emp-progress-bar';
		var PROGRESS_THUMB_CLASS = 'emp-progress-thumb';
		
		var VOLUME_CONTAINER_CLASS = 'emp-volume-container';
		var VOLUME_BUTTON_CLASS = 'emp-volume-button';
		var VOLUME_BUTTON_LOW_CLASS = 'emp-volume-button-low';
		var VOLUME_BUTTON_OFF_CLASS = 'emp-volume-button-off';
		var VOLUME_SLIDER_CLASS = 'emp-volume-slider';
		var VOLUME_BAR_CLASS = 'emp-volume-bar';
		var VOLUME_THUMB_CLASS = 'emp-volume-thumb';
		
		var PLAYBACK_RATE_CONTAINER_CLASS = 'emp-playback-rate-container';
		var PLAYBACK_RATE_SLIDER_CLASS = 'emp-playback-rate-slider';
		var PLAYBACK_RATE_BAR_CLASS = 'emp-playback-rate-bar';
		var PLAYBACK_RATE_THUMB_CLASS = 'emp-playback-rate-thumb';
	
		var view;
		
		var Controls = Backbone.View.extend({
			className: 'emp-controls',
			model: AppModel.video,
			muted: false,
			mutedVolume: 0,

			events: {
				'click .emp-play-pause-button': 'onPlayPauseClick',
				'click .emp-volume-button': 'onVolumeButtonClick',
				'mouseover .emp-volume-container': 'onVolumeContainerMouseOver',
				'mouseout .emp-volume-container': 'onVolumeContainerMouseOut',
				'mouseover .emp-playback-rate-container': 'onPlaybackRateContainerMouseOver',
				'mouseout .emp-playback-rate-container': 'onPlaybackRateContainerMouseOut',
				'mousedown .emp-seek-bar': 'onSeekBarMouseDown',
				'mousedown .emp-volume-slider': 'onVolumeSliderMouseDown',
				'mousedown .emp-playback-rate-slider': 'onPlaybackRateSliderMouseDown'
			},

			initialize: function () {
				_.bindAll(this, 'onSeekBarMouseMove');
				_.bindAll(this, 'onSeekBarMouseUp');
				_.bindAll(this, 'onVolumeSliderMouseMove');
				_.bindAll(this, 'onVolumeSliderMouseUp');
				_.bindAll(this, 'onPlaybackRateSliderMouseMove');
				_.bindAll(this, 'onPlaybackRateSliderMouseUp');
				_.bindAll(this, 'onDurationChange');
				_.bindAll(this, 'onPausedChange');
				_.bindAll(this, 'onCurrentTimeChange');
				_.bindAll(this, 'onVolumeChange');
				_.bindAll(this, 'onPlaybackRateChange');
				
				this.model.bind('change:formattedDuration', this.onDurationChange);
				this.model.bind('change:paused', this.onPausedChange);
				this.model.bind('change:formattedTime', this.onCurrentTimeChange);
				this.model.bind('change:volume', this.onVolumeChange);
				this.model.bind('change:playbackRate', this.onPlaybackRateChange);
			},
			
			render: function () {
				this.$el.html(_.template(template, AppModel.video.toJSON()));
				
				this.onVolumeChange();
				this.onPlaybackRateChange();
				
				return this;
			},
			
			seek: function (x) {
				var $seekBar = $('.' + SEEK_BAR_CLASS);
				var clickX = x - $seekBar.offset().left;
				var clickPct = clickX / $seekBar.width();
				var clickTime = clickPct * AppModel.video.get('duration');

				Container.seek(clickTime);
			},
			
			setVolume: function (x) {
				var $volumeSlider = $('.' + VOLUME_SLIDER_CLASS);
				var clickX = x - $volumeSlider.offset().left;
				var clickPct = clickX / $volumeSlider.width();
				
				if (clickPct > 1) {
					clickPct = 1;
				} else if (clickPct < 0) {
					clickPct = 0;
				}

				Container.setVolume(clickPct);
			},
			
			setPlaybackRate: function (x) {
				var $playbackRateSlider = $('.' + PLAYBACK_RATE_SLIDER_CLASS);
				var clickX = x - $playbackRateSlider.offset().left;
				var clickPct = clickX / $playbackRateSlider.width();
				
				if (clickPct > 1) {
					clickPct = 1;
				} else if (clickPct < .1) {
					clickPct = .1;
				}
				
				// Adjust to constain between .3 and 3
				var clickPlaybackRate = clickPct * 3;

				Container.setPlaybackRate(clickPlaybackRate);
			},
			
			onPlayPauseClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				Container.playPause();
			},
			
			onVolumeButtonClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				if (this.muted === true) {
					if (this.mutedVolume > 0) {
						Container.setVolume(this.mutedVolume);
					} else {
						Container.setVolume(1);
					}
					
					this.muted = false;
					this.mutedVolume = 0;
				} else {
					this.muted = true;
					this.mutedVolume = AppModel.video.get('volume');
					
					Container.setVolume(0);
				}
			},
			
			onVolumeContainerMouseOver: function (event) {
				$('.' + VOLUME_CONTAINER_CLASS).animate({width: 150});
			},
			
			onVolumeContainerMouseOut: function (event) {
				$('.' + VOLUME_CONTAINER_CLASS).animate({width: 40});
			},
			
			onPlaybackRateContainerMouseOver: function (event) {
				$('.' + PLAYBACK_RATE_CONTAINER_CLASS).animate({width: 150});
			},
			
			onPlaybackRateContainerMouseOut: function (event) {
				$('.' + PLAYBACK_RATE_CONTAINER_CLASS).animate({width: 40});
			},
			
			onSeekBarMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).bind('mousemove', this.onSeekBarMouseMove);
				$(document).bind('mouseup', this.onSeekBarMouseUp);
				
				this.seek(event.pageX);
			},

			onSeekBarMouseMove: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				this.seek(event.pageX);
			},
			
			onSeekBarMouseUp: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();

				$(document).unbind('mousemove', this.onSeekBarMouseMove);
				$(document).unbind('mouseup', this.onSeekBarMouseUp);
					
				this.seek(event.pageX);
			},
			
			onVolumeSliderMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).bind('mousemove', this.onVolumeSliderMouseMove);
				$(document).bind('mouseup', this.onVolumeSliderMouseUp);
					
				this.setVolume(event.pageX);
			},

			onVolumeSliderMouseMove: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
					
				this.setVolume(event.pageX);
			},

			onVolumeSliderMouseUp: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();

				$(document).unbind('mousemove', this.onVolumeSliderMouseMove);
				$(document).unbind('mouseup', this.onVolumeSliderMouseUp);
					
				this.setVolume(event.pageX);
			},
			
			onPlaybackRateSliderMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				console.log('playback rate slider');
				$(document).bind('mousemove', this.onPlaybackRateSliderMouseMove);
				$(document).bind('mouseup', this.onPlaybackRateSliderMouseUp);
					
				this.setPlaybackRate(event.pageX);
			},

			onPlaybackRateSliderMouseMove: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
					
				this.setPlaybackRate(event.pageX);
			},

			onPlaybackRateSliderMouseUp: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();

				$(document).unbind('mousemove', this.onPlaybackRateSliderMouseMove);
				$(document).unbind('mouseup', this.onPlaybackRateSliderMouseUp);
				
				Container.setPlaybackRate(1);
			},
			
			onPausedChange: function () {
				// Update the play/pause button
				var paused = AppModel.video.get('paused');
				
				if (paused) {
					$('.' + PLAY_PAUSE_CLASS).removeClass(PAUSE_CLASS);
				} else {
					$('.' + PLAY_PAUSE_CLASS).addClass(PAUSE_CLASS);
				}
			},
			
			onCurrentTimeChange: function () {
				// Update the progress bar to reflect the current time
				var seekBarWidth = $('.' + SEEK_BAR_CLASS).width();
				var pct = AppModel.video.get('currentTime') / AppModel.video.get('duration');
				var progressBarWidth = pct * seekBarWidth;
				
				// Constrain the progess bar so the thumb fits in the seek bar
				if (progressBarWidth < 4) {
					progressBarWidth = 4;
				} else if (progressBarWidth + 4 > seekBarWidth) {
					progressBarWidth = seekBarWidth - 4;
				}
				
				$('.' + PROGRESS_BAR_CLASS).width(progressBarWidth);
				$('.' + PROGRESS_THUMB_CLASS).css('left', progressBarWidth - 4);
				
				// Update the current time value
				$('.' + CURRENT_TIME_CLASS).html(AppModel.video.get('formattedTime'));
			},
			
			onDurationChange: function () {
				// Update the duration value
				$('.' + DURATION_CLASS).html(AppModel.video.get('formattedDuration'));
			},
			
			onVolumeChange: function () {
				var volume = AppModel.video.get('volume');
				var volumeSliderWidth = $('.' + VOLUME_SLIDER_CLASS).width();
				var volumeBarWidth = volume * volumeSliderWidth;
				
				// Constrain the progess bar so the thumb fits in the seek bar
				if (volumeBarWidth < 4) {
					volumeBarWidth = 4;
				} else if (volumeBarWidth + 4 > volumeSliderWidth) {
					volumeBarWidth = volumeSliderWidth - 4;
				}
				
				// Update the progress bar to reflect the current time
				$('.' + VOLUME_BAR_CLASS).width(volumeBarWidth);
				$('.' + VOLUME_THUMB_CLASS).css('left', volumeBarWidth - 4);
				
				// Update the volume button
				if (volume > .5) {
					this.muted = false;
					$('.' + VOLUME_BUTTON_CLASS).removeClass(VOLUME_BUTTON_LOW_CLASS);
					$('.' + VOLUME_BUTTON_CLASS).removeClass(VOLUME_BUTTON_OFF_CLASS);
				} else if (volume < .5 && volume > 0) {
					this.muted = false;
					$('.' + VOLUME_BUTTON_CLASS).addClass(VOLUME_BUTTON_LOW_CLASS);
					$('.' + VOLUME_BUTTON_CLASS).removeClass(VOLUME_BUTTON_OFF_CLASS);
				} else {
					this.muted = true;
					$('.' + VOLUME_BUTTON_CLASS).addClass(VOLUME_BUTTON_OFF_CLASS);
					$('.' + VOLUME_BUTTON_CLASS).removeClass(VOLUME_BUTTON_LOW_CLASS);
				}
			},
			
			onPlaybackRateChange: function () {
				var playbackRate = AppModel.video.get('playbackRate');
				var playbackRateSliderWidth = $('.' + PLAYBACK_RATE_SLIDER_CLASS).width();
				
				// Re-adjust playbackRate to be a percentage
				var playbackRateBarWidth = playbackRate / 3 * playbackRateSliderWidth;
				
				// Constrain the progess bar so the thumb fits in the seek bar
				if (playbackRateBarWidth < 4) {
					playbackRateBarWidth = 4;
				} else if (playbackRateBarWidth + 4 > playbackRateSliderWidth) {
					playbackRateBarWidth = playbackRateSliderWidth - 4;
				}
				
				// Update the progress bar to reflect the current time
				$('.' + PLAYBACK_RATE_BAR_CLASS).width(playbackRateBarWidth);
				$('.' + PLAYBACK_RATE_THUMB_CLASS).css('left', playbackRateBarWidth - 4);
			}
		});
		
		return {
			viewConstructor: Controls,
			
			initialize: function () {
				view = new Controls();
				
				var $videoEl = $('#' + Config.getVideoID());
				
				// Create the controls element and insert it into the DOM
				var controlsEl = view.make('div', {'class': view.className});
				$videoEl.after(controlsEl);
				
				$('.' + view.className).width($videoEl.width());
				
				view.setElement(controlsEl);
				view.render();
				
				return view;
			}
		};
    }
);