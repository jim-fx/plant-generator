import ResizeObserver from 'resize-observer-polyfill';

import { Renderer as oRenderer, Camera, Orbit, Vec3, Transform } from 'ogl';

import { throttle } from '@plantarium/helpers';

export default class Renderer {
  canvas: HTMLCanvasElement;

  gl: WebGL2RenderingContext;

  renderer: oRenderer;
  scene: Transform = new Transform();
  camera: Camera;
  controls: Orbit;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const { width, height } = canvas.getBoundingClientRect();

    this.renderer = new oRenderer({
      canvas,
      width,
      height,
      antialias: true,
      dpr: 1,
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(1, 1, 1, 1);

    // Setup Camera
    this.camera = new Camera(this.gl, { fov: 70, aspect: width / height });
    this.camera.position.set(0, 2, 4);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // Setup controls
    this.controls = new Orbit(this.camera, {
      element: canvas,
      target: new Vec3(0, 0.2, 0),
      maxPolarAngle: 1.6,
      minDistance: 0.2,
      maxDistance: 15,
      ease: 0.7,
      rotateSpeed: 0.5,
      inertia: 0.5,
    });

    this.bindEventlisteners();
    this.render();
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.controls.update();
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  bindEventlisteners() {
    const res = this.handleResize.bind(this);
    const resize = throttle(res, 500);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(this.canvas.parentElement);
  }

  handleResize() {
    const wrapper = this.canvas.parentElement;
    const { width, height } = wrapper.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.canvas.style.height = '';
    this.canvas.style.width = '';
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });
  }
}
