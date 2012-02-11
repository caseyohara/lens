define(["backbone","com/ericmatthys/models/AppModel","com/ericmatthys/views/Container","text!templates/seekbar.html"],function(a,b,c,d){var e="emp-seek-bar",f="emp-buffer-bar",g="emp-progress-bar",h="emp-progress-thumb",i=a.View.extend({className:"emp-seek-bar",model:b.video,events:{mousedown:"onSeekBarMouseDown"},initialize:function(){_.bindAll(this,"onSeekBarMouseMove"),_.bindAll(this,"onSeekBarMouseUp"),_.bindAll(this,"onCurrentTimeChange"),_.bindAll(this,"onBufferChange"),this.model.bind("change:formattedTime",this.onCurrentTimeChange),this.model.bind("change:startBuffer",this.onBufferChange),this.model.bind("change:endBuffer",this.onBufferChange)},render:function(){return this.$el.html(_.template(d,{})),this.onCurrentTimeChange(),this.onBufferChange(),this},seek:function(a){var d=$("."+e),f=a-d.offset().left,g=f/d.width(),h=g*b.video.get("duration");c.seek(h)},onSeekBarMouseDown:function(a){a.preventDefault(),$(document).bind("mousemove",this.onSeekBarMouseMove),$(document).bind("mouseup",this.onSeekBarMouseUp),this.seek(a.pageX)},onSeekBarMouseMove:function(a){a.preventDefault(),this.seek(a.pageX)},onSeekBarMouseUp:function(a){a.preventDefault(),$(document).unbind("mousemove",this.onSeekBarMouseMove),$(document).unbind("mouseup",this.onSeekBarMouseUp),this.seek(a.pageX)},onCurrentTimeChange:function(){var a=$("."+e).width(),c=b.video.get("currentTime")/b.video.get("duration"),d=c*a;d<4?d=4:d+4>a&&(d=a-4),$("."+g).width(d),$("."+h).css("left",d-4)},onBufferChange:function(){var a=$("."+f),c=$("."+e).width(),d=b.video.get("duration"),g=b.video.get("startBuffer")/d,h=b.video.get("endBuffer")/d,i=g*c,j=h*c-i;a.css("left",i),a.width(j)}});return i})