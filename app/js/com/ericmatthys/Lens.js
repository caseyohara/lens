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
						this.initializePlayer(c);
					}
				} else {
					this.initializePlayer();
				}
			},
			
			initializePlayer: function (config) {
				this.players.push(new Player(config));
			}
		};
    }
);