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
camera.position.set(10, 10, 10)
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

//Texture
const billete = new THREE.TextureLoader().load(
  "./billete.jpg"
)

const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uBillete: { value: billete },
    uTime: { value: 0.0 },
  },
  vertexShader: `
     varying vec2 vUv;   
     uniform float uTime;

     void main(){
        vec4 modelPosition = modelMatrix * vec4(position,1);
        modelPosition.z += sin(modelPosition.x * 15.0 + uTime) * 0.2;
        gl_Position = projectionMatrix * 
                          viewMatrix *
                          modelPosition;
        
        vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D uBillete;
    varying vec2 vUv;

    void main(){
        vec4 texturaBillete = texture2D(uBillete, vec2(vUv.x, vUv.y));
        gl_FragColor = texturaBillete;
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
// plane.rotation.x = Math.PI * -0.5
scene.add(plane)

//animate
const animate = () => {
  planeMaterial.uniforms.uTime.value += 0.01

  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

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
