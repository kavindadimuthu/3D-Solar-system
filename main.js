import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from './src/img/stars.jpg';
import sunTexture from './src/img/sun.jpg';
import mercuryTexture from './src/img/mercury.jpg';
import venusTexture from './src/img/venus.jpg';
import earthTexture from './src/img/earth.jpg';
import marsTexture from './src/img/mars.jpg';
import jupiterTexture from './src/img/jupiter.jpg';
import saturnTexture from './src/img/saturn.jpg';
import saturnRingTexture from './src/img/saturn ring.png';
import uranusTexture from './src/img/uranus.jpg';
import uranusRingTexture from './src/img/uranus ring.png';
import neptuneTexture from './src/img/neptune.jpg';
import plutoTexture from './src/img/pluto.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

// document.body.appendChild(renderer.domElement);
const container = document.querySelector('.container');
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}

const mercury = createPlanete(3.2, mercuryTexture, 28);
const venus = createPlanete(5.8, venusTexture, 44);
const earth = createPlanete(6, earthTexture, 62);
const mars = createPlanete(4, marsTexture, 78);
const jupiter = createPlanete(12, jupiterTexture, 100);
const saturn = createPlanete(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const uranus = createPlanete(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = createPlanete(7, neptuneTexture, 200);
const pluto = createPlanete(2.8, plutoTexture, 216);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

function animate() {

    const n = 4;
    const m = 5;

    //Self-rotation
    sun.rotateY(0.004 / n );
    mercury.mesh.rotateY(0.004 / n );
    venus.mesh.rotateY(0.002 / n );
    earth.mesh.rotateY(0.02 / n );
    mars.mesh.rotateY(0.018 / n );
    jupiter.mesh.rotateY(0.04 / n );
    saturn.mesh.rotateY(0.038 / n );
    uranus.mesh.rotateY(0.03 / n );
    neptune.mesh.rotateY(0.032 / n );
    pluto.mesh.rotateY(0.008 / n );

    //Around-sun-rotation
    mercury.obj.rotateY(0.04 / m );
    venus.obj.rotateY(0.015 / m );
    earth.obj.rotateY(0.01 / m );
    mars.obj.rotateY(0.008 / m );
    jupiter.obj.rotateY(0.002 / m );
    saturn.obj.rotateY(0.0009 / m );
    uranus.obj.rotateY(0.0004 / m );
    neptune.obj.rotateY(0.0001 / m );
    pluto.obj.rotateY(0.00007 / m );

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});