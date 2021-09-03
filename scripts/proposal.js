const tokenAddr = "0xeDBc990B877d0E552b0046988C4ef9174ad75018";
const govAlphaAddr = "0xAcA2E6C7C4fE4346711677e993AB6F7E025EAcAF";
const characterAddr = "0xa9961a6bbc7af4ba72a93a268986dd414d3e36ee";

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
