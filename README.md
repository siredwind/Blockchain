# Blockchain
Repository that keeps all my blockchain applications

# Troubleshoot if node version is gone in new Terminal session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Hardhat useful commands
## Week 1. Create project from scratch 
### create clean package.json 
npm init --yes
npm install --save-dev hardhat
### create hardhat project
npx hardhat
### compile code
npx hardhat compile
### create blockchain
npx hardhat node
### deploy contract
npx hardhat run --network localhost scripts/deploy.js
### open hardhat console
npx hardhat console --network localhost
### declare contract variable
const greeter = await ethers.getContractAt("Greeter", "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707")
### show contract address
greeter.runner.address
### get from contract
await greeter.get()
### write with contract
await greeter.set("Hello World! I modified my first Smart Contract!")

## Week 2. Create blockchain-developer-bootcamp backend
### get accounts from contract
const accounts = await ethers.getSigners()
### get first account
accounts[0]
### get account balance
const balance = await ethers.provider.getBalance(accounts[0].address)
### display balance
balance.toString()
### convert balance from wei to ether
ethers.utils.formatEther(balance.toString())

## Week 2. Verify Contract
### flatten contract
npx hardhat flatten > TokenFlatten.sol
### verify contract 
npx hardhat --verify --network sepolia 0xe437260B3785171cB5BAd86c3B78d961da1b8223 "Meme Ether" "MTH" "1000000" 
### manual verify contract
https://sepolia.etherscan.io/verifyContract-solc?a=0xe437260B3785171cB5BAd86c3B78d961da1b8223&c=v0.8.9%2bcommit.e5eed63a&lictype=2
add flatten contract code
choose sepolia network
choose solidity version from hardhat.config.js
choose license from contract header

## Week 2. Send tokens
Open Metamask -> Import tokens -> paste contract creation address 0x7feff842D55Aa98560791b00ff3Da8dA121Eb897
Send tokens using the address of the account