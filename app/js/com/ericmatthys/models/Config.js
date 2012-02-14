define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Config = Backbone.Model.extend({
			defaults: {
				videoID: 'emp-video',
				autoPlay: false
			},
			
			initialize: function () {
			    // Set the config options if available
        		if (typeof(window.empConfig) !== 'undefined') {
        		    var c = window.empConfig;
        		    
        		    this.set({
        		        'videoID': c.videoID,
        		        'autoPlay': c.autoPlay
        		    });
        		}
			}
		});
		
		return Config;
	}
);