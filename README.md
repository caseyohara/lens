# EM Player -- HTML5 video using Backbone and RequireJS

EM Player provides the base architecture for an HTML5 video player that can be easily skinned.

# Usage

Either jQuery or Zepto must be used alongside EM Player. The video wrapper and controls will be injected around the video tag with the correct element id. The default element id is *emp-video*.

In order to reduce HTTP requests and for ease of use, Underscore, Backbone, and RequireJS are packaged into the emplayer.js script.

``` html
<video id="emp-video" width="800" height="480" poster="http://media.w3.org/2010/05/sintel/poster.png">
	<source src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
	<source src="http://media.w3.org/2010/05/sintel/trailer.webm" />
</video>

<script type="text/javascript" src="js/libs/zepto-0.8-min.js"></script>
<script type="text/javascript" src="js/emplayer.js"></script>
```

# Configuration Options:

Although not required to use the default player, an *empConfig* object can be used to set configuration options on the player.

**Defaults**

``` js
var empConfig = {
	videoID: 'emp-video',
	overlayControls: false,
	showVolume: true,
	showFullscreen: true,
	showPlaybackRate: true
};
```