var mouseX = 0, mouseY = 0;
var prevMouseX = 0, prevMouseY = 0;
var isMouseDown = false;

var keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
}; //copy

// Elipsoid
function generateKepala(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [249/255,236/255,220/255] // Warna A1C398
    ];


    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        } //bentuk bola cuma ditambah scale jdi oval
    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
} 

function generateKepala(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [249/255,236/255,220/255] // Warna A1C398
    ];


    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        } //bentuk bola cuma ditambah scale jdi oval
    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
} 

//elipsoid paraboloid
function generateUpperbody(x, y, z, radius, segments, rotationX, rotationY, rotationZ) {
  var vertices = [];
  var colors = [];

  var angleIncrement = (2 * Math.PI) / segments;

  var rainbowColors = [
    [249/255,236/255,220/255]
  ];

  for (var i = 0; i <= segments; i++) {
      var latAngle = Math.PI * (-0.5 + (i / segments));
      var vLat = latAngle;

      for (var j = 0; j <= segments; j++) {
          var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
          var sinLon = Math.sin(lonAngle);
          var cosLon = Math.cos(lonAngle);

          var xCoord = cosLon * vLat;
          var yCoord = -(Math.pow(vLat,2));
          var zCoord = sinLon * vLat;

          var vertexX = x + radius * xCoord;
          var vertexY = y + radius * yCoord;
          var vertexZ = z + radius * zCoord;

          vertices.push(vertexX, vertexY, vertexZ);

          var colorIndex = j % rainbowColors.length;
          colors = colors.concat(rainbowColors[colorIndex]);
      }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
      for (var j = 0; j < segments; j++) {
          var index = i * (segments + 1) + j;
          var nextIndex = index + segments + 1;

          faces.push(index, nextIndex, index + 1);
          faces.push(nextIndex, nextIndex + 1, index + 1);
      }
  }
  return { vertices: vertices, colors: colors, faces: faces };
}

//Hemisphere
function generateLowerbody(x, y, z, radius, segments) {
  var vertices = [];
  var colors = [];
  var center = [x, y, z]; // Center point of the sphere

  var angleIncrement = (2 * Math.PI) / segments;

  var rainbowColors = [
    [249/255,236/255,220/255]
  ];

  for (var i = 0; i <= segments; i++) {
    var latAngle = Math.PI * (-0.5 + (i / segments));
    var sinLat = Math.sin(latAngle);
    var cosLat = Math.cos(latAngle);

    for (var j = 0; j <= segments/2; j++) {
      var lonAngle = 2 * Math.PI * (j / segments);
      var sinLon = Math.sin(lonAngle);
      var cosLon = Math.cos(lonAngle);

      var xCoord = cosLon * cosLat;
      var yCoord = -(sinLon * cosLat);
      var zCoord = sinLat;

      var vertexX = x + radius * xCoord;
      var vertexY = y + radius * yCoord;
      var vertexZ = z + radius * zCoord;

      vertices.push(vertexX, vertexY, vertexZ);

      var colorIndex = j % rainbowColors.length;
      colors = colors.concat(rainbowColors[colorIndex]);
    }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    for (var j = 0; j < segments; j++) {
      var index = i * (segments + 1) + j;
      var nextIndex = index + segments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }

  return { vertices: vertices, colors: colors, faces: faces, center: center };
} 

//Eliptic cone
function generateHat(x, y, z, radius, segments) {
  var vertices = [];
  var colors = [];
  
  var angleIncrement = (2 * Math.PI) / segments;

  var rainbowColors = [
    [1, 51/255, 51/255] 
  ];

  for (var i = 0; i <= segments; i++) {
      var latAngle = (i/segments);
      var v = latAngle

      for (var j = 0; j <= segments; j++) {
          var lonAngle = 2 * Math.PI * (j / segments);
          var sinLon = Math.sin(lonAngle);
          var cosLon = Math.cos(lonAngle);

          var xCoord = cosLon * v;
          var yCoord = sinLon * v;
          var zCoord = v;

          var vertexX = x + radius * xCoord;
          var vertexY = y + radius * yCoord;
          var vertexZ = z + radius * zCoord;

          vertices.push(vertexX, vertexY, vertexZ);

          var colorIndex = j % rainbowColors.length;
          colors = colors.concat(rainbowColors[colorIndex]);
      }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
      for (var j = 0; j < segments; j++) {
          var index = i * (segments + 1) + j;
          var nextIndex = index + segments + 1;

          faces.push(index, nextIndex, index + 1);
          faces.push(nextIndex, nextIndex + 1, index + 1);
      }
  }
  return { vertices: vertices, colors: colors, faces: faces };
}

//Eliptic paraboloid
function generateleftribbon(x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [246/255 ,242/255 ,180/255]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = -Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = -Math.pow(vLat, 2) * scaleZ;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = cosLon * vLat * scaleX ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }


    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}

//Eliptic paraboloid
function generaterightribbon(x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [246/255 ,242/255 ,180/255]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = -Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = Math.pow(vLat, 2) * scaleZ;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = cosLon * vLat * scaleX ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }


    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}

//SILINDER
function generateTail(x, y, z, radius, height, segments) {
  var vertices = [];
  var colors = [];

  var rainbowColors = [
      
    [249/255,236/255,220/255]
  ];

  for (var i = 0; i <= segments; i++) {
      var angle = 2 * Math.PI * (i / segments);
      var sinAngle = Math.sin(angle);
      var cosAngle = Math.cos(angle);

      for (var j = 0; j <= segments; j++) {
          var heightFraction = j / segments;
          var xCoord = -(radius * cosAngle);
          var yCoord = -(radius * sinAngle);
          var zCoord = height * heightFraction - height / 2;

          var vertexX = x + xCoord;
          var vertexY = y + yCoord;
          var vertexZ = z + zCoord;

          vertices.push(vertexX, vertexY, vertexZ);

          var colorIndex = j % rainbowColors.length;
          colors = colors.concat(rainbowColors[colorIndex]);
      }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
      for (var j = 0; j < segments; j++) {
          var index = i * (segments + 1) + j;
          var nextIndex = index + segments + 1;

          faces.push(index, nextIndex, index + 1);
          faces.push(nextIndex, nextIndex + 1, index + 1);
      }
  }
  return { vertices: vertices, colors: colors, faces: faces };
}

// Elipsoid
function generateTailSphere(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [128/255, 1, 0] // Warna A1C398
    ];


    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        } //bentuk bola cuma ditambah scale jdi oval
    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}

function generateTail1(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [128/255, 1, 0]
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = (i / segments);
        var v = -latAngle
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * v * ovalScaleX;
            var yCoord = sinLon * v * ovalScaleY;
            var zCoord = -v * ovalScaleZ;
            // var vertexX = x + radius * xCoord;
            // var vertexY = y + radius * yCoord;
            // var vertexZ = z + radius * zCoord;
            // Rotasi
            var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
            var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
            var rotatedZ = zCoord;
            // Pemutaran tambahan untuk diagonal
            rotatedY = rotatedY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
            rotatedZ = rotatedY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
            rotatedX = rotatedX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
            rotatedZ = rotatedX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);

            var vertexX = x + radius * rotatedX;
            var vertexY = y + radius * rotatedY;
            var vertexZ = z + radius * rotatedZ;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
            
            
        }
    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}

//SILINDER
function generateFeet(x, y, z, radius, height, segments) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [
        [249/255,236/255,220/255]
    ];

    for (var i = 0; i <= segments; i++) {
        var angle = 2 * Math.PI * (i / segments);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        for (var j = 0; j <= segments; j++) {
            var heightFraction = j / segments;
            var xCoord = radius * cosAngle;
            var yCoord = height * heightFraction - height / 2;
            var zCoord = (radius * sinAngle);

            var vertexX = x + xCoord;
            var vertexY = y + yCoord;
            var vertexZ = z + zCoord;

            vertices.push(vertexX, vertexY, vertexZ);

            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}

//Sphere
function generateSole(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [247/255, 143/255, 144/255] // Warna A1C398
    ];


    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments));
        var sinLat = Math.sin(latAngle);
        var cosLat = Math.cos(latAngle);
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * cosLat * ovalScaleX;
            var yCoord = sinLon * cosLat * ovalScaleY;
            var zCoord = sinLat * ovalScaleZ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        } //bentuk bola cuma ditambah scale jdi oval
    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
} 

//Eliptic paraboloid
function generateRightshoulder(x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [247/255, 143/255, 144/255]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = Math.cos(lonAngle);
            var cosLon = Math.sin(lonAngle);
            var xCoord = Math.pow(vLat, 2) * scaleZ;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = cosLon * vLat * scaleX ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }


    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}

//Eliptic Paraboloid
function generateLeftshoulder(x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [247/255, 143/255, 144/255]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = -Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = -Math.pow(vLat, 2) * scaleZ;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = cosLon * vLat * scaleX ;
            var vertexX = x + radius * xCoord;
            var vertexY = y + radius * yCoord;
            var vertexZ = z + radius * zCoord;
            vertices.push(vertexX, vertexY, vertexZ);
            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }


    }
    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
}

//Silinder
function generateArm(x, y, z, radius, height, segments) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [
        [249/255 , 241/255 ,230/255]
    ];

    for (var i = 0; i <= segments; i++) {
        var angle = 2 * Math.PI * (i / segments);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        for (var j = 0; j <= segments; j++) {
            var heightFraction = j / segments;
            var xCoord = height * heightFraction - height / 2;
            var yCoord = -radius * cosAngle;
            var zCoord = -(radius * sinAngle);

            var vertexX = x + xCoord;
            var vertexY = y + yCoord;
            var vertexZ = z + zCoord;

            vertices.push(vertexX, vertexY, vertexZ);

            var colorIndex = j % rainbowColors.length;
            colors = colors.concat(rainbowColors[colorIndex]);
        }
    }

    var faces = [];
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
            var index = i * (segments + 1) + j;
            var nextIndex = index + segments + 1;

            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
    return { vertices: vertices, colors: colors, faces: faces };
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

    var GL;
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

    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);

    GL.linkProgram(SHADER_PROGRAM);


    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");


    //uniform
    var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
    var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
    var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model


    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);
    GL.useProgram(SHADER_PROGRAM);

    // Kepala //pokoknya yg diganti z nya
    var kepala = generateKepala(0, 0.4, 0.5, 0.5, 50, 0.9, 0.9, 1); // badan: x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepala.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepala.colors), GL.STATIC_DRAW);
    var TUBE_FACES1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kepala.faces), GL.STATIC_DRAW);

    //Upper Body
    var upperbody = generateUpperbody(0, 0.2, 0.5, 0.4, 100, 0, 90, 0); // Example sphere: x=0, y=0, z=0.5, radius=0.6, segments=100, rotationX, rotationY, rotationZ
    var TUBE_VERTEX2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(upperbody.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(upperbody.colors), GL.STATIC_DRAW);
    var TUBE_FACES2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(upperbody.faces), GL.STATIC_DRAW);

    //Lower Body
    var lowerbody = generateLowerbody(0, -0.78, 0.5, 0.628, 100, 0, 0, 0); // Example sphere: x=0, y=0, z=0.5, radius=0.6, segments=100
    var TUBE_VERTEX4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(lowerbody.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(lowerbody.colors), GL.STATIC_DRAW);
    var TUBE_FACES4 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES4);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(lowerbody.faces), GL.STATIC_DRAW);
    
    //HAT
    var hat = generateHat(0, 1, 0.5, 0.8  , 100); // Example sphere: x=0, y=0, z=0.5, radius=0.8, segments=100
    var TUBE_VERTEX3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hat.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hat.colors), GL.STATIC_DRAW);
    var TUBE_FACES3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hat.faces), GL.STATIC_DRAW);

    //Left Ribbon
    var leftribbon = generateleftribbon(0, -0.09, 0.85, 0.1, 50, 0.2, 0.5, 1); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var TUBE_VERTEX5 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX5);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftribbon.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS5 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS5);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftribbon.colors), GL.STATIC_DRAW);
    var TUBE_FACES5 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES5);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftribbon.faces), GL.STATIC_DRAW);
    
    //Right Ribbbon
    var rightribbon = generaterightribbon(0, -0.09, 0.85, 0.1, 50, 0.2, 0.5, 1); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var TUBE_VERTEX6 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX6);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightribbon.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS6 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS6);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightribbon.colors), GL.STATIC_DRAW);
    var TUBE_FACES6 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES6);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightribbon.faces), GL.STATIC_DRAW);

    //Tail
    var tail = generateTail(0, -0.78, -0.35, 0.08, 0.6, 50); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var TUBE_VERTEX7 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX7);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tail.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS7 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS7);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tail.colors), GL.STATIC_DRAW);
    var TUBE_FACES7 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES7);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tail.faces), GL.STATIC_DRAW);

    //Tail Sphere
    var tailsphere = generateTailSphere(0, -0.78, -0.8, 0.2, 100, 1, 1, 1); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX8 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX8);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tailsphere.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS8 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS8);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tailsphere.colors), GL.STATIC_DRAW);
    var TUBE_FACES8 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES8);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tailsphere.faces), GL.STATIC_DRAW);

    //Tail head
    var tailhead = generateTail1(0,-0.58,-1.12, 0.15, 100, 1, 1, 2, 0.5, 0, 0); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX17 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX17);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tailhead.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS17 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS17);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tailhead.colors), GL.STATIC_DRAW);
    var TUBE_FACES17 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES17);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tailhead.faces), GL.STATIC_DRAW);

    //Left Kaki
    var leftfeet = generateFeet(-0.25, -1.4, 0.5, 0.2, 1, 100); //x, y, z, radius, height, segments
    var TUBE_VERTEX9 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX9);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftfeet.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS9 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS9);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftfeet.colors), GL.STATIC_DRAW);
    var TUBE_FACES9 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES9);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftfeet.faces), GL.STATIC_DRAW);

    //Right Kaki
    var rightfeet = generateFeet(0.25, -1.4, 0.5, 0.2, 1, 100); //x, y, z, radius, height, segments
    var TUBE_VERTEX10 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX10);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightfeet.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS10 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS10);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightfeet.colors), GL.STATIC_DRAW);
    var TUBE_FACES10 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES10);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightfeet.faces), GL.STATIC_DRAW);

    //Right Sole
    var rightsole = generateSole(0.25, -1.98, 0.6, 0.2, 100, -0.9, -0.5, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX11 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX11);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightsole.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS11 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS11);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightsole.colors), GL.STATIC_DRAW);
    var TUBE_FACES11 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES11);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightsole.faces), GL.STATIC_DRAW);
    
    //Left Sole
    var leftsole = generateSole(-0.25, -1.98, 0.6, 0.2, 100, -0.9, -0.5, 2); // x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ
    var TUBE_VERTEX12 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX12);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftsole.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS12 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS12);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftsole.colors), GL.STATIC_DRAW);
    var TUBE_FACES12 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES12);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftsole.faces), GL.STATIC_DRAW);

    //Left Shoulder
    var leftshoulder = generateLeftshoulder(1.185, -0.12, 0.5, 0.096, 50, 1, 1, 1); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var TUBE_VERTEX13 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX13);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftshoulder.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS13 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS13);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftshoulder.colors), GL.STATIC_DRAW);
    var TUBE_FACES13 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES13);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftshoulder.faces), GL.STATIC_DRAW);
    
    //Right Shoulder
    var rightshoulder = generateRightshoulder(-1.185, -0.12, 0.5, 0.096, 50, 1, 1, 1); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var TUBE_VERTEX14 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX14);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightshoulder.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS14 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS14);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightshoulder.colors), GL.STATIC_DRAW);
    var TUBE_FACES14 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES14);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightshoulder.faces), GL.STATIC_DRAW);

    //Left Arm
    var leftarm = generateArm(-0.55, -0.12, 0.5, 0.15, 0.8, 50); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var TUBE_VERTEX15 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX15);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftarm.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS15 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS15);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leftarm.colors), GL.STATIC_DRAW);
    var TUBE_FACES15 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES15);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leftarm.faces), GL.STATIC_DRAW);

    //Right Arm
    var rightarm = generateArm(0.55, -0.12, 0.5, 0.15, 0.8, 50); // Example tabung: x=0, y=0, z=0, radius=0.5, height=1.0, segments=50
    var TUBE_VERTEX16 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX16);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightarm.vertices), GL.STATIC_DRAW);
    var TUBE_COLORS16 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS16);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(rightarm.colors), GL.STATIC_DRAW);
    var TUBE_FACES16 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES16);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rightarm.faces), GL.STATIC_DRAW);

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

        // Kepala
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX1);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS1);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES1);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, kepala.faces.length, GL.UNSIGNED_SHORT, 0);

        // Upperbody
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX2);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS2);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES2);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, upperbody.faces.length, GL.UNSIGNED_SHORT, 0);
        

        //Lower Body
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX4);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS4);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES4);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, lowerbody.faces.length, GL.UNSIGNED_SHORT, 0);

        // // Hat
        // GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX3);
        // GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        // GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS3);
        // GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES3);
        // GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        // GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        // GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        // GL.drawElements(GL.TRIANGLES, hat.faces.length, GL.UNSIGNED_SHORT, 0);

        //Left Hand
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX5);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS5);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES5);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, leftribbon.faces.length, GL.UNSIGNED_SHORT, 0);

        

        //Right Hand
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX6);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS6);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES6);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, rightribbon.faces.length, GL.UNSIGNED_SHORT, 0);

        //Tail
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX7);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS7);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES7);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, tail.faces.length, GL.UNSIGNED_SHORT, 0);

        //Tail Sphere
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX8);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS8);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES8);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, tailsphere.faces.length, GL.UNSIGNED_SHORT, 0);

        //Left Feet
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX9);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS9);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES9);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, leftfeet.faces.length, GL.UNSIGNED_SHORT, 0);

        //Right Feet
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX10);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS10);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES10);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, rightfeet.faces.length, GL.UNSIGNED_SHORT, 0);

        //Right Feet
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX10);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS10);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES10);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, rightfeet.faces.length, GL.UNSIGNED_SHORT, 0);

        //Right Sole
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX11);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS11);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES11);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, rightsole.faces.length, GL.UNSIGNED_SHORT, 0);

        //Left Sole
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX12);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS12);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES12);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, leftsole.faces.length, GL.UNSIGNED_SHORT, 0);

        //Left shoulder
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX13);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS13);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES13);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, leftshoulder.faces.length, GL.UNSIGNED_SHORT, 0);


        //Right shoulder
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX14);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS14);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES14);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, rightshoulder.faces.length, GL.UNSIGNED_SHORT, 0);

        //Left Arm
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX15);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS15);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES15);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, leftarm.faces.length, GL.UNSIGNED_SHORT, 0);

        //Right Arm
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX16);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS16);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES16);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, rightarm.faces.length, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_VERTEX17);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, TUBE_COLORS17);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TUBE_FACES17);
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
        GL.drawElements(GL.TRIANGLES, tailhead.faces.length, GL.UNSIGNED_SHORT, 0);

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate(0);
}


window.addEventListener('load', main);