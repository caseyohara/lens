define(
	[
		'com/ericmatthys/config',
		'com/ericmatthys/views/controls'
	],
	
    function (config, controls) {
		return {
			initialize: function () {
				
			},
			
			ready: function () {
				controls.create();
				
				if( config.getAutoPlay() === true ) {
					controls.play();
				}
			}
		}
    }
);