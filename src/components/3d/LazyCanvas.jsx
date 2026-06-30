import { Canvas } from '@react-three/fiber';

export function LazyCanvas({ children, ...props }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 38 }} {...props}>
      {children}
    </Canvas>
  );
}
