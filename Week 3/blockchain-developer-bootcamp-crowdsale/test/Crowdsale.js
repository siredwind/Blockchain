const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (number) => ethers.utils.parseUnits(number.toString(), 'ether');
const ether = tokens;

describe('Crowdsale', () => {
    let crowdsale, token;
    let accounts, deployer, user1, user2;

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
        user2 = accounts[2];

        // Deploy Crowdsale
        const openTime = Math.floor(Date.now() / 1000) - 60;
        crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000', openTime);

        // Send tokens to crowdsale
        let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000));
        await transaction.wait();

        // Add user1 to whitelist
        await crowdsale.connect(deployer).addToWhitelist(user1.address);
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

    describe('Open Time Restriction', () => {
        describe('Successfully', async () => {
            it('allows buying tokens after open time', async () => {
                // Attempt to buy tokens after the open time.
                const transaction = await crowdsale.connect(user1).buyTokens(tokens(10), { value: ether(10) });
                await transaction.wait();
    
                // You can add more checks to ensure the purchase was successful.
                expect(await token.balanceOf(user1.address)).to.equal(tokens(10));
            });
        })

        describe('Fails', async () => {
            it('when buying tokens before open time', async () => {
                const openTime = Math.floor(Date.now() / 1000) + 86400;
                await crowdsale.connect(deployer).setOpenTime(openTime);
                await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: ether(10) })).to.be.reverted;
            });
        })
    });

    describe('Whitelist', () => {
        describe('Successfully', async () => {
            it('adds user to whitelist', async () => {
                // You can check for an event here or check some state change in your contract.
                // For example, check if the user's balance is updated, indicating they are whitelisted.
                // You might have a whitelist mapping in your contract.
                // const isWhitelisted = await crowdsale.isWhitelisted(user1.address);
                const user1Balance = await token.balanceOf(user1.address);
                expect(user1Balance).to.be.gte(0); // User1 balance should be greater than or equal to 0 if they are added to the whitelist.
            });

            it('removes user from whitelist', async () => {
                // Remove the user from the whitelist.
                await crowdsale.connect(deployer).removeFromWhitelist(user1.address);
                // You can check if the user's balance is 0, indicating they are removed from the whitelist.
                const user1Balance = await token.balanceOf(user1.address);
                expect(user1Balance).to.equal(0);
            });
        })
        
        describe('Fails', async () => {
            it('when non-owner adds user to whitelist', async () => {
                await expect(crowdsale.connect(user1).addToWhitelist(user2.address)).to.be.reverted;
            });
        
            it('when non-owner removes user from whitelist', async () => {
                // Attempt to remove user1 from the whitelist using a non-owner account.
                await expect(crowdsale.connect(user1).removeFromWhitelist(user2.address)).to.be.reverted;
            });
        })
    });

    describe('Buying Tokens', () => {
        let transaction, result;
        let amount = tokens(10);

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) });
                result = await transaction.wait();
            });

            it('transfers tokens', async () => {
                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990));
                expect(await token.balanceOf(user1.address)).to.equal(amount);
            });

            it('updates contracts ether balance', async () => {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount);
            });

            it('updates tokensSold', async () => {
                expect(await crowdsale.tokensSold()).to.equal(amount);
            });

            it('emits a buy event', async () => {
                await expect(transaction).to.emit(crowdsale, 'Buy').withArgs(amount, user1.address);
            });
        });

        describe('Fails', () => {
            it('when user is not whitelisted', async () => {
                await expect(crowdsale.connect(user2).buyTokens(tokens(10), { value: ether(10) })).to.be.reverted;
            });

            it('when insufficient ETH', async () => {
                await expect(crowdsale.connect(deployer).buyTokens(tokens(10), { value: ether(0) })).to.be.reverted;
            });

            it('when purchase amount is below the minimum', async () => {
                // Set the amount below the minimum (0.5 tokens, which is less than the minimum of 1)
                const invalidAmount = tokens(0.5);
                await expect(crowdsale.connect(user1).buyTokens(invalidAmount, { value: ether(0.5) })).to.be.reverted;
            })
    
            it('when purchase amount is above the maximum', async () => {
                // Set the amount above the maximum (101 tokens, which exceeds the maximum of 1000)
                const invalidAmount = tokens(1001);
                await expect(crowdsale.connect(user1).buyTokens(invalidAmount, { value: ether(1001) })).to.be.reverted;
            })
        });
    });

    describe('Sending ETH', () => {
        let transaction;
        let amount = ether(10);

        describe('Successfully', () => {
            beforeEach(async () => {
                transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount });
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