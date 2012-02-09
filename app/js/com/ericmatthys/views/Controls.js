define(
	[
		'backbone',
		'com/ericmatthys/Config',
		'com/ericmatthys/models/AppModel',
		'com/ericmatthys/views/Container',
		'text!templates/controls.html'
	],
	
    function (Backbone, Config, AppModel, Container, template) {
		var view;
		
		var Controls = Backbone.View.extend({
			className: 'emp-controls',
			
			model: AppModel.video,

			events: {
				'click .emp-play-pause': 'onPlayPauseClick',
			},

			initialize: function () {
				_.bindAll(this, 'onCurrentTimeChange');
				this.model.bind('change:currentTime', this.onCurrentTimeChange);
			},
			
			render: function () {
				this.$el.html(_.template(template, AppModel.video.toJSON()));
				return this;
			},
			
			onPlayPauseClick: function () {
				Container.playPause();
			},
			
			onCurrentTimeChange: function () {
				this.render();
				
				var barWidth = $('.emp-seekbar').width();
				var pct = AppModel.video.get('currentTime') / AppModel.video.get('duration');
				
				console.log(pct);
				$('.emp-progress').width(barWidth * pct);
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