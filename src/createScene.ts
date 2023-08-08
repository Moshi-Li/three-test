import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const createCanvas = (container: HTMLCanvasElement | null) => {
  if (container === null) return;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: container,
  });

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 600);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const textureLoader = new THREE.TextureLoader();
  const houseTexture = textureLoader.load("/house.jpg");
  //light
  {
    const color = 0xffffff;
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  // an array of objects who's rotation to update
  const objects: THREE.Mesh[] = [];

  //Inferior square
  {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);

    const groundMaterial = new THREE.MeshBasicMaterial({ map: houseTexture });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

    groundMesh.position.set(0, 0, 0);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
  }

  //Medial
  {
    const geometry = new THREE.PlaneGeometry(50, 50);
    const material = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, 0, 5);
    scene.add(mesh);
    objects.push(mesh);
  }

  //Superior square
  {
    const shape = new THREE.Shape()
      .moveTo(-50, -50)
      .lineTo(50, -50)
      .lineTo(50, 50)
      .lineTo(-50, 50);

    const path = new THREE.Path()
      .moveTo(-10, -10)
      .lineTo(10, -10)
      .lineTo(10, 10)
      .lineTo(-10, 10);

    shape.holes.push(path);

    const geometry = new THREE.ShapeGeometry(shape);
    const holeSquareMaterial = new THREE.MeshBasicMaterial({
      map: houseTexture,
    });
    const mesh = new THREE.Mesh(geometry, holeSquareMaterial);

    console.log(Object.keys(geometry));
    console.log(geometry.attributes);

    mesh.position.set(0, 0, 10);
    mesh.scale.set(1, 1, 1);

    scene.add(mesh);
  }

  /*
  // Smiley
  {
    const smileyShape = new THREE.Shape()
      .moveTo(80, 40)
      .absarc(40, 40, 40, 0, Math.PI * 2, false);

    const smileyEye1Path = new THREE.Path()
      .moveTo(35, 20)
      .absellipse(25, 20, 10, 10, 0, Math.PI * 2, true, 0);

    const smileyEye2Path = new THREE.Path()
      .moveTo(65, 20)
      .absarc(55, 20, 10, 0, Math.PI * 2, true);

    const smileyMouthPath = new THREE.Path()
      .moveTo(20, 40)
      .quadraticCurveTo(40, 60, 60, 40)
      .bezierCurveTo(70, 45, 70, 50, 60, 60)
      .quadraticCurveTo(40, 80, 20, 60)
      .quadraticCurveTo(5, 50, 20, 40);

    smileyShape.holes.push(smileyEye1Path);
    smileyShape.holes.push(smileyEye2Path);
    smileyShape.holes.push(smileyMouthPath);

    const geometry = new THREE.ShapeGeometry(smileyShape);

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: new THREE.Color("0xf000f0"),
      })
    );

    mesh.position.set(0, 0, 0);
    mesh.rotation.set(Math.PI, 0, 0);
    mesh.scale.set(1, 1, 1);

    scene.add(mesh);
  }
  */

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  let moveDirection = true;

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  function render(/*time: number*/) {
    //time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      if (moveDirection) {
        obj.position.x++;
      } else {
        obj.position.x--;
      }
      if (obj.position.x >= 50 || obj.position.x <= -50)
        moveDirection = !moveDirection;
    });

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};
