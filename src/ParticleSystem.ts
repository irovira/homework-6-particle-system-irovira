import * as CameraControls from '3d-view-controls';
import {vec3,vec4, mat4} from 'gl-matrix';
import Particle from './Particle';
class ParticleSystem {
  pos: vec3 = vec3.create();
  vel: vec3 = vec3.create();
  maxParticles: number;
  particles: Array<Particle> = new Array<Particle>();
  offsets: Float32Array;
  colors: Float32Array;

  //palette controls
  color1: Array<number>;
  color2: Array<number>;
  color3: Array<number>;
  greyControl: number;

  //velocity = mState[0,1,2];
  //acceleration = mState[3,4,5];
  //forces = mState[6,7,8];
  //mass = mState[9];
  //time to live = mState[10];


  constructor(numParticles:number, color1:Array<number>, color2:Array<number>, color3:Array<number>, greyControl:number, rootPos:vec3) {
    this.maxParticles = numParticles;

    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;
    this.greyControl = greyControl;

    this.createParticles(rootPos);
    this.pos = rootPos;
  }

  updateColor(color1:Array<number>, color2:Array<number>, color3:Array<number>, greyControl:number) {
    
    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;
    this.greyControl = greyControl;


    //update colors of particles
    for(let i = 0; i < this.particles.length; i++){
      let p: Particle = this.particles[i];
      p.col = this.generateColor(p.pos);
    }

  }
 //palette generation based on triad mixing from 
 //http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/

 generateColor(pos:vec3) : vec4 {
  var randomIndex = Math.floor(Math.random() * 3);
  var max = Math.max(pos[0], Math.max(pos[1], pos[2]));
  var mixRatio1 = (randomIndex == 0) ? pos[0] / max * this.greyControl : Math.random();
  var mixRatio2 = (randomIndex == 1) ? pos[1] / max * this.greyControl : Math.random();
  var mixRatio3 = (randomIndex == 2) ? pos[2] / max * this.greyControl : Math.random();

  var sum = mixRatio1 + mixRatio2 + mixRatio3;

  mixRatio1 /= sum;
  mixRatio2 /= sum;
  mixRatio3 /= sum;

  var r = (mixRatio1 * this.color1[0]+ mixRatio2 * this.color2[0]+ mixRatio3 * this.color3[0]) / 255.0;
  var g = (mixRatio1 * this.color1[1]+ mixRatio2 * this.color2[1]+ mixRatio3 * this.color3[1]) / 255.0;
  var b = (mixRatio1 * this.color1[2]+ mixRatio2 * this.color2[2]+ mixRatio3 * this.color3[2]) / 255.0;

  var color = vec4.fromValues(r,g,b,1.0);

  return color;
 }
  
  createParticles(rootPos:vec3){
    var dim = this.maxParticles / 2;
    for(let i = 0; i < this.maxParticles; i++){
        for(let j = 0; j < this.maxParticles; j++){
            var x = Math.floor(Math.random() * (this.maxParticles));
            var y = Math.floor(Math.random() * (this.maxParticles));
            var z = Math.floor(Math.random() * (this.maxParticles));
            var pos = vec3.fromValues(x - dim,y - dim,z - dim);

            // var pos = vec3.fromValues(i,j,0);

            var vel = vec3.fromValues(0,0,0);
  
            var col = this.generateColor(pos);//vec4.fromValues(i / this.maxParticles,j / this.maxParticles,1.0,1.0);

            let p : Particle = new Particle(pos, vel, col);

            this.particles.push(p);
        }
    }

  }

  attractMesh(positions:Float32Array){
    for(var i = 0; i < this.particles.length; i++){
      //console.log(this.particles[i].pos);
      var p = Math.floor(Math.random() * 4) * 3;
      this.particles[i].pos =  vec3.fromValues(positions[p],positions[p+1], positions[p+2]);
      //console.log(this.particles[i].pos);
      this.particles[i].center =  vec3.fromValues(positions[p],positions[p+1], positions[p+2]);
      this.particles[i].vel = vec3.fromValues(0,0,0);
      //console.log(this.particles[i].pos);
    }
    // var offset = 0;
    // var verts = positions.length / 3;
    // for(var j = 0; j < positions.length; j = j + 3){
    //   offset = (this.particles.length / verts) * j;
    //   for(var i = 0; i < this.particles.length / verts; i++){
    //     //console.log(this.particles[i].pos);
    //     this.particles[i+offset].pos =  vec3.fromValues(positions[j],positions[j+1], positions[j+2]);
    //     this.particles[i+offset].center =  vec3.fromValues(positions[j],positions[j+1], positions[j+2]);
        
    //     //console.log('called');
    //     this.particles[i+offset].vel = vec3.fromValues(0,0,0);
    //     //console.log(this.particles[i].pos);
    //   }
      
    // }
    
  }

  restore(){
    //pushes back particles
    //console.log(pos);
    for(var i = 0; i < this.particles.length; i++){
      //console.log(this.particles[i].pos);
      this.particles[i].restore(this.pos);
      //console.log(this.particles[i].pos);
    }

  }
  instantiateVBO(){
    let offsetsArray = [];
    let colorsArray = [];
    for(let i = 0; i < this.particles.length; i++){
        let p: Particle = this.particles[i];
        let pos: vec3 = p.pos;
        let col: vec4 = p.col;
        offsetsArray.push(p.pos[0]);
        offsetsArray.push(p.pos[1]);
        offsetsArray.push(p.pos[2]);

        colorsArray.push(col[0]);
        colorsArray.push(col[1]);
        colorsArray.push(col[2]);
        colorsArray.push(col[3]); // Alpha channel
    }
    this.offsets = new Float32Array(offsetsArray);
    this.colors =  new Float32Array(colorsArray);

  }

  attract(pos:vec3){
    console.log(pos);
    for(var i = 0; i < this.particles.length; i++){
      //console.log(this.particles[i].pos);
      this.particles[i].attract(pos);
      //console.log(this.particles[i].pos);
    }
  }

  repel(pos:vec3){
    console.log(pos);
    for(var i = 0; i < this.particles.length; i++){
      //console.log(this.particles[i].pos);
      this.particles[i].repel(pos);
      //console.log(this.particles[i].pos);
    }
  }

  updateState(deltaT:number){
    //update every particle in the list
    //debugger;
    
    for(var i = 0; i < this.particles.length; i++){
      //console.log(this.particles[i].pos);
      this.particles[i].updateState(deltaT);
      //console.log(this.particles[i].pos);
    }
    //debugger;
    this.instantiateVBO();
  }

  update() {
    // m_deltaT = deltaT;
	// if (m_state[10] <= 0.0)
	// {
	// 	m_alive = false;
	// 	return;
	// }
	// computeForces(forceMode);
    // updateState(deltaT, EULER);
  }
};

export default ParticleSystem;