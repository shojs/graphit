/**
 * Module lib/ui/rollout
 * graphit[js/app/ui/rollout.js]
 * sho / 17 déc. 2012 / 03:34:14
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	var modulePath = 'lib/ui/rollout';

	var Cobject = project.import('lib/ui/content');

	/**
	 * graphit[js/app/ui/rollout.js]
	 * sho / 17 déc. 2012 / 03:34:14
	 * @constructor
	 * @param options {Hash} Options hash
	 */
	var Module = function(options) {
		var that = this;
		options = options || {};
		options['className'] = modulePath;
		//options['label'] = modulePath;
		Cobject.call(this, options, []);
		this.bind_trigger(this, 'graphit-refresh-ui', function() { that.refresh(); });
		this.dom_get();

	};

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Method add
	 * graphit[js/app/ui/rollout.js]
	 * sho / 17 déc. 2012 / 03:35:11
	 * @param roll {/app/widget/content} Content
	 */
//	Module.prototype.add = function(roll) {
//		if (roll.label in this.rolls) this.exception('roll_with_same_label');
//		this.rolls[roll.label] = roll;
//		this.rootElm.append(roll.dom_get({noHeader: true}));
//		roll.set_index(this.roll_count);
//		this.roll_count++;
//	};

	/**
	 * Method refresh
	 * graphit[js/app/ui/rollout.js]
	 * sho / 17 déc. 2012 / 03:41:03
	 * @param dumbopt {String} dumbstring
	 */
//	Module.prototype.refresh = function() {
//		console.log('refresh ui');
//		for ( var label in this.rolls) {
//			this.rolls[label].refresh();
//		}
//
//	};
	/**
	 * Method dom_get
	 * graphit[js/app/ui/rollout.js]
	 * sho / 17 déc. 2012 / 03:37:32
	 * @param dumbopt {String} dumbstring
	 */
//	Module.prototype.dom_build = function() {
//		var rollout = $('<div />');
//		rollout.attr('id', this.get_dom_id());
//		rollout.addClass(this.get_dom_class());
//		this.rootElm = rollout;
//		return this;
//	};
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var that = this;
		var M = project.import(modulePath);
		var m = new M({'label': 'TEST_test'});
		var WidgetContent = project.import('lib/ui/content');
		var content01 = new WidgetContent({label: 'content01'});
		content01.set_content("Content 01");
		var content02 = new WidgetContent({label: 'content02'});
		content02.set_content("Content 02");
		var content03 = new WidgetContent({label: 'content03'});
		content03.set_content("Content 03");
		var button = new WidgetContent({label: 'refresh-button'});
		button.get_content = function() {
			var buttonContent = $('<button >Refresh</button>').button();
			buttonContent.click(function() { console.log('PLOP'); m.send_trigger('graphit-refresh-ui'); }); 
			return buttonContent;
		};
		m.add_child(content01);
		m.add_child(content02);
		m.add_child(content03);
		m.add_child(button);
		m.dom_get().dialog();

		content01.set_content("Content 01 Modified");
	};

	/* Export */
	project.export(modulePath, Module);

})(window, graphit, console);
