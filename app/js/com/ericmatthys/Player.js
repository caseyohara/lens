define(
	[
		'com/ericmatthys/models/PlayerModel',
		'com/ericmatthys/views/Container',
		'com/ericmatthys/views/Controls'
	],
	
	function (PlayerModel, Container, Controls) {
		var container;
		var controls;
        
		return {
			initialize: function () {
				container = new Container();
				
				controls = new Controls({
					$video: container.$el,
					overlay: PlayerModel.config.get('overlayControls'),
					showVolume: PlayerModel.config.get('showVolume'),
					showFullscreen: (container.supportsFullscreen() && PlayerModel.config.get('showFullscreen')),
					showPlaybackRate: (container.supportsPlaybackRate() && PlayerModel.config.get('showPlaybackRate'))
				});
				
				// Route control events to the container
				controls.on('playPause', container.playPause, container);
				controls.on('sync', container.sync, container);
				controls.on('seek', container.seek, container);
				controls.on('setVolume', container.setVolume, container);
				controls.on('setPlaybackRate', container.setPlaybackRate, container);
				controls.on('enterFullscreen', container.enterFullscreen, container);
				controls.on('exitFullscreen', container.exitFullscreen, container);
				controls.seekBar.on('seek', container.seek, container);
			}
		}
    }
);