import { ethers } from "ethers";

import { UserOperationBuilder } from "./builder";
import { DEFAULT_USER_OP } from "./builder";
import { Client } from "./Client";
import { ERC4337 } from "./constants/erc4337";
import { BundlerJsonRpcProvider } from "./provider";
import { IClientOpts } from "./types";

export const createCalls = async () => {
  try {
    const clientOptions: IClientOpts = {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      overrideBundlerRpc:
        "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958",
    };
    const rpc =
      "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958";
    const entryPoint = ERC4337.EntryPoint;
    const client = await Client.init(rpc, clientOptions);
    const builder = new UserOperationBuilder().useDefaults({
      sender: "0x154C51aB8A0F16A5EC19b447e77C13599EDa1C36",
      maxFeePerGas: ethers.BigNumber.from(27000000000),
    });

    console.log("UserOperationBuilder instance:", builder);
    const response = await client.sendUserOperation(builder);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
};

createCalls();
