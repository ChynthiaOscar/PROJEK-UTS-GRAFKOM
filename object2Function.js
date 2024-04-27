var functionObj2 = {
  // Elipsoid
generateKepala: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
  var vertices = [];
  var colors = [[254/255,230/255,232/255]];

  var rainbowColors = [[254/255,230/255,232/255]];



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

generateEar: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
  var vertices = [];
  var colors = [[254/255,230/255,232/255]];
  var rainbowColors = [
      [254/255,230/255,232/255] // Warna A1C398
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

//elipsoid paraboloid
generateUpperbody:function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
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

        var xCoord = cosLon * vLat *ovalScaleX;
        var yCoord = -(Math.pow(vLat,2)) * ovalScaleY;
        var zCoord = sinLon * vLat * ovalScaleZ;

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

//Hemisphere
generateLowerbody:function (x, y, z, radius, segments) {
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
},

//Eliptic cone
generateHat:function (x, y, z, radius, segments) {
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
},

//Eliptic paraboloid
generateleftribbon:function (x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
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
},

//Eliptic paraboloid
generaterightribbon:function (x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
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
},

//SILINDER
generateTail:function (x, y, z, radius, height, segments) {
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
},

// Elipsoid
generateTailSphere:function (x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
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
},

generateTail1:function (x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
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
},

//SILINDER
generateFeet:function (x, y, z, radius, height, segments) {
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
},

//Sphere
generateSole:function (x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
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
},

//Eliptic paraboloid
generateRightshoulder:function (x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
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
},

//Eliptic Paraboloid
generateLeftshoulder:function (x, y, z, radius, segments, scaleX, scaleY, scaleZ) {
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
},

//Silinder
generateArm:function (x, y, z, radius, height, segments) {
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
};
