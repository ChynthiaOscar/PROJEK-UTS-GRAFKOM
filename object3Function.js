var functionObj3 = {
    generateKepala: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
            [240 / 255, 232 / 240, 222 / 255]
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
    
    
    generateSayapKanan: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
            [240 / 255, 232 / 240, 240 / 255] 
        ];
    
    
        for (var i = 0; i <= segments/2; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var sinLat = Math.sin(latAngle);
            var cosLat = Math.cos(latAngle);
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * (j / segments);
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
                var xCoord = sinLat * ovalScaleZ;
                var yCoord = sinLon * cosLat * ovalScaleY; 
                var zCoord = cosLon * cosLat * ovalScaleX;  
    
                var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
                var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
                var rotatedZ = zCoord;
    
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
        for (var i = 0; i < segments/2; i++) {
            for (var j = 0; j < segments; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;
    
                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }
        return { vertices: vertices, colors: colors, faces: faces };
    },
    
    generateSayapKiri: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
            [240 / 255, 232 / 240, 240 / 255] 
        ];
    
    
        for (var i = 0; i <= segments/2; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var sinLat = Math.sin(latAngle);
            var cosLat = Math.cos(latAngle);
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * (j / segments);
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
                var xCoord = -sinLat * ovalScaleZ;
                var yCoord = sinLon * cosLat * ovalScaleY; 
                var zCoord = cosLon * cosLat * ovalScaleX;  
    
                var rotatedX = xCoord * Math.cos(rotationZ) - yCoord * Math.sin(rotationZ);
                var rotatedY = xCoord * Math.sin(rotationZ) + yCoord * Math.cos(rotationZ);
                var rotatedZ = zCoord;
    
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
        for (var i = 0; i < segments/2; i++) {
            for (var j = 0; j < segments; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;
    
                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }
        return { vertices: vertices, colors: colors, faces: faces };
    },
    
    generateKaki: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
            [255/255, 100/255, 50/255]
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
    
    generateMata: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
            [0 / 255, 0 / 240, 0 / 255]
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
    
    generateTelapakKaki: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
        [255 / 255, 255 / 255, 0 / 255] 
        ];


        for (var i = 0; i <= segments/2; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var sinLat = Math.sin(latAngle);
            var cosLat = Math.cos(latAngle);
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * (j / segments);
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
                var xCoord = sinLat * ovalScaleZ;
                var yCoord = sinLon * cosLat * ovalScaleY; 
                var zCoord = cosLon * cosLat * ovalScaleX;  
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
        for (var i = 0; i < segments/2; i++) {
            for (var j = 0; j < segments; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;
                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }
        return { vertices: vertices, colors: colors, faces: faces };
    },
    
    generateJengger: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
            [255 / 255, 0/ 240, 0 / 255] 
        ];
    
    
        for (var i = 0; i <= segments; i++) {
            var latAngle = Math.PI * (-0.5 + (i / segments));
            var sinLat = Math.sin(latAngle);
            var cosLat = Math.cos(latAngle);
            for (var j = 0; j <= segments; j++) {
                var lonAngle = 2 * Math.PI * (j / segments);
                var sinLon = Math.sin(lonAngle);
                var cosLon = Math.cos(lonAngle);
                var xCoord = sinLat * ovalScaleZ;
                var yCoord = sinLon * cosLat * ovalScaleY; 
                var zCoord = cosLon * cosLat * ovalScaleX;  
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
    
    generateParuh: function(x, y, z, radius, segments, ovalScaleX, ovalScaleY, ovalScaleZ,rotationX,rotationY,rotationZ) {
        var vertices = [];
        var colors = [];
        var rainbowColors = [
            [255 / 255, 120 / 255, 0 / 255]  
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
                var zCoord = v * ovalScaleZ;
               
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
    
    generateAlis:function (controlPoints, segments,zOffset, thickness) {
        var vertices = [];
        var colors = [];
      
        var rainbowColors = [[4/8, 4/8, 4/8]]; 
      
        for (var i = 0; i <= segments; i++) {
          var t = i / segments;
          var x = Math.pow(1 - t, 3) * controlPoints[0][0] + 3 * Math.pow(1 - t, 2) * t * controlPoints[1][0] + 3 * (1 - t) * Math.pow(t, 2) * controlPoints[2][0] + Math.pow(t, 3) * controlPoints[3][0];
          var y = Math.pow(1 - t, 3) * controlPoints[0][1] + 3 * Math.pow(1 - t, 2) * t * controlPoints[1][1] + 3 * (1 - t) * Math.pow(t, 2) * controlPoints[2][1] + Math.pow(t, 3) * controlPoints[3][1];
          var z = Math.pow(1 - t, 3) * controlPoints[0][2] + 3 * Math.pow(1 - t, 2) * t * controlPoints[1][2] + 3 * (1 - t) * Math.pow(t, 2) * controlPoints[2][2] + Math.pow(t, 3) * controlPoints[3][2];
      
          vertices.push(x - thickness, y - thickness, z + zOffset);
          vertices.push(x + thickness, y - thickness, z + zOffset);
          vertices.push(x, y + thickness, z + zOffset);
      
          var colorIndex = Math.floor(t * rainbowColors.length);
          colors = colors.concat(rainbowColors[colorIndex]);
          colors = colors.concat(rainbowColors[colorIndex]);
          colors = colors.concat(rainbowColors[colorIndex]);
        }
      
        var faces = [];
        for (var i = 0; i < segments; i++) {
          var index = i * 3;
          faces.push(index, index + 1, index + 2); // create triangles for each vertex
        }
      
        return { vertices: vertices, colors: colors, faces: faces };
      }
};