import { ethers } from "ethers";
import { ProviderWrapper } from "hardhat/plugins";
import { EIP1193Provider } from "hardhat/types";
import { RequestArguments } from "hardhat/types";

import { UserOperationBuilder } from "./builder";
import { Client } from "./Client";
import { ERC4337 } from "./constants/erc4337";
import { BundlerJsonRpcProvider } from "./provider";
import { IClientOpts } from "./types";

export class ExampleHardhatRuntimeEnvironmentField {
  public builder: UserOperationBuilder | null = null;
  public clientOptions: IClientOpts | null = null;

  public async buildUserOP(bundlerRpc: string, sender: string) {
    const clientOptions: IClientOpts = {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      overrideBundlerRpc: bundlerRpc,
    };

    const rpc = bundlerRpc;
    const entryPoint = ERC4337.EntryPoint;
    const client = await Client.init(rpc, clientOptions);

    this.builder = new UserOperationBuilder().useDefaults({
      sender,
    });

    console.log("UserOperationBuilder instance:", this.builder);
  }

  public async sendUserOP(bundlerRpc: string, sender: string) {
    const clientOptions: IClientOpts = {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      overrideBundlerRpc: bundlerRpc,
    };
    const rpc = bundlerRpc;
    const entryPoint = ERC4337.EntryPoint;
    const client = await Client.init(rpc, clientOptions);

    this.builder = new UserOperationBuilder().useDefaults({
      sender,
    });

    console.log("UserOperationBuilder instance:", this.builder);

    const response = await client.sendUserOperation(this.builder);
    console.log("UserOperationBuilder response:", response);
  }

  public getUserOpBuilder() {
    // ALL METHODS BELOW CAN BE CALLED ON THE BUILDER
    // getSender: () => string;
    // getNonce: () => BigNumberish;
    // getInitCode: () => BytesLike;
    // getCallData: () => BytesLike;
    // getCallGasLimit: () => BigNumberish;
    // getVerificationGasLimit: () => BigNumberish;
    // getPreVerificationGas: () => BigNumberish;
    // getMaxFeePerGas: () => BigNumberish;
    // getMaxPriorityFeePerGas: () => BigNumberish;
    // getPaymasterAndData: () => BytesLike;
    // getSignature: () => BytesLike;
    // getOp: () => IUserOperation;

    // // set methods.
    // setSender: (address: string) => IUserOperationBuilder;
    // setNonce: (nonce: BigNumberish) => IUserOperationBuilder;
    // setInitCode: (code: BytesLike) => IUserOperationBuilder;
    // setCallData: (data: BytesLike) => IUserOperationBuilder;
    // setCallGasLimit: (gas: BigNumberish) => IUserOperationBuilder;
    // setVerificationGasLimit: (gas: BigNumberish) => IUserOperationBuilder;
    // setPreVerificationGas: (gas: BigNumberish) => IUserOperationBuilder;
    // setMaxFeePerGas: (fee: BigNumberish) => IUserOperationBuilder;
    // setMaxPriorityFeePerGas: (fee: BigNumberish) => IUserOperationBuilder;
    // setPaymasterAndData: (data: BytesLike) => IUserOperationBuilder;
    // setSignature: (bytes: BytesLike) => IUserOperationBuilder;
    // setPartial: (partialOp: Partial<IUserOperation>) => IUserOperationBuilder;
    return this.builder;
  }
}

class HardhatBundlerProvider extends ProviderWrapper {
  private bundlerRpc?: ethers.providers.JsonRpcProvider;
  private bundlerMethods = new Set([
    "eth_sendUserOperation",
    "eth_estimateUserOperationGas",
    "eth_getUserOperationByHash",
    "eth_getUserOperationReceipt",
    "eth_supportedEntryPoints",
  ]);
  constructor(
    public readonly gasPrice: any,
    protected readonly _wrappedProvider: EIP1193Provider
  ) {
    super(_wrappedProvider);
  }
  public setBundlerRpc(bundlerRpc?: string): HardhatBundlerProvider {
    if (bundlerRpc) {
      this.bundlerRpc = new ethers.providers.JsonRpcProvider(bundlerRpc);
    }
    return this;
  }

  public async request(args: RequestArguments) {
    if (this.bundlerMethods.has(args.method)) {
      return this._wrappedProvider.request(args);
    } else {
      throw new Error(`Method not supported: ${args.method}`);
    }
  }
}
