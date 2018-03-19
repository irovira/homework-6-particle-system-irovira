import * as CameraControls from '3d-view-controls';
import {vec3, vec4, mat4} from 'gl-matrix';

class Particle {
  pos: vec3 = vec3.create();
  vel: vec3 = vec3.create();
  col: vec4 = vec4.create();
  mState: Array<number> = new Array<number>();
  mStateDot: Array<number> = new Array<number>();

  //velocity = mState[0,1,2];
  //acceleration = mState[3,4,5];
  //forces = mState[6,7,8];
  //mass = mState[9];
  //time to live = mState[10];


  constructor(position: vec3, velocity: vec3, color: vec4) {
    // mStartAlpha = parent.mStartAlpha;
	// mEndAlpha = parent.mEndAlpha;
	// mAlpha = mStartAlpha;

	// mStartColor = parent.mStartColor + AJitterVec(parent.mColorJitter);
	// mEndColor = parent.mEndColor + AJitterVec(parent.mColorJitter);
	// mColor = mStartColor;

	// mStartScale = parent.mStartScale + AJitterVal(parent.mScaleJitter);
	// mEndScale = parent.mEndScale + AJitterVal(parent.mScaleJitter);
	// mScale = mStartScale;

	// m_Pos = parent.mStartPos + AJitterVec(parent.mPositionJitter);
	// m_Vel = parent.mStartVel + AJitterVec(parent.mVelocityJitter);

	// m_gravity = parent.mGravity;

	// m_state[0] = m_Pos[0];
	// m_state[1] = m_Pos[1];
	// m_state[2] = m_Pos[2];
	// m_state[3] = m_Vel[0];
	// m_state[4] = m_Vel[1];
	// m_state[5] = m_Vel[2];
	// m_state[6] = m_mass * m_gravity[0];
	// m_state[7] = m_mass * m_gravity[1];
	// m_state[8] = m_mass * m_gravity[2];
	// m_state[9] = m_mass;
	// m_state[10] = m_lifeSpan;

	// m_alive = true;

    this.pos = position;
    this.vel = velocity;
	this.col = color;

	//position
	
	this.mState[0] = this.pos[0];
	this.mState[1] = this.pos[1];
	this.mState[2] = this.pos[2];

	//velocity
	this.mState[3] = 0.0;
	this.mState[4] = 0.0;
	this.mState[5] = 0.0;

	//acceleration, which is zero for now
	this.mState[6] = 0.0;
	this.mState[7] = 0.0;
	this.mState[8] = 0.0;

	this.mState[9] = 1.0; //mass is 1 for now
	this.mState[10] = 1.0; //lifespan is 1 for now

	//velocity, mStateDot
	this.mStateDot[0] = this.vel[0];
	this.mStateDot[1] = this.vel[1];
	this.mStateDot[2] = this.vel[2];

	//acceleration, mStateDot
	this.mStateDot[3] = 0.0;
	this.mStateDot[4] = 0.0;
	this.mStateDot[5] = 0.0;
  }
  computeDynamics(deltaT:number){
	//TODO: Add your code here
	//velocity
	this.mStateDot[0] = this.mState[3];
	this.mStateDot[1] = this.mState[4];
	this.mStateDot[2] = this.mState[5];
	
	//acceleration
	this.mStateDot[3] = this.mState[6] / this.mState[9];
	this.mStateDot[4] = this.mState[7] / this.mState[9];
	this.mStateDot[5] = this.mState[8] / this.mState[9];
	//forces

	// var force = vec3.create();
	// vec3.subtract(force, this.pos, vec3.fromValues(0,0,0));
	// vec3.normalize(force,force);
	
	this.mState[6] = Math.cos(deltaT) / 1000000.0;//1.0;
	this.mState[7] = Math.sin(deltaT) / 1000000.0;
	this.mState[8] = 0.0;
	//mass
	this.mStateDot[9] = 1.0;
	//time to live
	this.mStateDot[10] = 1.0;
  }
  updateState(deltaT:number){
	this.computeDynamics(deltaT);
	//euler integration
	//update position
	//debugger;
	//add velocity to position
	this.mState[0] = this.mState[0] + this.mStateDot[0] * deltaT;
	this.mState[1] = this.mState[1] + this.mStateDot[1] * deltaT;
	this.mState[2] = this.mState[2] + this.mStateDot[2] * deltaT;
	//add acceleration to velocity
	this.mState[3] = this.mState[3] + this.mStateDot[3] * deltaT;
	this.mState[4] = this.mState[4] + this.mStateDot[4] * deltaT;
	this.mState[5] = this.mState[5] + this.mStateDot[5] * deltaT;
	//TODO: update time to live

	this.pos[0] = this.mState[0];
	this.pos[1] = this.mState[1];
	this.pos[2] = this.mState[2];//(Math.sin((deltaT + this.mState[0]) * 3.14159 * 0.1) + Math.cos((deltaT + this.mState[1]) * 3.14159 * 0.1)) * 1.5;

	this.vel[0] = this.mState[3];
	this.vel[1] = this.mState[4];
	this.vel[2] = this.mState[5];
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