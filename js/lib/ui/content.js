/**
 * Module lib/widget/content
 * graphit[js/app/widget/content.js]
 * sho / 17 déc. 2012 / 03:29:29
 */
(function(window, project, console, undefined) {

	'use strict';

	var DEBUG = project.debug;
	var modulePath = 'lib/ui/content';

	var Cobject = project.import('lib/object');

	/**
	 * graphit[js/app/widget/content.js]
	 * sho / 17 déc. 2012 / 03:29:29
	 * @constructor
	 * @param options {Hash} Options hash
	 */
	var Module = function(options) {
		options = options || {};
		options.className = modulePath;
		options.parent = options.parent || null;
		//options['label'];
		Cobject.call(this, options, ['label', 'parent']);
		this.content = null;
		this.is_visible = true;
		this.childs = [];
		this.dom_get();
		var that = this;
		//this.bind_trigger(this, 'graphit-refresh-ui', function() { that.refresh(); });
	};

	/* Inheritance */
	Module.prototype = Object.create(Cobject.prototype);
	Module.prototype.constructor = new Cobject();

	/**
	 * Method visible
	 * graphit[js/lib/ui/content.js]
	 * sho / 18 déc. 2012 / 07:30:37
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.visible = function() {
		if (arguments.length == 0) return this.is_visible;
		this.is_visible = arguments[0]? true: false;
		return this;
		///return this.refresh();
	};
	
	/**
	 * Method set_content
	 * graphit[js/app/widget/content.js]
	 * sho / 17 déc. 2012 / 03:30:48
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.set_content = function(content) {
		console.log('Setting content', content);
		this.content = content;
		return this;
		//return this.refresh();
	};
	
	/**
	 * Method get_content
	 * graphit[js/app/widget/content.js]
	 * sho / 17 déc. 2012 / 05:01:49
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.get_content = function() {
		return this.content;
	};
	
	/**
	 * Method refresh
	 * graphit[js/app/widget/content.js]
	 * sho / 17 déc. 2012 / 03:31:08
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.refresh = function() {
		this.rootElm.detach();
		if (!this.visible) { console.log('Hidden content', this.label); return this; }
		var content = this.get_content();
		this.rootElm.append(content);
		for(var i = 0; i < this.childs.length; i++) {
			var child = this.childs[i];
			if (!child.visible()) continue;
			child.refresh();
			this.rootElm.append(child.dom_get());
		}
		return this;
	};
	
	/**
	 * Method empty
	 * graphit[js/lib/ui/content.js]
	 * sho / 18 déc. 2012 / 22:23:00
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.empty = function(dumbopt) {
		this.rootElm.empty();
		return this;
	};
	
	/**
	 * Method add_child
	 * graphit[js/lib/ui/content.js]
	 * sho / 17 déc. 2012 / 18:29:25
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.add_child = function(child) {
		//console.log('Add child', child.to_s());
		child.parent = this;
		this.childs.push(child);
		//this.refresh();
		return child;
	};
	
	/**
	 * Method get_child_by_label
	 * graphit[js/lib/ui/content.js]
	 * sho / 18 déc. 2012 / 07:13:22
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.get_child = function(options) {
		if (!options) this.exception('empty_options');
		for(var i = 0; i < this.childs.length; i++) {
			var child = this.childs[i];
			if (options.index && child.index == options.index) return child;
			else if (options.label && child.label == options.label) return child;
		}
		return null;
	};
	
	/**
	 * Method set_index
	 * graphit[js/app/widget/content.js]
	 * sho / 17 déc. 2012 / 03:44:48
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.set_index = function(index) {
		this.index = index;
		return this;
	};
	
	/**
	 * Method get_index
	 * graphit[js/app/widget/content.js]
	 * sho / 17 déc. 2012 / 03:45:12
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.get_index = function() {
		return this.index;
	};
	
	/**
	 * Method dom_build
	 * graphit[js/app/widget/content.js]
	 * sho / 17 déc. 2012 / 05:15:02
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.dom_build = function() {
		var content = $('<span />');
		content.attr('id', this.get_dom_id());
		content.addClass(this.get_dom_class());
		this.rootElm = content;
		this.refresh();
		return this;
	};
	
	/**
	 * Method to_s
	 * graphit[js/lib/ui/content.js]
	 * sho / 17 déc. 2012 / 20:21:18
	 * @param dumbopt {String} dumbstring
	 */
	Module.prototype.to_s = function() {
		var nl = "\n";
		var str = '['+this.className+']' + nl;
		var content = this.get_content();
		if (typeof content === 'object' && 'to_s' in content) {content = content.to_s(); }
		str+= 'Content: ' + content + nl;
		str+= 'Childs:' + nl;
		for (var i = 0; i < this.childs.length; i++) {
			str+= ' - ' + this.childs[i].to_s() + nl;
		}
		return str;
	};
	
	/**
	 * Test
	 */
	Module.prototype.__test = function() {
		var M = project.import(modulePath);
		var m = new M();
	};
	
	/* Export */
	project.export(modulePath, Module);

})(window, graphit, console);