define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Config = Backbone.Model.extend({
			defaults: {
				videoID: 'lens-video',
				overlayControls: false,
				hideVolume: false,
				hidePlaybackRate: false,
				hideFullscreen: false
			},
			
			initialize: function (options) {
				if (typeof(options) === 'undefined') {
					return;
				}
				
				// Set the config options if available
				if (typeof(options.videoID) !== 'undefined') {
					this.set({ 'videoID': options.videoID });
				}
        	    
				if (typeof(options.overlayControls) !== 'undefined') {
					this.set({ 'overlayControls': options.overlayControls });
				}
				
				if (typeof(options.hideVolume) !== 'undefined') {
					this.set({ 'hideVolume': options.hideVolume });
				}
				
				if (typeof(options.hidePlaybackRate) !== 'undefined') {
					this.set({ 'hidePlaybackRate': options.hidePlaybackRate });
				}
				
				if (typeof(options.hideFullscreen) !== 'undefined') {
					this.set({ 'hideFullscreen': options.hideFullscreen });
				}
			}
		});
		
		return Config;
	}
);