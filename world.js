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

    //ENVIRONMENT
    // tanah hemisphere
    var tanahData = envFunction.generateBase(0, -0.3, 0.5, 1, 50); // badan: x, y, z, radius, segments
    var tanah = new MyObject(tanahData.vertices, tanahData.faces, shader_vertex_source, shader_fragment_source, tanahData.colors);
    tanah.setup();

    // rumput
    var rumputData = envFunction.generateRumput(0, -0.26, 0.5, 1.05, 20); // badan: x, y, z, radius, segments
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


    //OBJECT1
    // Kepala
    var kepalaData = functionObj1.generateKepala(-1* 0.4, 0.025 * 0.4, 0.95 * 0.4, 0.275 * 0.4, 50, 1.3, 1, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var kepala = new MyObject(kepalaData.vertices, kepalaData.faces, shader_vertex_source, shader_fragment_source, kepalaData.colors);
    kepala.setup();

    // Badan Atas
    var badan1Data = functionObj1.generateBadan1(-1* 0.4, -0.175 * 0.4, 0.95 * 0.4, 0.15 *0.4, 0.15 * 0.4, 50, 1.1, 1, 1.2); // badan: x, y, z, radius, height, segments
    var badan1 = new MyObject(badan1Data.vertices, badan1Data.faces, shader_vertex_source, shader_fragment_source, badan1Data.colors);
    badan1.setup();

    // Badan bawah
    var badan2Data = functionObj1.generateBadan2(-1* 0.4, -0.35 * 0.4, 0.95 * 0.4, 0.25 * 0.4, 50, 0.95, 1.1, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var badan2 = new MyObject(badan2Data.vertices, badan2Data.faces, shader_vertex_source, shader_fragment_source, badan2Data.colors);
    badan2.setup();

    // Pipi Kiri
    var pipi1Data = functionObj1.generatePipi(-1.35 * 0.4, -0.11 * 0.4, 1.05 * 0.4, -0.045 * 0.4, 50, 1, 1, 3, 0.4, 0.8 , 0.5); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var pipi1 = new MyObject(pipi1Data.vertices, pipi1Data.faces, shader_vertex_source, shader_fragment_source, pipi1Data.colors);
    pipi1.setup();

    // Pipi Kanan
    var pipi2Data = functionObj1.generatePipi(-0.65 * 0.4, -0.11 * 0.4, 1.05 * 0.4, -0.045 * 0.4, 50, 1, 1, 3, 0.4, -0.8 , 0.5); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var pipi2 = new MyObject(pipi2Data.vertices, pipi2Data.faces, shader_vertex_source, shader_fragment_source, pipi2Data.colors);
    pipi2.setup();

    // Tanduk depan
    var tanduk1Data = functionObj1.generateTanduk(-1* 0.4, 0.525 * 0.4, 1.1 * 0.4, 0.045 * 0.4, 50, 1, 0.8, 3, 0.075 * 0.4, 0, 0); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tanduk1 = new MyObject(tanduk1Data.vertices, tanduk1Data.faces, shader_vertex_source, shader_fragment_source, tanduk1Data.colors);
    tanduk1.setup();

    // Tanduk belakang
    var tanduk2Data = functionObj1.generateTanduk(-1* 0.4, 0.6 * 0.4, 0.975 * 0.4, 0.045 * 0.4, 50, 1, 0.8, 3, -0.05 * 0.4, 0, 0); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tanduk2 = new MyObject(tanduk2Data.vertices, tanduk2Data.faces, shader_vertex_source, shader_fragment_source, tanduk2Data.colors);
    tanduk2.setup();

    // Ekor1
    var ekor1Data = functionObj1.generateEkor1(-1* 0.4, -0.375 * 0.4, 0.65 * 0.4, 0.125 * 0.4, 50, 0.8, 1.2, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ekor1 = new MyObject(ekor1Data.vertices, ekor1Data.faces, shader_vertex_source, shader_fragment_source, ekor1Data.colors);
    ekor1.setup();

    // Ekor 2
    var ekor2Data = functionObj1.generateEkor2(-1* 0.4, -0.225 * 0.4, 0.55 * 0.4, 0.15 * 0.4, 50, 1, 1.3, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ekor2 = new MyObject(ekor2Data.vertices, ekor2Data.faces, shader_vertex_source, shader_fragment_source, ekor2Data.colors);
    ekor2.setup();

    // Ekor 3
    var ekor3Data = functionObj1.generateEkor3(-1* 0.4, 0.05 * 0.4,  0.55 * 0.4, 0.175 * 0.4, 50, 0.7, 0.7, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var ekor3 = new MyObject(ekor3Data.vertices, ekor3Data.faces, shader_vertex_source, shader_fragment_source, ekor3Data.colors);
    ekor3.setup();

    // Kaki 1
    var kaki1Data = functionObj1.generateKaki(-0.9 * 0.4, -0.57 * 0.4, 0.95 * 0.4, 0.08 * 0.4, 0.3 * 0.4, 50, 1.1, 1, 1); // badan: x, y, z, radius, height, segments
    var kaki1 = new MyObject(kaki1Data.vertices, kaki1Data.faces, shader_vertex_source, shader_fragment_source, kaki1Data.colors);
    kaki1.setup();

    // Kaki 2
    var kaki2Data = functionObj1.generateKaki(-1.1 * 0.4, -0.57 * 0.4, 0.95 * 0.4, 0.08 * 0.4, 0.3 *0.4, 50, 1.1, 1, 1); // badan: x, y, z, radius, height, segments
    var kaki2 = new MyObject(kaki2Data.vertices, kaki2Data.faces, shader_vertex_source, shader_fragment_source, kaki2Data.colors);
    kaki2.setup();

    // Alas kaki 1
    var alas1Data = functionObj1.generateAlasKaki(-1.1 * 0.4, -0.725 * 0.4, 0.975 * 0.4, 0.1 * 0.4, 50, -0.9, -0.5, 1.1); // alas kaki: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var alas1 = new MyObject(alas1Data.vertices, alas1Data.faces, shader_vertex_source, shader_fragment_source, alas1Data.colors);
    alas1.setup();

    // Alas kaki 2
    var alas2Data = functionObj1.generateAlasKaki(-0.9 * 0.4, -0.725 * 0.4, 0.975 * 0.4, 0.1 * 0.4, 50, -0.9, -0.5, 1.1); // alas kaki: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var alas2 = new MyObject(alas2Data.vertices, alas2Data.faces, shader_vertex_source, shader_fragment_source, alas2Data.colors);
    alas2.setup();

    // Tangan kiri
    var tangan1Data = functionObj1.generateTangan(-1.375 * 0.4, -0.31 * 0.4, 1.05 * 0.4, -0.045 * 0.4, 50, 1, 1, 3, 0.4, 0.8 , 0.5); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tangan1 = new MyObject(tangan1Data.vertices, tangan1Data.faces, shader_vertex_source, shader_fragment_source, tangan1Data.colors);
    tangan1.setup();

    // Tangan kanan
    var tangan2Data = functionObj1.generateTangan(-0.625 * 0.4, -0.31 * 0.4, 1.05 * 0.4, -0.045 * 0.4, 50, 1, 1, 3, 0.4, -0.8 , 0.5); // badan: x, y, z, radius, segments, scaleX, scaleY, scaleZ, offsetX, offsetY,offsetZ
    var tangan2 = new MyObject(tangan2Data.vertices, tangan2Data.faces, shader_vertex_source, shader_fragment_source, tangan2Data.colors);
    tangan2.setup();

    // Mata kiri
    var mata1Data = functionObj1.generateMata(-0.905 * 0.4, 0.11 * 0.4, 1.2 * 0.4, 0.1 * 0.4, 100, 1, 1, 0.5); // badan: x, y, z, radius, segments
    var mata1 = new MyObject(mata1Data.vertices, mata1Data.faces, shader_vertex_source, shader_fragment_source, mata1Data.colors);
    mata1.setup();

    // Mata kanan
    var mata2Data = functionObj1.generateMata(-1.105 * 0.4, 0.11 * 0.4, 1.2 * 0.4, 0.1 * 0.4, 100, 1, 1, 0.5); // badan: x, y, z, radius, segments
    var mata2 = new MyObject(mata2Data.vertices, mata2Data.faces, shader_vertex_source, shader_fragment_source, mata2Data.colors);
    mata2.setup();

    // Mata kiri 2
    var mata3Data = functionObj1.generateMata2(-.905 * 0.4, 0.11 * 0.4, 1.2 * 0.4, 0.085 * 0.4, 100, 1, 1, 0.7); // badan: x, y, z, radius, segments
    var mata3 = new MyObject(mata3Data.vertices, mata3Data.faces, shader_vertex_source, shader_fragment_source, mata3Data.colors);
    mata3.setup();

    // Mata kanan 2
    var mata4Data = functionObj1.generateMata2(-1.105 * 0.4, 0.11 * 0.4, 1.2 * 0.4, 0.085 * 0.4, 100, 1, 1, 0.7); // badan: x, y, z, radius, segments
    var mata4 = new MyObject(mata4Data.vertices, mata4Data.faces, shader_vertex_source, shader_fragment_source, mata4Data.colors);
    mata4.setup();

    // Mata kiri 3
    var mata5Data = functionObj1.generateMata3(-0.91 * 0.4, 0.11 * 0.4, 1.21 * 0.4, 0.06 * 0.4, 100); // badan: x, y, z, radius, segments
    var mata5 = new MyObject(mata5Data.vertices, mata5Data.faces, shader_vertex_source, shader_fragment_source, mata5Data.colors);
    mata5.setup();

    // Mata kanan 3
    var mata6Data = functionObj1.generateMata3(-1.11 * 0.4, 0.11 * 0.4, 1.21 * 0.4, 0.06 * 0.4, 100); // badan: x, y, z, radius, segments
    var mata6 = new MyObject(mata6Data.vertices, mata6Data.faces, shader_vertex_source, shader_fragment_source, mata6Data.colors);
    mata6.setup();

    // mulut
    var mulutData = functionObj1.generateCurves([
        [-0.425, -0.02, 0.458],
        [-0.41, -0.01, 0.468],
        [-0.4, -0.01 , 0.468],
        [-0.375, -0.02, 0.458],
    ], 250, 0.025,0.002);
    var mulut = new MyObject(mulutData.vertices, mulutData.faces, shader_vertex_source, shader_fragment_source, mulutData.colors);
    mulut.setup();


    //CHILD PUSH
    badan1.child.push(badan2);
    badan1.child.push(kepala);
    kepala.child.push(mata1);
    kepala.child.push(mata2);
    kepala.child.push(mulut);
    mata2.child.push(mata4);
    mata4.child.push(mata6);
    mata1.child.push(mata3);
    mata3.child.push(mata5);
    kepala.child.push(tanduk1);
    kepala.child.push(tanduk2);
    kepala.child.push(pipi1);
    kepala.child.push(pipi2);
    ekor1.child.push(ekor2);
    ekor2.child.push(ekor3);
    badan2.child.push(tangan1);
    badan2.child.push(tangan2);
    // badan2.child.push(kaki1);
    // badan2.child.push(kaki2);
    badan2.child.push(ekor1);
    kaki1.child.push(alas2);
    kaki2.child.push(alas1);

    //OBJECT2
    var headData = functionObj2.generateKepala(0, 0.55 * 0.4, 0.55 * 0.4, 0.3 * 0.4, 50, 1, 1, 1);
    var head = new MyObject(headData.vertices, headData.faces, shader_vertex_source, shader_fragment_source, headData.colors);
    head.setup();

    var upperbodyData = functionObj2.generateUpperbody(0, 0.39 * 0.4, 0.55 * 0.4, 0.2 * 0.4, 100, 1, 1.01, 1);
    var upperbody = new MyObject(upperbodyData.vertices, upperbodyData.faces, shader_vertex_source, shader_fragment_source, upperbodyData.colors);
    upperbody.setup();

    var lowerbodyData = functionObj2.generateLowerbody(0, -0.105 * 0.4, 0.55 * 0.4, 0.314 * 0.4, 100, 0, 0, 0);
    var lowerbody = new MyObject(lowerbodyData.vertices, lowerbodyData.faces, shader_vertex_source, shader_fragment_source, lowerbodyData.colors);
    lowerbody.setup();

    var leftribbonData = functionObj2.generateleftribbon(0, 0.245 * 0.4, 0.725 * 0.4, 0.05 * 0.4, 50, 0.2, 0.5, 1);
    var leftribbon = new MyObject(leftribbonData.vertices, leftribbonData.faces, shader_vertex_source, shader_fragment_source, leftribbonData.colors);
    leftribbon.setup();

    var rightribbonData = functionObj2.generaterightribbon(0, 0.245 * 0.4, 0.725 * 0.4, 0.05 * 0.4, 50, 0.2, 0.5, 1);
    var rightribbon = new MyObject(rightribbonData.vertices, rightribbonData.faces, shader_vertex_source, shader_fragment_source, rightribbonData.colors);
    rightribbon.setup();

    var tailsphereData = functionObj2.generateTailSphere(0, 0.09 * 0.4, 0.225 * 0.4, 0.1 * 0.4, 100, 1, 1, 1);
    var tailsphere = new MyObject(tailsphereData.vertices, tailsphereData.faces, shader_vertex_source, shader_fragment_source, tailsphereData.colors);
    tailsphere.setup();

    var tailheadData = functionObj2.generateTail1(0, 0.19 * 0.4, 0.075 * 0.4, -0.075 * 0.4, 100, 1, 1, 2, 0.5, 0, 0);
    var tailhead = new MyObject(tailheadData.vertices, tailheadData.faces, shader_vertex_source, shader_fragment_source, tailheadData.colors);
    tailhead.setup();

    var leftfeetData = functionObj2.generateFeet(-0.125 * 0.4, -0.4 * 0.4, 0.55 * 0.4, 0.1 * 0.4, 0.5 * 0.4, 100);
    var leftfeet = new MyObject(leftfeetData.vertices, leftfeetData.faces, shader_vertex_source, shader_fragment_source, leftfeetData.colors);
    leftfeet.setup();

    var rightfeetData = functionObj2.generateFeet(0.125 * 0.4, -0.4 * 0.4, 0.55 * 0.4, 0.1 * 0.4, 0.5 * 0.4, 100);
    var rightfeet = new MyObject(rightfeetData.vertices, rightfeetData.faces, shader_vertex_source, shader_fragment_source, rightfeetData.colors);
    rightfeet.setup();

    var rightsoleData = functionObj2.generateSole(0.125 * 0.4, -0.69 * 0.4, 0.575 * 0.4, 0.125 * 0.4, 100, 0.9, 0.5, 1.5);
    var rightsole = new MyObject(rightsoleData.vertices, rightsoleData.faces, shader_vertex_source, shader_fragment_source, rightsoleData.colors);
    rightsole.setup();

    var leftsoleData = functionObj2.generateSole(-0.125 * 0.4, -0.69 * 0.4, 0.575 * 0.4, 0.125 * 0.4, 100, 0.9, 0.5, 1.5);
    var leftsole = new MyObject(leftsoleData.vertices, leftsoleData.faces, shader_vertex_source, shader_fragment_source, leftsoleData.colors);
    leftsole.setup();

    var leftshoulderData = functionObj2.generateLeftshoulder(0.49 * 0.4, -0.1 * 0.4, 0.55 * 0.4, 0.05 * 0.4, 50, 1, 1, 0.5,0,0,-0.7);
    var leftshoulder = new MyObject(leftshoulderData.vertices, leftshoulderData.faces, shader_vertex_source, shader_fragment_source, leftshoulderData.colors);
    leftshoulder.setup();

    var rightshoulderData = functionObj2.generateRightshoulder(-0.49 * 0.4, -0.095* 0.4, 0.55 * 0.4, 0.049 * 0.4, 50, 1, 1, 0.5,0,0,0.7);
    var rightshoulder = new MyObject(rightshoulderData.vertices, rightshoulderData.faces, shader_vertex_source, shader_fragment_source, rightshoulderData.colors);
    rightshoulder.setup();

    var leftarmData = functionObj2.generateArm(-0.26 * 0.4, 0.1 * 0.4, 0.55 * 0.4, 0.45 * 0.4, 2.7*0.4, 50,0,0,0.7);
    var leftarm = new MyObject(leftarmData.vertices, leftarmData.faces, shader_vertex_source, shader_fragment_source,leftarmData.colors);
    leftarm.setup();

    var rightarmData = functionObj2.generateArm(0.26 * 0.4, 0.1 * 0.4, 0.55 * 0.4, 0.45* 0.4, 2.7*0.4, 50,0,0,-0.7);
    var rightarm = new MyObject(rightarmData.vertices, rightarmData.faces, shader_vertex_source, shader_fragment_source, rightarmData.colors);
    rightarm.setup();

    var rightearData = functionObj2.generateEar(-0.19 * 0.4, 0.925 * 0.4, 0.55 * 0.4, 0.075 * 0.4,  100, 1.2, 3, 1, 0,0,0.25);
    var rightear = new MyObject(rightearData.vertices, rightearData.faces, shader_vertex_source, shader_fragment_source, rightearData.colors);
    rightear.setup();

    var leftearData = functionObj2.generateEar(0.19 * 0.4, 0.925 * 0.4, 0.55 * 0.4, 0.075 * 0.4,  100, 1.2, 3, 1, 0,0,-0.25);
    var leftear = new MyObject(leftearData.vertices, leftearData.faces, shader_vertex_source, shader_fragment_source, leftearData.colors);
    leftear.setup();

    var lefteyeData = functionObj2.generateEye(-0.1 * 0.4, 0.525 * 0.4, 0.8 * 0.4, 0.07 * 0.4, 50, 1, 1.3, 1);
    var lefteye = new MyObject(lefteyeData.vertices, lefteyeData.faces, shader_vertex_source, shader_fragment_source, lefteyeData.colors);
    lefteye.setup();

    var righteyeData = functionObj2.generateEye(0.1 * 0.4, 0.525 * 0.4, 0.8 * 0.4, 0.07 * 0.4, 50, 1, 1.3, 1);
    var righteye = new MyObject(righteyeData.vertices, righteyeData.faces, shader_vertex_source, shader_fragment_source, righteyeData.colors);
    righteye.setup();

    var lefteye2Data = functionObj2.generateEye2(-0.0985 * 0.4, 0.525 * 0.4, 0.825 * 0.4, 0.055 * 0.4, 50, 1, 1.3, 1);
    var lefteye2 = new MyObject(lefteye2Data.vertices, lefteye2Data.faces, shader_vertex_source, shader_fragment_source, lefteye2Data.colors);
    lefteye2.setup();

    var righteye2Data = functionObj2.generateEye2(0.0985 * 0.4, 0.525 * 0.4, 0.825 * 0.4, 0.055 * 0.4, 50, 1, 1.3, 1);
    var righteye2 = new MyObject(righteye2Data.vertices, righteye2Data.faces, shader_vertex_source, shader_fragment_source, righteye2Data.colors);
    righteye2.setup();

    var lefteye3Data = functionObj2.generateEye3(-0.096 * 0.4, 0.525 * 0.4, 0.85 * 0.4, 0.035 * 0.4,50, 1, 1.3, 1);
    var lefteye3 = new MyObject(lefteye3Data.vertices, lefteye3Data.faces, shader_vertex_source, shader_fragment_source, lefteye3Data.colors);
    lefteye3.setup();

    var righteye3Data = functionObj2.generateEye3(0.096 * 0.4, 0.525 * 0.4, 0.85 * 0.4, 0.035 * 0.4, 50, 1, 1.3, 1);
    var righteye3 = new MyObject(righteye3Data.vertices, righteye3Data.faces, shader_vertex_source, shader_fragment_source, righteye3Data.colors);
    righteye3.setup();

    var noseData = functionObj2.generateEye3(0, 0.45 * 0.4, 0.8435 * 0.4, 0.01 * 0.4                    , 50, 1.3, 1, 1);
    var nose = new MyObject(noseData.vertices, noseData.faces, shader_vertex_source, shader_fragment_source, noseData.colors);
    nose.setup();

    var mouth1Data = functionObj1.generateCurves(
        [
            [-0.032, 0.14, 0.3],
            [-0.015, 0.12, 0.29],
            [-0.0095, 0.13 , 0.3],
            [0, 0.16, 0.32],
        ], 

        250, 0.005,0.002 

    );
    var mouth1 = new MyObject(mouth1Data.vertices, mouth1Data.faces, shader_vertex_source, shader_fragment_source, mouth1Data.colors);
    mouth1.setup();

    var mouth2Data = functionObj1.generateCurves(
        [
            [0, 0.16, 0.32],
            [0.0095, 0.13, 0.3],
            [0.015, 0.12 , 0.29],
            [0.032, 0.14, 0.304],
        ], 

        250, 0.005,0.002

    );
    var mouth2 = new MyObject(mouth2Data.vertices, mouth2Data.faces, shader_vertex_source, shader_fragment_source, mouth2Data.colors);
    mouth2.setup();

    upperbody.child.push(head);
    head.child.push(leftear);
    head.child.push(rightear);
    head.child.push(nose);
    head.child.push(lefteye);
    head.child.push(righteye);
    head.child.push(mouth1);
    head.child.push(mouth2);
    lefteye.child.push(lefteye2);
    lefteye2.child.push(lefteye3);
    righteye.child.push(righteye2);
    righteye2.child.push(righteye3);
    lowerbody.child.push(leftarm);
    lowerbody.child.push(rightarm);
    leftarm.child.push(leftshoulder);
    rightarm.child.push(rightshoulder);
    lowerbody.child.push(tailsphere);
    tailsphere.child.push(tailhead);
    lowerbody.child.push(upperbody);
    // lowerbody.child.push(leftfeet);
    // lowerbody.child.push(rightfeet);
    leftfeet.child.push(leftsole);
    rightfeet.child.push(rightsole);

    //OBJECT3
    var dataKepala = functionObj3.generateKepala(1.8*0.25, -0.2*0.25, 1.4*0.25, 0.5*0.25, 50, 1.2, 1.3, 1);
var kepalaAyam = new MyObject(dataKepala.vertices, dataKepala.faces, shader_vertex_source, shader_fragment_source, dataKepala.colors);
kepalaAyam.setup();

var dataSayapKiri = functionObj3.generateSayapKiri(2.18*0.25, -0.22*0.25, 1.4*0.25, 0.4*0.25, 50, 0.8, 1.2, 1, 0.45, 0, 0);
var sayapKiri = new MyObject(dataSayapKiri.vertices, dataSayapKiri.faces, shader_vertex_source, shader_fragment_source, dataSayapKiri.colors);
sayapKiri.setup();

var dataSayapKanan = functionObj3.generateSayapKanan(1.42*0.25, -0.22*0.25, 1.4*0.25, 0.4*0.25, 50, 0.8, 1.2, 1, 0.45, 0, 0);
var sayapKanan = new MyObject(dataSayapKanan.vertices, dataSayapKanan.faces, shader_vertex_source, shader_fragment_source, dataSayapKanan.colors);
sayapKanan.setup();

var dataKakiKiri = functionObj3.generateKaki(2*0.25, -0.7*0.25, 1.35*0.25, 0.15*0.25, 50, 0.5, 3, 0.5);
var kakiKiri = new MyObject(dataKakiKiri.vertices, dataKakiKiri.faces, shader_vertex_source, shader_fragment_source, dataKakiKiri.colors);
kakiKiri.setup();

var dataKakiKanan = functionObj3.generateKaki(1.6*0.25, -0.7*0.25, 1.35*0.25, 0.15*0.25, 50, 0.5, 3, 0.5);
var kakiKanan = new MyObject(dataKakiKanan.vertices, dataKakiKanan.faces, shader_vertex_source, shader_fragment_source, dataKakiKanan.colors);
kakiKanan.setup();

var dataMataKanan = functionObj3.generateMata(1.95*0.25, -0.14*0.25, 1.83*0.25, 0.5*0.25, 50, 0.15, 0.2, 0.1);
var mataKanan = new MyObject(dataMataKanan.vertices, dataMataKanan.faces, shader_vertex_source, shader_fragment_source, dataMataKanan.colors);
mataKanan.setup();

var dataMataKiri = functionObj3.generateMata(1.65*0.25, -0.14*0.25, 1.83*0.25, 0.5*0.25, 50, 0.15, 0.2, 0.1);
var mataKiri = new MyObject(dataMataKiri.vertices, dataMataKiri.faces, shader_vertex_source, shader_fragment_source, dataMataKiri.colors);
mataKiri.setup();

var dataTelapakKanan1 = functionObj3.generateTelapakKaki(1.54*0.25, -1.13*0.25, 1.5*0.25, 0.5*0.25, 50, 0.55, 0.17, 0.2, 0, 0.3, -1.5);
var telapakKanan1 = new MyObject(dataTelapakKanan1.vertices, dataTelapakKanan1.faces, shader_vertex_source, shader_fragment_source, dataTelapakKanan1.colors);
telapakKanan1.setup();

var dataTelapakKanan2 = functionObj3.generateTelapakKaki(1.66*0.25, -1.13*0.25, 1.5*0.25, 0.5*0.25, 50, 0.55, 0.17, 0.2, 0, -0.3, -1.5);
var telapakKanan2 = new MyObject(dataTelapakKanan2.vertices, dataTelapakKanan2.faces, shader_vertex_source, shader_fragment_source, dataTelapakKanan2.colors);
telapakKanan2.setup();

var dataTelapakKiri1 = functionObj3.generateTelapakKaki(1.94*0.25, -1.13*0.25, 1.5*0.25, 0.5*0.25, 50, 0.55, 0.17, 0.2, 0, 0.3, -1.5);
var telapakKiri1 = new MyObject(dataTelapakKiri1.vertices, dataTelapakKiri1.faces, shader_vertex_source, shader_fragment_source, dataTelapakKiri1.colors);
telapakKiri1.setup();

var dataTelapakKiri2 = functionObj3.generateTelapakKaki(2.06*0.25, -1.13*0.25, 1.5*0.25, 0.5*0.25, 50, 0.55, 0.17, 0.2, 0, -0.3, -1.5);
var telapakKiri2 = new MyObject(dataTelapakKiri2.vertices, dataTelapakKiri2.faces, shader_vertex_source, shader_fragment_source, dataTelapakKiri2.colors);
telapakKiri2.setup();

var dataJenggerDepan = functionObj3.generateJengger(1.8*0.25, 0.3*0.25, 1.55*0.25, 0.4*0.25, 50, 0.4, 1, 0.25, 0.3, 0, 0);
var jenggerDepan = new MyObject(dataJenggerDepan.vertices, dataJenggerDepan.faces, shader_vertex_source, shader_fragment_source, dataJenggerDepan.colors);
jenggerDepan.setup();

var dataJenggerTengah = functionObj3.generateJengger(1.8*0.25, 0.3*0.25, 1.4*0.25, 0.4*0.25, 50, 0.4, 1, 0.25, 0, 0, 0);
var jenggerTengah = new MyObject(dataJenggerTengah.vertices, dataJenggerTengah.faces, shader_vertex_source, shader_fragment_source, dataJenggerTengah.colors);
jenggerTengah.setup();

var dataJenggerBelakang = functionObj3.generateJengger(1.8*0.25, 0.2*0.25, 1.3*0.25, 0.4*0.25, 50, 0.4, 1, 0.25, -0.3, 0, 0);
var jenggerBelakang = new MyObject(dataJenggerBelakang.vertices, dataJenggerBelakang.faces, shader_vertex_source, shader_fragment_source, dataJenggerBelakang.colors);
jenggerBelakang.setup();

var dataParuh = functionObj3.generateParuh(1.8*0.25, -0.2*0.25, 2.2*0.25, 0.3*0.25, 50, 0.7, 0.3, 1, 0, 0, 0);
var paruh = new MyObject(dataParuh.vertices, dataParuh.faces, shader_vertex_source, shader_fragment_source,dataParuh.colors);
paruh.setup();

var dataJenggerBawahKiri = functionObj3.generateJengger(1.85*0.25, -0.31*0.25, 1.9*0.25, 0.4*0.25, 50, 0.1, 0.35, 0.2, 0, 0, 0.2);
var jenggerBawahKiri = new MyObject(dataJenggerBawahKiri.vertices, dataJenggerBawahKiri.faces, shader_vertex_source, shader_fragment_source, dataJenggerBawahKiri.colors);
jenggerBawahKiri.setup();

var dataJenggerBawahKanan = functionObj3.generateJengger(1.75*0.25, -0.31*0.25, 1.9*0.25, 0.4*0.25, 50, 0.1, 0.35, 0.2, 0, 0, -0.2);
var jenggerBawahKanan = new MyObject(dataJenggerBawahKanan.vertices, dataJenggerBawahKanan.faces, shader_vertex_source, shader_fragment_source, dataJenggerBawahKanan.colors);
jenggerBawahKanan.setup();

var dataAlisKanan = functionObj3.generateAlis(
    [
        [0.475, -0.001, -0.028],
        [0.49, 0.004, -0.032], 
        [0.5, 0.004, -0.034],
        [0.515, -0.009, -0.033]
    ], 

    50, 0.5 , 0.006

);

var alisKanan = new MyObject(dataAlisKanan.vertices, dataAlisKanan.faces, shader_vertex_source, shader_fragment_source, dataAlisKanan.colors);
alisKanan.setup();

var dataAlisKiri = functionObj3.generateAlis(
    [
        [0.385, -0.009, -0.028],
        [0.4, 0.004, -0.032], 
        [0.41, 0.004,  -0.029],
        [0.425,-0.001, -0.028]
    ], 

    50, 0.5 , 0.006

);
var alisKiri = new MyObject(dataAlisKiri.vertices, dataAlisKiri.faces, shader_vertex_source, shader_fragment_source, dataAlisKiri.colors);
alisKiri.setup();


    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var badanDepresso = LIBS.get_I4();
    var kakiDepresso1 = LIBS.get_I4();
    var kakiDepresso2 = LIBS.get_I4();
    var badanFlopie = LIBS.get_I4();
    var kakiFlopie1 = LIBS.get_I4();
    var kakiFlopie2 = LIBS.get_I4();
    var badanAyam = LIBS.get_I4();
    var kakiAyam1 = LIBS.get_I4();
    var kakiAyam2 = LIBS.get_I4();
    var MODEL_MATRIX10 = LIBS.get_I4();

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

        
    var depressoMovementSpeed = 0.005; // Movement speed for badan2
    var walkFront = true; // Initial movement direction for badan2
    var depressoPos = [-1* 0.4, -0.35 * 0.4, 0.95 * 0.4];
    var walkAngle = 0; // Initial angle for walking animation
    var walkSpeed = 0.005; // Speed of the walking animation
    var maxWalkAngle = Math.PI / 32; 

    var flopieMovementSpeed = 0.005;
    var flopiePos = [0, -0.105 * 0.4, 0.55 * 0.4];
    var walkFront1 = true; // Initial movement direction for badan2
    

    


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

        //posisi awal
        if (walkFront == true) {
            depressoPos[2] += depressoMovementSpeed;
            if(depressoPos[2] >= 1) {
            walkFront = false;
            }
        }
        else {
            depressoPos[2] -= depressoMovementSpeed;
            if(depressoPos[2] <= 0.65) {
            walkFront = true;
            }
        }

        badanDepresso = LIBS.get_I4();
        LIBS.translateZ(badanDepresso, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(badanDepresso, Math.PI);
        }
        
        
        
    // Logic for walking animation
    walkAngle += walkSpeed;
    if (walkAngle > maxWalkAngle) {
        walkSpeed = -walkSpeed; // Reverse direction if reaching the maximum angle
    } else if (walkAngle < -maxWalkAngle) {
        walkSpeed = -walkSpeed; // Reverse direction if reaching the minimum angle
    }

        // Rotate kaki1 and kaki2 alternately
        var kaki1Angle = walkAngle;
        var kaki2Angle = -walkAngle;

        
        kakiDepresso1 = LIBS.get_I4();
        // Apply rotations to kaki1 and kaki2
        LIBS.rotateX(kakiDepresso1, kaki1Angle);
        LIBS.translateZ(kakiDepresso1, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(kakiDepresso1, Math.PI);
        }
        kaki1.MODEL_MATRIX = kakiDepresso1;
        // alas1.MODEL_MATRIX = MODEL_MATRIX2;
        kaki1.render(kaki1.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        kakiDepresso2 = LIBS.get_I4();
        LIBS.rotateX(kakiDepresso2, kaki2Angle);
        LIBS.translateZ(kakiDepresso2, depressoPos[2]);
        if (!walkFront) {
            LIBS.rotateY(kakiDepresso2, Math.PI);
        }
        // alas2.MODEL_MATRIX = MODEL_MATRIX3;
        kaki2.MODEL_MATRIX = kakiDepresso2;
        kaki2.render(kaki2.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        
          
        //render
        // ENVIRONMENT
        tanah.render(tanah.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        rumput.render(rumput.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        gunung.render(gunung.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        gunung2.render(gunung2.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);

        //OBJECT 1
        // kaki1.MODEL_MATRIX = MODEL_MATRIX2;
        // // alas1.MODEL_MATRIX = MODEL_MATRIX2;
        // kaki1.render(kaki1.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        // kaki2.MODEL_MATRIX = MODEL_MATRIX3;
        // kaki2.render(kaki2.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        badan1.MODEL_MATRIX = badanDepresso;
        badan1.render(badan1.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);
        // kepala.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // badan1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // badan2.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // tangan1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // tangan2.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // pipi1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // pipi2.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // tanduk1.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // tanduk2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // ekor1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // ekor2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // ekor3.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // kaki1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // kaki2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // alas1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // alas2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mata1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mata2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mata3.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mata4.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mata5.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mata6.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mulut.render(VIEW_MATRIX,PROJECTION_MATRIX);

        // // OBJECT2
        // posisi awal
        if (walkFront1 == true) {
            flopiePos[2] += flopieMovementSpeed;
            if(flopiePos[2] >= 1) {
            walkFront1 = false;
            }
        }
        else {
            flopiePos[2] -= flopieMovementSpeed;
            if(flopiePos[2] <= -1) {
            walkFront1 = true;
            }
        }

        badanFlopie = LIBS.get_I4();
        LIBS.translateZ(badanFlopie, flopiePos[2]);
        if (!walkFront1) {
            LIBS.rotateY(badanFlopie, Math.PI);
        }
        
        // Apply rotations to kaki1 and kaki2
        kakiFlopie1 = LIBS.get_I4();
        LIBS.rotateX(kakiFlopie1, kaki1Angle);
        LIBS.translateZ(kakiFlopie1, flopiePos[2]);
        if (!walkFront) {
            LIBS.rotateY(kakiFlopie1, Math.PI);
        }
        leftfeet.MODEL_MATRIX = kakiFlopie1;
        // alas1.MODEL_MATRIX = MODEL_MATRIX2;
        leftfeet.render(leftfeet.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        kakiFlopie2 = LIBS.get_I4();
        LIBS.rotateX(kakiFlopie2, kaki2Angle);
        LIBS.translateZ(kakiFlopie2, flopiePos[2]);
        if (!walkFront) {
            LIBS.rotateY(kakiFlopie2, Math.PI);
        }
        rightfeet.MODEL_MATRIX = kakiFlopie2;
        rightfeet.render(rightfeet.MODEL_MATRIX, VIEW_MATRIX, PROJECTION_MATRIX);

        // alas2.MODEL_MATRIX = MODEL_MATRIX3;
        
        
        // head.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // upperbody.render(VIEW_MATRIX, PROJECTION_MATRIX);
        
        lowerbody.MODEL_MATRIX = badanFlopie;
        lowerbody.render(lowerbody.MODEL_MATRIX,VIEW_MATRIX, PROJECTION_MATRIX);
        // leftribbon.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // rightribbon.render(VIEW_MATRIX, PROJECTION_MATRIX);
        //     // tail.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // tailsphere.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // tailhead.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // leftfeet.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // rightfeet.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // rightsole.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // leftsole.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // leftshoulder.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // rightshoulder.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // leftarm.render(leftarm.MODEL_MATRIX,VIEW_MATRIX,PROJECTION_MATRIX);
        // rightarm.render(rightarm.MODEL_MATRIX,VIEW_MATRIX,PROJECTION_MATRIX);
        // leftear.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // rightear.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // lefteye.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // righteye.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // lefteye2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // righteye2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // lefteye3.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // righteye3.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // nose.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mouth1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // mouth2.render(VIEW_MATRIX,PROJECTION_MATRIX);

        //OBJECT3
        // kepalaAyam.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // sayapKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // sayapKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // kakiKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // kakiKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // mataKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // mataKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // jenggerDepan.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // jenggerTengah.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // jenggerBelakang.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // paruh.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // jenggerBawahKiri.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // jenggerBawahKanan.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // telapakKanan1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // telapakKanan2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // telapakKiri1.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // telapakKiri2.render(VIEW_MATRIX,PROJECTION_MATRIX);
        // alisKanan.render(VIEW_MATRIX, PROJECTION_MATRIX);
        // alisKiri.render(VIEW_MATRIX, PROJECTION_MATRIX);


        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);