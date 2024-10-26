import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import spider1VertexShader from './Shaders/Spider1/vertex.glsl'
import spider1FragmentShader from './Shaders/Spider1/fragment.glsl'
import spider2VertexShader from './Shaders/Spider2/vertex.glsl'
import spider2FragmentShader from './Shaders/Spider2/fragment.glsl'
import overlayVertexShader from './Shaders/Overlay/vertex.glsl'
import overlayFragmentShader from './Shaders/Overlay/fragment.glsl'


/**
 * Loaders
 */
// Loading
const loaderElement = document.querySelector('.loading')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        gsap.delayedCall(1, () => {

            loaderElement.style.display = 'none'

            gsap.to(
                overlayMaterial.uniforms.uAlpha, 
                { duration: 1.5, value: 0, delay: 0.5 }
            )

            window.setTimeout(() => {
                initGUI()
            }, 3000)
        })
    },
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => 
    {
        loaderElement.style.display = 'block'
    }
)

// Texture
const textureLoader = new THREE.TextureLoader(loadingManager)

// Draco
const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('draco/')

// GLTF
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    vertexShader: overlayVertexShader,
    fragmentShader: overlayFragmentShader,
    uniforms: {
        uAlpha: new THREE.Uniform(1)
    },
    transparent: true,
    depthWrite: false,
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Light
 */
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 )
// scene.add( directionalLight )

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update materials
    spider1Material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 1
camera.position.z = 6
// camera.position.copy(positionView)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)

// controls.minPolarAngle = Math.PI / 4
// controls.maxPolarAngle = Math.PI / 2

// controls.minAzimuthAngle = -Math.PI / 6
// controls.maxAzimuthAngle = Math.PI / 2

// controls.minDistance = 2
// controls.maxDistance = 12

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor('#212a37')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Materials
 */
const materialParameters = {}
materialParameters.colorSpider1 = '#000000'
materialParameters.shadowColor = '#ff0000'
materialParameters.lightColor = '#000599'

materialParameters.colorSpider2 = '#ffffff'
materialParameters.shadowColor2 = '#f12eff'
materialParameters.lightColor2 = '#0550ff'

materialParameters.colorSpider3 = '#efff14'
materialParameters.shadowColor3 = '#00bfff'
materialParameters.lightColor3 = '#00ff1e'

const spider1Material = new THREE.ShaderMaterial({
    vertexShader: spider1VertexShader,
    fragmentShader: spider1FragmentShader,
    uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.colorSpider1)),
        uShadowColor: new THREE.Uniform(new THREE.Color(materialParameters.shadowColor)),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uShadowRepetitions: new THREE.Uniform(55),
        uLightRepetitions: new THREE.Uniform(102),
        uLightColor: new THREE.Uniform(new THREE.Color(materialParameters.lightColor))
    }
})

const spider2Material = new THREE.ShaderMaterial({
    vertexShader: spider2VertexShader,
    fragmentShader: spider2FragmentShader,
    uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.colorSpider2)),
        uShadowColor: new THREE.Uniform(new THREE.Color(materialParameters.shadowColor2)),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uShadowRepetitions: new THREE.Uniform(30),
        uLightRepetitions: new THREE.Uniform(55),
        uLightColor: new THREE.Uniform(new THREE.Color(materialParameters.lightColor2))
    }
})

const spider3Material = new THREE.ShaderMaterial({
    vertexShader: spider2VertexShader,
    fragmentShader: spider2FragmentShader,
    uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.colorSpider3)),
        uShadowColor: new THREE.Uniform(new THREE.Color(materialParameters.shadowColor3)),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uShadowRepetitions: new THREE.Uniform(150),
        uLightRepetitions: new THREE.Uniform(200),
        uLightColor: new THREE.Uniform(new THREE.Color(materialParameters.lightColor3))
    }
})

/**
 * Model
 */
let spider1
let spider2
let spider3

gltfLoader.load(
    'Model/spider.glb',
    (gltf) =>
    {
        const spiders = gltf.scene
        spiders.scale.set(1, 1, 1)
        spiders.rotation.set(0, 0.5, 0)
        scene.add(spiders )

        spider1 = spiders.children.find((child) => child.name === 'Spider1')
        spider2 = spiders.children.find((child) => child.name === 'Spider2')
        spider3 = spiders.children.find((child) => child.name === 'Spider3')

        spider1.material = spider1Material
        spider2.material = spider2Material
        spider3.material = spider3Material
    }
)

/**
 * Tweaks
 */
function initGUI()
{
    // Debug
    const gui = new GUI()

    const spiderFolder1 = gui.addFolder('Spider 1')

    spiderFolder1
    .addColor(materialParameters, 'colorSpider1')
    .name('Color')
    .onChange(() => {
        spider1Material.uniforms.uColor.value.set(materialParameters.colorSpider1)
    })

    spiderFolder1
    .addColor(materialParameters, 'shadowColor')
    .name('Shadow Color')
    .onChange(() =>
    {
        spider1Material.uniforms.uShadowColor.value.set(materialParameters.shadowColor)
    })

    spiderFolder1
    .add(spider1Material.uniforms.uShadowRepetitions, 'value')
    .min(1)
    .max(300)
    .step(1)
    .name('ShadowRepetitions')

    spiderFolder1
    .addColor(materialParameters, 'lightColor')
    .name('Light Color')
    .onChange(() =>
    {
        spider1Material.uniforms.uLightColor.value.set(materialParameters.lightColor)
    })

    spiderFolder1
    .add(spider1Material.uniforms.uLightRepetitions, 'value')
    .min(1)
    .max(300)
    .step(1)
    .name('LightRepetitions')

    const spiderFolder2 = gui.addFolder('Spider 2')

    spiderFolder2
    .addColor(materialParameters, 'colorSpider2')
    .name('Color')
    .onChange(() => {
        spider2Material.uniforms.uColor.value.set(materialParameters.colorSpider2)
    })
    
    spiderFolder2
    .addColor(materialParameters, 'shadowColor2')
    .name('Shadow Color')
    .onChange(() =>
    {
        spider2Material.uniforms.uShadowColor.value.set(materialParameters.shadowColor2)
    })
    
    spiderFolder2
    .add(spider2Material.uniforms.uShadowRepetitions, 'value')
    .min(1)
    .max(300)
    .step(1)
    .name('ShadowRepetitions')
    
    spiderFolder2
    .addColor(materialParameters, 'lightColor2')
    .name('Light Color')
    .onChange(() =>
    {
        spider2Material.uniforms.uLightColor.value.set(materialParameters.lightColor2)
    })
    
    spiderFolder2
    .add(spider2Material.uniforms.uLightRepetitions, 'value')
    .min(1)
    .max(300)
    .step(1)
    .name('LightRepetitions')

    const spiderFolder3 = gui.addFolder('Spider 3')

    spiderFolder3
    .addColor(materialParameters, 'colorSpider3')
    .name('Color')
    .onChange(() => {
        spider3Material.uniforms.uColor.value.set(materialParameters.colorSpider3)
    })
            
    spiderFolder3
    .addColor(materialParameters, 'shadowColor3')
    .name('Shadow Color')
    .onChange(() =>
    {
        spider3Material.uniforms.uShadowColor.value.set(materialParameters.shadowColor3)
    })
            
    spiderFolder3
    .add(spider3Material.uniforms.uShadowRepetitions, 'value')
    .min(1)
    .max(300)
    .step(1)
    .name('ShadowRepetitions')
            
    spiderFolder3
    .addColor(materialParameters, 'lightColor3')
    .name('Light Color')
    .onChange(() =>
    {
        spider3Material.uniforms.uLightColor.value.set(materialParameters.lightColor3)
    })
            
    spiderFolder3
    .add(spider3Material.uniforms.uLightRepetitions, 'value')
    .min(1)
    .max(300)
    .step(1)
    .name('LightRepetitions')

}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Models
    if(spider1){
        spider1.rotation.y = elapsedTime * 0.4
    }

    if(spider2){
        spider2.rotation.y = elapsedTime * 0.3
    }

    if(spider3){
        spider3.rotation.y = elapsedTime * 0.2
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()