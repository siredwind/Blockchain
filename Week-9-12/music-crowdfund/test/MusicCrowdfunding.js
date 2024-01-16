const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens;

const TITLE = 'Campaign #1';
const DESCRIPTION = 'This is campaign #1 created by musician';
const URL = "https://example.com/campaign";
const GOAL = ether(1);
const DEADLINE_IN_DAYS = 30;

describe('Token', () => {
  let token, mc, accounts;
  let deployer, musician, fan;
  let transaction;

  beforeEach(async () => {
    // Deploy Token
    const Token = await ethers.getContractFactory('Token');
    token = await Token.deploy();

    // Deploy MusicCrowdfunding
    const MC = await ethers.getContractFactory('MusicCrowdfunding');
    mc = await MC.deploy(token.address);

    // Get accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    musician = accounts[1];
    fan = accounts[2];

    // Send tokens to fan
    transaction = await token.connect(deployer).transfer(fan.address, tokens(1000));
    await transaction.wait();

    // Approve MusicCrowdfunding to spend tokens on behalf of the fan
    transaction = await token.connect(fan).approve(mc.address, tokens(1000));
    await transaction.wait();
  })

  describe('Deployment', () => {
    it('Should deploy the contract', async () => {
      expect(mc.address).to.not.equal('0x');
      expect(await mc.owner()).to.equal(deployer.address);
    })

    it('Should initialize with the correct token address', async () => {
      const tokenAddress = await mc.token();
      expect(tokenAddress).to.not.equal(ethers.constants.AddressZero);
    })
  })

  describe('Create campaign', () => {
    let transaction;
    let campaignDetails;

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await mc.connect(musician).createCampaign(TITLE, DESCRIPTION, URL, GOAL, DEADLINE_IN_DAYS);
        await transaction.wait();

        // Get campaign details
        campaignDetails = await mc.getCampaignDetails(1);
      })

      it('Should have a campaign on musician', async () => {
        expect(await campaignDetails.musician).to.equal(musician.address);
      })

      it('Should have a goal', async () => {
        expect(await campaignDetails.goal).to.equal(GOAL);
      })

      it('Should have a deadline', async () => {
        const deadline = await campaignDetails.deadline;
        const latestBlockTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
        const expectedDeadline = latestBlockTimestamp + DEADLINE_IN_DAYS * 86400;
      
        expect(deadline).to.equal(expectedDeadline);
      })      

      it('Should be an open campaign', async () => {
        expect(await campaignDetails.closed).to.be.equal(false);
      })

      it('Should emit an event', async () => {
        await expect(transaction).to.emit(mc, 'CampaignCreated').withArgs(
          1,
          musician.address,
          TITLE,
          DESCRIPTION,
          URL,
          GOAL,
          (await ethers.provider.getBlock('latest')).timestamp + DEADLINE_IN_DAYS * 86400
        );
      })
    })

    describe('Failure', () => {
      it('Rejects a 0 goal campaign', async () => {
        await (expect(mc.connect(musician).createCampaign(TITLE, DESCRIPTION, URL, 0, DEADLINE_IN_DAYS))).to.be.reverted;
      })

      it('Rejects a 0 deadline campaign', async () => {
        await (expect(mc.connect(musician).createCampaign(TITLE, DESCRIPTION, URL, GOAL, 0))).to.be.reverted;
      })
    })
  })

  describe('Fund campaign', () => {
    let transaction;

    beforeEach(async () => {
      // Create campaign
      transaction = await mc.connect(musician).createCampaign(TITLE, DESCRIPTION, URL, GOAL, DEADLINE_IN_DAYS);
      await transaction.wait();

      // Fund campaign
      transaction = await mc.connect(fan).fundCampaign(1, GOAL);
      await transaction.wait();
    });

    describe('Success', () => {
      it('Should update campaign raised amount', async () => {
        expect((await mc.getCampaignDetails(1)).raised).to.equal(GOAL);
      })

      it('Should emit an event', async () => {
        await expect(transaction).to.emit(mc, 'CampaignFunded').withArgs(1, fan.address, ether(1));
      })
    })

    describe('Failure', () => {
      it('Should reject funding with zero amount', async () => {
        await expect(mc.connect(fan).fundCampaign(1, 0)).to.be.revertedWith("Amount must be greater than zero");
      });
    });
  })

  describe('Close campaign', () => {
    let transaction;

    beforeEach(async () => {
      // Create campaign
      transaction = await mc.connect(musician).createCampaign(TITLE, DESCRIPTION, URL, GOAL, DEADLINE_IN_DAYS);
      await transaction.wait();

      // Fund campaign
      transaction = await mc.connect(fan).fundCampaign(1, GOAL);
      await transaction.wait();
    });

    describe('Success', () => {
      it('Should close the campaign after reaching the goal', async () => {
        // Advance the block time to simulate reaching the deadline
        await network.provider.send("evm_increaseTime", [DEADLINE_IN_DAYS + 1]);
        await network.provider.send("evm_mine");

        // Close the campaign
        transaction = await mc.connect(musician).closeCampaign(1);
        await transaction.wait();

        // Check if the campaign is closed
        const campaignDetails = await mc.getCampaignDetails(1);
        expect(campaignDetails.closed).to.be.equal(true);
      });

      it('Should transfer funds to the musician upon reaching the goal', async () => {
        // Advance the block time to simulate reaching the deadline
        await network.provider.send("evm_increaseTime", [DEADLINE_IN_DAYS + 1]);
        await network.provider.send("evm_mine");

        // Get musician's balance before closing the campaign
        const initialBalance = await token.balanceOf(musician.address);

        // Close the campaign
        transaction = await mc.connect(musician).closeCampaign(1);
        await transaction.wait();

        // Check if funds were transferred to the musician
        const finalBalance = await token.balanceOf(musician.address);
        const expectedBalance = initialBalance.add(GOAL);
        expect(finalBalance).to.be.equal(expectedBalance);
      });
    });

    describe('Failure', () => {
      it('Should reject funding a closed campaign', async () => {
        await mc.connect(musician).closeCampaign(1);

        await expect(mc.connect(fan).fundCampaign(1, GOAL)).to.be.revertedWith("Campaign is closed");
      });
      
      it('Should reject closing the campaign by someone other than the musician', async () => {
        // Advance the block time to simulate reaching the deadline
        await network.provider.send("evm_increaseTime", [DEADLINE_IN_DAYS + 1]);
        await network.provider.send("evm_mine");

        // Try to close the campaign by a different account
        await expect(mc.connect(fan).closeCampaign(1)).to.be.revertedWith('Caller is not the musician');
      });
    });
  })
})
