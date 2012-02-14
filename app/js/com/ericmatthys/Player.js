define(
	[
		'com/ericmatthys/views/Container',
		'com/ericmatthys/views/Controls'
	],
	
    function (Container, Controls) {
        var container;
        var controls;
        
		return {
			initialize: function () {
				container = new Container();
				
				controls = new Controls({
					$video: container.$el,
					showFullscreen: container.supportsFullscreen(),
					showPlaybackRate: container.supportsPlaybackRate()
				});
				
				// Route control events to the container
				controls.on('playPause', container.playPause, container);
				controls.on('sync', container.sync, container);
				controls.on('seek', container.seek, container);
				controls.on('setVolume', container.setVolume, container);
				controls.on('setPlaybackRate', container.setPlaybackRate, container);
				controls.seekBar.on('seek', container.seek, container);
			}
		}
    }
);