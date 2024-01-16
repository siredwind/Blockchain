import React from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from './FadeIn';
import RainbowMusicLogo from './RainbowMusicLogo';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <FadeIn>
      <div className="flex max-w-[1240px] justify-between max-sm:justify-center items-center bg-[#131315] mx-auto px-8 py-4 max-lg:mx-2 rounded-[999px] mt-6">
        <div className="flex justify-start items-center gap-x-8 gap-y-8 max-md:gap-3 max-sm:hidden">

          <Link to="/" className={`md:w-[120px] transition-all duration-300 ease-[ease-out] text-[#8a8a93] text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0 hover:text-white text-white`}>
            <RainbowMusicLogo />
          </Link>

          <Link to="/create-campaign" className={`md:w-[120px] transition-all duration-300 ease-[ease-out] text-[#8a8a93] text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0 hover:text-white text-white`}>
            Create Campaign
          </Link>

          <Link to="/edit-campaign" className={`md:w-[120px] transition-all duration-300 ease-[ease-out] text-[#8a8a93] text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0 hover:text-white text-white`}>
            Edit Campaign
          </Link>
        </div>

        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
          className="flex justify-end items-center"
        />

      </div>
    </FadeIn>
  );
};

export default Navbar;
