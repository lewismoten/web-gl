(function webGraphicsLibraryDemo(){

	'use strict';

	window.onLoad = main;

	return;

	function main() {

		var gl = getGl();

	}

	function getGl() {
		try {
			
			var canvas = getCanvas(),
				gl = canvas.getContext('webgl');

			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;

			return gl;

		} catch(error) {
			alert('error: ' + error);
		}
	}

	function getCanvas() {
		return document.getElementById('canvas');
	}

})();