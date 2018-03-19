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

  //velocity = mState[0,1,2];
  //acceleration = mState[3,4,5];
  //forces = mState[6,7,8];
  //mass = mState[9];
  //time to live = mState[10];


  constructor(numParticles:number, rootPos:vec3) {
    this.maxParticles = numParticles;
    this.createParticles(rootPos);
  }
  
  createParticles(rootPos:vec3){

    for(let i = 0; i < this.maxParticles; i++){
        for(let j = 0; j < this.maxParticles; j++){

            var pos = vec3.fromValues(i,j,0);

            var vel = vec3.fromValues(0,0,0);
  
            var col = vec4.fromValues(i / this.maxParticles,j / this.maxParticles,1.0,1.0);

            let p : Particle = new Particle(pos, vel, col);

            this.particles.push(p);
        }
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