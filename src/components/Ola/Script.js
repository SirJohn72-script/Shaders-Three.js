import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

//Global variables
let currentRef = null
const gui = new dat.GUI({ width: 400 })

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

const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0.0 },
    uFrecuencyX: { value: 2.5 },
    uFrecuencyZ: { value: 2.1 },
    uAmplitudeX: { value: 0.1692 },
    uAmplitudeZ: { value: 0.3624 },
    uColorA: { value: new THREE.Color(0x22caca) },
    uColorB: { value: new THREE.Color(0xeb1bd2) },
    uColorOffset: { value: 0.05 },
    uColorMult: { value: 1.00003 },
  },
  vertexShader: `
    varying float vElevationX;

    uniform float uTime;
    uniform float uFrecuencyX;
    uniform float uFrecuencyZ;
    uniform float uAmplitudeX;
    uniform float uAmplitudeZ;

     void main(){
        vec4 modelPosition = modelMatrix * vec4(position,1);
        float ElevationX = sin(modelPosition.x * uFrecuencyX + uTime) * uAmplitudeX; 
        float ElevationZ = sin(modelPosition.z * uFrecuencyZ + uTime) * uAmplitudeZ; 

        modelPosition.y += (ElevationX + uAmplitudeX) + (ElevationZ + uAmplitudeZ);

        gl_Position = projectionMatrix * 
                          viewMatrix *
                          modelPosition;

        vElevationX = modelPosition.y;
    }
  `,
  fragmentShader: `
    varying float vElevationX;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uColorOffset;
    uniform float uColorMult;

    void main(){
        float colorMix = (uColorOffset + vElevationX) * uColorMult;
        vec4 colorA = vec4(1.0, 0.0, 0.0, 1.0);
        vec4 colorB = vec4(0.0, 0.0, 1.0, 1.0);
        vec3 colorC = mix(uColorA, uColorB, colorMix);

        gl_FragColor = vec4(colorC, 1.0);
    }
  `,
})

//gui options
gui
  .add(planeMaterial.uniforms.uFrecuencyX, "value")
  .min(1)
  .max(10)
  .step(0.005)
  .name("Frecuency X")
gui
  .add(planeMaterial.uniforms.uFrecuencyZ, "value")
  .min(1)
  .max(10)
  .step(0.005)
  .name("Frecuency Z")

gui
  .add(planeMaterial.uniforms.uAmplitudeX, "value")
  .min(0.1)
  .max(1.0)
  .step(0.0003)
  .name("Amplitude X")

gui
  .add(planeMaterial.uniforms.uAmplitudeZ, "value")
  .min(0.1)
  .max(1.0)
  .step(0.0003)
  .name("Amplitude Z")

//debug colors
const debugColorMaterial = {
  ColorA: "#22caca",
  ColorB: "#eb1bd2",
}
gui.addColor(debugColorMaterial, "ColorA").onChange(() => {
  planeMaterial.uniforms.uColorA.value.set(
    debugColorMaterial.ColorA
  )
})
gui.addColor(debugColorMaterial, "ColorB").onChange(() => {
  planeMaterial.uniforms.uColorB.value.set(
    debugColorMaterial.ColorB
  )
})

//colors offset y color multiplier
gui
  .add(planeMaterial.uniforms.uColorOffset, "value")
  .min(-0.5)
  .max(0.5)
  .step(0.00001)
  .name("Color Offset")
gui
  .add(planeMaterial.uniforms.uColorMult, "value")
  .min(0)
  .max(5)
  .step(0.00001)
  .name("Color Mult")

const planeGeometry = new THREE.PlaneBufferGeometry(
  10,
  10,
  250,
  250
)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI * -0.5
scene.add(plane)

//animate
const animate = () => {
  planeMaterial.uniforms.uTime.value += 0.03

  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

//axes helper
const axesHelper = new THREE.AxesHelper(5)
//scene.add(axesHelper)

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
  gui.destroy()
  currentRef.removeChild(renderer.domElement)
  scene.dispose()
}
