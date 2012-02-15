define(
	[
		'backbone',
		'text!templates/slider.html'
	],
	
    function (Backbone, template) {
		//---------- Constants ----------
		var ACTIVE_SLIDER_CLASS = 'emp-active-slider';
		var BUTTON_CLASS = '-button';
		var SLIDER_CLASS = '-slider';
		var THUMB_CLASS = '-thumb';
		var BAR_CLASS = '-bar';
		
		var Slider = Backbone.View.extend({
			
			//---------- Properties ----------
			events: {
				'click .slider-button': 'onButtonClick',
				'mousedown .slider-track': 'onSliderMouseDown',
			},
			
			//---------- Init ----------
			initialize: function (className) {
				this.className = className;
				this.setElement($(className));
				
				_.bindAll(this, 'onSliderMouseMove', 'onSliderMouseUp');
			},
			
			//---------- Control ----------
			render: function () {
				this.$el.html(_.template(template, {className: this.className}));
				
				return this;
			},
			
			updateValue: function (x) {
				var $volumeSlider = $('.' + this.className + SLIDER_CLASS);
				var clickX = x - $volumeSlider.offset().left;
				var value = clickX / $volumeSlider.width();
				
				if (value > 1) {
					value = 1;
				} else if (value < 0) {
					value = 0;
				}
				
				this.trigger('valueChange', value);
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
				
				this.$el.addClass(ACTIVE_SLIDER_CLASS);
				
				this.updateValue(event.pageX);
			},
			
			onSliderMouseMove: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				this.updateValue(event.pageX);
			},
			
			onSliderMouseUp: function (event) {
				// Prevent the click from trying to select
				event.preventDefault();
				
				$(document).unbind('mousemove', this.onVolumeSliderMouseMove);
				$(document).unbind('mouseup', this.onVolumeSliderMouseUp);
				
				this.$el.removeClass(ACTIVE_SLIDER_CLASS);
				
				this.updateValue(event.pageX);
			}
		});
		
		return Slider;
    }
);