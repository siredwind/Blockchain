import { useState } from 'react';
import { ethers } from 'ethers';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Store 
import { createCampaign, updateSocialLinks } from '../../store/interactions';
import { selectCampaignCount, selectMC, selectProvider } from '../../store/selectors';

// Utils
import { pinFileToIPFS, generateMetadata } from '../ipfsUtils';

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

const useCampaignCreate = () => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const campaignCount = useSelector(selectCampaignCount);
    const provider = useSelector(selectProvider);
    const mc = useSelector(selectMC);

    const createCampaignCall = async ({ formData, socialLinks }) => {
        try {
            setIsLoading(true);
            setSuccessMessage('');
            setErrorMessage('');

            if (formData.isUpload && formData.media) {
                const newCampaignId = campaignCount + 1;
                const { isUpload, ...campaignData } = { ...formData };

                // Step 1: Upload MP4 file
                const mp4Hash = await pinFileToIPFS(formData.media, `${newCampaignId}.mp4`);

                // Step 2: Generate Metadata
                const metadata = generateMetadata(campaignData, mp4Hash);

                // Step 3: Upload Metadata
                const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
                const file = new File([blob], "metadata.json");
                const metadataHash = await pinFileToIPFS(file, `${newCampaignId}.json`);

                // Step 4: Create Campaign
                await createCampaign(
                    provider,
                    mc,
                    campaignData.title,
                    campaignData.description,
                    `${process.env.REACT_APP_PINATA_GATEWAY}/${metadataHash}`,
                    tokens(campaignData.goal),
                    campaignData.deadline,
                    dispatch
                );

                setSuccessMessage(`Campaign ${campaignData.title} was created with ID ${newCampaignId}!`);

                // Step 5: If social links update social links on blockchain
                const hasSocialLinks = Object.values(socialLinks).some(link => link !== '');
                if (hasSocialLinks) {
                    await updateSocialLinks(
                        provider,
                        mc,
                        newCampaignId,
                        socialLinks.facebook,
                        socialLinks.instagram,
                        socialLinks.tiktok,
                        socialLinks.youtube,
                        socialLinks.twitter,
                        socialLinks.github,
                        dispatch
                    );

                    setSuccessMessage(prevState => `${prevState} \n Social links updated successfully!`);
                }
            }

            setIsLoading(false);
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage(`Error creating campaign: ${error}`);
            setIsLoading(false);
        }
    }

    return { createCampaignCall, isLoading, successMessage, errorMessage };
}

export default useCampaignCreate;