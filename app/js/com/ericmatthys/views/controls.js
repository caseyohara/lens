define(
	[
		'jquery',
		'backbone',
		'com/ericmatthys/config',
		'text!templates/controls.html'
	],
	
    function ($, Backbone, config, template) {
		console.log('controls');
		
		var ControlsView = Backbone.View.extend({
			className: 'emp-controls',

			events: {
				'click .emp-play-pause': 'onPlayPauseClick',
			},
			
			initialize: function () {
				console.log('initialize');
			},
			
			render: function () {
				this.$el.html(_.template(template, {}));
				return this;
			},
			
			onPlayPauseClick: function () {
				console.log('onPlayPauseClick');
			}
		});
		
		return {
			constructor: ControlsView,
			
			create: function () {
				var view = new ControlsView();
				
				// Create the controls element and insert it into the DOM
				var controlsEl = view.make('div', {'class': view.className});
				$(controlsEl).insertAfter('#' + config.getVideoID());
				
				view.setElement(controlsEl, true);
				view.render();
				
				return view;
			},
			
			play: function () {
				console.log('play');
			}
		};
    }
);