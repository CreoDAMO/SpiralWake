require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.20',
  networks: {
    polygon_zkevm: {
      url: process.env.POLYGON_ZKEVM_RPC_URL || 'https://rpc.polygon-zkevm.io',
      accounts: [process.env.POLYGON_ZKEVM_PRIVATE_KEY || '0x'],
    },
  },
};
