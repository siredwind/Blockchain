import React from "react";

// Components
import Container from "../Container";
import Campaign from "../Campaign";
import News from "../News";
import { FadeIn } from "../FadeIn";

// Redux 
import { useSelector } from "react-redux";

// Store
import {
  campaignSelector,
  selectActiveCampaignCount
} from "../../store/selectors";

const Home = () => {
  const activeCampaignsCount = useSelector(selectActiveCampaignCount);
  const campaignsDetails = useSelector(campaignSelector) || [];

  return (
    <Container id="home">

      <FadeIn>
        <News activeCampaigns={parseInt(activeCampaignsCount)} />

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
