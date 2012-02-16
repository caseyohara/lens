define(
	[
		'com/ericmatthys/Player'
	],
	
	function (Player) {
		return {
			players: [],
			
			initialize: function () {
				// Determine whether to automatically initialize the player
				if (typeof(window.lensConfig) !== 'undefined') {
					var c = window.lensConfig;

					if (c.manual !== true) {
					 	if (typeof(c.videoID) === 'undefined') {
							this.initializeAllPlayers(c);
						} else {
							this.initializePlayer(c);
						}
					}
				} else {
					this.initializeAllPlayers();
				}
			},
			
			initializeAllPlayers: function (config) {
				config = config || {};
				
				// Capture this so we can directly access it in the each function
				var Lens = this;
				
				// Initialize a player for each video tag
				$('video').each(function () {
					var clonedConfig = _.clone(config);
					clonedConfig.$video = $(this);
					
					Lens.initializePlayer(clonedConfig);
				});
			},
			
			initializePlayer: function (config) {
				this.players.push(new Player(config));
			}
		};
    }
);