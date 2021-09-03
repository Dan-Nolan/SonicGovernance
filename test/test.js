const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("GovernorAlpha", function () {
  const delay = 2 * 24 * 60 * 60;
  let addr1, token, timelock, govAlpha, character;
  beforeEach(async () => {
    [addr1] = await ethers.provider.listAccounts();
    const Sonic = await ethers.getContractFactory("Sonic");
    token = await Sonic.deploy(addr1);
    await token.deployed();

    const nonce = await ethers.provider.getTransactionCount(addr1);
    const govAlphaAddr = ethers.utils.getContractAddress({ from: addr1, nonce: nonce + 1 });
    const Timelock = await ethers.getContractFactory("Timelock");
    timelock = await Timelock.deploy(govAlphaAddr, delay);
    await timelock.deployed();

    const GovernorAlpha = await ethers.getContractFactory("GovernorAlpha");
    govAlpha = await GovernorAlpha.deploy(timelock.address, token.address, addr1);
    await govAlpha.deployed();

    const Character = await ethers.getContractFactory("Character");
    character = await Character.deploy();
    await character.deployed();
  });

  it("should give the sonic tokens to addr1", async function () {
    const expected = ethers.utils.parseEther("10000000");
    const actual = await token.balanceOf(addr1);
    assert.equal(actual.toString(), expected.toString());
  });

  describe("create a proposal", () => {
    let proposalId;
    beforeEach(async () => {
      await token.delegate(addr1);

      const targets = [character.address];
      const values = ["0"];
      const signatures = [""];
      const calldatas = [character.interface.encodeFunctionData("changeName", ["Sanic"])];
      const tx = await govAlpha.propose(targets, values, signatures, calldatas, "Change Sonics Name")
      const receipt = await tx.wait();
      proposalId = receipt.events.find(x => x.event === "ProposalCreated").args.id;
    });

    it("should be able to get the proposal", async () => {
      const proposal = await govAlpha.proposals(proposalId);
      assert(proposal.startBlock.gt(0));
    });

    describe("vote on the proposal", () => {
      beforeEach(async () => {
        await hre.network.provider.request({ method: "evm_mine" });

        await govAlpha.castVote(proposalId, true);

        const { startBlock, endBlock } = await govAlpha.proposals(proposalId);
        const diff = endBlock.sub(startBlock);
        for(let i = 0; i < diff.toNumber(); i++) {
          await hre.network.provider.request({ method: "evm_mine" });
        }
      });

      it("should update the proposal state", async () => {
        const state = await govAlpha.state(proposalId);
        assert.equal(state, 4);
      });

      describe("execute this vote", () => {
        beforeEach(async () => {
          await govAlpha.queue(proposalId);

          const { eta } = await govAlpha.proposals(proposalId);

          await hre.network.provider.request({ method: "evm_setNextBlockTimestamp", params: [eta.toNumber()] });

          await govAlpha.execute(proposalId);
        });

        it("should have changed sanics name", async () => {
          assert.equal(await character.name(), "Sanic");
        });
      });
    });
  });
});
