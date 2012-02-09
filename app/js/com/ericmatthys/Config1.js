define(
    function () {
		// Default config options
		var videoID = 'emp-video';
		var autoPlay = false;
		
		// Set the config options if available
		if(typeof(empConfig) !== 'undefined') {
			videoID = empConfig.videoID || videoID;
			autoPlay = empConfig.autoPlay || autoPlay;
		}
		
		return {
			getVideoID: function () {
				return videoID;
			},
			
			getAutoPlay: function () {
				return autoPlay;
			}
		};
    }
);