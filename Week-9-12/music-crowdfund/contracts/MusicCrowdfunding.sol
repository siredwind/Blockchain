// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicCrowdfunding is Ownable {
    using SafeERC20 for IERC20;
    // ERC20 token used for funding (can be modified based on your needs)
    IERC20 public token;

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }

    // Struct to represent a campaign
    struct Campaign {
        uint256 id; // Campaign ID
        address musician; // Address of the musician/creator
        string title; // Name of the campaign
        string description; // Details for the campaign
        string url; // URL for the campaign (image, video, or link)
        uint256 goal; // Funding goal in wei
        uint256 raised; // Total funds raised in wei
        uint256 deadline; // Campaign deadline timestamp
        bool closed; // Flag to indicate if the campaign is closed
    }

    // Mapping from campaign ID to Campaign
    mapping(uint256 => Campaign) public campaigns;

    // Campaign counters
    uint256 public campaignCount;
    uint256 public activeCampaignCount;

    // Event emitted when a new campaign is created
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed musician,
        string title,
        string description,
        string url,
        uint256 goal,
        uint256 deadline
    );

    // Event emitted when a campaign is funded
    event CampaignFunded(
        uint256 indexed campaignId,
        address indexed backer,
        uint256 amount
    );

    // Event emitted when funds are released to the musician
    event FundsReleased(
        uint256 indexed campaignId,
        address indexed musician,
        uint256 amount
    );

    // Modifier to ensure that the campaign is open for funding
    modifier campaignOpen(uint256 _campaignId) {
        require(!campaigns[_campaignId].closed, "Campaign is closed");
        require(
            block.timestamp < campaigns[_campaignId].deadline,
            "Campaign deadline reached"
        );
        _;
    }

    // Modifier to ensure that the caller is the musician/creator of the campaign
    modifier onlyMusician(uint256 _campaignId) {
        require(
            msg.sender == campaigns[_campaignId].musician,
            "Caller is not the musician"
        );
        _;
    }

    // Function to create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _url,
        uint256 _goal,
        uint256 _durationInDays
    ) external {
        require(_goal > 0, "Goal must be greater than zero");
        require(_durationInDays > 0, "Duration must be greater than zero");

        uint256 durationInSeconds = _durationInDays * 1 days;
        uint256 deadline = block.timestamp + durationInSeconds;

        campaignCount++;
        activeCampaignCount++;

        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            musician: msg.sender,
            title: _title,
            description: _description,
            url: _url,
            goal: _goal,
            raised: 0,
            deadline: deadline,
            closed: false
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _title,
            _description,
            _url,
            _goal,
            deadline
        );
    }

    // Function to fund a campaign
    function fundCampaign(
        uint256 _campaignId,
        uint256 _amount
    ) external campaignOpen(_campaignId) {
        require(_amount > 0, "Amount must be greater than zero");

        // Transfer funds from the backer to the contract
        token.transferFrom(msg.sender, address(this), _amount);

        // Update the campaign's raised amount
        campaigns[_campaignId].raised += _amount;

        emit CampaignFunded(_campaignId, msg.sender, _amount);
    }

    // Function to close a campaign and release funds to the musician if the goal is reached
    function closeCampaign(
        uint256 _campaignId
    ) external onlyMusician(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];

        require(!campaign.closed, "Campaign is already closed");

        // Check if the funding goal is reached
        if (campaign.raised >= campaign.goal) {
            // Release funds to the musician
            token.transfer(campaign.musician, campaign.raised);
            emit FundsReleased(_campaignId, campaign.musician, campaign.raised);
        }

        // Mark the campaign as closed
        campaign.closed = true;

        // Decrease active campaign count
        activeCampaignCount--;
    }

    // Function to retrieve campaign details
    function getCampaignDetails(
        uint256 _campaignId
    )
        external
        view
        returns (
            uint256 id,
            address musician,
            string memory title,
            string memory description,
            string memory url,
            uint256 goal,
            uint256 raised,
            uint256 deadline,
            bool closed
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.id,
            campaign.musician,
            campaign.title,
            campaign.description,
            campaign.url,
            campaign.goal,
            campaign.raised,
            campaign.deadline,
            campaign.closed
        );
    }
}
