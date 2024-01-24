import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';

// Components
import Container from "../Container";
import { FadeIn } from "../FadeIn";
import Campaign from "./Campaign";
import News from "./News";

// Hooks
import { useContractRead, useContractReads } from "wagmi";
import useContract from "../../utils/hooks/useContract";

// Utils
import { MusicCrowdfundingFunctions } from "../../utils/constants";

const Home = () => {
  const [campaignsDetails, setCampaignsDetails] = useState([]);

  const { contract: musicCrowdFundingContract } = useContract('MusicCrowdfunding');

  // Get campaignCount
  const {
    data: campaignCount,
    isError: campaignCountError,
    isLoading: campaignCountLoading
  } = useContractRead({
    ...musicCrowdFundingContract,
    functionName: MusicCrowdfundingFunctions.CAMPAIGN_COUNT
  })

  // Get activeCampaignCount
  const {
    data: activeCampaignCount,
    isError: activeCampaignCountError,
    isLoading: activeCampaignCountLoading
  } = useContractRead({
    ...musicCrowdFundingContract,
    functionName: MusicCrowdfundingFunctions.ACTIVE_CAMPAIGN_COUNT
  })

  // Construct reads parameters
  let contractsArray = [];
  for (let campaignId = 1; campaignId <= parseInt(campaignCount); campaignId++) {
    contractsArray.push({
      ...musicCrowdFundingContract,
      functionName: MusicCrowdfundingFunctions.GET_CAMPAIGN_DETAILS,
      args: [campaignId]
    })
  }

  // Get all campaign details
  const {
    data: allCampaignDetails,
    isError,
    isLoading
  } = useContractReads({ contracts: contractsArray })

  useEffect(() => {
    if (allCampaignDetails && allCampaignDetails.length > 0) {
      const allCampaigns = allCampaignDetails.reduce((acc, campaign) => {
        const campaignDetails = {
          id: parseInt(campaign.result[0]),
          musician: campaign.result[1],
          title: campaign.result[2],
          description: campaign.result[3],
          url: campaign.result[4],
          goal: ethers.utils.formatEther(campaign.result[5]),
          raised: ethers.utils.formatEther(campaign.result[6]),
          deadline: new Date((campaign.result[7]).toString() * 1000).toLocaleString(),
          closed: campaign.result[8]
        }

        if (campaignDetails) acc.push(campaignDetails);
        return acc;
      }, [])

      setCampaignsDetails(allCampaigns);
    }
  }, [allCampaignDetails])

  return (
    <Container id="home">
      <FadeIn>
        <News activeCampaigns={parseInt(activeCampaignCount)} />
      </FadeIn>
      <FadeIn>
        <div className="flex flex-col items-center my-2">
          {campaignsDetails.map(campaign => <Campaign campaign={campaign} />)}
        </div>
      </FadeIn>
    </Container>
  );
}

export default Home;
