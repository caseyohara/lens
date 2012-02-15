define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Config = Backbone.Model.extend({
			defaults: {
				videoID: 'emp-video',
				overlayControls: false,
				showVolume: true,
				showPlaybackRate: true,
				showFullscreen: true
			},
			
			initialize: function () {
			    // Set the config options if available
        		if (typeof(window.empConfig) !== 'undefined') {
        			var c = window.empConfig;
        		    
					if (typeof(c.videoID) !== 'undefined') {
						this.set({ 'videoID': c.videoID });
					}
        		    
					if (typeof(c.overlayControls) !== 'undefined') {
						this.set({ 'overlayControls': c.overlayControls });
					}
					
					if (typeof(c.showVolume) !== 'undefined') {
						this.set({ 'showVolume': c.showVolume });
					}
					
					if (typeof(c.showPlaybackRate) !== 'undefined') {
						this.set({ 'showPlaybackRate': c.showPlaybackRate });
					}
					
					if (typeof(c.showFullscreen) !== 'undefined') {
						this.set({ 'showFullscreen': c.showFullscreen });
					}
				}
			}
		});
		
		return Config;
	}
);