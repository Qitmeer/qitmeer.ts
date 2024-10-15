import * as contracts from "@qng/meerchange-contracts";

import { Provider } from "@ethersproject/providers";
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
  async encodeExport4337(ops: string, fee: number, signature: string) {
    const meerchangeContract = await this._getMeerChangeContract();
    return meerchangeContract.interface.encodeFunctionData("export", [
      ops,
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
