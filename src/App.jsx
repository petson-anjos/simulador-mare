import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useRef } from 'react'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three';
import './App.css'

function Earth({position, size}) {
  const earthTexture = useLoader(TextureLoader, 'earth.jpg')
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 1/2
  })

  return (
    <mesh position={position} ref={ref}>
        <sphereGeometry args={size}/>
        <meshStandardMaterial map={earthTexture}/>
    </mesh>
  )
}

function Moon({position, size}) {
  const moonTexture = useLoader(TextureLoader, 'moon.jpg')
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 1/2
  })
  
  return (
    <mesh position={position} ref={ref}>
        <sphereGeometry args={size}/>
        <meshStandardMaterial map={moonTexture}/>
    </mesh>
  )
}

function Tide({position}) {
  const ref = useRef()
  ref.current.scale.x = 1.5
  useFrame((state, delta) => {
    //ref.current.rotation.y += delta * 1/2
    //ref.current.scale.x += delta * 1/2
  })
  
  return (
    <mesh position={position} ref={ref}>
        <sphereGeometry args={[1.001, 128, 128]}/>
        <meshPhongMaterial color={0x1E3B75} transparent={true} opacity={0.7}/>
    </mesh>
  )
}




function App() {
  
  return (
    <Canvas>
      {/* Camera e Controles */}
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 10]} />
      <OrbitControls makeDefault minDistance={5} maxDistance={30} />
      
      {/* Luzes da cena */}
      <ambientLight intensity={2} color={0xf5ef38}/>
      <directionalLight color={new THREE.Color().setHSL(0.1, 0.2, 0.2)} intensity={8} position={[1, 0, 0]  }/>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={3} />

      
      {/* Lensflare */}
      <pointLight position={[500, 0, 0]} color={0xffffff} intensity={1.5} distance={2000}  decay={0}/>
      

      {/* Terra e Lua*/}
      <Earth position={[0,0,0]} size={[1, 128, 128]}/>
      <Moon position={[3, 0, 0]} size={[1/3, 128, 128]}/>
      <Tide position={[0,0,0]}/>

    </Canvas>  
  )   
}

export default App
