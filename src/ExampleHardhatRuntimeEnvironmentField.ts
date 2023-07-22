import { ethers } from "ethers";
import { UserOpBuilder } from "./UserOpBuilder"; // Replace with the correct path to the UserOpBuilder class
import { ProviderWrapper } from 'hardhat/plugins'


export class ExampleHardhatRuntimeEnvironmentField {
  public sendUserOP() {

      // Initialize the UserOpBuilder
      const userOpBuilder = new UserOpBuilder();

      // Set the required fields for the user operation
      // Assume you have access to the entry point and chain ID externally
      // Build the final user operation
      // Now, you can use the finalUserOp for further processing or send it to the client.
      // await contract.sendUserOperation(finalUserOp);
      // Alternatively, you can return the finalUserOp to be used later or sent elsewhere.
      return finalUserOp;

  }
}
