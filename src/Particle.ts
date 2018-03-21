import * as CameraControls from '3d-view-controls';
import {vec3, vec4, mat4} from 'gl-matrix';

class Particle {
  pos: vec3 = vec3.create();
  vel: vec3 = vec3.create();
  col: vec4 = vec4.create();
  //force: vec3 = vec3.create();
  restoreRadius: number;
  maxVel: number;
  addedForce: vec3 = vec3.create();
  mState: Array<number> = new Array<number>();
  mStateDot: Array<number> = new Array<number>();
  center: vec3 = vec3.create();

  //velocity = mState[0,1,2];
  //acceleration = mState[3,4,5];
  //forces = mState[6,7,8];
  //mass = mState[9];
  //time to live = mState[10];


  constructor(position: vec3, velocity: vec3, color: vec4) {

    this.pos = position;
    this.vel = vec3.fromValues(Math.floor(Math.random() * 5),Math.floor(Math.random() * 5),Math.floor(Math.random() * 5));
	this.col = color;
	this.center = vec3.fromValues(0,0,0);

	this.restoreRadius = Math.floor(Math.random() * 10);
  }
  computeDynamics(deltaT:number){
  }

  attract(position:vec3){
	var force = vec3.create();
	vec3.subtract(force, this.pos, position);
	var r = vec3.length(force);
	r *= r;
	vec3.scale(force,force, 1/r);
	this.addedForce = vec3.fromValues(0,0,0);
	this.addedForce[0] -= 1000.0*force[0];//500.0 - force[0];
	this.addedForce[1] -= 1000.0*force[1];//500.0 - force[1];
	this.addedForce[2] -= 1000.0*force[2];//500.0 - force[2];

	//console.log('is now ' + this.addedForce);
	
  }

  repel(position:vec3){
	var force = vec3.create();
	vec3.subtract(force, this.pos, position);
	var r = vec3.length(force);
	r *= r;
	vec3.scale(force,force, 1/r);
	this.addedForce = vec3.fromValues(0,0,0);
	this.addedForce[0] += 1000.0*force[0];//500.0 - force[0];
	this.addedForce[1] += 1000.0*force[1];//500.0 - force[1];
	this.addedForce[2] += 1000.0*force[2];//500.0 - force[2];

	//console.log('is now ' + this.addedForce);
	
  }

  restore(root:vec3){
	this.addedForce = vec3.fromValues(0,0,0);
	this.center = vec3.fromValues(0,0,0);
	this.vel = vec3.fromValues(0,0,0);
	//var force = vec3.create();
	//vec3.subtract(force, this.pos, root);
	//var r = vec3.length(force);

	//this.addedForce[0] = 50.0*force[0];//500.0 - force[0];
	//this.addedForce[1] = 50.0*force[1];//500.0 - force[1];
	//this.addedForce[2] = 50.0*force[2];

  }

  calculateForce(){
	//this.addedForce = vec3.fromValues(0,0,0);
	var force = vec3.create();
	//this.addedForce = vec3.fromValues(0,0,0);
	vec3.subtract(force, this.pos, this.center);
	var r = vec3.length(force);
	var weh = Math.random();
	// if(r > this.restoreRadius){
	// 	return vec3.scale(force, force,-0.02);
	// } else if (r < this.restoreRadius - 4.0){
	// 	return vec3.scale(force, force,0.1);
	// }
	if(weh > 0.2 && r > this.restoreRadius){
		return vec3.scale(force, force,-0.2);
		
	} else {
		return vec3.scale(force, force,0.2);
	}
	//vec3.scale(force, force,-0.001);
	//return vec3.fromValues(0,0,0);//vec3.scale(force, force,0.0001);
	
	//this.addedForce[0] = 50.0*force[0];//500.0 - force[0];
	//this.addedForce[1] = 50.0*force[1];//500.0 - force[1];
	//this.addedForce[2] = 50.0*force[2];

  }
  updateState(deltaT:number){
	//this.computeDynamics(deltaT);

	//euler integration
	var force = this.calculateForce();
	vec3.scale(force, force, 0.5); // a = f/m
	//vec3.add(force, force, this.addedForce);
	//update velocity
	this.vel[0] = this.vel[0] + (force[0] + this.addedForce[0]) * 0.1;
	this.vel[1] = this.vel[1] + (force[1] + this.addedForce[1]) * 0.1;
	this.vel[2] = this.vel[2] + (force[2] + this.addedForce[2]) * 0.1;
	//this.addedForce = vec3.fromValues(0,0,0);
	//update position
	this.pos[0] = this.pos[0] + this.vel[0] * 0.1;
	this.pos[1] = this.pos[1] + this.vel[1] * 0.1;
	this.pos[2] = this.pos[2] + this.vel[2] * 0.1;

	//update position
	//debugger;
	//add velocity to position
	// this.mState[0] = this.mState[0] + this.mStateDot[0] * 0.1;
	// this.mState[1] = this.mState[1] + this.mStateDot[1] * 0.1;
	// this.mState[2] = this.mState[2] + this.mStateDot[2] * 0.1;
	// //add acceleration to velocity
	// this.mState[3] = this.mState[3] + this.mStateDot[3] * 0.1;
	// this.mState[4] = this.mState[4] + this.mStateDot[4] * 0.1;
	// this.mState[5] = this.mState[5] + this.mStateDot[5] * 0.1;
	// //TODO: update time to live

	// this.pos[0] = this.mState[0];
	// this.pos[1] = this.mState[1];
	// this.pos[2] = this.mState[2];//(Math.sin((deltaT + this.mState[0]) * 3.14159 * 0.1) + Math.cos((deltaT + this.mState[1]) * 3.14159 * 0.1)) * 1.5;

	// this.vel[0] = this.mState[3];
	// this.vel[1] = this.mState[4];
	// this.vel[2] = this.mState[5];
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

export default Particle;