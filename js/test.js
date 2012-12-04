"use strict";

var mat = new Cmatrix33([ 1.2,  3,    5,
                          0.4, -1,    4,
                         -4.3,  2.8, -0.9]);

mat.identity();
console.log(mat.to_s());
mat.translate({x:2, y:5});
console.log(mat.to_s());
mat.translate({x: 8, y: 0});
console.log(mat.to_s());
mat.rotate(90);
console.log(mat.to_s());
	
//var mat2 = new Cmatrix33();
//mat2.random();
//console.log(mat2.to_s());
//console.log(mat.to_s());
//mat.add(3);
//mat.add(4.2);
//console.log(mat.to_s());
//mat.add(mat2);
//console.log(mat.to_s());
//mat.mul(1.6);
//console.log(mat.to_s());
//mat.round();
//console.log(mat.to_s());
//var m3 = mat.clone();
//console.log(m3.to_s());
//
//console.log('----');
//mat2.set([1, 3, -2,
//          -1, 4, 5,
//          9, -2, 1]);
//
//mat.set([2, -1, -3,
//          6, 7, -5,
//          4, -1, 1]);
//
//
//mat.mul(mat2);
//var i = new Cmatrix33();
//i.set([1,0,0,
//	   0,1,0,
//	   0,0,1]);
//console.log(mat.to_s());
//mat.mul(i);
//console.log(mat.to_s());
//mat.set([-1, -2, 2,
//         2, 1, 1,
//         3, 4, 5]);
//var minor = mat.clone().minor();
//console.log('Minor', minor.to_s());
//var $Graphit = {};
//(function($_gi){
//	"use strict";	
//	Object.defineProperty($_gi, 'uid', { value: 425,
//		writable: false,
//		enumerable: true,
//		configurable: false
//	});
//	Object.defineProperty($_gi, 'util', { value: {},
//		writable: false,
//		enumerabl: true,
//		configurable: false
//	});
//}($Graphit));
//
///* util */
//(function($_gi){
//	"use strict";	
//	/* Canvas */
//	Object.defineProperty($_gi.util, 'canvas', { value: {},
//		writable: false,
//		enumerabl: true,
//		configurable: false
//	});
//}($Graphit));
//
///* Canvas */
//Object.defineProperty($Graphit.util.canvas, 'create', 
//{
//	value: function(options) {
//		console.log('creating canvas', options);
//		return $Graphit.util.canvas;
//	},
//	writable: false,
//	enumerable: true,
//	configurable: false,
//});
//
//
//
//$Graphit.util.canvas.create({width: 800, heigh: 600});
////$Graphit.util = 'zadazd';
//$Graphit.util.canvas.create({width: 800, heigh: 600});
////$Graphit.util.canvas = 'azdzakd';
//$Graphit.util.canvas.create({width: 800, heigh: 600}).create({width: 200, height: 200});
//(function($_gi) {
//	"use strict";
//
//	/* Installing path Draw */
//	Object.defineProperty($gi, 'draw', {value : {},
//		writable: false,
//		enumerable: true,
//		configurable: false, 
//	});
//	
//	/* Method Draw point  */
//	$gi.draw.point = function () {
//		console.log('Drawing points');
//	};
//	Object.defineProperty($gi.draw.point, 'point', {value : {},
//		writable: false,
//		enumerable: false,
//		configurable: false, 
//	});
//		
//	$gi.draw.point = function(_p) {
//		console.log('drawing point');
//	};
//}($gi));

//
//"use strict";
//
//delete $gi.uid;
//
//$gi.draw.point(1, 2);
//$gi.draw = 'é&e&é';
//$gi.draw.point(3, 4);
//console.log("UID:" + $gi.uid);
//$gi.get_name = function() {
//	return this.name;
//};
//
//var td = Object.create($gi);
//td.set_name = function(name) { this.name = name; };
//td.set_name('gabou');
//console.log(td.get_name());
//console.log($gi.get_name());
//console.log($gi);