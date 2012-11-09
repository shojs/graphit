function widget_slider_ex($parent, label, options, callbacks) {
	var root = document.createElement('div');
	var $r = $(root);
	$r.addClass('sliderex ' + label);
	$r.attr('title', label);
	var $table = $(document.createElement('table'));
	var $tr = $(document.createElement('tr'));
	var $td = $(document.createElement('td'));
	$td.append('<h6>' + label + '</h6>');
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
			var $p = $t.parent().children('input.input');
			$p.attr('value', value);
			callbacks.slide(this, value);
		},
		change : function() {
			var $t = $(this);
			var value = $t.slider('option', 'value');
			var $p = $t.parent().children('input.input');
			$p.attr('value', value);
			callbacks.change(this, value);
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
		var $p = $this.parent().children('div.slider');
		$p.slider('option', 'value', value);
		callbacks.change(this, value);
	});
	$td = $(document.createElement('td'));
	$td.append($input);
	$tr.append($td);
	$table.append($tr);
	$r.append($table);
	$parent.append($r);
}