import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Components
import { FadeIn } from "./FadeIn";
import Container from "./Container";

// Images
import MusicLogo from "../assets/music.png";

import styled from "styled-components";

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
    width: 150px;
    height: 140px;
`;


const LandingPage = () => {
    return (
        <Container id="landing-page">
            <FadeIn style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <RainbowLogoContainer className="my-4">
                        <LogoImage src={MusicLogo} alt="Music Logo" />
                    </RainbowLogoContainer>

                    <ConnectButton
                        showBalance={false}
                        chainStatus="icon"
                        accountStatus="address"
                        className="mt-4"
                    />
                </div>
            </FadeIn>
        </Container>
    );
}

export default LandingPage;