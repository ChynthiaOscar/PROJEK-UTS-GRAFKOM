var envFunction = {
  generateBase: function(x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
    var center = [x, y, z]; // Center point of the sphere
  
    var angleIncrement = (2 * Math.PI) / segments;
  
    var rainbowColors = [
      [103/255, 95/255, 75/255],
      [127/255, 111/255, 85/255],
      [171/255, 154/255, 130/255],
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
  },

  generateRumput: function(x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
    var center = [x, y, z]; // Center point of the sphere
  
    var angleIncrement = (2 * Math.PI) / segments;
  
    var rainbowColors = [
      [97/255, 124/255, 58/255],
      [123/255, 141/255, 74/255]
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
  },

  //gunung
  generateGunung: function(x, y, z, radius, segments, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
    var angleIncrement = (2 * Math.PI) / segments;
    var rainbowColors = [
        [123/255, 141/255, 74/255],
        [118/255, 136/255, 39/255],
        [99/255, 111/255, 24/255],

    ];
    for (var i = 0; i <= segments; i++) {
        var latAngle = Math.PI * (-0.5 + (i / segments)) ;
        var vLat = latAngle;
        for (var j = 0; j <= segments; j++) {
            var lonAngle = 2 * Math.PI * Math.max(0, (j / segments));
            var sinLon = Math.sin(lonAngle);
            var cosLon = Math.cos(lonAngle);
            var xCoord = cosLon * vLat * scaleX ;
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
}
};