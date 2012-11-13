function widget_slider_ex(obj, $parent, options) {
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('sliderex ' + options.label);
	$r.attr('title', options.label);
	var $table = $(document.createElement('table'));
	var $tr = $(document.createElement('tr'));
	var $td = $(document.createElement('td'));
	$td.append('<h6>' + options.label + '</h6>');
	$tr.append($td);

	var $slider = $(document.createElement('div'));
	$slider.addClass('slider');
	$slider.slider({
		min : options.min,
		max : options.max,
		value : options.value,
		step : options.step,
		slide : function() {
			var $t = $(this);
			var value = $t.slider('option', 'value');
			var $p = $t.parents('.sliderex').find('input.input');
			$p.attr('value', value);
			if ('callback_slide' in options && typeof(options.callback_slide) == 'function') {
				options.callback_slide.call(obj, value);
			}
		},
		change : function() {
			var $t = $(this);
			var value = $t.slider('option', 'value');
			var $p = $t.parents('.sliderex').find('input.input');
			$p.attr('value', value);
			if ('callback_change' in options && typeof(options.callback_change) == 'function') {
				options.callback_change.call(obj, value);
			}
	
		}
	});
	$td = $(document.createElement('td'));
	$td.append($slider);
	$tr.append($td);
	var $input = $(document.createElement('input'));
	$input.addClass('input');
	$input.attr('value', options.value);
	$input.css('width: 2em');
	$input.change(function() {
		$this = $(this);
		var value = $this.attr('value');
		var $p = $this.parents('.sliderex').find('.slider');
		$p.slider('option', 'value', value);
		if ('callback_change' in options && typeof(options.callback_change) == 'function') {
			options.callback_change.call(obj, value);
		}
	});
	$input.spinner();
	$td = $(document.createElement('td'));
	$td.append($input);
	$tr.append($td);
	$table.append($tr);
	$r.append($table);
	$parent.append($r);
}