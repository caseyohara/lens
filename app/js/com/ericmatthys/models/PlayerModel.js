define(
	[
	'com/ericmatthys/models/Config',
	'com/ericmatthys/models/Video'
	],
	
	function (Config, Video) {
		return {
		    config: new Config(),
			video: new Video()
		};
	}
);