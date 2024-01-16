import React from "react";

// Icons
import Facebook from "../../assets/facebook.png";
import Youtube from "../../assets/youtube.avif";
import Twitter from "../../assets/twitter.png";
import Github from "../../assets/github.jpg";
import Instagram from "../../assets/instagram.jpeg";
import Tiktok from "../../assets/tiktok.png";

const socialData = [
  {
    name: "facebook",
    icon: <Facebook />,
    link: "#",
  },
  {
    name: "instagram",
    icon: <Instagram />,
    link: "#",
  },
  {
    name: "Tiktok",
    icon: <Tiktok />,
    link: "#",
  },
  {
    name: "youtube",
    icon: <Youtube />,
    link: "#",
  },
  {
    name: "twitter",
    icon: <Twitter />,
    link: "#",
  },
  {
    name: "github",
    icon: <Github />,
    link: "#",
  },
];

const Socials = () => {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-2 my-2">
      {socialData.map((social, index) => (
        <a
          key={index}
          href={social.link}
          className="flex justify-center items-center bg-[#131315] text-white text-lg leading-6 text-center px-6 py-4 rounded-[99px] transition duration-300 ease-out"
        >
          <img
                    src={social.icon} // Replace with your campaign image URL
                    alt={social.name}
                    className="w-full rounded-xl"
                    style={{ filter: 'brightness(0) invert(1)', backgroundColor: 'transparent' }}
                />
        </a>
      ))}
    </div>
  );
}

export default Socials;
