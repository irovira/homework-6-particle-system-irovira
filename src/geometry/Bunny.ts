import {vec3, vec4, mat4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
// import * as THREE from 'three';
//import * as fs from 'fs';
var THREE = require('three');
//var THREE = require('../build/three.js')

var THREEJS = require("three-js")(["OBJLoader"]);

//var OBJ = require('webgl-obj-loader');
var currentMesh : any;
class Bunny {
  //indices: Uint32Array;
  // positions = new Float32Array([-10.0, -10.0, 0,
  //                             10.0, -10.0, 0,
  //                             10.0, 10.0, 0,
  //                             -10.0, 10.0, 0]);
  positions = new Float32Array([]);
  bunny = new Float32Array([]);
  mario = new Float32Array([]);
  geometry = Array<any>();
                    
  //normals: Float32Array;
//   currIndices: Array<number>;
//   currPositions: Array<number>;
//   currNormals: Array<number>;
//   center: vec4;


  constructor() {
  }

  loadMario(verts:Float32Array){
    

    //  var tempNum = new Array<number>();
    //  console.log(verts.length);
    //  for(var i = 0; i < verts.length; i++){
    //    var curr = verts[i];
    //    console.log(curr.values);
    //    tempNum.push(curr[0]);
    //    //console.log(curr[0]);
    //    tempNum.push(curr[1]);
    //    tempNum.push(curr[2]);
    //  }
     //console.log(this.positions);
     //console.log(verts.length);
     //console.log('verts are' + verts.length);
     this.mario = verts;
    //  for(var i = 0; i < verts.length; i++){
    //    this.positions[i] = verts[i];
    //  }
     //console.log('bunny positions are' + this.positions.length);
     //this.positions = verts;
     //console.log(this.positions);
  }

  loadBunny(verts:Float32Array){
    

    //  var tempNum = new Array<number>();
    //  console.log(verts.length);
    //  for(var i = 0; i < verts.length; i++){
    //    var curr = verts[i];
    //    console.log(curr.values);
    //    tempNum.push(curr[0]);
    //    //console.log(curr[0]);
    //    tempNum.push(curr[1]);
    //    tempNum.push(curr[2]);
    //  }
     //console.log(this.positions);
     //console.log(verts.length);
     //console.log('verts are' + verts.length);
     this.bunny = verts;
     this.positions = verts;
    //  for(var i = 0; i < verts.length; i++){
    //    this.positions[i] = verts[i];
    //  }
     //console.log('bunny positions are' + this.positions.length);
     //this.positions = verts;
     //console.log(this.positions);
  }


};

export default Bunny;