import {vec3, vec4, mat4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
//import * as fs from 'fs';
//var OBJ = require('webgl-obj-loader');
var currentMesh : any;
class Bunny {
  //indices: Uint32Array;
  positions = new Float32Array([-10.0, -10.0, 0,
                              10.0, -10.0, 0,
                              10.0, 10.0, 0,
                              -10.0, 10.0, 0]);
  //normals: Float32Array;
//   currIndices: Array<number>;
//   currPositions: Array<number>;
//   currNormals: Array<number>;
//   center: vec4;


  constructor() {
    // var objStr = document.getElementById('bunny.obj').innerHTML;
    // var opt = { encoding: 'utf8' };

    // var mesh = new OBJ.Mesh(objStr);
    // // OBJ.initMeshBuffers(gl, mesh);
    
    // currentMesh = mesh;
    // //this.positions = new Float32Array(currentMesh.vertices); 
    
    // //append 1
    // var posSize = (currentMesh.vertices.length / 3) * 4;
    // var newPosInd = 0;
    // for(var i = 0; i < currentMesh.vertices.length; i = i+3 ){
    //   this.positions[newPosInd] = currentMesh.vertices[i];
    //   this.positions[newPosInd+1] = currentMesh.vertices[i+1];
    //   this.positions[newPosInd+2] = currentMesh.vertices[i+2];
    //   //this.positions[newPosInd+3] = 1.0;
    //   //newPosInd = newPosInd + 4;
    // }
    }


};

export default Bunny;