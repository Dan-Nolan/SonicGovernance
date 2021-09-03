const tokenAddr = "";

async function main() {
  const nonce = await ethers.provider.getTransactionCount(addr1);
  const govAlphaAddr = ethers.utils.getContractAddress({ from: addr1, nonce: nonce + 1 });
  const Timelock = await ethers.getContractFactory("Timelock");
  const timelock = await Timelock.deploy(govAlphaAddr, delay);
  await timelock.deployed();
  console.log("Timelock", timelock.address);

  const GovernorAlpha = await ethers.getContractFactory("GovernorAlpha");
  const govAlpha = await GovernorAlpha.deploy(timelock.address, token.address, addr1);
  await govAlpha.deployed();
  console.log("Gov", govAlpha.address);

  const Character = await ethers.getContractFactory("Character");
  const character = await Character.deploy(govAlpha.address);
  await character.deployed();
  console.log("Character", charact.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
