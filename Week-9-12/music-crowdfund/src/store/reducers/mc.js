import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const mc = createSlice({
    name: 'mc',
    initialState: {
        contract: null,
        activeCampaignCount: 0,
        campaigns: [],
        campaignCount: 0,
        socialLinks: [],
        creating: {
            isLoading: false,
            isSuccess: false,
            transactionHash: null
        },
        updating: {
            isLoading: false,
            isSuccess: false,
            transactionHash: null
        },
        funding: {
            isLoading: false,
            isSuccess: false,
            transactionHash: null
        },
        closing: {
            isLoading: false,
            isSuccess: false,
            transactionHash: null
        }
    },
    reducers: {
        setContract: (state, action) => {
            state.contract = action.payload;
        },
        activeCampaignCountLoaded: (state, action) => {
            state.activeCampaignCount = action.payload;
        },
        campaignsLoaded: (state, action) => {
            state.campaigns = action.payload;
        },
        campaignCountLoaded: (state, action) => {
            state.campaignCount = action.payload;
        },
        socialLinksLoaded: (state, action) => {
            state.socialLinks = action.payload;
        },
        createRequest: (state) => {
            state.creating.isLoading = true;
            state.creating.isSuccess = false;
            state.creating.transactionHash = null;
        },
        createSuccess: (state, action) => {
            state.creating.isLoading = false;
            state.creating.isSuccess = true;
            state.creating.transactionHash = action.payload.transactionHash;

            const campaignId = parseInt(state.campaignCount) + 1;
            const campaign = action.payload.campaign;
            const goal = ethers.utils.parseUnits(campaign.goal.toString(), 'wei');
            const raised = ethers.utils.parseUnits('0', 'wei');

            // Add one more campaign to active campaigns
            state.activeCampaignCount = parseInt(state.activeCampaignCount) + 1;

            // Add one more campaign to campaigns
            state.campaignCount = campaignId;

            // Add campaign to campaigns
            state.campaigns[campaignId] = [
                campaignId,
                campaign.musician,
                campaign.title,
                campaign.description,
                campaign.url,
                goal,
                raised,
                campaign.deadline,
                false,
            ]
        },
        createFail: (state) => {
            state.creating.isLoading = false;
            state.creating.isSuccess = false;
            state.creating.transactionHash = null;
        },
        fundRequest: (state) => {
            state.funding.isLoading = true;
            state.funding.isSuccess = false;
            state.funding.transactionHash = null;
        },
        fundSuccess: (state, action) => {
            const { transactionHash, campaignId, amount } = action.payload;
            state.funding.isLoading = false;
            state.funding.isSuccess = true;
            state.funding.transactionHash = transactionHash;

            // Find the campaign and update its raised amount
            const campaignIndex = state.campaigns
                .findIndex(c => parseInt(c[0]) === parseInt(campaignId));

            if (campaignIndex !== -1) {
                // Assuming the amount is in wei and needs to be converted to ether
                const newAmount = ethers.utils.parseUnits(amount.toString(), 'wei');
                const existingAmount = ethers.utils.parseUnits(state.campaigns[campaignIndex][6].toString(), 'wei');

                // Use BigNumber addition
                const updatedAmount = newAmount.add(existingAmount);

                // Convert back to a readable format if necessary
                state.campaigns[campaignIndex][6] = ethers.utils.formatUnits(updatedAmount, 'wei');
            }
        },
        fundFail: (state) => {
            state.funding.isLoading = false;
            state.funding.isSuccess = false;
            state.funding.transactionHash = null;
        },
        updateRequest: (state) => {
            state.updating.isLoading = true;
            state.updating.isSuccess = false;
            state.updating.transactionHash = null;
        },
        updateSuccess: (state, action) => {
            state.updating.isLoading = false;
            state.updating.isSuccess = true;
            state.updating.transactionHash = action.payload;
        },
        updateFail: (state) => {
            state.updating.isLoading = false;
            state.updating.isSuccess = false;
            state.updating.transactionHash = null;
        },
        closeRequest: (state) => {
            state.closing.isLoading = true;
            state.closing.isSuccess = false;
            state.closing.transactionHash = null;
        },
        closeSuccess: (state, action) => {
            state.closing.isLoading = false;
            state.closing.isSuccess = true;
            state.closing.transactionHash = action.payload.transactionHash;

            // remove one campaign from active campaigns
            state.activeCampaignCount = parseInt(state.activeCampaignCount) - 1;

            // remove campaign from campaigns
            state.campaigns = state.campaigns.filter(campaign => 
                parseInt(campaign[0]) !== parseInt(action.payload.campaignId)
            );
        },
        closeFail: (state) => {
            state.closing.isLoading = false;
            state.closing.isSuccess = false;
            state.closing.transactionHash = null;
        }
    }
})

export const {
    setContract,
    campaignsLoaded,
    socialLinksLoaded,
    activeCampaignCountLoaded,
    campaignCountLoaded,
    createRequest,
    createSuccess,
    createFail,
    fundRequest,
    fundSuccess,
    fundFail,
    updateRequest,
    updateSuccess,
    updateFail,
    closeRequest,
    closeSuccess,
    closeFail
} = mc.actions;

export default mc.reducer;