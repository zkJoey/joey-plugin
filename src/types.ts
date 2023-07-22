import { BigNumberish, BytesLike } from "ethers";
export interface IUserOperation {
    sender: string;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    callGasLimit: BigNumberish;
    verificationGasLimit: BigNumberish;
    preVerificationGas: BigNumberish;
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
    paymasterAndData: BytesLike;
    signature: BytesLike;
  }
export interface IUserOpBuilder {
    // get methods.
    getSender: () => string;
    getNonce: () => BigNumberish;
    getInitCode: () => BytesLike;
    getCallData: () => BytesLike;
    getCallGasLimit: () => BigNumberish;
    getVerificationGasLimit: () => BigNumberish;
    getPreVerificationGas: () => BigNumberish;
    getMaxFeePerGas: () => BigNumberish;
    getMaxPriorityFeePerGas: () => BigNumberish;
    getPaymasterAndData: () => BytesLike;
    getSignature: () => BytesLike;
    getOp: () => IUserOperation;

     // set methods.
  setSender: (address: string) => IUserOpBuilder;
  setNonce: (nonce: BigNumberish) => IUserOpBuilder;
  setInitCode: (code: BytesLike) => IUserOpBuilder;
  setCallData: (data: BytesLike) => IUserOpBuilder;
  setCallGasLimit: (gas: BigNumberish) => IUserOpBuilder;
  setVerificationGasLimit: (gas: BigNumberish) => IUserOpBuilder;
  setPreVerificationGas: (gas: BigNumberish) => IUserOpBuilder;
  setMaxFeePerGas: (fee: BigNumberish) => IUserOpBuilder;
  setMaxPriorityFeePerGas: (fee: BigNumberish) => IUserOpBuilder;
  setPaymasterAndData: (data: BytesLike) => IUserOpBuilder;
  setSignature: (bytes: BytesLike) => IUserOpBuilder;
  setPartial: (partialOp: Partial<IUserOperation>) => IUserOpBuilder;

  // Sets the default values that won't be wiped on reset.
  useDefaults: (partialOp: Partial<IUserOperation>) => IUserOpBuilder;
  resetDefaults: () => IUserOpBuilder;

  // Some fields may require arbitrary logic to build an op.
  // Middleware functions allow you to set custom logic for building op fragments.
  useMiddleware: (fn: UserOperationMiddlewareFn) => IUserOpBuilder;
  resetMiddleware: () => IUserOpBuilder;

  // This will construct a UserOperation that can be sent to a client.
  // It will run through your entire middleware stack in the process.
  buildOp: (
    entryPoint: string,
    chainId: BigNumberish
  ) => Promise<IUserOperation>;

  // Will reset all fields back to default value.
  resetOp: () => IUserOpBuilder;
}

export type UserOperationMiddlewareFn = (
    context: IUserOperationMiddlewareCtx
  ) => Promise<void>;

export interface IUserOperationMiddlewareCtx {
op: IUserOperation;
entryPoint: string;
chainId: BigNumberish;

// A userOpHash is a unique hash of op + entryPoint + chainId.
getUserOpHash: () => string;
}

export interface IUserOperationMiddlewareCtx {
    op: IUserOperation;
    entryPoint: string;
    chainId: BigNumberish;
  
    // A userOpHash is a unique hash of op + entryPoint + chainId.
    getUserOpHash: () => string;
  }