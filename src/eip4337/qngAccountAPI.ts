import { BigNumber, BigNumberish } from "ethers";
import {
  QngAccount,
  QngAccount__factory,
  QngAccountFactory,
  QngAccountFactory__factory,
} from "@qng/eip4337-contracts";

import { arrayify, hexConcat } from "ethers/lib/utils";
import { Signer } from "@ethersproject/abstract-signer";
import {
  BaseApiParams,
  BaseAccountAPI,
  PaymasterAPI,
  HttpRpcClient,
} from "./baseAccountAPI";
export { PaymasterAPI, HttpRpcClient, BaseAccountAPI };
/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index nonce value used when creating multiple accounts for the same owner
 */
export interface QngAccountApiParams extends BaseApiParams {
  owner: Signer;
  factoryAddress?: string;
  index?: BigNumberish;
}

/**
 * An implementation of the BaseAccountAPI using the QngAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class QngAccountAPI extends BaseAccountAPI {
  factoryAddress?: string;
  owner: Signer;
  index: BigNumberish;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: QngAccount;

  factory?: QngAccountFactory;

  constructor(params: QngAccountApiParams) {
    super(params as any);
    this.factoryAddress = params.factoryAddress;
    this.owner = params.owner;
    this.index = BigNumber.from(params.index ?? 0);
  }

  async _getAccountContract(): Promise<QngAccount> {
    if (this.accountContract == null) {
      this.accountContract = QngAccount__factory.connect(
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
  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== "") {
        this.factory = QngAccountFactory__factory.connect(
          this.factoryAddress,
          this.provider
        );
      } else {
        throw new Error("no factory to get initCode");
      }
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData("createAccount", [
        await this.owner.getAddress(),
        this.index,
      ]),
    ]);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
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
  async encodeExecute(
    target: string,
    value: BigNumberish,
    data: string
  ): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData("execute", [
      target,
      value,
      data,
    ]);
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.owner.signMessage(arrayify(userOpHash));
  }
}
