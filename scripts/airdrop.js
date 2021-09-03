const addrs = [
    "0x785Ba9bA76F9C2f1c07AEb27C64683Dfa9281cF3", // allen
    "0xb13938afbed97e1F1bb1919aCBb179729aBE9229", // deche
    "0x3c55F43143e03f7ed329C833eCdE45646F24e6d9", // pavlos
    "0xd2eC7b4bCC4019dE53F7f5676427476309Ef38f7", // jim
    "0x201E63233530298b5e616bfec0546A345AAEa008", // chiranjibi
    "0x4D326be40DD82Bf91b523F7A0aef25C0606AfFED", // daniel
    "0xaf796D06C7Ffc6231a59adBaF9B1aDf737ECCcA4", // julissa
    "0xdB52bd8213E8eedc3b9F3e3b2087659A8743b344", // vikram
    "0xe15A4F5eA424B540e6B0558105f88c5D39735374", // kevin
    "0xc99818f33d5e74D3362c697909F75caF8a881C61", // marc
]

async function main() {
  [addr1] = await ethers.provider.listAccounts();
  const Sonic = await ethers.getContractFactory("Sonic");
  token = await Sonic.deploy(addr1);
  await token.deployed();

  const share = Math.floor((10_000_000 - 500_000) / addrs.length);

  for(let i = 0; i < addrs.length; i++) {
    const addr = addrs[i];
    await token.transfer(addrs[i], ethers.utils.parseEther(share.toString()));
  }

  console.log("Token deployed here:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
