import React, { useState } from "react";
import PropTypes from 'prop-types';

// Components
import FundCampaignDialog from "./FundCampaignDialog";
import OwnerProfile from "./OwnerProfile";

// Hooks
import CampaignDetails from "./CampaignDetails";

const Campaign = ({ campaign }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenFundDialog = () => setIsModalOpen(true);

    const handleCloseFundDialog = () => setIsModalOpen(false);

    if (!campaign.closed)
        return (
            <div className="flex flex-row w-full">
                <OwnerProfile
                    campaignId={campaign.id}
                    musicianAddress={campaign.musician}
                />

                <CampaignDetails
                    campaign={campaign}
                    handleClick={handleOpenFundDialog}
                />

                <FundCampaignDialog
                    campaignId={campaign.id}
                    isOpen={isModalOpen}
                    onClose={handleCloseFundDialog}
                />
            </div>
        )
}

Campaign.propTypes = {
    campaign: PropTypes.object
};

export default Campaign;
