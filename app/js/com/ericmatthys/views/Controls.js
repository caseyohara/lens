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
	
		var view;
		
		var Controls = Backbone.View.extend({
			className: 'emp-controls',
			
			model: AppModel.video,

			events: {
				'click .emp-play-pause': 'onPlayPauseClick',
				'click .emp-seek-bar': 'onSeekBarClick'
			},

			initialize: function () {
				_.bindAll(this, 'onCurrentTimeChange');
				this.model.bind('change', this.onCurrentTimeChange);
			},
			
			render: function () {
				this.$el.html(_.template(template, AppModel.video.toJSON()));
				return this;
			},
			
			onPlayPauseClick: function () {
				Container.playPause();
			},
			
			onSeekBarClick: function (event) {
				var clickX = event.pageX - this.el.offsetLeft;
				var clickPct = clickX / this.$el.width();
				var clickTime = clickPct * AppModel.video.get('duration');
				
				Container.seek(clickTime);
			},
			
			onCurrentTimeChange: function () {
				// Render the view to update the time values
				this.render();
				
				// Update the progress bar to reflect the current time
				var barWidth = $('.' + SEEK_BAR_CLASS).width();
				var pct = AppModel.video.get('currentTime') / AppModel.video.get('duration');
				
				$('.' + PROGRESS_BAR_CLASS).width(barWidth * pct);
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