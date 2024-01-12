import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, 1.33, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
document.querySelector('.hero-right').appendChild(renderer.domElement);
renderer.setSize(document.querySelector('.hero-right').clientWidth, document.querySelector('.hero-right').clientWidth);

renderer.setClearColor(0xffffff, 1);

renderer.setPixelRatio(window.devicePixelRatio * 1.5);

camera.position.z = 5;

{
    const skyColor = 0xB1E1FF; // light blue
    const groundColor = 0xB97A20; // brownish orange
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

{
    const color = 0xFFFFFF;
    const intensity = 2.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
}

let duck = null;

//load gltf model with percentage and stuff
const loader = new GLTFLoader();
loader.load('scene.gltf', (gltf) => {
    duck = gltf.scene;
    duck.position.y = -.25;

    scene.add(gltf.scene);
    renderer.render(scene, camera);
}, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, (error) => {
    console.log(error);
});

let hoz_counter = 0;

function animate() {
    resizeCanvasToDisplaySize();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    if (duck) {
        duck.rotation.y += 0.003;
        duck.rotation.x += hoz_counter / 250 & 2 ? 0.003 : -0.003;

        hoz_counter++;
    }
}

animate();

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;

document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

document.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        duck.rotation.y += (e.clientX - prevMouseX) / 100;
        duck.rotation.x += (e.clientY - prevMouseY) / 100;

        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    }
});

