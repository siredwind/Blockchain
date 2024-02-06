import React from "react";

// Components
import Container from "../Container";
import { FadeIn } from "../FadeIn";
import Campaign from "./Campaign";
import News from "./News";

// Redux 
import { useSelector } from "react-redux";

// Store
import { campaignSelector, selectActiveCampaignCount } from "../../store/selectors";

const Home = () => {
  const activeCampaignsCount = useSelector(selectActiveCampaignCount);
  const campaignsDetails = useSelector(campaignSelector) || [];

  return (
    <Container id="home">
      
      <FadeIn>
        <News activeCampaigns={parseInt(activeCampaignsCount)} />
      </FadeIn>
      
      <FadeIn>
        <div className="flex flex-col items-center my-2">
          {campaignsDetails.map(campaign =>
            <Campaign
              campaign={campaign}
              key={campaign.id}
            />)}
        </div>
      </FadeIn>
    </Container>
  );
}

export default Home;
