define(
	[
		'backbone',
		'com/ericmatthys/models/AppModel',
		'com/ericmatthys/views/SeekBar',
		'text!templates/controls.html'
	],
	
    function (Backbone, AppModel, SeekBar, template) {
		var PLAY_PAUSE_CLASS = 'emp-play-pause-button';
		var PAUSE_CLASS = 'emp-pause-button';
		
		var SEEK_BAR_CLASS = 'emp-seek-bar';
		
		var CURRENT_TIME_CLASS = 'emp-current-time';
		var DURATION_CLASS = 'emp-duration';
		
		var ACTIVE_SLIDER_CLASS = 'emp-active-slider';
		
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
		var PLAYBACK_RATE_DIVIDER_CLASS = 'emp-divider-playback-rate';
		
		var FULLSCREEN_WRAPPER_CLASS = 'emp-fullscreen-wrapper';
		var FULLSCREEN_VIDEO_CLASS = 'emp-video-fullscreen';
		var FULLSCREEN_CONTROLS_CLASS = 'emp-controls-fullscreen';
		var FULLSCREEN_BUTTON_CLASS = 'emp-fullscreen-button';
		var FULLSCREEN_DIVIDER_CLASS = 'emp-divider-fullscreen';
		
		var Controls = Backbone.View.extend({
			className: 'emp-controls',
			model: AppModel.video,
			seekBar: null,
			muted: false,
			mutedVolume: 0,
			showFullscreen: false,
			showPlaybackRate: false,

			events: {
				'click .emp-play-pause-button': 'onPlayPauseClick',
				'click .emp-volume-button': 'onVolumeButtonClick',
				'click .emp-fullscreen-button': 'onFullscreenButtonClick',
				'mousedown .emp-volume-slider': 'onVolumeSliderMouseDown',
				'mousedown .emp-playback-rate-slider': 'onPlaybackRateSliderMouseDown'
			},

			initialize: function (options) {
				this.showFullscreen = options.showFullscreen;
				this.showPlaybackRate = options.showPlaybackRate;
				
				_.bindAll(this, 'onVolumeSliderMouseMove');
				_.bindAll(this, 'onVolumeSliderMouseUp');
				_.bindAll(this, 'onPlaybackRateSliderMouseMove');
				_.bindAll(this, 'onPlaybackRateSliderMouseUp');
				
				this.model.bind('change:formattedDuration', this.onDurationChange, this);
				this.model.bind('change:paused', this.onPausedChange, this);
				this.model.bind('change:formattedTime', this.onCurrentTimeChange, this);
				this.model.bind('change:volume', this.onVolumeChange, this);
				this.model.bind('change:playbackRate', this.onPlaybackRateChange, this);
				
				// Conditionally bind to fullscreen events
				if (this.showFullscreen === true) {
					_.bindAll(this, 'onFullscreenChange');
					
					$(document).bind('webkitfullscreenchange', this.onFullscreenChange);
					$(document).bind('mozfullscreenchange', this.onFullscreenChange);
				}
				
				this.create(options.$video);
			},
			
			create: function ($video) {
				// Create the controls element and insert it into the DOM
				var controlsEl = this.make('div', {'class': this.className});
				$video.after(controlsEl);
				
				this.setElement(controlsEl);
				this.render();
				
				// Adjust the width of the controls to the width of the video
				this.$el.width(AppModel.video.get('width'));
				
				// Create the seek bar
				this.seekBar = new SeekBar();
				this.seekBar.render();
				
				// Conditionally hide controls
				if (this.showFullscreen === false) {
					$('.' + FULLSCREEN_BUTTON_CLASS).css('display', 'none');
					$('.' + FULLSCREEN_DIVIDER_CLASS).css('display', 'none');
				}
				
				if (this.showPlaybackRate === false) {
					$('.' + PLAYBACK_RATE_CONTAINER_CLASS).css('display', 'none');
					$('.' + PLAYBACK_RATE_DIVIDER_CLASS).css('display', 'none');
				}
			},
			
			render: function () {
				this.$el.html(_.template(template, AppModel.video.toJSON()));
				
				this.onVolumeChange();
				this.onPlaybackRateChange();
				
				return this;
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
				
				this.trigger('setVolume', clickPct);
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
				
				this.trigger('setPlaybackRate', clickPlaybackRate);
			},
			
			onPlayPauseClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				this.trigger('playPause');
			},
			
			onVolumeButtonClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				if (this.muted === true) {
					if (this.mutedVolume > 0) {
						this.trigger('setVolume', this.mutedVolume);
					} else {
						this.trigger('setVolume', 1);
					}
					
					this.muted = false;
					this.mutedVolume = 0;
				} else {
					this.muted = true;
					this.mutedVolume = AppModel.video.get('volume');
					
					this.trigger('setVolume', 0);
				}
			},
			
			onFullscreenButtonClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				var $video = $('#' + AppModel.config.get('videoID'));
				
				if (document.webkitIsFullScreen === true || 
					document.mozFullScreen === true || 
					document.fullScreen === true) {
					// If we are already in fullscreen, cancel fullscreen
					if (typeof(document.cancelFullScreen) === 'function') {
						document.cancelFullScreen();
					} else if (typeof(document.exitFullscreen) === 'function') {
						document.exitFullscreen();
					} else if (typeof(document.mozCancelFullScreen) === 'function') {
						document.mozCancelFullScreen();
					} else if (typeof(document.webkitCancelFullScreen) === 'function') {
						document.webkitCancelFullScreen();
					}
				} else {
					// Wrap the controls and video in a div that we can request fullscreen with
					this.$el.wrap(this.make('div', {'class': FULLSCREEN_WRAPPER_CLASS}));

					var $wrapper = $('.' + FULLSCREEN_WRAPPER_CLASS);
					var wrapper = $wrapper.get(0);

					$wrapper.prepend($video);

					if (wrapper.requestFullScreen) {
						wrapper.requestFullScreen();
					} else if (wrapper.requestFullscreen) {
						wrapper.requestFullscreen();
					} else if (wrapper.mozRequestFullScreen) {
						wrapper.mozRequestFullScreen();
					} else if (wrapper.webkitRequestFullScreen) {
						wrapper.webkitRequestFullScreen();
					}
				}
			},
			
			onFullscreenChange: function () {
				var $video = $('#' + AppModel.config.get('videoID'));
				
				if (document.webkitIsFullScreen === true || 
					document.mozFullScreen === true || 
					document.fullScreen === true) {
					this.$el.addClass(FULLSCREEN_CONTROLS_CLASS);
					this.$el.css('width', '100%');
					$video.addClass(FULLSCREEN_VIDEO_CLASS);
				} else {
					// Remove the fullscreen wrapper
					this.$el.unwrap();
					
					this.$el.removeClass(FULLSCREEN_CONTROLS_CLASS);
					this.$el.css('width', AppModel.video.get('width'));
					$video.removeClass(FULLSCREEN_VIDEO_CLASS);
				}
				
				// Re-render the seekbar since the controls width has changed
				this.seekBar.render();
				
				// Going fullscreen may pause the video unintentionally
				this.trigger('sync');
			},
			
			onVolumeSliderMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).bind('mousemove', this.onVolumeSliderMouseMove);
				$(document).bind('mouseup', this.onVolumeSliderMouseUp);
				
				$('.' + VOLUME_CONTAINER_CLASS).addClass(ACTIVE_SLIDER_CLASS);
					
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
				
				$('.' + VOLUME_CONTAINER_CLASS).removeClass(ACTIVE_SLIDER_CLASS);
					
				this.setVolume(event.pageX);
			},
			
			onPlaybackRateSliderMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).bind('mousemove', this.onPlaybackRateSliderMouseMove);
				$(document).bind('mouseup', this.onPlaybackRateSliderMouseUp);
				
				$('.' + PLAYBACK_RATE_CONTAINER_CLASS).addClass(ACTIVE_SLIDER_CLASS);
					
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
				
				$('.' + PLAYBACK_RATE_CONTAINER_CLASS).removeClass(ACTIVE_SLIDER_CLASS);
				
				this.trigger('setPlaybackRate', 1);
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
				// Update the current time value
				$('.' + CURRENT_TIME_CLASS).html(AppModel.video.get('formattedTime'));
			},
			
			onDurationChange: function () {
				// Update the duration value
				$('.' + DURATION_CLASS).html(AppModel.video.get('formattedDuration'));
			},
			
			onVolumeChange: function () {
				var $volumeButton = $('.' + VOLUME_BUTTON_CLASS);
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
					$volumeButton.removeClass(VOLUME_BUTTON_LOW_CLASS);
					$volumeButton.removeClass(VOLUME_BUTTON_OFF_CLASS);
				} else if (volume < .5 && volume > 0) {
					this.muted = false;
					$volumeButton.addClass(VOLUME_BUTTON_LOW_CLASS);
					$volumeButton.removeClass(VOLUME_BUTTON_OFF_CLASS);
				} else {
					this.muted = true;
					$volumeButton.addClass(VOLUME_BUTTON_OFF_CLASS);
					$volumeButton.removeClass(VOLUME_BUTTON_LOW_CLASS);
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
		
		return Controls;
    }
);