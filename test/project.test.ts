// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";
import { UserOperationBuilder } from "../src/builder";
import { ethers } from "ethers";

import { ExampleHardhatRuntimeEnvironmentField } from "../src/ExampleHardhatRuntimeEnvironmentField";

import { useEnvironment } from "./helpers";

describe("Integration with userOps", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Init Extension", function () {
      assert.instanceOf(
        this.hre.userOp,
        ExampleHardhatRuntimeEnvironmentField
      );
    });

    it("The address of entrypoint", async function () {
      const builder: UserOperationBuilder = new UserOperationBuilder().useDefaults({
        sender: "0x154C51aB8A0F16A5EC19b447e77C13599EDa1C36",
        maxFeePerGas: ethers.BigNumber.from(27000000000),
      });
      const instance = new ExampleHardhatRuntimeEnvironmentField();
      await instance.buildUserOP();

      assert.deepEqual(instance.builder, builder);
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
