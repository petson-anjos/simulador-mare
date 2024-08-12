
import { Canvas } from '@react-three/fiber'
import './App.css'

function App() {
  return (
    <Canvas>
      <ambientLight intensity={1} color={0xf5ef38}/>
      <directionalLight color={0xf5ef38} intensity={12} position={[1, 0, 0]}/>
      
      
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>  
  )   
}

export default App
