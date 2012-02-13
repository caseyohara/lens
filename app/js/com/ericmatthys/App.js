define(
	[
		'com/ericmatthys/views/Container',
		'com/ericmatthys/views/Controls'
	],
	
    function (Container, Controls) {
		return {
			initialize: function () {
				Container.initialize();
				Controls.initialize();
			}
		}
    }
);