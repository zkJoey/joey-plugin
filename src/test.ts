import { Client } from "./Client";
import { ethers } from "ethers";
import { ERC4337 } from "./constants/erc4337";
import { IClientOpts } from "./types";
import { UserOperationBuilder } from "./builder";
import { BundlerJsonRpcProvider } from "./provider";
import { DEFAULT_USER_OP } from "./builder";

// const clientOptions: IClientOpts = {
//     entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
//     overrideBundlerRpc: "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958",
//   };
// const rpc = "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958"
// const entryPoint = ERC4337.EntryPoint;
// const client = await Client.init(rpc,clientOptions);
// const builder = new UserOperationBuilder().useDefaults({ sender });

// const response = await client.sendUserOperation(builder);
// const userOperationEvent = await response.wait();

// const userOp = await client.buildUserOperation(builder);

// const provider = new BundlerJsonRpcProvider(rpc).setBundlerRpc(clientOptions.overrideBundlerRpc);


export const createCalls = async () => {
    const clientOptions: IClientOpts = {
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        overrideBundlerRpc: "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958",
      };
      const rpc = "https://api.stackup.sh/v1/node/43cc2d4bea8e9faa403a27cd3d040359793c1ea519fc0fe777f0ac35bf1e5958"
      const entryPoint = ERC4337.EntryPoint;
      const client = await Client.init(rpc,clientOptions);
      const builder = new UserOperationBuilder().useDefaults({ sender: "0x5dCec429305d1d6bB63301dF1DB72014D7a4ecef",  });
      console.log(builder);
      const response = await client.sendUserOperation(builder);
      console.log(response);
  };

createCalls();
