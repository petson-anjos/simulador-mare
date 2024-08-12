import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useState, useEffect, useRef } from 'react'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import '@fontsource/roboto/400.css';
import * as THREE from 'three';
import './App.css'




function BoxSlider() {
  return (
    <Box alignItems="center" 
    sx={{ 
      padding: 2, 
      background: 'rgba(33, 33, 33, 0.65)',
      color: 'white', 
      width: 300, 
      position: 'absolute', 
      top: '30px', 
      left: '10px', 
      zIndex: 1, 
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'}}>

      <SliderValue name ="Distância da Lua" defaultValue={10}/>
      <SliderValue name ="Massa da Lua" defaultValue={50}/>
      <PauseButton />
      <PlayButton />
      

    </Box>
  )
}

function SliderValue({name, defaultValue}) {
  return (
    <Box sx={{ color: 'white', width: 250, position: 'relative', zIndex: 2}}>
      <div style={{ textAlign: 'center', fontSize: 24, fontFamily: 'Roboto, "Times New Roman"'}}>{name}</div>
      <Slider
          size="small"
          defaultValue={defaultValue}
          aria-label="Small"
          valueLabelDisplay="auto"
          sx={{
            color: 'white',
            '& .MuiSlider-thumb': {
              color: 'white',
            },
            '& .MuiSlider-track': {
              color: 'white',
            },
            '& .MuiSlider-rail': {
              color: 'white',
            },
          }}
        />
    </Box>
  )
}

function PlayButton() {
  return (
    <IconButton aria-label="play" size="small">
      <PlayArrowIcon fontSize="large" style={{ color: 'white' }}/>
    </IconButton>
  )
}

function PauseButton() {
  return (
    <IconButton aria-label="pause" size="small">
      <PauseIcon fontSize="large" style={{ color: 'white'}} />
    </IconButton>
  )
}

let elapsedTime = 0;

function Earth({position, size}) {
  const earthTexture = useLoader(TextureLoader, 'earth.jpg')
  const earthRef = useRef()
  useFrame((state, delta) => {
    earthRef.current.rotation.y = elapsedTime
  })

  return (
    <mesh position={position} ref={earthRef}>
        <sphereGeometry args={size}/>
        <meshStandardMaterial map={earthTexture}/>
    </mesh>
  )
}

function Moon({position, size}) {
  const moonTexture = useLoader(TextureLoader, 'moon.jpg')
  const moonRef = useRef()
  
  useFrame((state, delta) => {
    elapsedTime += delta
    moonRef.current.rotation.y = elapsedTime 
    moonRef.current.position.set(-Math.cos(elapsedTime) * 2, 0, Math.sin(elapsedTime) * 2);
  })
  
  return (
    <mesh position={position} ref={moonRef}>
        <sphereGeometry args={size}/>
        <meshStandardMaterial map={moonTexture}/>
    </mesh>
  )
}

function Tide({position}) {
  const tideRef = useRef()
  useFrame((state, delta) => {
    tideRef.current.rotation.y = elapsedTime;
    //ref.current.scale.x += delta * 1/2
  })
  
  return (
    <mesh position={position} scale={[1.5, 1, 1]} ref={tideRef}>
        <sphereGeometry args={[1.001, 128, 128]}/>
        <meshPhongMaterial color={0x1E3B75} transparent={true} opacity={0.7}/>
    </mesh>
  )
}


const AddLight = ({ h, s, l, x, y, z }) => {
    
  const textureLoader = new THREE.TextureLoader();

  const textureFlare0 = textureLoader.load( 'lensflare0_alpha.png' );
  const textureFlare3 = textureLoader.load( 'lensflare3.png');
  const hexangle = textureLoader.load ('hexangle.png')

  const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
  light.position.set(500, 0, 0)
  light.color.setHSL( h, s, l );
  
  const lensflare = new Lensflare();

  lensflare.addElement( new LensflareElement( textureFlare0, 1400, 0, light.color ) );
  lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.1 ) ); //0.6
  lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.15 ) ); //0.7
  lensflare.addElement( new LensflareElement( hexangle, 120, 0.25 ) ); //0.9
  lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.35 ) ); //1

  light.add( lensflare );

return (
<primitive object={light} position={[x, y, z]} />
);
};


function App() {
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <BoxSlider />
    <Canvas>
      {/* Camera e Controles */}
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 10]} />
      <OrbitControls makeDefault minDistance={5} maxDistance={30} />
      
      {/* Luzes da cena */}
      <ambientLight intensity={2.3} color={0xf5ef38}/>
      <directionalLight color={new THREE.Color().setHSL(0.1, 0.2, 0.2)} intensity={12} position={[1, 0, 0]  }/>
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={3} />

      
      {/* Lensflare */}
      <AddLight h = '0.05' s = '0.5' l = '0.9' x = '500' y = '0' z = '0' />
      

      {/* Terra e Lua*/}
      <Earth position={[0,0,0]} size={[1, 128, 128]}/>
      <Moon position={[3, 0, 0]} size={[1/3, 128, 128]}/>
      <Tide position={[0,0,0]}/>

    </Canvas>  
    </div>
  )   
}

export default App
