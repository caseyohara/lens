# EM Player - A base HTML5 video player using Backbone and RequireJS

EM Player provides the base architecture for an HTML5 video player that can be easily skinned.

# Configuration Options:

Although not required to use the default player, an empConfig object can be used to set configuration options on the player.

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