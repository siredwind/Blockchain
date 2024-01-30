import React from "react";
import styled from "styled-components";

// Icons
import Facebook from "../../assets/facebook.svg";
import Youtube from "../../assets/youtube.svg";
import Twitter from "../../assets/twitter.svg";
import Github from "../../assets/github.svg";
import Instagram from "../../assets/instagram.svg";
import Tiktok from "../../assets/tiktok.svg";

const socialData = [
  {
    name: "facebook",
    icon: Facebook,
    link: "https://www.facebook.com",
  },
  {
    name: "instagram",
    icon: Instagram,
    link: "https://www.instagram.com",
  },
  {
    name: "Tiktok",
    icon: Tiktok,
    link: "https://www.tiktok.com",
  },
  {
    name: "youtube",
    icon: Youtube,
    link: "https://www.youtube.com",
  },
  {
    name: "twitter",
    icon: Twitter,
    link: "https://www.twitter.com",
  },
  {
    name: "github",
    icon: Github,
    link: "https://www.github.com",
  },
];

const StyledIcon = styled.img`
  width: 50px;
  height: 50px;
  transition: transform 0.3s ease;
  object-fit: contain;
  filter: brightness(0) invert(1);
  &:hover {
    transform: scale(1.8);
  }
`;

const Socials = () => {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-2 my-2">
      {socialData.map((social, index) => (
        <a
          key={index}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center bg-[#131315] text-white text-lg leading-6 text-center px-6 py-4 rounded-[99px] transition duration-300 ease-out"
        >
          <StyledIcon
            src={social.icon}
            alt={social.name}
          />
        </a>
      ))}
    </div>
  );
}

export default Socials;
