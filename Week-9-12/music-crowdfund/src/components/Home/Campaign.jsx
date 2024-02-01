import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Socials from "./Socials";

// Icons
import MusicCampaignIcon from "../../assets/music-campaign.png";
import MusicianIcon from "../../assets/musician.svg";
import CommentIcon from "../../assets/comment.png";
import EtherIcon from "../../assets/ether.png";
import FundCampaign from "./FundCampaign";
import { fetchMetadataFromIPFS } from "../../utils/ipfsUtils";

const Campaign = ({ campaign }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    const handleFundClick = () => {
        setIsModalOpen(true);
    };

    const fundsRaisedPercentage = (parseInt(campaign.raised) / parseInt(campaign.goal)) * 100;

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const videoHash = await fetchMetadataFromIPFS(campaign.url);
                if (videoHash)
                    setVideoUrl(videoHash);
            } catch (error) {
                console.error('Error fetching metadata:', error);
                setVideoError(true);
            }
        };

        fetchMetadata();
    }, [campaign.url]);

    return (
        <div className="flex flex-row w-full">
            {/* Campaign Owner and Social Links */}
            <div className="flex flex-col items-center justify-center p-4">
                <div className="flex items-center mb-2">
                    <img src={MusicianIcon} alt="Musician" className="w-6 h-6 mr-2" style={{ filter: "brightness(0) invert(1)", width: "25px", height: "25px" }} />
                    <span className="text-white text-xl">{campaign.musician.slice(0,4)}...{campaign.musician.slice(38, 42)}</span>
                </div>
                <Socials />
            </div>

            {/* Campaign Details */}
            <div className="flex flex-col w-2/3 bg-[#131315] px-12 py-10 rounded-3xl my-2">
                {
                    videoError
                        ? <img
                            src={MusicCampaignIcon}
                            alt="Fallback"
                            className="w-full rounded-xl"
                            style={{ filter: 'brightness(0) invert(1)', backgroundColor: 'transparent' }}
                        />
                        : <video
                            src={videoUrl}
                            className="w-full rounded-xl"
                            style={{ backgroundColor: 'transparent' }}
                            controls
                            onError={() => setVideoError(true)}
                        />
                }
                <h2 className="text-white text-xl font-bold text-left">{campaign.title}</h2>
                <h5 className="flex items-center text-sm text-left">
                    <img src={CommentIcon} alt="Comment" style={{ filter: 'brightness(0) invert(1)', width: "20px", height: "20px" }} />
                    <span className="flex items-center ml-8 bg-[#000000] py-1 px-4 rounded-3xl" style={{ marginLeft: '8px' }}>
                        {campaign.description}
                    </span>
                </h5>
                <div className="flex items-center justify-center text-white mt-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={handleFundClick}>
                        Fund
                    </button>

                    <div className="flex items-center justify-center bg-[#000000] py-1 px-4 rounded-3xl mx-2">
                        <img src={EtherIcon} alt="Raised" style={{ filter: 'brightness(0) invert(1)', width: "30px", height: "30px" }} />
                        <span className="text-sm">
                            {campaign.raised} ETH Raised ({fundsRaisedPercentage}%)
                        </span>
                    </div>
                    <div className="flex items-center justify-center bg-[#000000] py-2 px-4 rounded-3xl mx-2">
                        <span className="text-sm">
                            Active Until {campaign.deadline}
                        </span>
                    </div>
                </div>
            </div>

            <FundCampaign
                campaignId={campaign.id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

Campaign.propTypes = {
    campaign: PropTypes.object
};

export default Campaign;
