const ethers = require("ethers");
const CROWDSALE_ABI = require('../src/abis/Crowdsale.json');
const config = require('../src/config.json');

const usersToAddToWhitelist = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    // Add more user addresses as needed
  ];

const CHAIN_ID = 31337;
const CROWDSALE_ADDRESS = config[CHAIN_ID].crowdsale.address;
const NETWORK_URL = 'http:localhost:8545';
const OWNER_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

async function main() {
    addToWhitelist();
}   

async function addToWhitelist() {
    // Connect to the Ethereum network
    const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);

    // Connect to the Crowdsale contract
    const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
    const crowdsale = new ethers.Contract(CROWDSALE_ADDRESS, CROWDSALE_ABI, wallet);
    console.log(crowdsale)
    for (const userAddress of usersToAddToWhitelist) {
      try {
        // Call the addToWhitelist function to add the user to the whitelist
        const tx = await crowdsale.addToWhitelist(userAddress);
        await tx.wait();
        console.log(`User ${userAddress} added to the whitelist.`);
      } catch (error) {
        console.error(`Failed to add user ${userAddress} to the whitelist: ${error.message}`);
      }
    }
  }
  
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });