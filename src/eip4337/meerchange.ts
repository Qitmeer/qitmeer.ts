import * as contracts from "@qng/meerchange-contracts";

import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
export class MeerChangeAPI {
  meerchangeContract: any;
  meerchangeAddr: string;
  provider: Provider;
  constructor(params: any) {
    this.provider = params.provider;
    this.meerchangeAddr = params.meerchangeAddr;
  }
  async _getMeerChangeContract() {
    if (this.meerchangeContract == null) {
      this.meerchangeContract = await contracts.MeerChange__factory.connect(
        await this.getMeerChangeAddress(),
        this.provider
      );
    }
    return this.meerchangeContract;
  }
  async encodeExport4337(
    txid: string,
    idx: number,
    fee: number,
    signature: string
  ) {
    if (!txid.startsWith("0x")) {
      txid = `0x${txid}`;
    }
    const meerchangeContract = await this._getMeerChangeContract();
    return meerchangeContract.interface.encodeFunctionData("export", [
      ethers.utils.hexZeroPad(txid, 32),
      idx,
      fee,
      signature,
    ]);
  }

  async getMeerChangeAddress() {
    // TODO
    // {
    //  "id":1,"jsonrpc":"2.0","method":"qng_getMeerChangeAddress","params":[]
    //}
    return this.meerchangeAddr;
  }
}
