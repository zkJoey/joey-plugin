import { ethers } from "ethers";

import { UserOperationBuilder } from "./builder";
import { DEFAULT_USER_OP } from "./builder";
import { Client } from "./Client";
import { ERC4337 } from "./constants/erc4337";
import { BundlerJsonRpcProvider } from "./provider";
import { IClientOpts } from "./types";
import { ProviderWrapper } from "hardhat/plugins";
import { EIP1193Provider } from "hardhat/types";
import { RequestArguments } from "hardhat/types";

export class ExampleHardhatRuntimeEnvironmentField {
  public builder: UserOperationBuilder | null = null;
  public clientOptions: IClientOpts | null = null;

  public async buildUserOP(bundlerRpc: string, sender: string) {
    const clientOptions: IClientOpts = {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      overrideBundlerRpc:
      bundlerRpc,
    };

    const rpc =
    bundlerRpc;
    const entryPoint = ERC4337.EntryPoint;
    const client = await Client.init(rpc, clientOptions);

    this.builder = new UserOperationBuilder().useDefaults({
      sender: sender,
    });

    console.log("UserOperationBuilder instance:", this.builder);
  }

  public async sendUserOP(bundlerRpc: string, sender: string) {
    const clientOptions: IClientOpts = {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      overrideBundlerRpc:
      bundlerRpc,
    };
    const rpc =
    bundlerRpc;
    const entryPoint = ERC4337.EntryPoint;
    const client = await Client.init(rpc, clientOptions);

    this.builder = new UserOperationBuilder().useDefaults({
      sender: sender,
    });

    console.log("UserOperationBuilder instance:", this.builder);

    const response = await client.sendUserOperation(this.builder);
    console.log("UserOperationBuilder response:", response);
  }

  public getUserOpBuilder(){
    return this.builder;
  }
}

class HardhatBundlerProvider extends ProviderWrapper {
  constructor(
    public readonly gasPrice: any,
    protected readonly _wrappedProvider: EIP1193Provider
  ) {
    super(_wrappedProvider);
  }
  private bundlerMethods = new Set([
    "eth_sendUserOperation",
    "eth_estimateUserOperationGas",
    "eth_getUserOperationByHash",
    "eth_getUserOperationReceipt",
    "eth_supportedEntryPoints",
  ]);

  public async request(args: RequestArguments) {
    if (this.bundlerMethods.has(args.method)) {
      const params = this._getParams(args);
      const tx = params[0];
    }

    return this._wrappedProvider.request(args);
  }
}
