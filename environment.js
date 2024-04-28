var mouseX = 0, mouseY = 0;
var prevMouseX = 0, prevMouseY = 0;
var isMouseDown = false;

var keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
}; //copy
var GL;
  class MyObject{
    canvas = null;
    vertex = [];
    faces = [];
    colors =[];

    SHADER_PROGRAM = null;
    _color = null;
    _position = null;


    _MMatrix = LIBS.get_I4();
    _PMatrix = LIBS.get_I4();
    _VMatrix = LIBS.get_I4();
    _greyScality = 0;


    TRIANGLE_VERTEX = null;
    TRIANGLE_FACES = null;
    TRIANGLE_COLORS = null;

    MODEL_MATRIX = LIBS.get_I4();
    child = [];

    constructor(vertex, faces, source_shader_vertex, source_shader_fragment, colors){
        this.vertex = vertex;
        this.faces = faces;   
        this.colors = colors;
    
        var compile_shader = function(source, type, typeString) {
            var shader = GL.createShader(type);
            GL.shaderSource(shader, source);
            GL.compileShader(shader);
            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
                alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
                return false;
            }
            return shader;
        };
    
        var shader_vertex = compile_shader(source_shader_vertex, GL.VERTEX_SHADER, "VERTEX");
        var shader_fragment = compile_shader(source_shader_fragment, GL.FRAGMENT_SHADER, "FRAGMENT");
    
        this.SHADER_PROGRAM = GL.createProgram();
        GL.attachShader(this.SHADER_PROGRAM, shader_vertex);
        GL.attachShader(this.SHADER_PROGRAM, shader_fragment);
    
        GL.linkProgram(this.SHADER_PROGRAM);
    
        // Get attribute and uniform locations
        this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color");
        this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");
        this._PMatrix = GL.getUniformLocation(this.SHADER_PROGRAM,"PMatrix"); //projection
        this._VMatrix = GL.getUniformLocation(this.SHADER_PROGRAM,"VMatrix"); //View
        this._MMatrix = GL.getUniformLocation(this.SHADER_PROGRAM,"MMatrix"); //Model
        this._greyScality = GL.getUniformLocation(this.SHADER_PROGRAM, "greyScality");//GreyScality
    
        // Enable attribute arrays
        GL.enableVertexAttribArray(this._color);
        GL.enableVertexAttribArray(this._position);
        GL.useProgram(this.SHADER_PROGRAM);
    
        // Create buffers
        this.TRIANGLE_VERTEX = GL.createBuffer();
        this.TRIANGLE_FACES = GL.createBuffer();
        this.TRIANGLE_COLORS = GL.createBuffer(); // Create color buffer
    }
    


    setup(){
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_COLORS); // Use the color buffer
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.colors), GL.STATIC_DRAW); // Update with rainbow colors
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW);
        this.child.forEach(obj => {
            obj.setup();
        });
    }
    


    render(model_matrix, VIEW_MATRIX, PROJECTION_MATRIX){
        GL.useProgram(this.SHADER_PROGRAM);  
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 0, 0); // Use the position buffer
 
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_COLORS); // Bind the color buffer
        GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 0, 0); // Use the color buffer
 
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
 
        GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(this._MMatrix, false, model_matrix); // Use the provided model_matrix
        GL.uniform1f(this._greyScality, 1);
 
        GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);
 
        GL.flush();
        this.child.forEach(obj => {
            obj.render(model_matrix, VIEW_MATRIX, PROJECTION_MATRIX); // Pass model_matrix to child objects
        });
    }
  }
  

function updateViewMatrix() {
    var sensitivity = 0.001; // Adjust sensitivity here
    var dx = mouseX - prevMouseX;
    var dy = mouseY - prevMouseY;

    // Rotate the view matrix based on mouse movement
    LIBS.rotateY(VIEW_MATRIX, -dx);
    LIBS.rotateX(VIEW_MATRIX, -dy);

    prevMouseX = mouseX;
    prevMouseY = mouseY;
}

function updateViewMatrix() {
    var sensitivity = 0.001; // Adjust sensitivity here
    var dx = mouseX - prevMouseX;
    var dy = mouseY - prevMouseY;

    // Rotate the view matrix based on mouse movement
    LIBS.rotateY(VIEW_MATRIX, -dx);
    LIBS.rotateX(VIEW_MATRIX, -dy);

    prevMouseX = mouseX;
    prevMouseY = mouseY;
}

function main() {
    var CANVAS = document.getElementById("your_canvas");

    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
        var EXT = GL.getExtension("OES_element_index_uint");
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }

    //shaders
    var shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;

    uniform mat4 PMatrix;
    uniform mat4 VMatrix;
    uniform mat4 MMatrix;
    
    varying vec3 vColor;
    void main(void) {
    gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
    vColor = color;
    }`;
    var shader_fragment_source = `
    precision mediump float;
    varying vec3 vColor;
      // uniform vec3 color;
    void main(void) {
    gl_FragColor = vec4(vColor, 1.);
    
    }`;
    var compile_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };

    

    // tanah hemisphere
    var tanahData = envFunction.generateBase(0, -0.3, 0.5, 1, 50); // badan: x, y, z, radius, segments
    var tanah = new MyObject(tanahData.vertices, tanahData.faces, shader_vertex_source, shader_fragment_source, tanahData.colors);
    tanah.setup();

    // rumput
    var rumputData = envFunction.generateRumput(0, -0.29, 0.5, 1.05, 20); // badan: x, y, z, radius, segments
    var rumput = new MyObject(rumputData.vertices, rumputData.faces, shader_vertex_source, shader_fragment_source, rumputData.colors);
    rumput.setup();

    // gunung 1
    var gunungData = envFunction.generateGunung(0.3, 0.75, -0.1, 0.2, 100, 1.8, 1.2, 2.5, 0, 0.5, 0); // badan: x, y, z, radius, segments
    var gunung = new MyObject(gunungData.vertices, gunungData.faces, shader_vertex_source, shader_fragment_source, gunungData.colors);
    gunung.setup();

    // gunung 2
    var gunung2Data = envFunction.generateGunung(-0.4, 0.55, -0.1, 0.2, 100, 1.8, 1.5, 1.8, 0, -0.8, 0); // badan: x, y, z, radius, segments
    var gunung2 = new MyObject(gunung2Data.vertices, gunung2Data.faces, shader_vertex_source,shader_fragment_source, gunung2Data.colors);
    gunung2.setup();

    var awanData = envFunction.generateAwan(-0.15, 1.85, 0, 0.3, 16, 1.5, 1.2, 1.5); // badan: x, y, z, radius, segments
    var awan = new MyObject(awanData.vertices, awanData.faces, shader_vertex_source,shader_fragment_source, awanData.colors);
    awan.setup();

    var awanData1 = envFunction.generateAwan(-0.1, 1.72, -0.17, 0.25, 14, 1.5, 1.2, 1.5); // badan: x, y, z, radius, segments
    var awan1 = new MyObject(awanData1.vertices, awanData1.faces, shader_vertex_source,shader_fragment_source, awanData1.colors);
    awan1.setup();

    var awanData2 = envFunction.generateAwan(0.3, 1.85, 0.15, 0.25, 20, 1.5, 1.2, 1.5); // badan: x, y, z, radius, segments
    var awan2 = new MyObject(awanData2.vertices, awanData2.faces, shader_vertex_source,shader_fragment_source, awanData2.colors);
    awan2.setup();

    var awanData3 = envFunction.generateAwan(0.4, 1.51, -0.15, 0.25, 10, 1.5, 1.2, 1.5); // badan: x, y, z, radius, segments
    var awan3 = new MyObject(awanData3.vertices, awanData3.faces, shader_vertex_source,shader_fragment_source, awanData3.colors);
    awan3.setup();

    var awanData4 = envFunction.generateAwan(-0.4, 1.59, -0.1, 0.25, 17, 1.5, 1.2, 1.5); // badan: x, y, z, radius, segments
    var awan4 = new MyObject(awanData4.vertices, awanData4.faces, shader_vertex_source,shader_fragment_source, awanData4.colors);
    awan4.setup();

    var awanData5 = envFunction.generateAwan(-0.1, 1.82, 0.25, 0.25, 15, 1.5, 1.2, 1.5); // badan: x, y, z, radius, segments
    var awan5 = new MyObject(awanData5.vertices, awanData5.faces, shader_vertex_source,shader_fragment_source, awanData5.colors);
    awan5.setup();

    var awanData6 = envFunction.generateAwan(0.74, 1.71, 0, 0.25, 14, 1.5, 1.2, 1.5); // badan: x, y, z, radius, segments
    var awan6 = new MyObject(awanData6.vertices, awanData6.faces, shader_vertex_source,shader_fragment_source, awanData6.colors);
    awan6.setup();

    var baseData = envFunction.generateBaseAwan(-0.6, -1.05, 1, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base = new MyObject(baseData.vertices, baseData.faces, shader_vertex_source,shader_fragment_source, baseData.colors);
    base.setup();

    var baseData1 = envFunction.generateBaseAwan(0.58, -1.05, -0.3, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base1 = new MyObject(baseData1.vertices, baseData1.faces, shader_vertex_source,shader_fragment_source, baseData1.colors);
    base1.setup();

    var baseData2 = envFunction.generateBaseAwan(0.6, -1.05, 1, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base2 = new MyObject(baseData2.vertices, baseData2.faces, shader_vertex_source,shader_fragment_source, baseData2.colors);
    base2.setup();

    var baseData3 = envFunction.generateBaseAwan(-0.58, -1.05, -0.3, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base3 = new MyObject(baseData3.vertices, baseData3.faces, shader_vertex_source,shader_fragment_source, baseData3.colors);
    base3.setup();

    var baseData4 = envFunction.generateBaseAwan(0, -1.25, 0.4, 0.3, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base4 = new MyObject(baseData4.vertices, baseData4.faces, shader_vertex_source,shader_fragment_source, baseData4.colors);
    base4.setup();

    var baseData5 = envFunction.generateBaseAwan(0, -0.96, 1.1, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base5 = new MyObject(baseData5.vertices, baseData5.faces, shader_vertex_source,shader_fragment_source, baseData5.colors);
    base5.setup();

    var baseData6 = envFunction.generateBaseAwan(0, -0.96, -0.4, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base6 = new MyObject(baseData6.vertices, baseData6.faces, shader_vertex_source,shader_fragment_source, baseData6.colors);
    base6.setup();

    var baseData7 = envFunction.generateBaseAwan(0.8, -0.96, 0.3, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base7 = new MyObject(baseData7.vertices, baseData7.faces, shader_vertex_source,shader_fragment_source, baseData7.colors);
    base7.setup();

    var baseData8 = envFunction.generateBaseAwan(-0.8, -0.96, 0.3, 0.25, 14, 2, 1, 2); // badan: x, y, z, radius, segments
    var base8 = new MyObject(baseData8.vertices, baseData8.faces, shader_vertex_source,shader_fragment_source, baseData8.colors);
    base8.setup();

    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();

    // Event listener untuk mouse movement
    document.addEventListener('mousemove', function (event) {
        if (isMouseDown) {
            var sensitivity = 0.01; // Adjust sensitivity here
            var dx = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var dy = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            mouseX += dx * sensitivity;
            mouseY += dy * sensitivity;

            updateViewMatrix();
        }
    });
    // Event listener untuk mouse down
    document.addEventListener('mousedown', function (event) {
        isMouseDown = true;
        updateViewMatrix();
    });
    // Event listener untuk mouse up
    document.addEventListener('mouseup', function (event) {
        isMouseDown = false;
    });
    function updateViewMatrix() {
        var sensitivity = 0.001; // Adjust sensitivity here
        var dx = mouseX - prevMouseX;
        var dy = mouseY - prevMouseY;
        // Rotate the view matrix based on mouse movement
        LIBS.rotateY(VIEW_MATRIX, dx);
        LIBS.rotateX(VIEW_MATRIX, dy);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
    }

    // Set view matrix to position the camera
    LIBS.translateZ(VIEW_MATRIX, -5);
    var zoomSpeed = 0.2; // Kecepatan zoom
    // Event listener untuk scroll mouse
    document.addEventListener('wheel', function (event) {
        // Menentukan arah scroll
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        // Mengubah posisi kamera berdasarkan arah scroll
        LIBS.translateZ(VIEW_MATRIX, delta * zoomSpeed);
        // Memastikan kamera tidak terlalu dekat atau terlalu jauh
        if (VIEW_MATRIX[14] < -20) {
            VIEW_MATRIX[14] = -20;
        }
        if (VIEW_MATRIX[14] > -1) {
            VIEW_MATRIX[14] = -1;
        }
    });

    document.addEventListener('keydown', function (event) {
        var keyCode = event.keyCode;
        if (keyCode === 87) { // W key
            keysPressed.w = true;
        } else if (keyCode === 65) { // A key
            keysPressed.a = true;
        } else if (keyCode === 83) { // S key
            keysPressed.s = true;
        } else if (keyCode === 68) { // D key
            keysPressed.d = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        var keyCode = event.keyCode;
        if (keyCode === 87) { // W key
            keysPressed.w = false;
        } else if (keyCode === 65) { // A key
            keysPressed.a = false;
        } else if (keyCode === 83) { // S key
            keysPressed.s = false;
        } else if (keyCode === 68) { // D key
            keysPressed.d = false;
        }
    });


    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var cameraSpeed = 0.1; // Kecepatan pergerakan kamera

    var time_prev = 0;

   

    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        var dt = time - time_prev;
        time_prev = time;

        if (keysPressed.s) {
            LIBS.translateZ(VIEW_MATRIX, -cameraSpeed);
        }
        if (keysPressed.a) {
            LIBS.translateX(VIEW_MATRIX, -cameraSpeed);
        }
        if (keysPressed.w) {
            LIBS.translateZ(VIEW_MATRIX, cameraSpeed);
        }
        if (keysPressed.d) {
            LIBS.translateX(VIEW_MATRIX, cameraSpeed);
        }


        //render
        tanah.render(tanah.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        rumput.render(rumput.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        gunung.render(gunung.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        gunung2.render(gunung2.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        awan.render(awan.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        awan1.render(awan1.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        awan2.render(awan2.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        awan3.render(awan3.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        awan4.render(awan4.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        awan5.render(awan5.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        awan6.render(awan6.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base.render(base.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        base1.render(base1.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base2.render(base2.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base3.render(base3.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base4.render(base4.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base5.render(base5.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base6.render(base6.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base7.render(base7.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        base8.render(base8.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);