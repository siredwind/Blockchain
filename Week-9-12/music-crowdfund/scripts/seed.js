// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require("../src/config.json");

const tokens = (n) => {
    return hre.ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
    console.log(`Fetching accounts & network... \n`);
    const accounts = await hre.ethers.getSigners();
    const funder = accounts[0];
    const musician1 = accounts[1];
    const musician2 = accounts[2];
    const fan1 = accounts[3];
    const fan2 = accounts[4];

    let transaction;

    // Fetch network
    const { chainId } = await hre.ethers.provider.getNetwork();

    console.log(`Fetching token and transferring to accounts... \n`);

    // Fetch deployed token
    const token = await hre.ethers.getContractAt('Token', config[chainId].token.address);
    console.log(`Token fetched: ${token.address}\n`);

    // Send tokens to investors - each one gets 20%
    transaction = await token.transfer(musician1.address, tokens(200000));
    await transaction.wait();

    transaction = await token.transfer(musician2.address, tokens(200000));
    await transaction.wait();

    transaction = await token.transfer(fan1.address, tokens(200000));
    await transaction.wait();

    transaction = await token.transfer(fan2.address, tokens(200000));
    await transaction.wait();

    // Fetch deployed mc
    const mc = await hre.ethers.getContractAt('MusicCrowdfunding', config[chainId].mc.address);
    console.log(`MusicCrowdfunding fetched: ${mc.address}\n`);

    // Funder sends Ether to MusicCrowdfunding treasury
    const value = tokens(1000);
    transaction = await funder.sendTransaction({ to: mc.address, value: value }); // 1000 Ether
    await transaction.wait();
    console.log(`Sent ${value}ETH to MusicCrowdfunding treasury...\n`);

    // Musician1 creates a campaign
    transaction = await mc.connect(musician1).createCampaign(tokens(100), 30);
    await transaction.wait();
    console.log(`Musician1 created a campaign. \n`)

    // Musician2 creates a campaign
    transaction = await mc.connect(musician2).createCampaign(tokens(100), 30);
    await transaction.wait();
    console.log(`Musician1 created a campaign. \n`)

    console.log(`Finished.\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});