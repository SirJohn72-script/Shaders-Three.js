import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Vertex } from "./glsl/Vertex"
import { Fragment } from "./glsl/Fragment"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

//Global variables
let currentRef = null

//Scene, camera, renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  25,
  100 / 100,
  0.1,
  100
)
scene.add(camera)
camera.position.set(20, 30, 20)
camera.lookAt(new THREE.Vector3())

const renderer = new THREE.WebGLRenderer()
renderer.setSize(100, 100)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.physicallyCorrectLights = true

//OrbitControls
const orbitControls = new OrbitControls(
  camera,
  renderer.domElement
)
orbitControls.enableDamping = true
orbitControls.target.set(0, 5, 0)

//Resize canvas
const resize = () => {
  renderer.setSize(
    currentRef.clientWidth,
    currentRef.clientHeight
  )
  camera.aspect =
    currentRef.clientWidth / currentRef.clientHeight
  camera.updateProjectionMatrix()
}
window.addEventListener("resize", resize)

const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: Vertex,
  fragmentShader: Fragment,
  uniforms: {
    uTime: { value: 0.0 },
  },
})

const planeGeometry = new THREE.PlaneBufferGeometry(
  5,
  5,
  500,
  500
)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// plane.rotation.x = Math.PI * -0.5
scene.add(plane)

//axes helper
const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

//grid helper
const size = 10
const divisions = 10

//load model
const gltfLoader = new GLTFLoader()
gltfLoader.load("./Portal.gltf", (gltf) => {
  scene.add(gltf.scene)
})

//lights
const DirectionalLight = new THREE.DirectionalLight(
  0xffffff,
  3
)
DirectionalLight.position.set(20, 20, 20)
scene.add(DirectionalLight)

const ao = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ao)

const envMap = new THREE.CubeTextureLoader().load([
  "./hdri/px.png",
  "./hdri/nx.png",
  "./hdri/py.png",
  "./hdri/ny.png",
  "./hdri/pz.png",
  "./hdri/nz.png",
])
scene.environment = envMap

//animate
const animate = () => {
  planeMaterial.uniforms.uTime.value += 0.03

  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

const gridHelper = new THREE.GridHelper(size, divisions)
// scene.add(gridHelper)

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current
  resize()
  currentRef.appendChild(renderer.domElement)
}

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.dispose()
  currentRef.removeChild(renderer.domElement)
}
