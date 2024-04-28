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
    var MODEL_MATRIX2 = LIBS.get_I4();
    var MODEL_MATRIX3 = LIBS.get_I4();
    var MODEL_MATRIX4 = LIBS.get_I4();
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

    //Kepala //Pokoknya yang diganti z nya
    var kepalaData = functionObj1.generateKepala(0, -0.05, 0.5, 0.55, 50, 1.3, 1, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kepala = new MyObject(kepalaData.vertices, kepalaData.faces, shader_vertex_source, shader_fragment_source, kepalaData.colors);
    kepala.setup();
    
    //Badan Atas
    var badan1Data = functionObj1.generateBadan1(0, -0.55, 0.5, 0.3, 0.3, 50, 1.1, 1, 1.2); // badan: x, y, z, radius, height, segments
    var badan1 = new MyObject(badan1Data.vertices, badan1Data.faces, shader_vertex_source, shader_fragment_source, badan1Data.colors);
    badan1.setup();

    //Badan bawah
    var badan2Data = functionObj1.generateBadan2(0, -0.9, 0.5, 0.5, 50, 0.95, 1.1, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var badan2 = new MyObject(badan2Data.vertices, badan2Data.faces, shader_vertex_source, shader_fragment_source, badan2Data.colors);
    badan2.setup();

    //Pipi Kiri
    var pipi1Data = functionObj1.generatePipi(-0.7, -0.4, 0.7, -0.09, 50, 1, 1, 3, 0.3, 0.8, 1); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var pipi1 = new MyObject(pipi1Data.vertices, pipi1Data.faces, shader_vertex_source, shader_fragment_source, pipi1Data.colors);
    pipi1.setup();

    //Pipi Kanan
    var pipi2Data = functionObj1.generatePipi(0.7, -0.4, 0.7, -0.09, 50, 1, 1, 3,  0.3, -0.8, 1); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var pipi2 = new MyObject(pipi2Data.vertices, pipi2Data.faces, shader_vertex_source, shader_fragment_source, pipi2Data.colors);
    pipi2.setup();

    //Tanduk depan
    var tanduk1Data = functionObj1.generateTanduk(0, 0.85, 0.8, 0.09, 50, 1, 0.8, 3, 0.15,0,0); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tanduk1 = new MyObject(tanduk1Data.vertices, tanduk1Data.faces, shader_vertex_source, shader_fragment_source, tanduk1Data.colors);
    tanduk1.setup();

    //Tanduk belakang
    var tanduk2Data = functionObj1.generateTanduk(0, 1, 0.55, 0.09, 50, 1, 0.8, 3, -0.1,0,0); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tanduk2 = new MyObject(tanduk2Data.vertices, tanduk2Data.faces, shader_vertex_source, shader_fragment_source, tanduk2Data.colors);
    tanduk2.setup();

    //Ekor1
    var ekor1Data = functionObj1.generateEkor1(0, -0.95, -0.1, 0.25, 50, 0.8, 1.2, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ekor1 = new MyObject(ekor1Data.vertices, ekor1Data.faces, shader_vertex_source, shader_fragment_source,ekor1Data.colors);
    ekor1.setup();

    //Ekor 2
    var ekor2Data = functionObj1.generateEkor2(0, -0.65, -0.3, 0.3, 50, 1, 1.3, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ekor2 = new MyObject(ekor2Data.vertices, ekor2Data.faces, shader_vertex_source, shader_fragment_source, ekor2Data.colors);
    ekor2.setup();

    //Ekor 3
    var ekor3Data = functionObj1.generateEkor3(0, -0.1, -0.3, 0.35, 50, 0.7, 0.7, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ekor3 = new MyObject(ekor3Data.vertices, ekor3Data.faces, shader_vertex_source, shader_fragment_source, ekor3Data.colors);
    ekor3.setup();

    //Kaki 1
    var kaki1Data = functionObj1.generateKaki(0.2, -1.4, 0.5, 0.16, 0.5, 50, 1.1, 1, 1); // badan: x, y, z, radius, height, segments
    var kaki1 = new MyObject(kaki1Data.vertices, kaki1Data.faces, shader_vertex_source, shader_fragment_source,kaki1Data.colors);
    kaki1.setup();

    //Kaki 2
    var kaki2Data = functionObj1.generateKaki(-0.2, -1.4, 0.5, 0.16, 0.5, 50, 1.1, 1, 1); // badan: x, y, z, radius, height, segments
    var kaki2 = new MyObject(kaki2Data.vertices, kaki2Data.faces, shader_vertex_source, shader_fragment_source, kaki2Data.colors);
    kaki2.setup();

    //Alas kaki 1 
    var alas1Data = functionObj1.generateAlasKaki(-0.2, -1.65, 0.55, 0.2, 50, -0.9, -0.5, 1.1); // alas kaki: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var alas1 = new MyObject(alas1Data.vertices, alas1Data.faces, shader_vertex_source, shader_fragment_source, alas1Data.colors);
    alas1.setup();

    //Alas kaki 2
    var alas2Data = functionObj1.generateAlasKaki(0.2, -1.65, 0.55, 0.2, 50, -0.9, -0.5, 1.1); // alas kaki: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var alas2 = new MyObject(alas2Data.vertices, alas2Data.faces, shader_vertex_source, shader_fragment_source, alas2Data.colors);
    alas2.setup();

    //Tangan kiri
    var tangan1Data = functionObj1.generateTangan(-0.75, -0.82, 0.7, -0.09, 50, 1, 1, 3, 0.32, 0.8, 1); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tangan1 = new MyObject(tangan1Data.vertices, tangan1Data.faces, shader_vertex_source, shader_fragment_source, tangan1Data.colors);
    tangan1.setup();

    //Tangan kanan
    var tangan2Data = functionObj1.generateTangan(0.75, -0.82, 0.7, -0.09, 50, 1, 1, 3,  0.3, -0.8, 1); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tangan2 = new MyObject(tangan2Data.vertices, tangan2Data.faces, shader_vertex_source, shader_fragment_source, tangan2Data.colors);
    tangan2.setup();

    //Mata kiri
    var mata1Data = functionObj1.generateMata(0.21, 0.02, 1, 0.2, 200, 1, 1,0.5); // badan: x, y, z, radius, segments
    var mata1 = new MyObject(mata1Data.vertices, mata1Data.faces, shader_vertex_source, shader_fragment_source, mata1Data.colors);
    mata1.setup();

    //Mata kanan
    var mata2Data = functionObj1.generateMata(-0.21, 0.02, 1, 0.2, 200, 1, 1,0.5); // badan: x, y, z, radius, segments
    var mata2 = new MyObject(mata2Data.vertices, mata2Data.faces, shader_vertex_source, shader_fragment_source, mata2Data.colors);
    mata2.setup();

    // Mata kiri 2
    var mata3Data = functionObj1.generateMata2(0.21, 0.02, 1, 0.17, 200,1, 1, 0.7); // badan: x, y, z, radius, segments
    var mata3 = new MyObject(mata3Data.vertices, mata3Data.faces, shader_vertex_source, shader_fragment_source, mata3Data.colors);
    mata3.setup();

    //Mata kanan 2
    var mata4Data = functionObj1.generateMata2(-0.21, 0.02, 1, 0.17, 200,1, 1, 0.7); // badan: x, y, z, radius, segments
    var mata4 = new MyObject(mata4Data.vertices, mata4Data.faces, shader_vertex_source, shader_fragment_source,mata4Data.colors);
    mata4.setup();

    //Mata kiri 3
    var mata5Data = functionObj1.generateMata3(0.22, 0.02, 1.02, 0.12, 200); // badan: x, y, z, radius, segments
    var mata5 = new MyObject(mata5Data.vertices, mata5Data.faces, shader_vertex_source, shader_fragment_source, mata5Data.colors);
    mata5.setup();

    //Mata kanan 3
    var mata6Data = functionObj1.generateMata3(-0.22, 0.02, 1.02, 0.12, 200); // badan: x, y, z, radius, segments
    var mata6 = new MyObject(mata6Data.vertices, mata6Data.faces, shader_vertex_source, shader_fragment_source, mata6Data.colors);
    mata6.setup();
    
    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var cameraSpeed = 0.1; // Kecepatan pergerakan kamer


var MODEL_MATRIX;
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


        kepala.render(VIEW_MATRIX, PROJECTION_MATRIX);
        badan1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        badan2.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tangan1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tangan2.render(VIEW_MATRIX, PROJECTION_MATRIX);
        pipi1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        pipi2.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tanduk1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        tanduk2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        ekor1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        ekor2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        ekor3.render(VIEW_MATRIX,PROJECTION_MATRIX);
        kaki1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        kaki2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        alas1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        alas2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        mata1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        mata2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        mata3.render(VIEW_MATRIX,PROJECTION_MATRIX);
        mata4.render(VIEW_MATRIX,PROJECTION_MATRIX);
        mata5.render(VIEW_MATRIX,PROJECTION_MATRIX);
        mata6.render(VIEW_MATRIX,PROJECTION_MATRIX);

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);