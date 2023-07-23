// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import { ethers } from "ethers";
import path from "path";

import { UserOperationBuilder } from "../src/builder";
import { Client } from "../src/Client";
import { ExampleHardhatRuntimeEnvironmentField } from "../src/ExampleHardhatRuntimeEnvironmentField";
import { IClientOpts } from "../src/types";

import { useEnvironment } from "./helpers";

describe("Integration with userOps", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Init Extension", function () {
      assert.instanceOf(this.hre.userOp, ExampleHardhatRuntimeEnvironmentField);
    });

    it("should build the user operation", async function () {
      const builder: UserOperationBuilder =
        new UserOperationBuilder().useDefaults({
          sender: "0x154C51aB8A0F16A5EC19b447e77C13599EDa1C36",
          maxFeePerGas: ethers.BigNumber.from(27000000000),
        });
      const instance = new ExampleHardhatRuntimeEnvironmentField();
      await instance.buildUserOP(
        "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958",
        "0x154C51aB8A0F16A5EC19b447e77C13599EDa1C36"
      );

      assert.deepEqual(instance.builder, builder);
    });

    it("should send the user operation", async function () {
      const builder: UserOperationBuilder =
        new UserOperationBuilder().useDefaults({
          sender: "0x154C51aB8A0F16A5EC19b447e77C13599EDa1C36",
          maxFeePerGas: ethers.BigNumber.from(27000000000),
        });
      const rpc =
        "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958";

      const clientOptions: IClientOpts = {
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        overrideBundlerRpc:
          "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958",
      };

      // Build UOP
      const instance = new ExampleHardhatRuntimeEnvironmentField();
      await instance.buildUserOP(
        "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958",
        "0x154C51aB8A0F16A5EC19b447e77C13599EDa1C36"
      );

      if (instance.builder) {
        // Send UOP
        const client = await Client.init(rpc, clientOptions);
        await client.sendUserOperation(instance.builder);
      } else {
        // Handle the case when instance.builder is null
        throw new Error("UserOperationBuilder not initialized");
      }
    });
  });

  describe("HardhatConfig extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the newPath to the config", function () {
      assert.equal(
        this.hre.config.paths.newPath,
        path.join(process.cwd(), "asd")
      );
    });
  });
});
