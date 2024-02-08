
export const IPFS_TAG = "ipfs://";

export const MusicCrowdfundingFunctions = {
    ACTIVE_CAMPAIGN_COUNT: 'activeCampaignCount',
    CAMPAIGN_COUNT: 'campaignCount',
    GET_CAMPAIGN_DETAILS: 'getCampaignDetails',
    CREATE_CAMPAIGN: 'createCampaign',
    FUND_CAMPAIGN: 'fundCampaign',
    CLOSE_CAMPAIGN: 'closeCampaign'
};

export const InitCampaignData = {
    title: "",
    description: "",
    media: "",
    goal: "1",
    deadline: "30",
    isUpload: true,
};

export const InitSocialLinks = {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    github: ""
};

export const MetadataTemplate = {
    id: "7ccc7c11688b48ea9f437abdfaf4f30dc",
    name: "",
    description: "",
    video: "",
    edition: 1,
    date: 0,
    attributes: [
        {
            "trait_type": "Genre",
            "value": "Pop"
        },
        {
            "trait_type": "Length",
            "value": "20"
        },
        {
            "trait_type": "Description",
            "value": "Guitar"
        },
        {
            "trait_type": "Remarkable",
            "value": "Bed"
        }
    ]
};

export const socialMediaArray = [
    "facebook", 
    "instagram", 
    "tiktok", 
    "youtube", 
    "twitter", 
    "github"
];