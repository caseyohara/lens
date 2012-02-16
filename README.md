# Lens -- HTML5 video using Backbone and RequireJS

Lens provides the base architecture for an HTML5 video player that can be easily maintained and skinned.

# Usage

Either jQuery or Zepto must be used alongside Lens. The video wrapper and controls will be injected around the video tag with the correct element id.

For ease of use and to reduce HTTP requests, Underscore, Backbone, and RequireJS are packaged into the lens.js script.

**Automatic By Tag**

The default player will initialize for all video tags and does not require any additional JavaScript. All video tags must have an id attribute. Configuration options can be set via a global variable named *lensConfig*.

``` html
<video id="lens-video" width="800" height="480" poster="http://media.w3.org/2010/05/sintel/poster.png">
	<source src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
	<source src="http://media.w3.org/2010/05/sintel/trailer.webm" />
</video>

<script type="text/javascript" src="js/libs/zepto-0.8-min.js"></script>
<script type="text/javascript" src="js/lens.js"></script>
```

**Automatic By ID**

A configuration option can be set to initialize a single player based on the id of the video tag.

``` html
<video id="test-video" width="800" height="480" poster="http://media.w3.org/2010/05/sintel/poster.png">
	<source src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
	<source src="http://media.w3.org/2010/05/sintel/trailer.webm" />
</video>

<script type="text/javascript" src="js/libs/zepto-0.8-min.js"></script>
<script type="text/javascript" src="js/lens.js"></script>

<script type="text/javascript">
var lensConfig = {
	autoByID: true,
	videoID: 'test-video'
};
</script>
```

**Manual**

To initialize multiple players based on the ids of their video tags, players must be initialized manually. A configuration object can then passed as the argument for initializePlayer.

``` js
var lensConfig = {
	manual: true
};

require(['com/ericmatthys/Lens'],
	function (Lens) {
		Lens.initializePlayer({videoID: 'lens-video1'});
		Lens.initializePlayer({videoID: 'lens-video2'});
	}
);
```

# Configuration

Although not required by the default player, a *lensConfig* object can be used to set configuration options on the player.

**Defaults**

``` js
var lensConfig = {
	autoByID: false,
	manual: false,
	videoID: 'lens-video',
	overlayControls: false,
	showVolume: true,
	showFullscreen: true,
	showPlaybackRate: true
};
```