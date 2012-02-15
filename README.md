# EM Player - HTML5 video using Backbone and RequireJS

EM Player provides the base architecture for an HTML5 video player that can be easily skinned.

# Usage

A video tag with the correct id is all that is needed by the default player.

``` html
<video id="emp-video" width="800" height="480" poster="http://media.w3.org/2010/05/sintel/poster.png">
	<source src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
	<source src="http://media.w3.org/2010/05/sintel/trailer.webm" />
</video>
```

# Configuration Options:

Although not required to use the default player, an *empConfig* object can be used to set configuration options on the player.

Defaults:

``` js
var empConfig = {
	videoID: 'emp-video',
	overlayControls: false,
	showVolume: true,
	showFullscreen: true,
	showPlaybackRate: true
};
```