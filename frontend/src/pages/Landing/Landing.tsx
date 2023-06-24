import { useRef, useEffect, useState, Suspense } from "react";

import { Link } from "react-router-dom";

import { styled } from "styled-components";

import * as THREE from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Environment, OrbitControls, Stage } from "@react-three/drei";
import NesDraco from '../../components/NesDraco';

const Title = styled.h1`
  display: block;
  width: 100vw;
  top: 100;
  position: absolute;
  text-align: center;
  font-size: 48px;
`

const Landing = () => {
  return (
    <>
	  <Title>
	    <Link to="/"> Pong Story Short   0.3</Link>
	  </Title>
	  <Canvas>
	    <Stage environment="city" intensity={0.6}>
  	      <NesDraco />
		  <OrbitControls enableZoom={false} />
		</Stage>
	  </Canvas>
	</>
  )
};

export default Landing;
