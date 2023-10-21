const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (number) => ethers.utils.parseUnits(number.toString(), 'ether');
const ether = tokens;

describe('Crowdsale', () => {
    let crowdsale, token;
    let accounts, deployer, user1; 

    beforeEach(async () => {
        // Load Contracts
        const Crowdsale = await ethers.getContractFactory('Crowdsale');
        const Token = await ethers.getContractFactory('Token');

        // Deploy token
        token = await Token.deploy('Meme Ether', 'MTH', '1000000');

        // Configure Accounts
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user1 = accounts[1];
    
        // Deploy Crowdsale
        crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000');

        // Send tokens to crowdsale
        let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000));
        await transaction.wait();
    })

    describe('Deployment', () => {
        it('sends tokens to the Crowdsale contract', async () => {
            expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
        })

        it('returns the price', async () => {
            expect(await crowdsale.price()).to.be.equal(ether(1));
        })

        it('returns token address', async () => {
            expect(await crowdsale.token()).to.equal(token.address);
        })
    })

    describe('Buying Tokens', () => {
        let transaction, result;
        let amount = tokens(10);

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) });
                result = await transaction.wait();
            })
        
            it('transfers tokens', async () => {
                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990));
                expect(await token.balanceOf(user1.address)).to.equal(amount);
            })

            it('updates contracts ether balance', async () => {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount);
            })

            it('updates tokensSold', async () => {
                expect(await crowdsale.tokensSold()).to.equal(amount);
            })

            it('emits a buy event', async () => {
                await expect(transaction).to.emit(crowdsale, 'Buy').withArgs(amount, user1.address);
            })
        })

        describe('Fails', () => {
            it('when insufficient ETH', async () => {
                await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted;
            })
        })
    })

    describe('Sending ETH', () => {
        let transaction;
        let amount = ether(10);

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount});
                await transaction.wait();
            })

            it('updates contracts ether balance', async () => {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount);
            })

            it('updates user token balance', async () => {
                expect(await token.balanceOf(user1.address)).to.equal(amount);
            })

        })
    })

    describe('Update Price', () => { 
        let transaction;
        let price = ether(2);

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await crowdsale.connect(deployer).setPrice(price);
                await transaction.wait();

                transaction = await crowdsale.connect(deployer).finalize();
                await transaction.wait();
            })

            it('updates the price', async () => {
                expect(await crowdsale.price()).to.equal(price);
            })
        })

        describe('Fails', () => {
            it('when non-owner updates price', async () => {
                await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted;
            })
        })
    })

    describe('Finalize Sale', () => {
        let transaction;
        let amount = tokens(10);
        let value = ether(10);

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value });
                await transaction.wait();

                transaction = await crowdsale.connect(deployer).finalize();
                await transaction.wait();
            })

            it('transfers remaining tokens to owner', async () => {
                expect(await token.balanceOf(crowdsale.address)).to.equal(0);
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990));
            })

            it('transfers ETH balance to owner', async () => {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(0);
            })

            it('emits a Finalize event', async () => {
                await expect(transaction).to.emit(crowdsale, 'Finalize').withArgs(amount, value);
            })

        })

        describe('Fails', () => {
            it('when non-owner wants to finalize', async () => {
                await expect(crowdsale.connect(user1).finalize()).to.be.reverted;
            })
        })

    })
})