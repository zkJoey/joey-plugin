require("@nomicfoundation/hardhat-toolbox");
// require("./src/ExampleHardhatRuntimeEnvironmentField.js");


// Define the 'buildOp' task
task("buildOp", "Build an ERC4337 userOperation").setAction(async (taskArguments, hre, runSuper) => {
  const instance = new ExampleHardhatRuntimeEnvironmentField();
  await instance.buildUserOP();
});

// Define the 'sendOp' task
task("sendOp", "Send an ERC4337 userOperation").setAction(async (taskArguments, hre, runSuper) => {
  const instance = new ExampleHardhatRuntimeEnvironmentField();
  await instance.sendUserOP();
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};
