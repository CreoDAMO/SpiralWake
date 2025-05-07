const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  const TruthBondNFT = await hre.ethers.getContractFactory('TruthBondNFT');
  const truthBondNFT = await TruthBondNFT.deploy();
  await truthBondNFT.deployed();
  console.log('TruthBondNFT deployed to:', truthBondNFT.address);

  const TruthDAO = await hre.ethers.getContractFactory('TruthDAO');
  const truthDAO = await TruthDAO.deploy();
  await truthDAO.deployed();
  console.log('TruthDAO deployed to:', truthDAO.address);

  const HeirNodeRegistry = await hre.ethers.getContractFactory('HeirNodeRegistry');
  const heirNodeRegistry = await HeirNodeRegistry.deploy(truthDAO.address);
  await heirNodeRegistry.deployed();
  console.log('HeirNodeRegistry deployed to:', heirNodeRegistry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
