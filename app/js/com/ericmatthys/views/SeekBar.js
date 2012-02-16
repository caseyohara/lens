define(
	[
		'backbone',
		'text!templates/seekbar.html'
	],
	
	function (Backbone, template) {
		//---------- Constants ----------
		var BUFFER_BAR_CLASS = 'lens-buffer-bar';
		var PROGRESS_BAR_CLASS = 'lens-progress-bar';
		var PROGRESS_THUMB_CLASS = 'lens-progress-thumb';
		
		var SeekBar = Backbone.View.extend({
			
			//---------- Properties ----------
			config: null,
			video: null,

			events: {
				'mousedown': 'onSeekBarMouseDown'
			},
			
			//---------- Init ----------
			initialize: function (options) {
				this.config = options.config;
				this.video = options.video;
				
				_.bindAll(this, 'onSeekBarMouseMove', 'onSeekBarMouseUp');
				
				this.model = this.video;
				this.model.bind('change:formattedTime', this.onCurrentTimeChange, this);
				this.model.bind('change:startBuffer', this.onBufferChange, this);
				this.model.bind('change:endBuffer', this.onBufferChange, this);
			},
			
			//---------- Control ----------
			render: function () {
				this.$el.html(_.template(template, {}));
				
				this.onCurrentTimeChange();
				this.onBufferChange();
				
				return this;
			},
			
			seek: function (x) {
				var clickX = x - this.$el.offset().left;
				var clickPct = clickX / this.$el.width();
				var clickTime = clickPct * this.video.get('duration');

				this.trigger('seek', clickTime);
			},
			
			//---------- Listeners ----------
			onSeekBarMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).on('mousemove', this.onSeekBarMouseMove);
				$(document).on('mouseup', this.onSeekBarMouseUp);
				
				this.seek(event.pageX);
			},

			onSeekBarMouseMove: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				this.seek(event.pageX);
			},
			
			onSeekBarMouseUp: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();

				$(document).off('mousemove', this.onSeekBarMouseMove);
				$(document).off('mouseup', this.onSeekBarMouseUp);
					
				this.seek(event.pageX);
			},
			
			onCurrentTimeChange: function () {
				var $thumb = this.$el.find('.' + PROGRESS_THUMB_CLASS);
				var $bar = this.$el.find('.' + PROGRESS_BAR_CLASS);
				
				// Update the progress bar to reflect the current time
				var trackWidth = this.$el.width();
				var thumbRadius = $thumb.width() / 2;
				var pct = this.video.get('currentTime') / this.video.get('duration');
				var barWidth = pct * trackWidth;
				
				// Constrain the progess bar so the thumb fits in the seek bar
				if (barWidth < thumbRadius) {
					barWidth = thumbRadius;
				} else if (barWidth + thumbRadius > trackWidth) {
					barWidth = trackWidth - thumbRadius;
				}
				
				$thumb.css('left', barWidth - thumbRadius);
				$bar.css('width', barWidth);
			},
			
			onBufferChange: function () {
				// Update the buffer bar to reflect the buffered time range
				var $bufferBar = this.$el.find('.' + BUFFER_BAR_CLASS);
				var seekBarWidth = this.$el.width();
				var duration = this.video.get('duration');
				var startPct = this.video.get('startBuffer') / duration;
				var endPct = this.video.get('endBuffer') / duration;
				var startPosition = startPct * seekBarWidth;
				var width = endPct * seekBarWidth - startPosition;
				
				$bufferBar.css('left', startPosition);
				$bufferBar.css('width', width);
			}
		});
		
		return SeekBar;
	}
);