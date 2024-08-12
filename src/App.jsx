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




function BoxSlider({onToggle}) {
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
      {/* <PauseButton />
      <PlayButton /> */}
      <PlayPauseButton onToggle={onToggle}/>
      

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

function PlayPauseButton({ onToggle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const handleButtonClick = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    setIsPlaying(!isPlaying);
    onToggle(!isPlaying);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <IconButton 
      aria-label={isPlaying ? 'pause' : 'play'} 
      size="small" 
      onClick={handleButtonClick}
    >
      {isPlaying ? <PauseIcon fontSize="large" style={{ color: 'white' }} /> : <PlayArrowIcon fontSize="large" style={{ color: 'white' }}  />}
    </IconButton>
  );
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

function Earth({ position, size, isSimulating }) {
  const earthTexture = useLoader(TextureLoader, 'earth.jpg');
  const earthRef = useRef();
  let elapsedTime = useRef(0);

  useFrame((state, delta) => {
    if (!isSimulating) {
      elapsedTime.current += delta;
      earthRef.current.rotation.y = elapsedTime.current;
    }
  });

  return (
    <mesh position={position} ref={earthRef}>
      <sphereGeometry args={size} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}

function Moon({ position, size, isSimulating }) {
  const moonTexture = useLoader(TextureLoader, 'moon.jpg');
  const moonRef = useRef();
  let elapsedTime = useRef(0);

  useFrame((state, delta) => {
    if (!isSimulating) {
      elapsedTime.current += delta;
      moonRef.current.rotation.y = elapsedTime.current;
      moonRef.current.position.set(-Math.cos(elapsedTime.current) * 2, 0, Math.sin(elapsedTime.current) * 2);
    }
  });

  return (
    <mesh position={position} ref={moonRef}>
      <sphereGeometry args={size} />
      <meshStandardMaterial map={moonTexture} />
    </mesh>
  );
}

function Tide({ position, isSimulating }) {
  const tideRef = useRef();
  let elapsedTime = useRef(0);

  useFrame((state, delta) => {
    if (!isSimulating) {
      elapsedTime.current += delta;
      tideRef.current.rotation.y = elapsedTime.current;
      // tideRef.current.scale.x += delta * 1/2
    }
  });

  return (
    <mesh position={position} scale={[1.5, 1, 1]} ref={tideRef}>
      <sphereGeometry args={[1.001, 128, 128]} />
      <meshPhongMaterial color={0x1E3B75} transparent opacity={0.7} />
    </mesh>
  );
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
  const [isSimulating, setIsSimulating] = useState(false);
  const toggleSimulation = (isPlaying) => {
    setIsSimulating(isPlaying);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <BoxSlider onToggle={toggleSimulation}/>
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
      <Earth position={[0,0,0]} size={[1, 128, 128]}  isSimulating={isSimulating}/>
      <Moon position={[3, 0, 0]} size={[1/3, 128, 128]} isSimulating={isSimulating}/>
      <Tide position={[0,0,0]} isSimulating={isSimulating}/>

    </Canvas>  
    </div>
  )   
}

export default App
