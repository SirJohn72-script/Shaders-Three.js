import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

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
camera.position.set(5, 5, 5)
camera.lookAt(new THREE.Vector3())

const renderer = new THREE.WebGLRenderer()
renderer.setSize(100, 100)

//OrbitControls
const orbitControls = new OrbitControls(
  camera,
  renderer.domElement
)
orbitControls.enableDamping = true

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

//animate
const animate = () => {
  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: `
     void main(){
        vec4 modelPosition = modelMatrix * vec4(position,1);
        gl_Position = projectionMatrix * 
                          viewMatrix *
                          modelPosition;
    }
  `,
  fragmentShader: `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
})

const planeGeometry = new THREE.PlaneBufferGeometry(
  5,
  2,
  100,
  100
)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI * -0.5
scene.add(plane)

//axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//grid helper
const size = 10
const divisions = 10

const gridHelper = new THREE.GridHelper(size, divisions)
scene.add(gridHelper)

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
