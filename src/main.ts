import {vec3} from 'gl-matrix';
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
};


let square: Square;
let time: number = 0.0;
let ps: ParticleSystem = new ParticleSystem(100.0, controls.color1, controls.color2, controls.color3, controls.greyControl, vec3.fromValues(0,0,0));
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

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));

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
    ps.updateState(time);
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
