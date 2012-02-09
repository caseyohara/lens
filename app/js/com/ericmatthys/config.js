define(
    function () {
		// Default config options
		var videoID = 'emp-video';
		var autoPlay = false;
		
		// Determine whether to use a global config object
		var useGlobalConfig = true;
		
		if(empConfig.typeof === 'undefined') {
			useGlobalConfig = false;
		}
		
		return {
			getVideoID: function () {
				if(useGlobalConfig === true) {
					return empConfig.videoID;
				}
				else
				{
					return videoID;
				}
			},
			
			getAutoPlay: function () {
				if(useGlobalConfig === true) {
					return empConfig.autoPlay;
				}
				else
				{
					return autoPlay;
				}
			}
		};
    }
);