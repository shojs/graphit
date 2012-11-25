var $gi = {};
(function($_gi){
	"use strict";	
	Object.defineProperty($_gi, 'uid', { value: 425,
		writable: false,
		enumerable: true,
		configurable: false,
	});
	
}($gi));


(function($_gi) {
	"use strict";

	/* Installing path Draw */
	Object.defineProperty($gi, 'draw', {value : {},
		writable: false,
		enumerable: true,
		configurable: false, 
	});
	
	/* Method Draw point  */
	$gi.draw.point = function () {
		console.log('Drawing points');
	};
	Object.defineProperty($gi.draw.point, 'point', {value : {},
		writable: false,
		enumerable: false,
		configurable: false, 
	});
		
	$gi.draw.point = function(_p) {
		console.log('drawing point');
	};
}($gi));


"use strict";

delete $gi.uid;

$gi.draw.point(1, 2);
$gi.draw = 'é&e&é';
$gi.draw.point(3, 4);
console.log("UID:" + $gi.uid);
$gi.get_name = function() {
	return this.name;
};

var td = Object.create($gi);
td.set_name = function(name) { this.name = name; };
td.set_name('gabou');
console.log(td.get_name());
console.log($gi.get_name());
console.log($gi);