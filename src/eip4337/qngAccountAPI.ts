"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import * as contracts_1 from "@qng/eip4337-contracts";
import { ethers } from "ethers";
import {
  BaseAccountAPI,
  PaymasterAPI,
  HttpRpcClient,
  // calcPreVerificationGas,
} from "./baseAccountAPI";
export { PaymasterAPI, HttpRpcClient, BaseAccountAPI };
/**
 * An implementation of the BaseAccountAPI using the QngAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class QngAccountAPI extends BaseAccountAPI {
  factoryAddress: any;
  owner: any;
  index: any;
  accountContract: any;
  factory: any;
  constructor(params: any) {
    var _a;
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.owner = params.owner;
    this.index = ethers.BigNumber.from(
      (_a = params.index) !== null && _a !== void 0 ? _a : 0
    );
  }
  async _getAccountContract() {
    if (this.accountContract == null) {
      this.accountContract = contracts_1.QngAccount__factory.connect(
        await this.getAccountAddress(),
        this.provider
      );
    }
    return this.accountContract;
  }
  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode() {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== "") {
        this.factory = contracts_1.QngAccountFactory__factory.connect(
          this.factoryAddress,
          this.provider
        );
      } else {
        throw new Error("no factory to get initCode");
      }
    }
    return (0, ethers.utils.hexConcat)([
      this.factory.address,
      this.factory.interface.encodeFunctionData("createAccount", [
        await this.owner.getAddress(),
        this.index,
      ]),
    ]);
  }
  async getNonce() {
    if (await this.checkAccountPhantom()) {
      return ethers.BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
    return await accountContract.getNonce();
  }
  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(target: any, value: any, data: any) {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData("execute", [
      target,
      value,
      data,
    ]);
  }
  async signUserOpHash(userOpHash: any) {
    return await this.owner.signMessage((0, ethers.utils.arrayify)(userOpHash));
  }
}
//# sourceMappingURL=QngAccountAPI.js.map
