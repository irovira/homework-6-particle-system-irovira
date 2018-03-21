import {vec3,vec4, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import ParticleSystem from './ParticleSystem';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentially
  color1: [ 255, 0, 0 ],
  color2: [ 0, 255, 0 ],
  color3: [ 0, 0, 255 ],
  greyControl: 0.0,
  'Restore Center' : restoreCenter,
};


let square: Square;
let time: number = 0.0;
let ps: ParticleSystem = new ParticleSystem(100.0, controls.color1, controls.color2, controls.color3, controls.greyControl, vec3.fromValues(0,0,0));
function restoreCenter(){
  ps.restore();
}
function loadScene() {
  square = new Square();
  square.create();
  //set up Particle System
  
  ps.instantiateVBO();
  //get offset array of particles from particle system
  //get color array of particles from particle system
  //then set instance VBOs of mesh
  //then set numInstances based on number of particles from particle system
  // Set up particles here. Hard-coded example data for now

  // let offsetsArray = [];
  // let colorsArray = [];
  // let n: number = 1.0;
  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     offsetsArray.push(i);
  //     offsetsArray.push(j);
  //     offsetsArray.push(0);

  //     colorsArray.push(i / n);
  //     colorsArray.push(j / n);
  //     colorsArray.push(1.0);
  //     colorsArray.push(1.0); // Alpha channel
  //   }
  // }
  // let offsets: Float32Array = new Float32Array(offsetsArray);
  // let colors: Float32Array = new Float32Array(colorsArray);
  square.setInstanceVBOs(ps.offsets, ps.colors);
  square.setNumInstances(ps.maxParticles * ps.maxParticles); // 10x10 grid of "particles"
}

const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  var color1 = gui.addColor(controls, 'color1');
  var color2 = gui.addColor(controls, 'color2');
  var color3 = gui.addColor(controls, 'color3');
  var greyControl = gui.add(controls, 'greyControl', 0, 1);
  gui.add(controls, 'Restore Center');

  
  color1.onFinishChange(function() {
    // Fires on every change, drag, keypress, etc.
    ps.updateColor(controls.color1,controls.color2,controls.color3,controls.greyControl);
  });
  color2.onFinishChange(function() {
    // Fires on every change, drag, keypress, etc.
    ps.updateColor(controls.color1,controls.color2,controls.color3,controls.greyControl);
  });
  color3.onFinishChange(function() {
    // Fires on every change, drag, keypress, etc.
    ps.updateColor(controls.color1,controls.color2,controls.color3,controls.greyControl);
  });
  greyControl.onFinishChange(function() {
    // Fires on every change, drag, keypress, etc.
    ps.updateColor(controls.color1,controls.color2,controls.color3,controls.greyControl);
  });


  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  //TODO: MOUSE POSITION
  canvas.addEventListener("dblclick", getClick, false);
  function getClick(event: MouseEvent){

    var mousePositionX = (2*event.clientX/canvas.width) - 1;
    var mousePositionY = (2*event.clientY/(canvas.height*(-1))) + 1;
    //cast ray into scene and create an attractor or repeller
    var invViewProjMat = mat4.create();
    mat4.multiply(invViewProjMat, camera.viewMatrix, camera.projectionMatrix);
    mat4.invert(invViewProjMat,invViewProjMat);
    //construct mouse position
    var arr = new Array<number>();
    var winZ = 1.0;


    arr[0]=(2.0* event.clientX/canvas.width)-1.0;
    arr[1]=1.0-(2.0*(event.clientY/canvas.height));
    arr[2]=2.0* winZ -1.0;
    arr[3]=1.0;  
    
    var ref = vec3.create();
    vec3.scale(ref,camera.forward,125.0);
    vec3.add(ref,ref,camera.position);
    var lengthV = vec3.create();
    var length = vec3.length(vec3.subtract(lengthV, ref, camera.position));
    var alpha = camera.fovy / 2.0;

    var V = vec3.create();
    vec3.scale(V, camera.up, length * Math.tan(alpha));

    var H = vec3.create();
    vec3.scale(H, camera.right, length * Math.tan(alpha) * camera.aspectRatio);
    
    var finalPos = vec3.create();

    var sXH = vec3.create();
    vec3.scale(sXH, H, arr[0]); //sx*H

    var sYV = vec3.create();
    vec3.scale(sYV, V, arr[1]); //sy*V

    vec3.add(finalPos, vec3.add(finalPos, ref, sXH), sYV);
    // var vIn = vec4.fromValues(arr[0],arr[1],arr[2],arr[3]);
    // var pos = vec4.create();
    // pos = vec4.transformMat4(pos, vIn, invViewProjMat);

    // pos[3] = 1.0 / pos[3];

    // pos[0] *= pos[3];
    // pos[1] *= pos[3];
    // pos[2] *= pos[3];
    // // console.log(mousePositionX);
    // var finalPos = vec3.fromValues(pos[0],pos[1],pos[2]);
    ps.addForce(finalPos);


  }

  // Initial call to load scene
  loadScene();

  

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/particle-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/particle-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    lambert.setTime(time++);
    ps.updateState(time * 0.01);
    square.setInstanceVBOs(ps.offsets, ps.colors);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, lambert, [
      square,
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
