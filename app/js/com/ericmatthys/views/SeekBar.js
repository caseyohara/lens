define(
	[
		'backbone',
		'com/ericmatthys/models/PlayerModel',
		'text!templates/seekbar.html'
	],
	
    function (Backbone, PlayerModel, template) {
		//---------- Constants ----------
		var SEEK_BAR_CLASS = 'emp-seek-bar';
		var BUFFER_BAR_CLASS = 'emp-buffer-bar';
		var PROGRESS_BAR_CLASS = 'emp-progress-bar';
		var PROGRESS_THUMB_CLASS = 'emp-progress-thumb';
		
		var SeekBar = Backbone.View.extend({
			
			//---------- Properties ----------
			el: '.' + SEEK_BAR_CLASS,
			model: PlayerModel.video,

			events: {
				'mousedown': 'onSeekBarMouseDown'
			},
			
			//---------- Init ----------
			initialize: function () {
				_.bindAll(this, 'onSeekBarMouseMove', 'onSeekBarMouseUp');
				
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
				var $seekBar = $('.' + SEEK_BAR_CLASS);
				var clickX = x - $seekBar.offset().left;
				var clickPct = clickX / $seekBar.width();
				var clickTime = clickPct * PlayerModel.video.get('duration');

				this.trigger('seek', clickTime);
			},
			
			//---------- Listeners ----------
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
				var pct = PlayerModel.video.get('currentTime') / PlayerModel.video.get('duration');
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
				var duration = PlayerModel.video.get('duration');
				var startPct = PlayerModel.video.get('startBuffer') / duration;
				var endPct = PlayerModel.video.get('endBuffer') / duration;
				var startPosition = startPct * seekBarWidth;
				var width = endPct * seekBarWidth - startPosition;
				
				$bufferBar.css('left', startPosition);
				$bufferBar.width(width);
			}
		});
		
		return SeekBar;
    }
);