import React from "react";
import PropTypes from "prop-types";

// Components
import Socials from "./Socials";

// Images
import MusicianIcon from "../../assets/musician.svg";

const OwnerProfile = ({ campaignId, musicianAddress }) => {
    return (
        <div className="flex flex-col w-1/4 items-center justify-center p-4 bg-gray-800 rounded-3xl mr-2 my-2">
            <img src={MusicianIcon} alt="Musician" className="w-6 h-6 mr-2" style={{ filter: "brightness(0) invert(1)", width: "250px", height: "250px" }} />

            <div className="flex items-center mb-2">
                <span className="text-white text-xl">
                    {musicianAddress.slice(0, 4)}...{musicianAddress.slice(38, 42)}
                </span>
            </div>

            <Socials campaignId={campaignId} />
        </div>
    )
}

OwnerProfile.propTypes = {
    campaignId: PropTypes.number,
    musicianAddress: PropTypes.string
};

export default OwnerProfile;