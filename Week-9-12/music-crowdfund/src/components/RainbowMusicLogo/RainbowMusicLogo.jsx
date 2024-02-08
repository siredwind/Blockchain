// RainbowFilter.js
import React from "react";
import MusicLogo from "../../assets/music.png";
import styled from "styled-components";

const RainbowMusicLogo = () => {
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
    width: 70px;
    height: 60px;
  `;

  return (
    <RainbowLogoContainer>
      <LogoImage src={MusicLogo} alt="Music Logo" />
    </RainbowLogoContainer>
  )
};

export default RainbowMusicLogo;
