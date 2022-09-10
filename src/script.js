import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// Loader

const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/Textures/NormalMap4.jpg')


const loader = new THREE.TextureLoader()
const star = loader.load('/Textures/star.png')



// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 16, 16,16)


const particleGeometry = new THREE.BufferGeometry;
const particlesCnt = 10000;

const posArray = new Float32Array(particlesCnt * 3);
// xyz, xyz, xyz, xyz

for (let i = 0; i < particlesCnt * 4; i++){
    // posArray[i] = Math.random()
    posArray[i] = (Math.random() - 0.5) * 4
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.6
material.roughness = 0.2
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929)

const material2 = new THREE.PointsMaterial({
    map: star,
    size: 0.005,
    color: 0x6900ff,
    blending: THREE.AdditiveBlending,
    transparent: true
})

// Mesh
const sphere = new THREE.Mesh(geometry,material)
const partclesMesh = new THREE.Points(particleGeometry, material2)
scene.add(sphere, partclesMesh)


// Light1

const pointLight = new THREE.PointLight(0xffffff, 0.09)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Light2

const pointLight2 = new THREE.PointLight(0x6900ff, 2)
pointLight2.position.set(-2.56, 3,-3)
pointLight2.intensity = 7

const light2 = gui.addFolder('Light1')


light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

const light2Color = {
    color: 0x6900ff
}

light2.addColor(light2Color, 'color')
    .onChange(() => {
            pointLight2.color.set(light2Color.color)
    })


// Light 3

const pointLight3 = new THREE.PointLight(0x00077e, 2)
pointLight3.position.set(1.23, -1.73, -0.19)
pointLight3.intensity = 7

const light3 = gui.addFolder('Light 3')

light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01)


const light3Color = {
    color: 0x00077e
}

light3.addColor(light3Color, 'color')
    .onChange(() => {
            pointLight3.color.set(light3Color.color)
    })



scene.add(pointLight2)
scene.add(pointLight3)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0


let targetX = 0
let targetY = 0


const windowX = window.innerHeight / 2;
const windowY = window.innerWidth / 2;

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

document.addEventListener('mousemove', animateParticles)

let pmouseX = 0
let pmouseY = 0


function animateParticles(event){
    pmouseY = event.clientY
    pmouseX = event.clientX
}





const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .4 * elapsedTime

    sphere.rotation.y += .2 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .2 * (targetY - sphere.rotation.x)
    sphere.rotation.Z += -.2 * (targetY - sphere.rotation.z)
    sphere.rotation.x = .4 * elapsedTime

    partclesMesh.rotation.z = -0.1 * elapsedTime
    partclesMesh.rotation.x = -0.001 * elapsedTime
    partclesMesh.rotation.y = -0.001 * elapsedTime

    if(mouseX)        {


    partclesMesh.rotation.y = mouseX * (elapsedTime * 0.00006)
    partclesMesh.rotation.x = mouseY * (elapsedTime * 0.00006)
    partclesMesh.rotation.z = -mouseX * (elapsedTime * 0.00006)
}

    
    

    // Update Orbital Controls
    controls.update()
    controls.enablePan = false
    controls.enableZoom = false

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
