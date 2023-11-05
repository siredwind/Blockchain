//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DAO {
    IERC20 public token;
    address owner;
    uint256 public quorum;

    enum PaymentType { Ether, Token }

    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        bool finalized;
        PaymentType paymentType;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public votes;
    mapping(address => uint256) public tokenBalances;

    event Propose(uint id, uint256 amount, address recipient, address creator, PaymentType paymentType);
    event Vote(uint256 id, address investor);
    event Finalize(uint256 id);

    constructor(IERC20 _token, uint256 _quorum) {
        owner = msg.sender;
        token = _token;
        quorum = _quorum;
    }

    // Allow contract to receive Ether
    receive() external payable {}

    modifier onlyInvestor() {
        require(token.balanceOf(msg.sender) > 0, "must be token holder");
        _;
    }

    // Create proposal
    function createProposal(
        string memory _name,
        uint256 _amount,
        address payable _recipient,
        PaymentType _paymentType
    ) external onlyInvestor {
        require(bytes(_name).length > 0, "Proposal must have a description");

        if (_paymentType == PaymentType.Ether) {
            require(address(this).balance >= _amount, "Insufficient Ether balance");
        } else if (_paymentType == PaymentType.Token) {
            require(token.balanceOf(address(this)) >= _amount, "Insufficient token balance");
        }

        proposalCount++;

        // Create a proposal
        proposals[proposalCount] = Proposal(
            proposalCount,
            _name,
            _amount,
            _recipient,
            0,
            false,
            _paymentType
        );

        emit Propose(proposalCount, _amount, _recipient, msg.sender, _paymentType);
    }

    // Vote on proposal
    function vote(uint256 _id) external onlyInvestor {
        // Fetch proposal from mapping by id
        Proposal storage proposal = proposals[_id];

        // Don't let investors vote twice
        require(!votes[msg.sender][_id], "already voted");

        // Update votes
        proposal.votes += token.balanceOf(msg.sender);

        // Track that user has voted
        votes[msg.sender][_id] = true;

        // Emit an event
        emit Vote(_id, msg.sender);
    }

    function downvote(uint256 _id) external onlyInvestor {
        // Fetch proposal from mapping by id
        Proposal storage proposal = proposals[_id];

        // Ensure the proposal has enough votes to deduct from
        require(
            proposal.votes >= token.balanceOf(msg.sender),
            "not enough votes to downvote"
        );

        // Don't let investors vote twice
        require(!votes[msg.sender][_id], "already voted");

        // Update votes
        proposal.votes -= token.balanceOf(msg.sender);

        // Track that user has voted
        votes[msg.sender][_id] = true;

        // Emit an event
        emit Vote(_id, msg.sender);
    }

    // Finalize proposal & transfer funds
    function finalizeProposal(uint256 _id) external onlyInvestor {
        // Fetch the proposal
        Proposal storage proposal = proposals[_id];

        // Ensure proposal is not already finalized
        require(!proposal.finalized, "proposal already finalized");

        // Mark as finalized
        proposal.finalized = true;

        // Check that proposal has enough votes
        require(
            proposal.votes >= quorum,
            "must reach quorum to finalize proposal"
        );

        if (proposal.paymentType == PaymentType.Ether) {
            // Check contract has enough Ether
            require(address(this).balance >= proposal.amount, "Insufficient Ether balance");

            // Transfer funds
            (bool sent, ) = proposal.recipient.call{value: proposal.amount}("");
            require(sent, "Failed to transfer Ether");
        } else if (proposal.paymentType == PaymentType.Token) {
            // Check that the contract has enough Tokens
            require(hasEnoughTokens(address(this), proposal.amount), "Insufficient contract token balance");

            // Transfer funds
            require(token.transfer(proposal.recipient, proposal.amount), "Token transfer failed");
        }

        // Emit events
        emit Finalize(_id);
    }

    // Update the balance when tokens are transferred in
    function depositTokens(uint256 amount) external {
        // Implement the transfer function from the token contract
        require(token.transfer(address(this), amount), "Token transfer failed");
        tokenBalances[msg.sender] += amount;
    }

    // Check token balance
    function hasEnoughTokens(address user, uint256 amount) internal view returns (bool) {
        return tokenBalances[user] >= amount;
    }
}
