define(
	[
		'com/ericmatthys/models/AppModel',
		'com/ericmatthys/views/Container',
		'com/ericmatthys/views/Controls'
	],
	
    function (AppModel, Container, Controls) {
        var container;
        var controls;
        
		return {
			initialize: function () {
			    container = new Container();
				
				controls = new Controls({
					showFullscreen: container.supportsFullscreen(),
					showPlaybackRate: container.supportsPlaybackRate()
				});
				
				// Create the controls element and insert it into the DOM
				var controlsEl = controls.make('div', {'class': controls.className});
				container.$el.after(controlsEl);
				
				controls.setElement(controlsEl);
				
				// Set the width of the controls to the width of the video
				controls.width = container.$el.width();
				controls.$el.width(controls.width);
				
				controls.render();
				
				controls.on('playPause', container.playPause, container);
				controls.on('sync', container.sync, container);
				controls.on('seek', container.seek, container);
				controls.on('setVolume', container.setVolume, container);
				controls.on('setPlaybackRate', container.setPlaybackRate, container);
			}
		}
    }
);