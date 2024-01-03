import React from "react";
import { FadeIn } from "./FadeIn";

// RainbowKit
import { ConnectButton } from "@rainbow-me/rainbowkit";

const links = [
  {
    name: "Home",
    link: "#home",
  },
  {
    name: "Create Campaign",
    link: "#create",
  },
  {
    name: "Edit Campaign",
    link: "#edit",
  },
];
const Navbar = () => {
  return (
    <div>
      <FadeIn>
        <div className="flex max-w-[1240px] justify-between max-sm:justify-center items-center bg-[#131315] mx-auto px-8 py-4 max-lg:mx-2 rounded-[999px] mt-6">
          {/* <span className="text-lg leading-6 -translate-x-[0.01em] upper" style={{ color: 'white'}}>
            Username
          </span> */}
          <div className="flex justify-start items-center gap-x-8 gap-y-8 max-md:gap-3 max-sm:hidden">
            {links.map((navLink, id) => (
              <a
                key={id}
                href={navLink.link}
                className={`md:w-[120px] transition-all duration-300 ease-[ease-out] text-[#8a8a93] text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0 hover:text-white ${navLink.link === "#home" ? "text-white" : ""
                  }`}
              >
                {navLink.name}
              </a>
            ))}
          </div>
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" className="flex justify-end items-center"/>
        </div>
        
        <div className="flex w-full justify-center items-center sm:hidden">
          <div className="flex justify-around items-center gap-x-8 gap-y-8 max-w-[1240px]  bg-[#131315] px-8 py-4 rounded-full fixed bottom-5 mx-auto">
            {links.map((navLink, id) => (
              <a
                key={id}
                href={navLink.link}
                className={`md:w-[120px] transition-all duration-300 ease-[ease-out] text-[#8a8a93] text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0 hover:text-white ${navLink.link === "#home" ? "text-white" : ""
                  }`}
              >
                {navLink.name}
              </a>
            ))}
          </div>
          
        </div>
      </FadeIn>
    </div>
  );
}

export default Navbar;
