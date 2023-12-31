const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens;
const quorum_wei = '500000000000000000000001';

describe('DAO', () => {
    let token, dao;
    let deployer, funder, recipient, user;
    let investor1, investor2, investor3, investor4, investor5;
    let transaction;

    beforeEach(async () => {
        // Set up accounts
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        funder = accounts[1];
        investor1 = accounts[2];
        investor2 = accounts[3];
        investor3 = accounts[4];
        investor4 = accounts[5];
        investor5 = accounts[6];
        recipient = accounts[7];
        user = accounts[8];

        // Deploy Token
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Meme Ether', 'MTH', '1000000')

        // Send tokens to investors - each one gets 20%
        transaction = await token.connect(deployer).transfer(investor1.address, tokens(200000));
        await transaction.wait();

        transaction = await token.connect(deployer).transfer(investor2.address, tokens(200000));
        await transaction.wait();

        transaction = await token.connect(deployer).transfer(investor3.address, tokens(200000));
        await transaction.wait();

        transaction = await token.connect(deployer).transfer(investor4.address, tokens(200000));
        await transaction.wait();

        transaction = await token.connect(deployer).transfer(investor5.address, tokens(200000));
        await transaction.wait();

        // Deploy DAO
        // Set Quorum to > 50% of token total supply. 
        // 500k tokens + 1 wei
        const DAO = await ethers.getContractFactory('DAO');
        dao = await DAO.deploy(token.address, quorum_wei);

        // Funder sends 100 Ether to DAO treasury for Governance
        await funder.sendTransaction({ to: dao.address, value: ether(100) })

    })

    describe('Deployment', () => {
        it('sends Ether to the DAO treasury', async () => {
            expect(await ethers.provider.getBalance(dao.address)).to.equal(ether(100));
        })

        it('return token address', async () => {
            expect(await dao.token()).to.equal(token.address);
        })

        it('return quorum', async () => {
            expect(await dao.quorum()).to.equal(quorum_wei);
        })
    })

    describe('Proposal creation', () => {
        let transaction;

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await dao.connect(investor1).createProposal('Proposal 1', ether(100), recipient.address);
                await transaction.wait();
            })

            it('updates proposal count', async () => {
                expect(await dao.proposalCount()).to.equal(1);
            })

            it('updates proposal mapping', async () => {
                const proposal = await dao.proposals(1);
                expect(proposal.id).to.be.equal(1);
                expect(proposal.amount).to.be.equal(ether(100));
                expect(proposal.recipient).to.be.equal(recipient.address);
            })

            it('emits a propose event', async () => {
                await expect(transaction).to.emit(dao, 'Propose').withArgs(1, ether(100), recipient.address, investor1.address);
            })
        })

        describe('Fails', async () => {
            it('when no description', async () => {
                await expect(dao.connect(investor1).createProposal('', ether(1000), recipient.address)).to.be.reverted;
            })

            it('when invalid amount', async () => {
                await expect(dao.connect(investor1).createProposal('Proposal 1', ether(1000), recipient.address)).to.be.reverted;
            })

            it('when non-investor', async () => {
                await expect(dao.connect(user).createProposal('Proposal 1', ether(1000), recipient.address)).to.be.reverted;
            })
        })
    })

    describe('Voting', () => {
        let transaction;

        beforeEach(async () => {
            transaction = await dao.connect(investor1).createProposal('Proposal 1', ether(100), recipient.address);
            await transaction.wait();
        })

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await dao.connect(investor1).vote(1);
                await transaction.wait();
            })

            it('updates vote count', async () => {
                const proposal = await dao.proposals(1);
                expect(proposal.votes).to.equal(tokens(200000));
            })

            it('emits a vote event', async () => {
                await expect(transaction).to.emit(dao, 'Vote').withArgs(1, investor1.address);
            })
        })

        describe('Fails', async () => {
            it('when non-investor', async () => {
                await expect(dao.connect(user).vote(1)).to.be.reverted;
            })

            it('when double voting', async () => {
                transaction = await dao.connect(investor1).vote(1);
                await transaction.wait();
                await expect(dao.connect(investor1).vote(1)).to.be.reverted;
            })
        })
    })

    describe('Down Voting', () => {
        let transaction;

        beforeEach(async () => {
            transaction = await dao.connect(investor1).createProposal('Proposal 1', ether(100), recipient.address);
            await transaction.wait();

            transaction = await dao.connect(investor1).vote(1);
            await transaction.wait();

            transaction = await dao.connect(investor2).downvote(1);
            await transaction.wait();
        })

        describe('Successfully', () => {
            it('updates vote count', async () => {
                const proposal = await dao.proposals(1);
                expect(proposal.votes).to.equal(tokens(0));
            })

            it('emits a vote event', async () => {
                await expect(transaction).to.emit(dao, 'Vote').withArgs(1, investor2.address);
            })
        })

        describe('Fails', async () => {
            it('when not enough votes', async () => {
                await expect(dao.connect(investor3).downvote(1)).to.be.reverted;
            })

            it('when non-investor', async () => {
                await expect(dao.connect(user).downvote(1)).to.be.reverted;
            })

            it('when double down voting', async () => {
                await expect(dao.connect(investor1).downvote(1)).to.be.reverted;
            })
        })
    })

    describe('Governance', () => {
        let transaction;

        describe('Successfully', () => {
            beforeEach(async () => {
                // Create proposal 
                transaction = await dao.connect(investor1).createProposal('Proposal 1', ether(100), recipient.address);
                await transaction.wait();

                // Vote
                transaction = await dao.connect(investor1).vote(1);
                await transaction.wait();

                transaction = await dao.connect(investor2).vote(1);
                await transaction.wait();

                transaction = await dao.connect(investor3).vote(1);
                await transaction.wait();

                // Finalize proposal
                transaction = await dao.connect(investor1).finalizeProposal(1);
                await transaction.wait()
            })

            it('transfers funds to recipient', async () => {
                expect(await ethers.provider.getBalance(recipient.address)).to.equal(tokens(10100));
            })

            it('updates the proposal to finalized', async () => {
                const proposal = await dao.proposals(1);
                expect(proposal.finalized).to.equal(true);
            })

            it('emits a finalize event', async () => {
                await expect(transaction).to.emit(dao, 'Finalize').withArgs(1);
            })
        })

        describe('Fails', async () => {
            beforeEach(async () => {
                // Create proposal 
                transaction = await dao.connect(investor1).createProposal('Proposal 1', ether(100), recipient.address);
                await transaction.wait();

                // Vote
                transaction = await dao.connect(investor1).vote(1);
                await transaction.wait();

                transaction = await dao.connect(investor2).vote(1);
                await transaction.wait();
            })

            it('when proposal is already finalized', async () => {
                // Vote 3
                transaction = await dao.connect(investor3).vote(1);
                await transaction.wait();

                // Finalize
                transaction = await dao.connect(investor1).finalizeProposal(1);
                await transaction.wait();
                
                // Try to finalize again
                await expect(dao.connect(investor1).finalizeProposal(1)).to.be.reverted;
            })

            it('when there are not enough votes', async () => {
                await expect(dao.connect(investor1).finalizeProposal(1)).to.be.reverted;
            })

            it('when non-investor finalizes', async () => {
                // Vote 3
                transaction = await dao.connect(investor3).vote(1);
                await transaction.wait();
                
                await expect(dao.connect(user).finalizeProposal(1)).to.be.reverted;
            })
        })
    })
})
