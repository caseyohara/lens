define(
	[
	'backbone'
	],
	
	function (Backbone) {
		var Config = Backbone.Model.extend({
			defaults: {
				$video: undefined,
				videoID: undefined,
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
				if (typeof(options.$video) !== 'undefined') {
					this.set({'$video': options.$video});
				}
				
				// Set the config options if available
				if (typeof(options.videoID) !== 'undefined') {
					this.set({'videoID': options.videoID});
					this.set({'$video': $('#' + options.videoID)});
				}
        	    
				if (typeof(options.overlayControls) !== 'undefined') {
					this.set({'overlayControls': options.overlayControls});
				}
				
				if (typeof(options.hideVolume) !== 'undefined') {
					this.set({'hideVolume': options.hideVolume});
				}
				
				if (typeof(options.hidePlaybackRate) !== 'undefined') {
					this.set({'hidePlaybackRate': options.hidePlaybackRate});
				}
				
				if (typeof(options.hideFullscreen) !== 'undefined') {
					this.set({'hideFullscreen': options.hideFullscreen});
				}
			}
		});
		
		return Config;
	}
);