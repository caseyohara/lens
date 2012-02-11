define(["backbone","com/ericmatthys/Config","com/ericmatthys/models/AppModel"],function(a,b,c){var d,e=a.View.extend({idName:b.getVideoID(),events:{loadedmetadata:"onLoadedMetadata",progress:"onProgress",timeupdate:"onTimeUpdate",ended:"onEnded"},onLoadedMetadata:function(){var a=this.el.duration,b=c.video.secondsToHms(a),d=this.el.currentTime,e=c.video.secondsToHms(d);c.video.set({duration:a,formattedDuration:b,currentTime:d,formattedTime:e,volume:this.el.volume,playbackRate:this.el.playbackRate})},onProgress:function(){if(typeof this.el.buffered!="undefined"){var a=this.el.buffered;if(a.length>0){var b=a.start(0),d=a.end(0);c.video.set({startBuffer:b,endBuffer:d})}}},onTimeUpdate:function(){var a=this.el.currentTime,b=c.video.secondsToHms(a);c.video.set({currentTime:a}),c.video.set({formattedTime:b})},onEnded:function(){c.video.set({paused:!0}),this.el.pause()}});return{viewConstructor:e,initialize:function(){return d=new e,d.setElement($("#"+d.idName)),d.el.duration>0&&(console.log("metadata already loaded"),d.onLoadedMetadata()),d},playPause:function(){var a=d.el;a.paused===!0?(a.ended===!0&&(d.el.currentTime=0),console.log("play"),c.video.set({paused:!1}),a.play()):(console.log("pause"),c.video.set({paused:!0}),a.pause())},sync:function(){console.log("sync");var a=d.el,b=c.video.get("paused");console.log(b+" !== "+a.paused),b!==a.paused&&this.playPause()},seek:function(a){d.el.currentTime=a},setVolume:function(a){c.video.set({volume:a}),d.el.volume=a},setPlaybackRate:function(a){c.video.set({playbackRate:a}),d.el.playbackRate=a},supportsPlaybackRate:function(){return typeof d.el.playbackRate!="undefined"},supportsFullscreen:function(){return typeof document.webkitCancelFullScreen=="function"||typeof document.mozCancelFullScreen=="function"||typeof document.cancelFullScreen=="function"||typeof document.exitFullscreen=="function"?!0:!1}}})