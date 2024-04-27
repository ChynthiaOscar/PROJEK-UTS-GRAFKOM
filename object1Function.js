var functionObj1 = {
  //Function
  generateKepala: function (x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [66 / 255, 132 / 255, 181 / 255] 
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
},

// BADAN ATAS
generateBadan1: function(x, y, z, radius, height, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [
        [66 / 255, 132 / 255, 181 / 255] 
    ];

    for (var i = 0; i <= segments; i++) {
        var angle = 2 * Math.PI * (i / segments);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        for (var j = 0; j <= segments; j++) {
            var heightFraction = j / segments;
            var xCoord = radius * cosAngle * ovalScaleX;
            var yCoord = height * heightFraction - height / 2 * ovalScaleY;
            var zCoord = radius * sinAngle * ovalScaleZ;

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
},

//BADAN BAWAH
generateBadan2: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [66 / 255, 132 / 255, 181 / 255] 
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
},

// Cone pipi
generatePipi: function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [66 / 255, 132 / 255, 181 / 255]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * vLat * scaleX ;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = Math.pow(vLat, 2) * scaleZ;

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
},

//tanduk 
generateTanduk: function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [151 / 255, 102 / 255, 151 / 255]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * vLat * scaleX;
            var yCoord = -Math.pow(vLat, 2) * scaleZ;
            var zCoord = sinLon * vLat * scaleY;
            
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
},

//ekor1
generateEkor1: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [70 / 255, 70 / 255, 86 / 255] 
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
},

//ekor2
generateEkor2: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [70 / 255, 70 / 255, 86 / 255] 
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
},

//tanduk ekor
generateEkor3: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [70 / 255, 70 / 255, 86 / 255]  
    ];

    for (var i = 0; i <= segments; i++) {
        var latAngle = (i / segments);
        var v = -latAngle
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * (j / segments);
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * v * ovalScaleX;
            var yCoord = v * ovalScaleZ;
            var zCoord = sinLon * v * ovalScaleY;
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
},

//kaki
generateKaki: function(x, y, z, radius, height, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];

    var rainbowColors = [
        [66 / 255, 132 / 255, 181 / 255] 
    ];

    for (var i = 0; i <= segments; i++) {
        var angle = 2 * Math.PI * (i / segments);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        for (var j = 0; j <= segments; j++) {
            var heightFraction = j / segments;
            var xCoord = radius * cosAngle * ovalScaleX;
            var yCoord = height * heightFraction - height / 2 * ovalScaleY;
            var zCoord = radius * sinAngle * ovalScaleZ;

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
},

//alas kaki
generateAlasKaki: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var rainbowColors = [
        [66 / 255, 132 / 255, 181 / 255] 
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
},

generateTangan: function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [66 / 255, 132 / 255, 181 / 255]
    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * vLat * scaleX ;
            var yCoord = sinLon * vLat * scaleY;
            var zCoord = Math.pow(vLat, 2) * scaleZ;

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
},

//mata
generateMata: function(x, y, z, radius, segments,ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var center = [x, y, z]; // Center point of the sphere
  
    var angleIncrement = (2 * Math.PI) / segments;
  
    var rainbowColors = [
      [1, 1, 1]
    ];
  
    for (var i = 0; i <= segments; i++) {
      var latAngle = Math.PI * (-0.5 + (i / segments));
      var sinLat = Math.sin(latAngle);
      var cosLat = Math.cos(latAngle);
  
      for (var j = 0; j <= segments/2; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);
  
        var xCoord = cosLon * cosLat*ovalScaleX;
        var yCoord = -sinLon * cosLat*ovalScaleY;
        var zCoord = sinLat*ovalScaleZ;
  
        var vertexX = x + radius * xCoord;
        var vertexY = y + radius * yCoord;
        var vertexZ = z + radius * zCoord;
  
        vertices.push(vertexX, vertexY, vertexZ);
  
        var colorIndex = j % rainbowColors.length;
        colors = colors.concat(rainbowColors[colorIndex]);
      }
    }

    for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);
    
        var xCoord = cosLon * Math.cos(Math.PI / 2) * ovalScaleX; // Use latAngle = PI/2 for the lid
        var yCoord = sinLon * Math.cos(Math.PI / 2) * ovalScaleY;
        var zCoord = Math.sin(Math.PI / 2) * ovalScaleZ; // Top of the sphere
    
        var vertexX = x + radius * xCoord/32;
        var vertexY = y + radius * yCoord/32;
        var vertexZ = z + radius * zCoord/32;
    
        vertices.push(vertexX, vertexY, vertexZ);
    
        var colorIndex = j % rainbowColors.length;
        colors = colors.concat(rainbowColors[colorIndex]);
      }
  
    var faces = [];
    for (var i = 0; i < segments/2; i++) {
      for (var j = 0; j < segments; j++) {
        var index = i * (segments + 1) + j;
        var nextIndex = index + segments + 1;
  
        faces.push(index, nextIndex, index + 1);
        faces.push(nextIndex, nextIndex + 1, index + 1);
      }
    }
  
    return { vertices: vertices, colors: colors, faces: faces, center: center };
  },

  //mata2
  generateMata2: function(x, y, z, radius, segments,ovalScaleX, ovalScaleY, ovalScaleZ) {
    var vertices = [];
    var colors = [];
    var center = [x, y, z]; // Center point of the sphere
  
    var angleIncrement = (2 * Math.PI) / segments;
  
    var rainbowColors = [
      [217/255, 185/255, 217/255]
    ];
  
    for (var i = 0; i <= segments; i++) {
      var latAngle = Math.PI * (-0.5 + (i / segments));
      var sinLat = Math.sin(latAngle);
      var cosLat = Math.cos(latAngle);
  
      for (var j = 0; j <= segments/2; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);
  
        var xCoord = cosLon * cosLat * ovalScaleX;
        var yCoord = -sinLon * cosLat * ovalScaleY;
        var zCoord = sinLat * ovalScaleZ;
  
        var vertexX = x + radius * xCoord;
        var vertexY = y + radius * yCoord;
        var vertexZ = z + radius * zCoord;
  
        vertices.push(vertexX, vertexY, vertexZ);
  
        var colorIndex = j % rainbowColors.length;
        colors = colors.concat(rainbowColors[colorIndex]);
      }
    }

    for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);
    
        var xCoord = cosLon * Math.cos(Math.PI / 2); // Use latAngle = PI/2 for the lid
        var yCoord = sinLon * Math.cos(Math.PI / 2);
        var zCoord = Math.sin(Math.PI / 2); // Top of the sphere
    
        var vertexX = x + radius * xCoord/32;
        var vertexY = y + radius * yCoord/32;
        var vertexZ = z + radius * zCoord/32;
    
        vertices.push(vertexX, vertexY, vertexZ);
    
        var colorIndex = j % rainbowColors.length;
        colors = colors.concat(rainbowColors[colorIndex]);
      }
  
    var faces = [];
    for (var i = 0; i < segments/2; i++) {
      for (var j = 0; j < segments; j++) {
        var index = i * (segments + 1) + j;
        var nextIndex = index + segments + 1;
  
        faces.push(index, nextIndex, index + 1);
        faces.push(nextIndex, nextIndex + 1, index + 1);
      }
    }
  
    return { vertices: vertices, colors: colors, faces: faces, center: center };
  },

  //mata3
  generateMata3: function(x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
    var center = [x, y, z]; // Center point of the sphere
  
    var angleIncrement = (2 * Math.PI) / segments;
  
    var rainbowColors = [
      [42/255, 76/255, 108/255]
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
        var yCoord = -sinLon * cosLat;
        var zCoord = sinLat;
  
        var vertexX = x + radius * xCoord;
        var vertexY = y + radius * yCoord;
        var vertexZ = z + radius * zCoord;
  
        vertices.push(vertexX, vertexY, vertexZ);
  
        var colorIndex = j % rainbowColors.length;
        colors = colors.concat(rainbowColors[colorIndex]);
      }
    }

    for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);
    
        var xCoord = cosLon * Math.cos(Math.PI / 2); // Use latAngle = PI/2 for the lid
        var yCoord = sinLon * Math.cos(Math.PI / 2);
        var zCoord = Math.sin(Math.PI / 2); // Top of the sphere
    
        var vertexX = x + radius * xCoord/32;
        var vertexY = y + radius * yCoord/32;
        var vertexZ = z + radius * zCoord/32;
    
        vertices.push(vertexX, vertexY, vertexZ);
    
        var colorIndex = j % rainbowColors.length;
        colors = colors.concat(rainbowColors[colorIndex]);
      }
  
    var faces = [];
    for (var i = 0; i < segments/2; i++) {
      for (var j = 0; j < segments; j++) {
        var index = i * (segments + 1) + j;
        var nextIndex = index + segments + 1;
  
        faces.push(index, nextIndex, index + 1);
        faces.push(nextIndex, nextIndex + 1, index + 1);
      }
    }
  
    return { vertices: vertices, colors: colors, faces: faces, center: center };
  }

};