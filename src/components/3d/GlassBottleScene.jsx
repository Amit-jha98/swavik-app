import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import { LazyCanvas } from './LazyCanvas';

export default function GlassBottleScene() {
  return (
    <LazyCanvas>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.8}>
        <mesh>
          <cylinderGeometry args={[0.85, 1.05, 2.8, 64]} />
          <MeshTransmissionMaterial
            thickness={0.55}
            roughness={0.18}
            transmission={0.92}
            ior={1.45}
            chromaticAberration={0.03}
            color="#f3df9c"
          />
        </mesh>
      </Float>
    </LazyCanvas>
  );
}
