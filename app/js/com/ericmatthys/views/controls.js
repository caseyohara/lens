define(
	[
		'backbone',
		'com/ericmatthys/Config',
		'text!templates/controls.html'
	],
	
    function (Backbone, Config, template) {
		console.log('controls');
		
		var Controls = Backbone.View.extend({
			idName: Config.getVideoID() + '-controls',

			events: {
				'click .emp-play-pause': 'onPlayPauseClick',
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
			viewConstructor: Controls,
			
			create: function () {
				var view = new Controls();
				
				// Create the controls element and insert it into the DOM
				var controlsEl = view.make('div', {'id': view.className});
				$('#' + Config.getVideoID()).after(controlsEl);
				
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