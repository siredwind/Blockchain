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