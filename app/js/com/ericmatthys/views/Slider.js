define(
	[
		'backbone',
		'text!templates/slider.html'
	],
	
	function (Backbone, template) {
		//---------- Constants ----------
		var ACTIVE_SLIDER_CLASS = 'lens-active-slider';
		var BUTTON_CLASS = 'lens-slider-button';
		var TRACK_CLASS = 'lens-slider-track';
		var THUMB_CLASS = 'lens-slider-thumb';
		var BAR_CLASS = 'lens-slider-bar';
		
		var Slider = Backbone.View.extend({
			
			//---------- Properties ----------
			currentValue: 0,
			dragging: false,
			
			events: {
				'click .lens-slider-button': 'onButtonClick',
				'mousedown .lens-slider-track': 'onSliderMouseDown',
			},
			
			//---------- Init ----------
			initialize: function () {
				_.bindAll(this, 'onSliderMouseMove', 'onSliderMouseUp');
			},
			
			//---------- Control ----------
			render: function () {
				this.$el.html(_.template(template, {}));
				
				return this;
			},
			
			calculateValue: function (pageX) {
				var $track = this.$el.find('.' + TRACK_CLASS);
				var localX = pageX - $track.offset().left;
				var value = localX / $track.width();
				
				// Normalize the value
				if (value > 1) {
					value = 1;
				} else if (value < 0) {
					value = 0;
				}
				
				this.currentValue = value;
				
				// Dispatch a custom event with the updated value
				this.trigger('valueChange', value);
			},
			
			setValue: function (value) {
				this.currentValue = value;
				
				var $track = this.$el.find('.' + TRACK_CLASS);
				var $thumb = this.$el.find('.' + THUMB_CLASS);
				var $bar = this.$el.find('.' + BAR_CLASS);
				
				var trackWidth = $track.width();
				var thumbRadius = $thumb.width() / 2;
				var barWidth = value * trackWidth;
				
				// Constrain the bar so the thumb fits on the track
				if (barWidth < thumbRadius) {
					barWidth = thumbRadius;
				} else if (barWidth + thumbRadius > trackWidth) {
					barWidth = trackWidth - thumbRadius;
				}
				
				// Update the slider to reflect the new value
				$thumb.css('left', barWidth - thumbRadius);
				$bar.width(barWidth);
			},
			
			//---------- Listeners ----------
			onButtonClick: function (event) {
				// Prevent the click from navigating to a href value
				event.preventDefault();
				
				this.trigger('buttonClick');
			},
			
			onSliderMouseDown: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).bind('mousemove', this.onSliderMouseMove);
				$(document).bind('mouseup', this.onSliderMouseUp);
				
				this.dragging = true;
				this.$el.addClass(ACTIVE_SLIDER_CLASS);
				
				this.calculateValue(event.pageX);
			},
			
			onSliderMouseMove: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				this.calculateValue(event.pageX);
			},
			
			onSliderMouseUp: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).unbind('mousemove', this.onVolumeSliderMouseMove);
				$(document).unbind('mouseup', this.onVolumeSliderMouseUp);
				
				this.dragging = false;
				this.$el.removeClass(ACTIVE_SLIDER_CLASS);
				
				this.calculateValue(event.pageX);
				
				this.trigger('release');
			}
		});
		
		return Slider;
	}
);