import { FC, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { ACESFilmicToneMapping, Vector3 } from 'three'
import { a, useSpring } from '@react-spring/three'
import {
  softShadows,
  MeshWobbleMaterial,
  Sky,
  Backdrop,
  MeshReflectorMaterial,
  Cloud,
  SpotLight,
  MeshDistortMaterial,
  useDepthBuffer
} from '@react-three/drei'

interface BoxProps {
  position: any
  size?: any
  color: any
  r: number
}
softShadows({
  frustum: 3.75,
  size: 0.005,
  near: 9.5,
  samples: 17,
  rings: 11 // Rings (default: 11) must be a int
})

export const Box: FC<BoxProps> = ({ position, size, color, r }) => {
  const [expand, setExpand] = useState<boolean>(false)
  const props = useSpring({
    scale: expand ? 1.5 : 1
  })

  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame(
    (state, delta) => (
      (meshRef.current.rotation.x =
        meshRef.current.rotation.y =
        meshRef.current.rotation.z +=
          0.004 * r),
      (meshRef.current.position.y =
        position[1] +
        Math[r > 0.5 ? 'cos' : 'sin'](state.clock.getElapsedTime() * r) * r)
    )
  )
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
        factor={0.7}
        attach="material"
        color={color}
      />
    </a.mesh>
  )
}

const App = () => {
  const [target] = useState(() => new THREE.Object3D())
  const thisGroup = useRef<THREE.Group>(null!)

  return (
    <div
      className="
      flex items-center justify-center flex-col
      h-screen w-full
      min-h-screen min-w-full bg-sky-600 font-bold"
    >
      <Canvas shadows gl={{ toneMapping: ACESFilmicToneMapping }}>
        <PerspectiveCamera makeDefault position={[28, 13, 25]} />
        <OrbitControls enableDamping />

        <group ref={thisGroup}>
          <ambientLight intensity={0.2} />
          <mesh
            receiveShadow
            position={[0, -2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1000, 1000]} attach={'geometry'} />
            <meshPhongMaterial
              attach={'material'}
              color={'#EB5353'}
              transparent
            />
          </mesh>
          <SpotLight
            position={[0, 10, 15]}
            castShadow
            target={target}
            penumbra={0.8}
            radiusTop={0}
            radiusBottom={50}
            opacity={0.5}
            distance={100}
            angle={0.5}
            attenuation={20}
            anglePower={5}
            intensity={0.4}
          />

          <Box position={[0, 3, 0]} size={[3, 2, 0.7]} color="#18181b" r={2} />
          <Box position={[3, 3, -5]} color="#18181b" r={1.5} />
          <Box position={[-5, 3, -2]} color="#18181b" r={1.5} />
          <Sky
            turbidity={0.5}
            rayleigh={0.8}
            distance={450000}
            sunPosition={[0, 0, 100]}
            inclination={0}
            azimuth={0.5}
          />
        </group>
      </Canvas>
    </div>
  )
}

export default App
