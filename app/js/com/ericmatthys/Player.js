define(
	[
		'com/ericmatthys/models/Config',
		'com/ericmatthys/models/Video',
		'com/ericmatthys/views/Container',
		'com/ericmatthys/views/Controls'
	],
	
	function (Config, Video, Container, Controls) {
		var Player = function (config) {
			this.config = new Config(config);
			this.video = new Video();
			
			this.container = new Container({
				config: this.config,
				video: this.video
			});
			
			this.controls = new Controls({
				video: this.video,
				$video: this.config.get('$video'),
				overlay: this.config.get('overlayControls'),
				hideVolume: this.config.get('hideVolume'),
				hideFullscreen: (this.container.supportsFullscreen() === false || this.config.get('hideFullscreen') === true),
				hidePlaybackRate: (this.container.supportsPlaybackRate() === false || this.config.get('hidePlaybackRate') === true)
			});
			
			// Route control events to the container
			this.controls.on('playPause', this.container.playPause, this.container);
			this.controls.on('sync', this.container.sync, this.container);
			this.controls.on('seek', this.container.seek, this.container);
			this.controls.on('setVolume', this.container.setVolume, this.container);
			this.controls.on('setPlaybackRate', this.container.setPlaybackRate, this.container);
			this.controls.on('enterFullscreen', this.container.enterFullscreen, this.container);
			this.controls.on('exitFullscreen', this.container.exitFullscreen, this.container);
		};
		
		return Player;
    }
);