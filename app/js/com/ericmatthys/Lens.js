define(
	[
		'com/ericmatthys/Player'
	],
	
	function (Player) {
		return {
			players: [],
			
			initialize: function () {
				if (typeof(window.lensConfig) !== 'undefined') {
					var c = window.lensConfig;

					if (c.manual === true) {
						console.log('manual mode');
					} else {
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