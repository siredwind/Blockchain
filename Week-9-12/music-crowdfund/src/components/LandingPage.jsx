import React, { useMemo } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Components
import { FadeIn } from "./FadeIn";

// Images
import MusicLogo from "../assets/music.png";

import styled, { keyframes } from "styled-components";

// Define the animations and styled components
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const Star = styled.div`
  width: 2px;
  height: 2px;
  background-color: white;
  border-radius: 50%;
  opacity: 0.8;
  position: absolute;
  top: ${(props) => props.top}vh;
  left: ${(props) => props.left}vw;
  animation: ${float} ${(props) => props.duration}s ease-in-out infinite;
`;

const RainbowLogoContainer = styled.div`
  display: inline-block;
  padding: 5px;
  border-radius: 50%;
  background-size: 300% 300%;
  animation: MoveGradient 4s ease infinite;
  background-image: linear-gradient(
    45deg,
    #f06,
    #f90,
    #0ff,
    #f06,
    #f90
  );

  @keyframes MoveGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const LogoImage = styled.img`
    width: 250px;
    height: 240px;
`;

const GlowingText = styled.h1`
  font-size: 2rem; // Adjust as needed
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #f06, 0 0 20px #f90, 0 0 25px #0ff, 0 0 30px #f06, 0 0 35px #f90, 0 0 40px #0ff;
  animation: glow 3s ease-in-out infinite alternate;

  @keyframes glow {
    0% {
      text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #f06, 0 0 20px #f90, 0 0 25px #0ff, 0 0 30px #f06, 0 0 35px #f90, 0 0 40px #0ff;
    }
    50% {
      text-shadow: 0 0 10px #fff, 0 0 15px #f90, 0 0 20px #0ff, 0 0 25px #f06, 0 0 30px #f90, 0 0 35px #0ff, 0 0 40px #f06;
    }
    100% {
      text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #f06, 0 0 20px #f90, 0 0 25px #0ff, 0 0 30px #f06, 0 0 35px #f90, 0 0 40px #0ff;
    }
  }
`;

// Generate stars
const generateStars = (count) => Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 2 + Math.random() * 3,
}));

const LandingPage = () => {
    const stars = useMemo(() => generateStars(100), []);

    return (

        <div id="landing-page" style={{ position: 'relative', overflow: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {stars.map((star, index) => (
                <Star key={index} top={star.top} left={star.left} duration={star.duration} />
            ))}

            <FadeIn>
                <RainbowLogoContainer className="my-20">
                    <LogoImage src={MusicLogo} alt="Music Logo" />
                </RainbowLogoContainer>
            </FadeIn>

            <div className="flex flex-col bg-[#131315] px-12 py-4 rounded-3xl items-center my-4">
                <GlowingText>WELCOME TO TUNE CHAINS</GlowingText>
                <GlowingText>Connect with your wallet</GlowingText>
            </div>

            <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus="address"
                className="mt-4"
            />

        </div>
    );
}

export default LandingPage;