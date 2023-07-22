import { BigNumberish, BytesLike, ethers, getBytes } from "ethers";
import { OpToJSON } from "./utils/opToJSON";
import { IUserOperation, IUserOpBuilder, UserOperationMiddlewareFn, IUserOperationMiddlewareCtx } from "./types";

export const DEFAULT_VERIFICATION_GAS_LIMIT = 7000n;
export const DEFAULT_CALL_GAS_LIMIT = 35000n;
export const DEFAULT_PRE_VERIFICATION_GAS = 21000n;

export const DEFAULT_USER_OP: IUserOperation = {
    sender: ethers.ZeroAddress,
    nonce: 0n,
    initCode: ethers.toBeHex("0x"),
    callData: ethers.toBeHex("0x"),
    callGasLimit: DEFAULT_CALL_GAS_LIMIT,
    verificationGasLimit: DEFAULT_VERIFICATION_GAS_LIMIT,
    preVerificationGas: DEFAULT_PRE_VERIFICATION_GAS,
    maxFeePerGas: 0n,
    maxPriorityFeePerGas: 0n,
    paymasterAndData: ethers.toBeHex("0x"),
    signature: ethers.toBeHex("0x"),
  };

  export class UserOpBuilder implements IUserOpBuilder {
    private defaultOp: IUserOperation;
    private currentOp: IUserOperation;
    private middlewareStack: Array<UserOperationMiddlewareFn>;
    constructor() {
        this.defaultOp = { ...DEFAULT_USER_OP };
        this.currentOp = { ...this.defaultOp };
        this.middlewareStack = [];
      }

    private resolveFields(op: Partial<IUserOperation>): Partial<IUserOperation> {
    const obj = {
        sender:
        op.sender !== undefined
            ? ethers.getAddress(op.sender)
            : undefined,
        nonce:
        op.nonce !== undefined ? BigInt(op.nonce) : undefined,
        initCode:
        op.initCode !== undefined
            ? ethers.hexlify(op.initCode)
            : undefined,
        callData:
        op.callData !== undefined
            ? ethers.hexlify(op.callData)
            : undefined,
        callGasLimit:
        op.callGasLimit !== undefined
            ? BigInt(op.callGasLimit)
            : undefined,
        verificationGasLimit:
        op.verificationGasLimit !== undefined
            ? BigInt(op.verificationGasLimit)
            : undefined,
        preVerificationGas:
        op.preVerificationGas !== undefined
            ? BigInt(op.preVerificationGas)
            : undefined,
        maxFeePerGas:
        op.maxFeePerGas !== undefined
            ? BigInt(op.maxFeePerGas)
            : undefined,
        maxPriorityFeePerGas:
        op.maxPriorityFeePerGas !== undefined
            ? BigInt(op.maxPriorityFeePerGas)
            : undefined,
        paymasterAndData:
        op.paymasterAndData !== undefined
            ? ethers.hexlify(op.paymasterAndData)
            : undefined,
        signature:
        op.signature !== undefined
            ? ethers.hexlify(op.signature)
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

    getSender() {
    return this.currentOp.sender;
    }
    getNonce() {
    return this.currentOp.nonce;
    }
    getInitCode() {
    return this.currentOp.initCode;
    }
    getCallData() {
    return this.currentOp.callData;
    }
    getCallGasLimit() {
    return this.currentOp.callGasLimit;
    }
    getVerificationGasLimit() {
    return this.currentOp.verificationGasLimit;
    }
    getPreVerificationGas() {
    return this.currentOp.preVerificationGas;
    }
    getMaxFeePerGas() {
    return this.currentOp.maxFeePerGas;
    }
    getMaxPriorityFeePerGas() {
    return this.currentOp.maxPriorityFeePerGas;
    }
    getPaymasterAndData() {
    return this.currentOp.paymasterAndData;
    }
    getSignature() {
    return this.currentOp.signature;
    }
    getOp() {
    return this.currentOp;
    }

    setSender(val: string) {
    this.currentOp.sender = ethers.getAddress(val);
    return this;
    }
    setNonce(val: BigNumberish) {
    this.currentOp.nonce = BigInt(val);
    return this;
    }
    setInitCode(val: BytesLike) {
    this.currentOp.initCode = ethers.hexlify(val);
    return this;
    }
    setCallData(val: BytesLike) {
    this.currentOp.callData = ethers.hexlify(val);
    return this;
    }
    setCallGasLimit(val: BigNumberish) {
    this.currentOp.callGasLimit = BigInt(val);
    return this;
    }
    setVerificationGasLimit(val: BigNumberish) {
    this.currentOp.verificationGasLimit = BigInt(val);
    return this;
    }
    setPreVerificationGas(val: BigNumberish) {
    this.currentOp.preVerificationGas = BigInt(val);
    return this;
    }
    setMaxFeePerGas(val: BigNumberish) {
    this.currentOp.maxFeePerGas = BigInt(val);
    return this;
    }
    setMaxPriorityFeePerGas(val: BigNumberish) {
    this.currentOp.maxPriorityFeePerGas = BigInt(val);
    return this;
    }
    setPaymasterAndData(val: BytesLike) {
    this.currentOp.paymasterAndData = ethers.hexlify(val);
    return this;
    }
    setSignature(val: BytesLike) {
    this.currentOp.signature = ethers.hexlify(val);
    return this;
    }
    setPartial(partialOp: Partial<IUserOperation>) {
    this.currentOp = { ...this.currentOp, ...this.resolveFields(partialOp) };
    return this;
    }

    useDefaults(partialOp: Partial<IUserOperation>) {
    const resolvedOp = this.resolveFields(partialOp);
    this.defaultOp = { ...this.defaultOp, ...resolvedOp };
    this.currentOp = { ...this.currentOp, ...resolvedOp };

    return this;
    }
    resetDefaults() {
    this.defaultOp = { ...DEFAULT_USER_OP };
    return this;
    }

    useMiddleware(fn: UserOperationMiddlewareFn) {
    this.middlewareStack = [...this.middlewareStack, fn];
    return this;
    }
    resetMiddleware() {
    this.middlewareStack = [];
    return this;
    }

    async buildOp(entryPoint: string, chainId: BigNumberish) {
    const ctx = new UserOperationMiddlewareCtx(
        this.currentOp,
        entryPoint,
        chainId
    );

    for (const fn of this.middlewareStack) {
        await fn(ctx);
    }
    this.setPartial(ctx.op);

    return OpToJSON(this.currentOp);
    }

    resetOp() {
    this.currentOp = { ...this.defaultOp };
    return this;
    }
}