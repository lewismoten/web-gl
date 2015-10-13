// see http://learningwebgl.com/blog/?p=28 for tutorial
// see http://glmatrix.net/ for mat4 library

(function webGraphicsLibraryDemo(){

	'use strict';

	var objects 	= {
						triangle: undefined,
						square: undefined
					},
		gl,
		program,
		
		mvMatrix 	= mat4.create(),
		pMatrix 	= mat4.create();

	window.onload = main;

	return;

	function main() {

		gl = getGl();

		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;

		var fragment = getFragmentSource(),
			vertex = getVertexSource(),

			source = {
				fragment: fragment,
				vertex: vertex
			},

			square = [
				 1.0,  1.0,  0.0,
		        -1.0,  1.0,  0.0,
		         1.0, -1.0,  0.0,
		        -1.0, -1.0,  0.0
			],

			triangle = [
				 0.0,  1.0, 0.0,
				-1.0, -1.0, 0.0,
				 1.0, -1.0, 0.0
			],

			updateButton = document.getElementById('updateSourceCode');

		updateButton.onclick = onUpdateSourceCode;

		program = createProgram(source);

		objects.triangle = createBuffer(triangle);
		objects.square = createBuffer(square);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);

		drawScene();

	}

	function onUpdateSourceCode() {
		
		var fragment = getFragmentSource(),
			vertex = getVertexSource(),

			source = {
				fragment: fragment,
				vertex: vertex
			};

		program = createProgram(source);

		gl.useProgram(program);

		drawScene();
	}

	function createBuffer(verticies) {
		var buffer = gl.createBuffer(),
			itemSize = 3,
			numItems = verticies.length / itemSize;

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

		buffer.numItems = numItems;
		buffer.itemSize = itemSize;

		return buffer;
	}

	function drawScene() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

 	 	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
 	 	mat4.identity(mvMatrix);
		
		goTo(-1.5, 0.0, -7.0);
		drawObject(objects.triangle);

		goTo(3.0, 0.0, 0.0);
		drawObject(objects.square);
	}

	function goTo(x, y, z) {
		mat4.translate(mvMatrix, [x, y, z]);
	}

	function setMatrixUniforms() {

		
		gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
	}

	function drawObject(buffer) {

		var itemSize = buffer.itemSize,
			numItems = buffer.numItems;

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    	gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

    	setMatrixUniforms();

    	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numItems); // TRIANGLE only does 1
	}

	function getFragmentSource() {
		return document.getElementById('fragmentSource').value;
	}

	function getVertexSource() {
		return document.getElementById('vertexSource').value;
	}

	function getCanvas() {
		return document.getElementById('canvas');
	}

	function getGl() {
		try {

			var canvas = getCanvas(),
				gl = canvas.getContext('webgl');
			return gl;

		} catch(error) {
			console.log('getGL error', error);
		}
	}

	function createProgram(source) {
		var fragment = getShader(gl.FRAGMENT_SHADER, source.fragment),
			vertex   = getShader(gl.VERTEX_SHADER,   source.vertex),

			program = gl.createProgram();

		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);

		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {

			console.log('could not initialize shaders');
		}

		gl.useProgram(program);

		program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
		
		gl.enableVertexAttribArray(program.aVertexPosition);

		program.pMatrixUniform = gl.getUniformLocation(program, 'uPMatrix');
		program.mvMatrixUniform = gl.getUniformLocation(program, 'uMVMatrix');

		return program;
	}

	function getShader(type, script) {

		var shader = gl.createShader(type);

		gl.shaderSource(shader, script);
		gl.compileShader(shader);

		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

			console.log('Could not get compile status of shader', gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

})();