
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
    


    render(VIEW_MATRIX, PROJECTION_MATRIX){
        GL.useProgram(this.SHADER_PROGRAM);  
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 0, 0); // Use the position buffer
    
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_COLORS); // Bind the color buffer
        GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 0, 0); // Use the color buffer
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
              
        GL.uniformMatrix4fv(this._PMatrix,false,PROJECTION_MATRIX);
        GL.uniformMatrix4fv(this._VMatrix,false,VIEW_MATRIX);
        GL.uniformMatrix4fv(this._MMatrix,false,this.MODEL_MATRIX);
        GL.uniform1f(this._greyScality, 1);
     
        GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);
    
        GL.flush();
        this.child.forEach(obj => {
            obj.render(VIEW_MATRIX, PROJECTION_MATRIX);
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
        // LIBS.rotateX(VIEW_MATRIX, dy);
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

    var headData = functionObj2.generateKepala(0, 0.4, 0.5, 0.5, 50, 1, 1, 1);
    var head = new MyObject(headData.vertices, headData.faces, shader_vertex_source, shader_fragment_source, headData.colors);
    head.setup();
    
    var upperbodyData = functionObj2.generateUpperbody(0, 0.2, 0.5, 0.4, 100, 1, 1, -1); // Example sphere: x=0, y=0, z=0.5, radius=0.6, segments=100, rotationX, rotationY, rotationZ
    var upperbody = new MyObject(upperbodyData.vertices, upperbodyData.faces, shader_vertex_source, shader_fragment_source, upperbodyData.colors);
    upperbody.setup();

    var lowerbodyData = functionObj2.generateLowerbody(0, -0.81, 0.5, 0.628, 100, 0, 0, 0); // Example sphere: x=0, y=0, z=0.5, radius=0.6, segments=100
    var lowerbody = new MyObject(lowerbodyData.vertices, lowerbodyData.faces, shader_vertex_source, shader_fragment_source, lowerbodyData.colors);
    lowerbody.setup();

    var leftribbonData = functionObj2.generateleftribbon(0, -0.09, 0.85, 0.1, 50, 0.2, 0.5, 1); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var leftribbon = new MyObject(leftribbonData.vertices, leftribbonData.faces, shader_vertex_source, shader_fragment_source, leftribbonData.colors);
    leftribbon.setup();

    var rightribbonData = functionObj2.generaterightribbon(0, -0.09, 0.85, 0.1, 50, 0.2, 0.5, 1); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var rightribbon = new MyObject(rightribbonData.vertices, rightribbonData.faces, shader_vertex_source, shader_fragment_source, rightribbonData.colors);
    rightribbon.setup();

    var tailData = functionObj2.generateTail(0, -0.78, -0.35, 0.08, 0.6, 50); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var tail = new MyObject(tailData.vertices, tailData.faces, shader_vertex_source, shader_fragment_source, tailData.colors);
    tail.setup();

    var tailsphereData = functionObj2.generateTailSphere(0, -0.78, -0.8, 0.2, 100, 1, 1, 1); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tailsphere = new MyObject(tailsphereData.vertices, tailsphereData.faces, shader_vertex_source, shader_fragment_source, tailsphereData.colors);
    tailsphere.setup();

    var tailheadData = functionObj2.generateTail1(0,-0.58,-1.12, 0.15, 100, 1, 1, 2, 0.5, 0, 0); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var tailhead = new MyObject(tailheadData.vertices, tailheadData.faces, shader_vertex_source, shader_fragment_source, tailheadData.colors);
    tailhead.setup();

    var leftfeetData = functionObj2.generateFeet(-0.25, -1.4, 0.5, 0.2, 1, 100); //x, y, z, radius, height, segments
    var leftfeet = new MyObject(leftfeetData.vertices, leftfeetData.faces, shader_vertex_source, shader_fragment_source, leftfeetData.colors);
    leftfeet.setup();

    var rightfeetData = functionObj2.generateFeet(0.25, -1.4, 0.5, 0.2, 1, 100); //x, y, z, radius, height, segments
    var rightfeet = new MyObject(rightfeetData.vertices, rightfeetData.faces, shader_vertex_source, shader_fragment_source, rightfeetData.colors);
    rightfeet.setup();

    var rightsoleData = functionObj2.generateSole(0.25, -1.98, 0.6, 0.2, 100, -0.9, -0.5, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var rightsole = new MyObject(rightsoleData.vertices, rightsoleData.faces, shader_vertex_source, shader_fragment_source, rightsoleData.colors);
    rightsole.setup();

    var leftsoleData = functionObj2.generateSole(-0.25, -1.98, 0.6, 0.2, 100, -0.9, -0.5, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var leftsole = new MyObject(leftsoleData.vertices, leftsoleData.faces, shader_vertex_source, shader_fragment_source, leftsoleData.colors);
    leftsole.setup();

    var leftshoulderData = functionObj2.generateLeftshoulder(1.185, -0.12, 0.5, 0.096, 50, 1, 1, 0.5); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var leftshoulder = new MyObject(leftshoulderData.vertices, leftshoulderData.faces, shader_vertex_source, shader_fragment_source, leftshoulderData.colors);
    leftshoulder.setup();

    var rightshoulderData = functionObj2.generateRightshoulder(-1.185, -0.12, 0.5, 0.096, 50, 1, 1, 0.5); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var rightshoulder = new MyObject(rightshoulderData.vertices, rightshoulderData.faces, shader_vertex_source, shader_fragment_source, rightshoulderData.colors);
    rightshoulder.setup();

    var leftarmData = functionObj2.generateArm(-0.6, -0.12, 0.5, 0.15, 0.6, 50); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var leftarm = new MyObject(leftarmData.vertices, leftarmData.faces, shader_vertex_source, shader_fragment_source,leftarmData.colors);
    leftarm.setup();

    var rightarmData = functionObj2.generateArm(0.6, -0.12, 0.5, 0.15, 0.6, 50); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var rightarm = new MyObject(rightarmData.vertices, rightarmData.faces, shader_vertex_source, shader_fragment_source, rightarmData.colors);
    rightarm.setup();

    var rightearData = functionObj2.generateEar(-0.38, 1.05, 0.45, 0.15, 100, 1, 3, 1, 0,0,0.25); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var rightear = new MyObject(rightearData.vertices, rightearData.faces, shader_vertex_source, shader_fragment_source, rightearData.colors);
    rightear.setup();

    var leftearData = functionObj2.generateEar(0.38, 1.05, 0.45, 0.15, 100, 1, 3, 1, 0,0,-0.25); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var leftear = new MyObject(leftearData.vertices, leftearData.faces, shader_vertex_source, shader_fragment_source, leftearData.colors);
    leftear.setup();
    
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

        if (keysPressed.w) {
            LIBS.translateZ(VIEW_MATRIX, -cameraSpeed);
        }
        if (keysPressed.a) {
            LIBS.translateX(VIEW_MATRIX, -cameraSpeed);
        }
        if (keysPressed.s) {
            LIBS.translateZ(VIEW_MATRIX, cameraSpeed);
        }
        if (keysPressed.d) {
            LIBS.translateX(VIEW_MATRIX, cameraSpeed);
        }

        head.render(VIEW_MATRIX, PROJECTION_MATRIX);
        upperbody.render(VIEW_MATRIX, PROJECTION_MATRIX);
        lowerbody.render(VIEW_MATRIX, PROJECTION_MATRIX);
        leftribbon.render(VIEW_MATRIX, PROJECTION_MATRIX);
        rightribbon.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tail.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tailsphere.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tailhead.render(VIEW_MATRIX, PROJECTION_MATRIX);
        leftfeet.render(VIEW_MATRIX,PROJECTION_MATRIX);
        rightfeet.render(VIEW_MATRIX,PROJECTION_MATRIX);
        rightsole.render(VIEW_MATRIX,PROJECTION_MATRIX);
        leftsole.render(VIEW_MATRIX,PROJECTION_MATRIX);
        leftshoulder.render(VIEW_MATRIX,PROJECTION_MATRIX);
        rightshoulder.render(VIEW_MATRIX,PROJECTION_MATRIX);
        leftarm.render(VIEW_MATRIX,PROJECTION_MATRIX);
        rightarm.render(VIEW_MATRIX,PROJECTION_MATRIX);
        leftear.render(VIEW_MATRIX,PROJECTION_MATRIX);
        rightear.render(VIEW_MATRIX,PROJECTION_MATRIX);

       
        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);