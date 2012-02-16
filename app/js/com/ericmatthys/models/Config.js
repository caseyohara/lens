define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Config = Backbone.Model.extend({
			defaults: {
				videoID: 'lens-video',
				overlayControls: false,
				showVolume: true,
				showPlaybackRate: true,
				showFullscreen: true
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
				
				if (typeof(options.showVolume) !== 'undefined') {
					this.set({ 'showVolume': options.showVolume });
				}
				
				if (typeof(options.showPlaybackRate) !== 'undefined') {
					this.set({ 'showPlaybackRate': options.showPlaybackRate });
				}
				
				if (typeof(options.showFullscreen) !== 'undefined') {
					this.set({ 'showFullscreen': options.showFullscreen });
				}
			}
		});
		
		return Config;
	}
);