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
  GATEWAY_PINATA_URL = "https://gateway.pinata.cloud/ipfs/";
  BASE_URI = "QmcqJAkZoXA33PxEeQQrWCTVNgXDjg3S2yXz7xXSUYjiVP/";
  BASE_EXT = ".json";

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

  // Fetch deployed mc
  const mc = await hre.ethers.getContractAt('MusicCrowdfunding', config[chainId].mc.address);
  console.log(`MusicCrowdfunding fetched: ${mc.address}\n`);

  const funderBalance = await token.balanceOf(funder.address);
  console.log(`Funder's token balance: ${hre.ethers.utils.formatUnits(funderBalance, 'ether')} \n`);

  // Send tokens to investors - each one gets 20%
  transaction = await token.connect(funder).transfer(musician1.address, tokens(10000));
  await transaction.wait();

  transaction = await token.connect(funder).transfer(musician2.address, tokens(10000));
  await transaction.wait();

  transaction = await token.connect(funder).transfer(fan1.address, tokens(10000));
  await transaction.wait();

  transaction = await token.connect(funder).transfer(fan2.address, tokens(10000));
  await transaction.wait();

  // Musician1 creates a campaign
  transaction = await mc.connect(musician1).createCampaign(
    '3 Latino Girls',
    'Campaign created for a raggaeton song released by 3 latino girls.',
    `${GATEWAY_PINATA_URL}${BASE_URI}1${BASE_EXT}`,
    tokens(100),
    300
  );
  await transaction.wait();
  console.log(`Musician1 created campaign 1. \n`)

  // Musician2 creates a campaign
  transaction = await mc.connect(musician2).createCampaign(
    'Walking Past',
    'Campaign created for a pop song released by an artist walking with headphones and singing.',
    `${GATEWAY_PINATA_URL}${BASE_URI}2${BASE_EXT}`,
    tokens(100),
    300
  );
  await transaction.wait();
  console.log(`Musician2 created a campaign 2. \n`)

  // Musician1 creates a campaign
  transaction = await mc.connect(musician1).createCampaign(
    'Techno vibes',
    'Campaign created for a dubstep song released by Deadmau.',
    `${GATEWAY_PINATA_URL}${BASE_URI}3${BASE_EXT}`,
    tokens(100),
    300
  );
  await transaction.wait();
  console.log(`Musician1 created campaign 3. \n`)

  // Musician2 creates a campaign
  transaction = await mc.connect(musician2).createCampaign(
    'Prelude',
    'Campaign created for a classical song released by Yann Tiersen.',
    `${GATEWAY_PINATA_URL}${BASE_URI}4${BASE_EXT}`,
    tokens(100),
    300
  );
  await transaction.wait();
  console.log(`Musician2 created a campaign 4. \n`)

  // Musician1 creates a campaign
  transaction = await mc.connect(musician1).createCampaign(
    'Sad Goodbye',
    'Campaign created for a pop song released by a new pop star.',
    `${GATEWAY_PINATA_URL}${BASE_URI}5${BASE_EXT}`,
    tokens(100),
    300
  );
  await transaction.wait();
  console.log(`Musician1 created campaign 5. \n`)

  // Fan1 approves transfer of 10 tokens
  transaction = await token.connect(fan1).approve(mc.address, tokens(10));
  await transaction.wait();

  // Fan1 funds 10 tokens to campaign1
  transaction = await mc.connect(fan1).fundCampaign(
    1,
    tokens(10)
  )
  await transaction.wait();
  console.log(`Fan1 funded ${hre.ethers.utils.formatUnits(tokens(10), 'ether')} to campaign1. \n`)

  console.log(`Finished.\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});