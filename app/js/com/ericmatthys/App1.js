define(
	[
		'com/ericmatthys/Config',
		'com/ericmatthys/views/Container',
		'com/ericmatthys/views/Controls'
	],
	
    function (Config, Container, Controls) {
		return {
			initialize: function () {
				
			},
			
			ready: function () {
				Controls.create();
				
				if( Config.getAutoPlay() === true ) {
					Controls.play();
				}
			}
		}
    }
);