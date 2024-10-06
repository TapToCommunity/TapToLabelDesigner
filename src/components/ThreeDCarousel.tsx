// import { useEffect, useRef, useState } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { useLoader } from '@react-three/fiber';

// function CreditCard(props) {
//   // This reference gives us direct access to the THREE.Mesh object
//   const ref = useRef();
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   useFrame((state, delta) => {
//     // ref.current.rotation.x += delta;
//   });

//   const state = useThree((state) => state);

//   useEffect(() => {
//     window.state = state;
//     window.threeCamera = state.camera;
//   }, []);

//   const card = useLoader(GLTFLoader, '/models/taptocard/tapto_card.glb');
//   return <primitive object={card.scene} />;
// }

// export const ThreeDCarousel = ({ onClick }) => {
//   return (
//     <Canvas
//       camera={{
//         position: [0, 0, 5],
//         fov: 75,
//       }}
//     >
//       <ambientLight intensity={Math.PI / 2} />
//       <spotLight
//         position={[0, 10, 0]}
//         angle={0.15}
//         penumbra={1}
//         decay={0}
//         intensity={Math.PI}
//       />
//       <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
//       <CreditCard onClick={onClick} position={[0, 0, 0]} />
//     </Canvas>
//   );
// };
