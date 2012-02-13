define(
	[
		'backbone',
		'com/ericmatthys/models/AppModel',
		'text!templates/seekbar.html'
	],
	
    function (Backbone, AppModel, template) {
		var SEEK_BAR_CLASS = 'emp-seek-bar';
		var BUFFER_BAR_CLASS = 'emp-buffer-bar';
		var PROGRESS_BAR_CLASS = 'emp-progress-bar';
		var PROGRESS_THUMB_CLASS = 'emp-progress-thumb';
		
		var SeekBar = Backbone.View.extend({
			className: 'emp-seek-bar',
			model: AppModel.video,

			events: {
				'mousedown': 'onSeekBarMouseDown'
			},

			initialize: function () {
				_.bindAll(this, 'onSeekBarMouseMove');
				_.bindAll(this, 'onSeekBarMouseUp');
				
				this.model.bind('change:formattedTime', this.onCurrentTimeChange, this);
				this.model.bind('change:startBuffer', this.onBufferChange, this);
				this.model.bind('change:endBuffer', this.onBufferChange, this);
			},
			
			render: function () {
				this.$el.html(_.template(template, {}));
				
				this.onCurrentTimeChange();
				this.onBufferChange();
				
				return this;
			},
			
			seek: function (x) {
				var $seekBar = $('.' + SEEK_BAR_CLASS);
				var clickX = x - $seekBar.offset().left;
				var clickPct = clickX / $seekBar.width();
				var clickTime = clickPct * AppModel.video.get('duration');

				this.trigger('seek', clickTime);
			},
			
			onSeekBarMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).bind('mousemove', this.onSeekBarMouseMove);
				$(document).bind('mouseup', this.onSeekBarMouseUp);
				
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

				$(document).unbind('mousemove', this.onSeekBarMouseMove);
				$(document).unbind('mouseup', this.onSeekBarMouseUp);
					
				this.seek(event.pageX);
			},
			
			onCurrentTimeChange: function () {
				// Update the progress bar to reflect the current time
				var seekBarWidth = $('.' + SEEK_BAR_CLASS).width();
				var pct = AppModel.video.get('currentTime') / AppModel.video.get('duration');
				var progressBarWidth = pct * seekBarWidth;
				
				// Constrain the progess bar so the thumb fits in the seek bar
				if (progressBarWidth < 4) {
					progressBarWidth = 4;
				} else if (progressBarWidth + 4 > seekBarWidth) {
					progressBarWidth = seekBarWidth - 4;
				}
				
				$('.' + PROGRESS_BAR_CLASS).width(progressBarWidth);
				$('.' + PROGRESS_THUMB_CLASS).css('left', progressBarWidth - 4);
			},
			
			onBufferChange: function () {
				// Update the buffer bar to reflect the buffered time range
				var $bufferBar = $('.' + BUFFER_BAR_CLASS);
				var seekBarWidth = $('.' + SEEK_BAR_CLASS).width();
				var duration = AppModel.video.get('duration');
				var startPct = AppModel.video.get('startBuffer') / duration;
				var endPct = AppModel.video.get('endBuffer') / duration;
				var startPosition = startPct * seekBarWidth;
				var width = endPct * seekBarWidth - startPosition;
				
				$bufferBar.css('left', startPosition);
				$bufferBar.width(width);
			}
		});
		
		return SeekBar;
    }
);