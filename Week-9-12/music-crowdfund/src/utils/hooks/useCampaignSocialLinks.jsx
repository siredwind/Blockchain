import { useEffect, useState } from "react";

const useCampaignSocialLinks = ({ data, links, id }) => {
    const [campaignSocialLinks, setCampaignSocialLinks] = useState({});

    useEffect(() => {
        // Ensure `id` is correctly aligned with `links` array indexing
        const campaignIndex = id - 1;
        if (campaignIndex >= 0 && campaignIndex < links.length) {
            const currentCampaignsLinks = links[campaignIndex];
            if (currentCampaignsLinks && currentCampaignsLinks.length === data.length) {
                const newSocialLinks = data.reduce((acc, social, index) => {
                    const link = currentCampaignsLinks[index];
                    // Only update the link if it is not an empty string
                    if (link) acc[social.name] = link;
                    return acc;
                }, {});
                setCampaignSocialLinks(newSocialLinks);
            }
        }
    }, [data, links, id]);

    return campaignSocialLinks;
}

export default useCampaignSocialLinks;