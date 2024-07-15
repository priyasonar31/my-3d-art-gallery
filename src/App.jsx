import { Suspense, useState, useRef } from "react";
import {
  OrbitControls,
  Environment,
  Text,
  useBounds,
  Bounds,
  useProgress,
  Html,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import "./App.css";

function SelectToZoom({ children }) {
  const api = useBounds();
  return (
    <group
      onClick={(e) => (
        e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
      )}
      onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
    >
      {children}
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <h2>{progress} % loaded</h2>{" "}
    </Html>
  );
}


export default function App() {
  const initialCameraPosition = [0.5, 1, 2];
  const orbitref = useRef();
  const gltf = useLoader(GLTFLoader, "/3d/scene.gltf");
  const [autoRotate, setAutoRotate] = useState(false);
  return (
    <>
      <Canvas
        style={{ height: "100vh" }}
        camera={{ position: initialCameraPosition }}
        shadows
      >
        <Suspense fallback={<Loader />}>
          <directionalLight
            position={[3.3, 1.0, 4.4]}
            castShadow
            intensity={2.5}
          />
          <ambientLight intensity={0.84} />
          <Bounds fit clip observe margin={0.3}>
            <SelectToZoom>
              <primitive
                object={gltf.scene}
                position={[0, 1, 0]}
                children-0-castShadow
              />
            </SelectToZoom>
          </Bounds>
          <Text fontSize={0.5} position-z={0.501} position-y={0.501}>
            Welcome
          </Text>
          <Environment preset="city" background />
          <OrbitControls
            autoRotate={autoRotate}
            ref={orbitref}
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        </Suspense>
      </Canvas>
      <div
       className="controls"
      >
        <p>Drag and Rotate</p>
        <p>Click on paintings to zoom</p>
        <label for="vehicle1"> Auto rotate </label>
        <input
          type="checkbox"
          id="auto-rotate"
          name="Auto Rotate"
          defaultChecked={autoRotate}
          onChange={() => setAutoRotate((autoRotate) => !autoRotate)}
        />
        <p>
          <button
            onClick={() => orbitref.current.reset()}
          >
            Reset
          </button>
        </p>
      </div>
    </>
  );
}
