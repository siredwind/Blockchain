const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (number) => ethers.utils.parseUnits(number.toString(), 'ether')

describe('Token', () => {
    let token, accounts, deployer;

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token');
        token = await Token.deploy('Meme Ether', 'MTH', '1000000');
        accounts = await ethers.getSigners();
        deployer = accounts[0];
    })

    describe('Deployment', () => {
        const name = 'Meme Ether';
        const symbol = 'MTH';
        const decimals = '18';
        const totalSupply = tokens('1000000');

        it('has correct name', async () => {
            expect(await token.name()).to.equal(name);
        })
    
        it('has correct symbol', async () => {
            expect(await token.symbol()).to.equal(symbol);
        })
    
        it('has correct decimals', async () => {
            expect(await token.decimals()).to.equal(decimals);
        })
    
        it('has correct totalSupply', async () => {
            expect(await token.totalSupply()).to.equal(totalSupply);
        })

        it('assigns totalSupply to deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
        })
    })
})