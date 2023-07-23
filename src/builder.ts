import { BigNumberish, BytesLike, ethers } from "ethers";

import { UserOperationMiddlewareCtx } from "./context";
import {
  IUserOperation,
  IUserOperationBuilder,
  UserOperationMiddlewareFn,
} from "./types";
import { OpToJSON } from "./utils";

export const DEFAULT_VERIFICATION_GAS_LIMIT = ethers.BigNumber.from(70000);
export const DEFAULT_CALL_GAS_LIMIT = ethers.BigNumber.from(35000);
export const DEFAULT_PRE_VERIFICATION_GAS = ethers.BigNumber.from(50000);

export const DEFAULT_USER_OP: IUserOperation = {
  sender: ethers.constants.AddressZero,
  nonce: 1,
  initCode: ethers.utils.hexlify("0x"),
  callData: ethers.utils.hexlify("0x"),
  callGasLimit: DEFAULT_CALL_GAS_LIMIT,
  verificationGasLimit: DEFAULT_VERIFICATION_GAS_LIMIT,
  preVerificationGas: DEFAULT_PRE_VERIFICATION_GAS,
  maxFeePerGas: ethers.BigNumber.from(27000000000),
  maxPriorityFeePerGas: ethers.constants.Zero,
  paymasterAndData: ethers.utils.hexlify("0x"),
  signature: ethers.utils.hexlify("0x"),
};

export class UserOperationBuilder implements IUserOperationBuilder {
  private defaultOp: IUserOperation;
  private currOp: IUserOperation;
  private middlewareStack: UserOperationMiddlewareFn[];

  constructor() {
    this.defaultOp = { ...DEFAULT_USER_OP };
    this.currOp = { ...this.defaultOp };
    this.middlewareStack = [];
  }

  public getSender() {
    return this.currOp.sender;
  }
  public getNonce() {
    return this.currOp.nonce;
  }
  public getInitCode() {
    return this.currOp.initCode;
  }
  public getCallData() {
    return this.currOp.callData;
  }
  public getCallGasLimit() {
    return this.currOp.callGasLimit;
  }
  public getVerificationGasLimit() {
    return this.currOp.verificationGasLimit;
  }
  public getPreVerificationGas() {
    return this.currOp.preVerificationGas;
  }
  public getMaxFeePerGas() {
    return this.currOp.maxFeePerGas;
  }
  public getMaxPriorityFeePerGas() {
    return this.currOp.maxPriorityFeePerGas;
  }
  public getPaymasterAndData() {
    return this.currOp.paymasterAndData;
  }
  public getSignature() {
    return this.currOp.signature;
  }
  public getOp() {
    return this.currOp;
  }

  public setSender(val: string) {
    this.currOp.sender = ethers.utils.getAddress(val);
    return this;
  }
  public setNonce(val: BigNumberish) {
    this.currOp.nonce = ethers.BigNumber.from(val);
    return this;
  }
  public setInitCode(val: BytesLike) {
    this.currOp.initCode = ethers.utils.hexlify(val);
    return this;
  }
  public setCallData(val: BytesLike) {
    this.currOp.callData = ethers.utils.hexlify(val);
    return this;
  }
  public setCallGasLimit(val: BigNumberish) {
    this.currOp.callGasLimit = ethers.BigNumber.from(val);
    return this;
  }
  public setVerificationGasLimit(val: BigNumberish) {
    this.currOp.verificationGasLimit = ethers.BigNumber.from(val);
    return this;
  }
  public setPreVerificationGas(val: BigNumberish) {
    this.currOp.preVerificationGas = ethers.BigNumber.from(val);
    return this;
  }
  public setMaxFeePerGas(val: BigNumberish) {
    this.currOp.maxFeePerGas = ethers.BigNumber.from(val);
    return this;
  }
  public setMaxPriorityFeePerGas(val: BigNumberish) {
    this.currOp.maxPriorityFeePerGas = ethers.BigNumber.from(val);
    return this;
  }
  public setPaymasterAndData(val: BytesLike) {
    this.currOp.paymasterAndData = ethers.utils.hexlify(val);
    return this;
  }
  public setSignature(val: BytesLike) {
    this.currOp.signature = ethers.utils.hexlify(val);
    return this;
  }
  public setPartial(partialOp: Partial<IUserOperation>) {
    this.currOp = { ...this.currOp, ...this.resolveFields(partialOp) };
    return this;
  }

  public useDefaults(partialOp: Partial<IUserOperation>) {
    const resolvedOp = this.resolveFields(partialOp);
    this.defaultOp = { ...this.defaultOp, ...resolvedOp };
    this.currOp = { ...this.currOp, ...resolvedOp };

    return this;
  }
  public resetDefaults() {
    this.defaultOp = { ...DEFAULT_USER_OP };
    return this;
  }

  public useMiddleware(fn: UserOperationMiddlewareFn) {
    this.middlewareStack = [...this.middlewareStack, fn];
    return this;
  }
  public resetMiddleware() {
    this.middlewareStack = [];
    return this;
  }

  public async buildOp(entryPoint: string, chainId: BigNumberish) {
    const ctx = new UserOperationMiddlewareCtx(
      this.currOp,
      entryPoint,
      chainId
    );

    for (const fn of this.middlewareStack) {
      await fn(ctx);
    }
    this.setPartial(ctx.op);

    return OpToJSON(this.currOp);
  }

  public resetOp() {
    this.currOp = { ...this.defaultOp };
    return this;
  }

  private resolveFields(op: Partial<IUserOperation>): Partial<IUserOperation> {
    const obj = {
      sender:
        op.sender !== undefined
          ? ethers.utils.getAddress(op.sender)
          : undefined,
      nonce:
        op.nonce !== undefined ? ethers.BigNumber.from(op.nonce) : undefined,
      initCode:
        op.initCode !== undefined
          ? ethers.utils.hexlify(op.initCode)
          : undefined,
      callData:
        op.callData !== undefined
          ? ethers.utils.hexlify(op.callData)
          : undefined,
      callGasLimit:
        op.callGasLimit !== undefined
          ? ethers.BigNumber.from(op.callGasLimit)
          : undefined,
      verificationGasLimit:
        op.verificationGasLimit !== undefined
          ? ethers.BigNumber.from(op.verificationGasLimit)
          : undefined,
      preVerificationGas:
        op.preVerificationGas !== undefined
          ? ethers.BigNumber.from(op.preVerificationGas)
          : undefined,
      maxFeePerGas:
        op.maxFeePerGas !== undefined
          ? ethers.BigNumber.from(op.maxFeePerGas)
          : undefined,
      maxPriorityFeePerGas:
        op.maxPriorityFeePerGas !== undefined
          ? ethers.BigNumber.from(op.maxPriorityFeePerGas)
          : undefined,
      paymasterAndData:
        op.paymasterAndData !== undefined
          ? ethers.utils.hexlify(op.paymasterAndData)
          : undefined,
      signature:
        op.signature !== undefined
          ? ethers.utils.hexlify(op.signature)
          : undefined,
    };
    return Object.keys(obj).reduce(
      (prev, curr) =>
        (obj as any)[curr] !== undefined
          ? { ...prev, [curr]: (obj as any)[curr] }
          : prev,
      {}
    );
  }
}
