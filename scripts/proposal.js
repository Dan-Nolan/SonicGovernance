const tokenAddr = "";
const govAlphaAddr = "";
const characterAddr = "";

async function main() {
  const [addr1] = ethers.provider.listAccounts();
  const token = await ethers.getContractAt("Token", tokenAddr);
  const tx = await token.delegate(addr1);
  await tx.wait();

  const character = await ethers.getContractAt("Character", characterAddr);
  const targets = [character.address];
  const values = ["0"];
  const signatures = [""];
  const calldatas = [character.interface.encodeFunctionData("changeName", ["Sanic"])];
  const govAlpha = await ethers.getContractAt("GovernorAlpha", govAlphaAddr);
  const tx = await govAlpha.propose(targets, values, signatures, calldatas, "Change Sonics Name")
  const receipt = await tx.wait();
  proposalId = receipt.events.find(x => x.event === "ProposalCreated").args.id;

  console.log(`Proposal ${proposalId} created!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
