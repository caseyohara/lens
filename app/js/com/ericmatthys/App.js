define(
	[
		'com/ericmatthys/Config',
		'com/ericmatthys/views/Container',
		'com/ericmatthys/views/Controls'
	],
	
    function (Config, Container, Controls) {
		return {
			initialize: function () {
				Container.initialize();
				Controls.initialize();
			}
		}
    }
);