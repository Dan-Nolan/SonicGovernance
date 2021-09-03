const govAlphaAddr = "";

async function main() {
  const govAlpha = await ethers.getContractAt("GovernorAlpha", govAlphaAddr);
  const proposalId = 1;
  await govAlpha.castVote(proposalId, true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
