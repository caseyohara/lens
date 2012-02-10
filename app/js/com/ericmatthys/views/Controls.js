define(
	[
		'backbone',
		'com/ericmatthys/Config',
		'com/ericmatthys/models/AppModel',
		'com/ericmatthys/views/Container',
		'text!templates/controls.html'
	],
	
    function (Backbone, Config, AppModel, Container, template) {
		var PLAY_PAUSE_CLASS = 'emp-play-pause';
		var SEEK_BAR_CLASS = 'emp-seek-bar';
		var PROGRESS_BAR_CLASS = 'emp-progress-bar';
		var PROGRESS_THUMB_CLASS = 'emp-progress-thumb';
	
		var view;
		
		var Controls = Backbone.View.extend({
			className: 'emp-controls',
			model: AppModel.video,
			seeking: false,

			events: {
				'click .emp-play-pause': 'onPlayPauseClick',
				'mousedown .emp-seek-bar': 'onSeekBarMouseDown',
				'mousemove .emp-seek-bar': 'onSeekBarMouseMove',
				'mouseup .emp-seek-bar': 'onSeekBarMouseUp'
			},

			initialize: function () {
				_.bindAll(this, 'onCurrentTimeChange');
				this.model.bind('change', this.onCurrentTimeChange);
			},
			
			render: function () {
				this.$el.html(_.template(template, AppModel.video.toJSON()));
				return this;
			},
			
			seek: function (x) {
				var clickX = x - this.el.offsetLeft;
				var clickPct = clickX / this.$el.width();
				var clickTime = clickPct * AppModel.video.get('duration');

				Container.seek(clickTime);
			},
			
			onPlayPauseClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				Container.playPause();
			},
			
			onSeekBarMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				this.seeking = true;
				this.seek(event.pageX);
			},

			onSeekBarMouseMove: function (event) {
				if (this.seeking === true) {
					// Prevent the click from trying to select
					event.preventDefault();
					
					this.seek(event.pageX);
				}
			},
			
			onSeekBarMouseUp: function (event) {
				if (this.seeking === true) {
					// Prevent the click from trying to select
					event.preventDefault();
					
					this.seeking = false;
					this.seek(event.pageX);
				}
			},
			
			onCurrentTimeChange: function () {
				// Render the view to update the time values
				this.render();
				
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