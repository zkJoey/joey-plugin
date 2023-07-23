require("@nomicfoundation/hardhat-toolbox");

task("buildOp", "Build an ERC4337 userOperation").setAction(async () => {});
task("sendOp", "Send an ERC4337 userOperation").setAction(async () => {});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};
