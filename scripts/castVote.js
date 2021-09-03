const govAlphaAddr = "";

async function execute() {
  const govAlpha = await ethers.getContractAt("GovernorAlpha", govAlphaAddr);
  const proposalId = 1;
  const tx = await govAlpha.queue(proposalId);
  await tx.wait();

  await govAlpha.execute(proposalId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
