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
			idName: Config.getVideoID() + '-controls',
			
			model: AppModel.video,

			events: {
				'click .emp-play-pause': 'onPlayPauseClick',
			},

			initialize: function () {
				_.bindAll(this, 'render');
				this.model.bind('change', this.render);
			},
			
			render: function () {
				console.log('rendering');
				this.$el.html(_.template(template, AppModel.video.toJSON()));
				return this;
			},
			
			onPlayPauseClick: function () {
				Container.playPause();
				console.log('onPlayPauseClick');
			}
		});
		
		return {
			viewConstructor: Controls,
			
			initialize: function () {
				view = new Controls();
				
				// Create the controls element and insert it into the DOM
				var controlsEl = view.make('div', {'id': view.idName});
				$('#' + Config.getVideoID()).after(controlsEl);
				
				view.setElement(controlsEl);
				view.render();
				
				return view;
			}
		};
    }
);