const hre = require("hardhat");
const config = require('../src/config.json');

async function main() {
  console.log(`Fetching accounts & network... \n`);
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];

  let transaction;

  // Fetch network
  const { chainId } = await hre.ethers.provider.getNetwork();

  console.log(`Fetching token and whitelisting accounts... \n`);

  // Fetch deployed crowdsale
  const crowdsale = await hre.ethers.getContractAt('Crowdsale', config[chainId].crowdsale.address);
  console.log(`Crowdsale fetched: ${crowdsale.address}\n`);

  // Whitelist accounts
  transaction = await crowdsale.connect(deployer).addToWhitelist(user1);
  await transaction.wait();
  console.log(`User ${user1} added to the whitelist.\n`);

  transaction = await crowdsale.connect(deployer).addToWhitelist(user2);
  await transaction.wait();
  console.log(`User ${user2} added to the whitelist.\n`);

  transaction = await crowdsale.connect(deployer).addToWhitelist(user3);
  await transaction.wait();
  console.log(`User ${user3} added to the whitelist.\n`);

  console.log(`Finished.\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});