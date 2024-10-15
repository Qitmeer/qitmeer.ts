import { MeerChangeAPI, MeerChangeAddr } from "../";

describe("export4337", () => {
  const abi = new MeerChangeAPI({
    meerchangeAddr: MeerChangeAddr,
  });

  it("returns a gas value proportional to sigSize", async () => {
    const data = await abi.encodeExport4337(
      "d47e847a8ac828abc27109b3f94a053c4dba53ccc6eb37cb7872435e0ee8936a:0",
      10000,
      "3097947d270698a7f7d6bd5b9f4b725af77c9c866219893f75b63f2207370d5279249ec5cccc4973c343f299d086412c9443bb4f30e283a628f7043c6c0b14be00"
    );
    console.log(data);
  });
});
