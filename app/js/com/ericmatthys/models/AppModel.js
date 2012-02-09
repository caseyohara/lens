define(
	[
	'com/ericmatthys/models/Video',
	'com/ericmatthys/models/Playlist'
	],
	
	function (Video, Playlist) {
		return {
			video: new Video(),
			playlist: new Playlist()
		};
	}
);