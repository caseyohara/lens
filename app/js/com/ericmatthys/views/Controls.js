define(
	[
		'backbone',
		'com/ericmatthys/views/SeekBar',
		'com/ericmatthys/views/Slider',
		'text!templates/controls.html'
	],
	
	function (Backbone, SeekBar, Slider, template) {
		//---------- Constants ----------
		var OVERLAY_CONTROLS_CLASS = 'lens-controls-overlay';
		var COLLAPSED_CONTROLS_CLASS = 'lens-controls-collapsed';
		
		var PLAY_PAUSE_CLASS = 'lens-play-pause-button';
		var PAUSE_CLASS = 'lens-pause-button';
		
		var CURRENT_TIME_CLASS = 'lens-current-time';
		var DURATION_CLASS = 'lens-duration';
		
		var SEEK_BAR_CLASS = 'lens-seek-bar';
		
		var SLIDER_BUTTON_CLASS = 'lens-slider-button'
		
		var VOLUME_CLASS = 'lens-volume';
		var VOLUME_DIVIDER_CLASS = 'lens-divider-volume';
		var VOLUME_BUTTON_LOW_CLASS = 'lens-volume-button-low';
		var VOLUME_BUTTON_OFF_CLASS = 'lens-volume-button-off';
		
		var PLAYBACK_RATE_CLASS = 'lens-playback-rate';
		var PLAYBACK_RATE_DIVIDER_CLASS = 'lens-divider-playback-rate';
		var PLAYBACK_RATE_BUTTON_POINT1X_CLASS = 'lens-playback-rate-button-point1x';
		var PLAYBACK_RATE_BUTTON_POINT5X_CLASS = 'lens-playback-rate-button-point5x';
		var PLAYBACK_RATE_BUTTON_1X_CLASS = 'lens-playback-rate-button-1x';
		var PLAYBACK_RATE_BUTTON_2X_CLASS = 'lens-playback-rate-button-2x';
		var PLAYBACK_RATE_BUTTON_3X_CLASS = 'lens-playback-rate-button-3x';
		
		var FULLSCREEN_BUTTON_CLASS = 'lens-fullscreen-button';
		var FULLSCREEN_DIVIDER_CLASS = 'lens-divider-fullscreen';
		
		var Controls = Backbone.View.extend({
			
			//---------- Properties ----------
			className: 'lens-controls',
			config: null,
			video: null,
			seekBar: null,
			volumeSlider: null,
			playbackRateSlider: null,
			muted: false,
			mutedVolume: 0,
			overlay: false,
			showVolume: false,
			showFullscreen: false,
			showPlaybackRate: false,
			hideControlsTimeout: null,

			events: {
				'click .lens-play-pause-button': 'onPlayPauseClick',
				'click .lens-fullscreen-button': 'onFullscreenButtonClick'
			},
			
			//---------- Init ----------
			initialize: function (options) {
				this.config = options.config;
				this.video = options.video;
				this.overlay = options.overlay;
				this.showVolume = options.showVolume;
				this.showFullscreen = options.showFullscreen;
				this.showPlaybackRate = options.showPlaybackRate;
				
				_.bindAll(this, 'onDocumentMouseMove', 'showControls', 'hideControls');
				
				this.model = this.video;
				this.model.bind('change:formattedDuration', this.onDurationChange, this);
				this.model.bind('change:paused', this.onPausedChange, this);
				this.model.bind('change:formattedTime', this.onCurrentTimeChange, this);
				this.model.bind('change:volume', this.onVolumeChange, this);
				this.model.bind('change:playbackRate', this.onPlaybackRateChange, this);
				this.model.bind('change:fullscreen', this.onFullscreenChange, this);
				
				this.create(options);
			},
			
			create: function (options) {
				// Create the controls element and insert it into the DOM
				var $video = $('#' + this.config.get('videoID'));
				var controlsEl = this.make('div', {'class': this.className});
				$video.after(controlsEl);
				
				this.setElement(controlsEl);
				this.render();
				
				// Create the seek bar
				this.seekBar = new SeekBar(options);
				this.seekBar.setElement(this.$el.find('.' + SEEK_BAR_CLASS));
				this.seekBar.render();
				
				// Create the volume slider
				this.volumeSlider = new Slider();
				this.volumeSlider.setElement(this.$el.find('.' + VOLUME_CLASS));
				this.volumeSlider.render();
				
				// Create the playback rate slider
				this.playbackRateSlider = new Slider();
				this.playbackRateSlider.setElement(this.$el.find('.' + PLAYBACK_RATE_CLASS));
				this.playbackRateSlider.render();
				
				// Adjust the sliders to their current values immediately
				this.onVolumeChange();
				this.onPlaybackRateChange();
				
				// Bind to custom events from the slider control
				this.volumeSlider.on('buttonClick', this.onVolumeSliderButtonClick, this);
				this.volumeSlider.on('valueChange', this.onVolumeSliderValueChange, this);
				this.playbackRateSlider.on('buttonClick', this.onPlaybackRateSliderButtonClick, this);
				this.playbackRateSlider.on('valueChange', this.onPlaybackRateSliderValueChange, this);
				this.playbackRateSlider.on('release', this.onPlaybackRateSliderRelease, this);
				
				// Conditionally add the overlay controls class
				if (this.overlay === true) {
					this.$el.addClass(OVERLAY_CONTROLS_CLASS);
					
					// Hide the controls on mouse inactivity
					$(document).on('mousemove', this.onDocumentMouseMove);

					// Start the setTimeout immediately
					this.onDocumentMouseMove();
				}
				
				// Conditionally hide controls
				if (this.showVolume === false) {
					this.$el.find('.' + VOLUME_CLASS).css('display', 'none');
					this.$el.find('.' + VOLUME_DIVIDER_CLASS).css('display', 'none');
				}
				
				if (this.showFullscreen === false) {
					this.$el.find('.' + FULLSCREEN_BUTTON_CLASS).css('display', 'none');
					this.$el.find('.' + FULLSCREEN_DIVIDER_CLASS).css('display', 'none');
				}
				
				if (this.showPlaybackRate === false) {
					this.$el.find('.' + PLAYBACK_RATE_CLASS).css('display', 'none');
					this.$el.find('.' + PLAYBACK_RATE_DIVIDER_CLASS).css('display', 'none');
				}	
			},
			
			//---------- Control ----------
			render: function () {
				this.$el.html(_.template(template, this.video.toJSON()));
				
				return this;
			},

			showControls: function() {
				clearTimeout(this.hideControlsTimeout);
				this.$el.removeClass(COLLAPSED_CONTROLS_CLASS);
			},

			hideControls: function() {
				this.$el.addClass(COLLAPSED_CONTROLS_CLASS);
			},
			
			//---------- Listeners ----------
			onPlayPauseClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				this.trigger('playPause');
			},
			
			onFullscreenButtonClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				if (this.video.isFullscreen() === true) {
					if (this.overlay === false) {
						this.$el.removeClass(OVERLAY_CONTROLS_CLASS);
					}
					
					this.trigger('exitFullscreen');
				} else {
					this.$el.addClass(OVERLAY_CONTROLS_CLASS);
					
					this.trigger('enterFullscreen');
				}
			},
			
			onFullscreenChange: function () {
				if (this.overlay === false) {
					if (this.video.isFullscreen() === true) {
						// Hide the controls on mouse inactivity
						$(document).on('mousemove', this.onDocumentMouseMove);
						
						// Start the setTimeout immediately
						this.onDocumentMouseMove();
						
						this.$el.addClass(OVERLAY_CONTROLS_CLASS);
					} else {
						$(document).off('mousemove', this.onDocumentMouseMove);
					
						// Make sure the controls are visible again
						this.showControls();
						
						this.$el.removeClass(OVERLAY_CONTROLS_CLASS);
					}
				}
				
				// Re-render the seekbar since the controls width has changed
				this.seekBar.render();
				
				// Going fullscreen may pause the video unintentionally
				this.trigger('sync');
			},
			
			onDocumentMouseMove: function() {
				this.showControls();
				
				// If there is no mouse movement for 3 seconds, hide the controls
				this.hideControlsTimeout = setTimeout( this.hideControls, 3000 );
			},
			
			onPausedChange: function () {
				// Update the play/pause button
				var paused = this.video.get('paused');
				
				if (paused) {
					this.$el.find('.' + PLAY_PAUSE_CLASS).removeClass(PAUSE_CLASS);
				} else {
					this.$el.find('.' + PLAY_PAUSE_CLASS).addClass(PAUSE_CLASS);
				}
			},
			
			onCurrentTimeChange: function () {
				// Update the current time value
				this.$el.find('.' + CURRENT_TIME_CLASS).html(this.video.get('formattedTime'));
			},
			
			onDurationChange: function () {
				// Update the duration value
				this.$el.find('.' + DURATION_CLASS).html(this.video.get('formattedDuration'));
			},
			
			onVolumeChange: function () {
				var $volumeButton = this.$el.find('.' + VOLUME_CLASS + ' .' + SLIDER_BUTTON_CLASS);
				var volume = this.video.get('volume');
				
				// Update the slider
				this.volumeSlider.setValue(volume);
				
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
				var $playbackRateButton = this.$el.find('.' + PLAYBACK_RATE_CLASS + ' .' + SLIDER_BUTTON_CLASS);
				var playbackRate = this.video.get('playbackRate');
				
				// Update the slider
				this.playbackRateSlider.setValue(playbackRate / 3);
				
				// Update the playback rate button
				if (playbackRate > 2.5) {
					$playbackRateButton.addClass(PLAYBACK_RATE_BUTTON_3X_CLASS);
					
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT5X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_2X_CLASS);
				} else if (playbackRate > 1.5) {
					$playbackRateButton.addClass(PLAYBACK_RATE_BUTTON_2X_CLASS);
					
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT5X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_3X_CLASS);
				} else if (playbackRate > .8) {
					$playbackRateButton.addClass(PLAYBACK_RATE_BUTTON_1X_CLASS);
					
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT5X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_2X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_3X_CLASS);
				} else if (playbackRate > .2) {
					$playbackRateButton.addClass(PLAYBACK_RATE_BUTTON_POINT5X_CLASS);
					
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_2X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_3X_CLASS);
				} else {
					$playbackRateButton.addClass(PLAYBACK_RATE_BUTTON_POINT1X_CLASS);
					
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_POINT5X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_1X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_2X_CLASS);
					$playbackRateButton.removeClass(PLAYBACK_RATE_BUTTON_3X_CLASS);
				}
			},
			
			onVolumeSliderButtonClick: function () {
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
					this.mutedVolume = this.video.get('volume');
					
					this.trigger('setVolume', 0);
				}
			},
			
			onVolumeSliderValueChange: function (value) {
				this.trigger('setVolume', value);
			},
			
			onPlaybackRateSliderButtonClick: function () {
				var playbackRate = this.video.get('playbackRate');
				
				if (playbackRate < .1) {
					this.trigger('setPlaybackRate', .1);
				} else if (playbackRate < .5) {
					this.trigger('setPlaybackRate', .5);
				} else if (playbackRate < 1) {
					this.trigger('setPlaybackRate', 1);
				} else if (playbackRate < 2) {
					this.trigger('setPlaybackRate', 2);
				} else if (playbackRate < 3) {
					this.trigger('setPlaybackRate', 3);
				} else if (playbackRate >= 3) {
					this.trigger('setPlaybackRate', .1);
				}
			},
			
			onPlaybackRateSliderValueChange: function (value) {
				if (value < .033) {
					value = .033;
				}
				
				// Adjust to constain between .1 and 3
				this.trigger('setPlaybackRate', value * 3);
			},
			
			onPlaybackRateSliderRelease: function () {
				// Reset the playback rate to 1 on release
				this.trigger('setPlaybackRate', 1);
			}
		});
		
		return Controls;
	}
);