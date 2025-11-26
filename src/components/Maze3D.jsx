import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Cell = ({ position, color, isWall, isPath, isVisited, isStart, isEnd }) => {
    const mesh = useRef();

    // Animate visited/path cells
    useFrame((state) => {
        if (mesh.current) {
            if (isPath) {
                mesh.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
            } else if (isVisited) {
                mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, 0.5, 0.1);
            }
        }
    });

    if (isWall) {
        return (
            <mesh position={position} ref={mesh}>
                <boxGeometry args={[0.9, 1, 0.9]} />
                {/* Minimalist Light Gray Wall */}
                <meshStandardMaterial color="#cbd5e1" metalness={0.1} roughness={0.1} />
            </mesh>
        );
    }

    return (
        <mesh position={[position[0], -0.4, position[2]]} ref={mesh}>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial
                color={
                    isStart ? "#22c55e" :
                        isEnd ? "#ef4444" :
                            isPath ? "#facc15" :
                                isVisited ? "#3b82f6" :
                                    "#1e293b" // Darker floor for contrast
                }
                emissive={
                    isStart ? "#22c55e" :
                        isEnd ? "#ef4444" :
                            isPath ? "#facc15" :
                                isVisited ? "#1d4ed8" :
                                    "#000000"
                }
                emissiveIntensity={isPath || isStart || isEnd ? 2 : isVisited ? 1 : 0}
                transparent
                opacity={isVisited ? 0.8 : 1}
            />
        </mesh>
    );
};

const Maze3D = ({ grid, visitedCells = [], pathCells = [] }) => {
    if (!grid || grid.length === 0) return null;

    const rows = grid.length;
    const cols = grid[0].length;

    return (
        <div className="w-full h-screen absolute top-0 left-0 z-0 bg-gray-950">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 25, 15]} fov={45} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 2.2}
                />

                {/* Reduced star count for performance and cleaner look */}
                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />

                <ambientLight intensity={0.6} />
                <pointLight position={[10, 20, 10]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
                <directionalLight position={[-5, 10, -5]} intensity={0.8} />

                <group position={[-rows / 2, 0, -cols / 2]}>
                    {grid.map((row, r) =>
                        row.map((cell, c) => {
                            const isVisited = visitedCells.some(([vr, vc]) => vr === r && vc === c);
                            const isPath = pathCells.some(([pr, pc]) => pr === r && pc === c);

                            return (
                                <Cell
                                    key={`${r}-${c}`}
                                    position={[r, 0, c]}
                                    color={cell === 0 ? 'black' : 'white'}
                                    isWall={cell === 0}
                                    isStart={cell === 2}
                                    isEnd={cell === 3}
                                    isVisited={isVisited}
                                    isPath={isPath}
                                />
                            );
                        })
                    )}
                    {/* Floor plane */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[rows / 2 - 0.5, -0.5, cols / 2 - 0.5]} receiveShadow>
                        <planeGeometry args={[rows * 2, cols * 2]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
                    </mesh>
                </group>
            </Canvas>
        </div>
    );
};

export default Maze3D;
