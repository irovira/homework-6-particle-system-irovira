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
      p.col = this.generateColor();
    }

  }
 //palette generation based on triad mixing from 
 //http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/

 generateColor() : vec4 {
  var randomIndex = Math.floor(Math.random() * 3);

  var mixRatio1 = (randomIndex == 0) ? Math.random() * this.greyControl : Math.random();
  var mixRatio2 = (randomIndex == 1) ? Math.random() * this.greyControl : Math.random();
  var mixRatio3 = (randomIndex == 2) ? Math.random() * this.greyControl : Math.random();

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
  
            var col = this.generateColor();//vec4.fromValues(i / this.maxParticles,j / this.maxParticles,1.0,1.0);

            let p : Particle = new Particle(pos, vel, col);

            this.particles.push(p);
        }
    }

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

  addForce(pos:vec3){
    console.log(pos);
    for(var i = 0; i < this.particles.length; i++){
      //console.log(this.particles[i].pos);
      this.particles[i].updateForce(pos);
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