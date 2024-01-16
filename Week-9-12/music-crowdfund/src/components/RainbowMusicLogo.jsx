// RainbowFilter.js
import React from "react";
import MusicLogo from "../assets/music.png";
import styled from "styled-components"; // Import styled-components

const RainbowMusicLogo = () => {
  const RainbowLogoContainer = styled.div`
    display: inline-block;
    padding: 5px;
    border-radius: 50%;
    background-image: linear-gradient(
      45deg,
      #f06,
      #f90,
      #f06,
      #f90,
      #f06
    );
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
