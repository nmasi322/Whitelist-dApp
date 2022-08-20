const {ethers} = require("hardhat");

async function main(){
  const whitelistContract = await ethers.getContractFactory("Whitelist")

  const deployedContract = await whitelistContract.deploy(15);

  await deployedContract.deployed()

  console.log("Whitelist contract address:", deployedContract.address);
}

main()
.then(() => {
  process.exit(0)
})
.catch(err => {
  console.log(err);
  process.exit(1)
})