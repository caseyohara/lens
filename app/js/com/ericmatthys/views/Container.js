define(
	[
		'backbone',
		'com/ericmatthys/Config'
	],
	
    function (Backbone, Config) {
		console.log('container: ' + Config.getVideoID());
		
		var Container = Backbone.View.extend({
			idName: Config.getVideoID(),

			events: {
			}
		});
		
		return {
			viewConstructor: Container,
			
			play: function () {
				console.log('play');
			},
			
			stop: function () {
				console.log('stop');
			}
		};
    }
);