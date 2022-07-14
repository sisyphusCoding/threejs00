import { FC, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { ACESFilmicToneMapping, Vector3 } from 'three'
import {a,useSpring} from '@react-spring/three'
import { softShadows, MeshWobbleMaterial } from '@react-three/drei'

interface BoxProps {
  position: any
  size?: any
  color: any
  r:number
}

export const Box: FC<BoxProps> = ({ position, size, color,r}) => {
  const [expand, setExpand] = useState<boolean>(false)
  const props = useSpring({
    scale: expand?1.5:1
  })


  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame(
    (state, delta) =>( 
    meshRef.current.rotation.x = meshRef.current.rotation.y = meshRef.current.rotation.z += 0.004 * r,
    meshRef.current.position.y = position[1] + Math[r > 0.5 ? 'cos' : 'sin'](state.clock.getElapsedTime() * r) * r
    ))
  return (
    <a.mesh
      onClick={() => setExpand(!expand)}
      castShadow
      scale={props.scale}
      ref={meshRef}
      position={position}
    >
      <boxBufferGeometry attach="geometry" args={size} />
      <MeshWobbleMaterial
        speed={1}
        factor={0.6}
        attach="material"
        color={color}
      />
      <OrbitControls />
    </a.mesh>
  )
}

const App = () => {
  return (
    <div
      className="
      flex items-center justify-center flex-col
      h-screen w-full
      min-h-screen min-w-full bg-zinc-300 font-bold"
    >
      <Canvas shadows gl={{ toneMapping: ACESFilmicToneMapping }}>
        <PerspectiveCamera makeDefault position={[-2, 5, 13]} />

        <directionalLight
          castShadow
          shadowMapWidth={1024}
          shadowMapHeight={1024}
          shadowCameraFar={50}
          shadowCameraLeft={-13}
          shadowCameraRight={13}
          shadowCameraTop={13}
          shadowCameraBottom={-13}
          position={[-2, 10, 5]}
          intensity={2}
        />
        <ambientLight intensity={0.8} />
        <pointLight intensity={1.5} position={[-10, 0, -20]} />
        <pointLight intensity={1.5} position={[0, -20, 0]} />

        <group>
          <mesh
            receiveShadow
            position={[0, -3, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <shadowMaterial attach={'material'} opacity={0.2} />
          </mesh>
    
          <Box position={[0, 1, 0]} size={[3, 2, 1]} color="#71717a" r={.8} />
          <Box position={[-2, 1, -5]} color="#52525b" r={0.5} />
          <Box position={[5, 1, -2]} color="#52525b" r={0.5} />
        </group>
      </Canvas>
    </div>
  )
}

export default App
