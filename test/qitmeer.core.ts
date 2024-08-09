// Copyright 2017-2018 The qitmeer developers
// Use of this source code is governed by an ISC
// license that can be found in the LICENSE file.
import { describe, it } from "mocha";
import assert from "assert";
import bs58 from "bs58";
import * as qitmeer from "../src";
import * as uint8arraytools from "uint8array-tools";
const data = require("./data/qitmeer.core/core.json");
describe("qitmeer-core", () => {
  // type check
  describe("type check", function () {
    it("hash256", function () {
      const hexStr =
        "5c0dff371fe9c762139570bdfef7d34aca5e84325871e67fd0203f0da8c5e50c";
      assert.strictEqual(qitmeer.typecheck(qitmeer.types.Hex, hexStr), true);
      assert.strictEqual(qitmeer.typecheck(qitmeer.types.Hex32, hexStr), true);
      assert.strictEqual(
        qitmeer.typecheck(
          qitmeer.types.Hash256,
          uint8arraytools.fromHex(hexStr)
        ),
        true
      );
    });
  });

  // base58
  describe("base58 test", () => {
    console.log(data);
    data.base58.forEach(function (f: [string, string]) {
      const hexStr = f[0];
      const b58Str = f[1];
      it("encode " + hexStr + " -> " + b58Str, function () {
        const encoded = bs58.encode(uint8arraytools.fromHex(hexStr));
        assert.strictEqual(encoded, b58Str);
      });
      it("decode " + b58Str + " -> " + hexStr, function () {
        const decoded = uint8arraytools.toHex(bs58.decode(b58Str));
        assert.strictEqual(decoded, hexStr);
      });
    });
  });

  // hash
  describe("qitmeer.hash", function () {
    data.hash.sha256.forEach(function (d: [string, string]) {
      const inputStr = d[0];
      const hashStr = d[1];
      it("sha256 " + inputStr + " -> " + hashStr, function () {
        const hash = uint8arraytools.toHex(
          qitmeer.hash.sha256(uint8arraytools.fromHex(inputStr))
        );
        assert.strictEqual(hash, hashStr);
      });
    });

    data.hash.blake2b256.forEach(function (d: [string, string]) {
      const inputStr = d[0];
      const hashStr = d[1];
      it("blake2b256 " + inputStr + " -> " + hashStr, function () {
        const hash = uint8arraytools.toHex(
          qitmeer.hash.blake2b256(uint8arraytools.fromHex(inputStr))
        );
        assert.strictEqual(hash, hashStr);
      });
    });

    data.hash.hash160.forEach(function (d: [string, string]) {
      const inputStr = d[0];
      const hashStr = d[1];
      it("hash160 " + inputStr + " -> " + hashStr, function () {
        const hash = uint8arraytools.toHex(
          qitmeer.hash.hash160(uint8arraytools.fromHex(inputStr))
        );
        assert.strictEqual(hash, hashStr);
      });
    });
  });

  // base58check
  describe("qitmeer.address", function () {
    data.base58check.forEach(function (
      f: [string, string, { coin: string; network: string }]
    ) {
      const hexStr = f[0];
      const qitmeer58checkStr = f[1];
      const { coin, network } = f[2];

      if (coin === "qitmeer") {
        it("fromBase58Check " + qitmeer58checkStr, function () {
          const decoded = qitmeer.address.fromBase58Check(qitmeer58checkStr);
          assert.strictEqual(uint8arraytools.toHex(decoded.hash), hexStr);
          switch (network) {
            case "privnet":
              assert.strictEqual(
                decoded.version,
                qitmeer.networks.privnet.pubKeyHashAddrId
              );
              break;
            case "mainnet":
              assert.strictEqual(
                decoded.version,
                qitmeer.networks.mainnet.pubKeyHashAddrId
              );
              break;
            case "testnet":
              assert.strictEqual(
                decoded.version,
                qitmeer.networks.testnet.pubKeyHashAddrId
              );
              break;
            default:
              assert.fail("unknown network " + network);
          }
        });

        it("toBase58Check " + hexStr, function () {
          let encoded: string;
          switch (network) {
            case "privnet":
              encoded = qitmeer.address.toBase58Check(
                uint8arraytools.fromHex(hexStr),
                qitmeer.networks.privnet.pubKeyHashAddrId
              );
              assert.strictEqual(encoded, qitmeer58checkStr);
              break;
            case "mainnet":
              encoded = qitmeer.address.toBase58Check(
                uint8arraytools.fromHex(hexStr),
                qitmeer.networks.mainnet.pubKeyHashAddrId
              );
              assert.strictEqual(encoded, qitmeer58checkStr);
              break;
            case "testnet":
              encoded = qitmeer.address.toBase58Check(
                uint8arraytools.fromHex(hexStr),
                qitmeer.networks.testnet.pubKeyHashAddrId
              );
              assert.strictEqual(encoded, qitmeer58checkStr);
              break;
            default:
              assert.fail("unknown network " + network);
          }
        });
      }
    });
  });

  describe("qitmeer.EC", function () {
    describe("wif compressed", function () {
      data.EC.wif.compressed.forEach(function (f: [string, string]) {
        const ecPrivStr = f[0];
        const wifStr = f[1];
        const ecPair = qitmeer.ec.fromWIF(wifStr);
        it("fromWIF " + wifStr, function () {
          assert.strictEqual(
            ecPrivStr,
            uint8arraytools.toHex(ecPair.privateKey as Uint8Array)
          );
          assert.strictEqual(true, ecPair.compressed);
        });
        it("toWIF " + ecPrivStr, function () {
          const wif = ecPair.toWIF();
          console.log(wifStr, wif);
          assert.strictEqual(wifStr, wif);
        });
      });
    });

    describe("wif uncompressed", function () {
      data.EC.wif.uncompressed.forEach(function (f: [string, string]) {
        const ecPrivStr = f[0];
        const wifStr = f[1];
        const ecPair = qitmeer.ec.fromWIF(wifStr);
        it("fromWIF " + wifStr, function () {
          assert.strictEqual(
            ecPrivStr,
            uint8arraytools.toHex(ecPair.privateKey as Uint8Array)
          );
          assert.strictEqual(false, ecPair.compressed);
        });
        it("toWIF " + ecPrivStr, function () {
          const wif = ecPair.toWIF();
          assert.strictEqual(wifStr, wif);
        });
      });
    });

    describe("keypair compressed", function () {
      data.EC.keypair.compressed.forEach(function (f: [string, string]) {
        const privHex = f[0];
        const pubHex = f[1];
        it("fromPrivateKey " + privHex, function () {
          const keyPair = qitmeer.ec.fromPrivateKey(
            uint8arraytools.fromHex(privHex)
          );
          assert.strictEqual(keyPair.compressed, true);
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.privateKey as Uint8Array),
            privHex
          );
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.__priv as Uint8Array),
            privHex
          );
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.publicKey as Uint8Array),
            pubHex
          );
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.__pub as Uint8Array),
            pubHex
          );
        });
        it("fromPubKey " + pubHex, function () {
          const keyPair = qitmeer.ec.fromPublicKey(
            uint8arraytools.fromHex(pubHex)
          );
          assert.strictEqual(keyPair.compressed, true);
          assert.strictEqual(keyPair.privateKey, null);
          assert.strictEqual(keyPair.__priv, null);
          assert.strictEqual(uint8arraytools.toHex(keyPair.publicKey), pubHex);
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.__pub as Uint8Array),
            pubHex
          );
        });
      });
    });

    describe("keypair uncompressed", function () {
      data.EC.keypair.uncompressed.forEach(function (f: [string, string]) {
        const privHex = f[0];
        const pubHex = f[1];
        it("fromPrivateKey " + privHex, function () {
          const keyPair = qitmeer.ec.fromPrivateKey(
            uint8arraytools.fromHex(privHex),
            {
              compressed: false,
            }
          );
          assert.strictEqual(keyPair.compressed, false);
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.privateKey as Uint8Array),
            privHex
          );
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.__priv as Uint8Array),
            privHex
          );
          assert.strictEqual(uint8arraytools.toHex(keyPair.publicKey), pubHex);
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.__pub as Uint8Array),
            pubHex
          );
        });
        it("fromPubKey " + pubHex, function () {
          const keyPair = qitmeer.ec.fromPublicKey(
            uint8arraytools.fromHex(pubHex),
            {
              compressed: false,
            }
          );
          assert.strictEqual(keyPair.compressed, false);
          assert.strictEqual(keyPair.privateKey, null);
          assert.strictEqual(keyPair.__priv, null);
          assert.strictEqual(uint8arraytools.toHex(keyPair.publicKey), pubHex);
          assert.strictEqual(
            uint8arraytools.toHex(keyPair.__pub as Uint8Array),
            pubHex
          );
        });
      });
    });

    describe("random", function () {
      it("fromEntropy", function () {
        const keyPair = qitmeer.ec.fromEntropy();
        assert.strictEqual(true, keyPair.compressed);
        assert.strictEqual(32, keyPair.privateKey?.length);
        assert.strictEqual(33, keyPair.publicKey.length);
        assert(keyPair.publicKey[0] === 0x03 || keyPair.publicKey[0] === 0x02);
        const keyPair2 = qitmeer.ec.fromPrivateKey(
          keyPair.privateKey as Uint8Array
        );
        assert.deepStrictEqual(keyPair2.publicKey, keyPair.publicKey);
      });
    });
    describe("signature", function () {
      it("sign", function () {
        const ecPair = qitmeer.ec.fromWIF(
          "L1g6Qv9Q7H6mraoqLQ4r4pH4up2qfVqzx6y48AoUw1zkke9BnR1F"
        );
        const signature = ecPair.sign(
          uint8arraytools.fromHex(
            "31d336c0f0fa39bd83e1349549befa279a4e3cf6da3bfcf77578ba078b99476d"
          )
        );
        assert.strictEqual(
          "a62d560012f8a3714b8c85c4282c7498b5490ea8a7e4ab5b392834264574d9d41b445cabb744c6aeeececfcc92cf2effaf2ac177a55cfd6071e41bf45eeb4454",
          uint8arraytools.toHex(signature)
        );
      });
      it("verify", function () {
        const ecPair = qitmeer.ec.fromWIF(
          "L1g6Qv9Q7H6mraoqLQ4r4pH4up2qfVqzx6y48AoUw1zkke9BnR1F"
        );
        const result = ecPair.verify(
          uint8arraytools.fromHex(
            "31d336c0f0fa39bd83e1349549befa279a4e3cf6da3bfcf77578ba078b99476d"
          ),
          uint8arraytools.fromHex(
            "a62d560012f8a3714b8c85c4282c7498b5490ea8a7e4ab5b392834264574d9d41b445cabb744c6aeeececfcc92cf2effaf2ac177a55cfd6071e41bf45eeb4454"
          )
        );
        assert.strictEqual(true, result);
      });
    });
  });
  describe("qitmeer.Transaction", function () {
    describe("nowitness", function () {
      it("fromBuffer", function () {
        // qx tx-encode -i db4d833a87b300f516a3702a3450037dc9fe9febe41a0713d8e626173c8c4c3f:2 -o RmFskNPMcPLn4KpDqYzkgwBoa5soPS2SDDH:440 -o RmQNkCr8ehRUzJhmNmgQVByv7VjakuCjc3d:9.9
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.nowitness.hex)
        );
        assert.strictEqual(tx.version, data.TX.nowitness.tx.version);
        assert.strictEqual(tx.vin.length, data.TX.nowitness.tx.vin.length);
        tx.vin.forEach(function (vin: any, index: number) {
          assert.strictEqual(
            uint8arraytools.toHex(vin.txid.reverse()),
            data.TX.nowitness.tx.vin[index].txid
          );
          assert.strictEqual(vin.vout, data.TX.nowitness.tx.vin[index].vout);
          assert.strictEqual(
            vin.sequence,
            data.TX.nowitness.tx.vin[index].sequence
          );
          assert.deepStrictEqual(
            vin.script,
            uint8arraytools.fromHex(
              data.TX.nowitness.tx.vin[index].scriptSig.hex
            )
          );
        });
        assert.strictEqual(tx.vout.length, data.TX.nowitness.tx.vout.length);
        tx.vout.forEach(function (vout: any, index: number) {
          assert.strictEqual(
            Number(vout.amount),
            Number(data.TX.nowitness.tx.vout[index].amount)
          );
          assert.deepStrictEqual(
            vout.script,
            uint8arraytools.fromHex(
              data.TX.nowitness.tx.vout[index].scriptPubKey.hex
            )
          );
        });
        assert.strictEqual(tx.locktime, data.TX.nowitness.tx.locktime);
        assert.strictEqual(tx.exprie, data.TX.nowitness.tx.expire);
      });
      it("byteLength", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.nowitness.hex)
        );
        assert.strictEqual(
          tx.byteLength(),
          uint8arraytools.fromHex(data.TX.nowitness.hex).length
        );
      });
      it("getTxHash", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.nowitness.hex)
        );

        assert.deepStrictEqual(
          tx.toBuffer(),
          uint8arraytools.fromHex(data.TX.nowitness.hex),
          "nowitness"
        );
        assert.deepStrictEqual(
          tx.getTxIdBuffer().reverse(),
          uint8arraytools.fromHex(data.TX.nowitness.tx.txid)
        );
      });
      it("getTxId " + data.TX.nowitness.tx.txid, function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.nowitness.hex)
        );
        assert.strictEqual(tx.getTxId(), data.TX.nowitness.tx.txid);
      });
      it("clone", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.nowitness.hex)
        );
        const txClone = tx.clone();
        assert.strictEqual(tx.version, txClone.version);
        assert.strictEqual(tx.vin.length, txClone.vin.length);
        tx.vin.forEach(function (vin, index) {
          assert.strictEqual(vin.txid, txClone.vin[index]!.txid);
          assert.strictEqual(vin.vout, txClone.vin[index]!.vout);
          assert.strictEqual(vin.sequence, txClone.vin[index]!.sequence);
          assert.deepStrictEqual(vin.script, txClone.vin[index]!.script);
        });
        assert.strictEqual(tx.vout.length, txClone.vout.length);
        tx.vout.forEach(function (vout, index) {
          assert.strictEqual(vout.amount, txClone.vout[index]!.amount);
          assert.deepStrictEqual(vout.script, txClone.vout[index]!.script);
        });
        assert.strictEqual(tx.locktime, txClone.locktime);
        assert.strictEqual(tx.exprie, txClone.exprie);
        assert.deepStrictEqual(tx.getTxHash(), txClone.getTxHash());
        assert.strictEqual(tx.getTxId(), txClone.getTxId());
        assert.deepStrictEqual(tx.getTxIdBuffer(), txClone.getTxIdBuffer());
        assert.deepStrictEqual(tx.getTxHashBuffer(), txClone.getTxHashBuffer());
      });
    });
    describe("full witness", function () {
      it("fromBuffer", function () {
        // qx tx-sign -k 9af3b7c0b4f19635f90a5fc722defb961ac43508c66ffe5df992e9314f2a2948 01000000013f4c8c3c1726e6d813071ae4eb9ffec97d0350342a70a316f500b3873a834ddb02000000ffffffff0200b89a3e0a0000001976a91469570a6c1fcb68db1b1c50b34960e714d42c7b9c88ac8033023b000000001976a914c693f8fbfe6836f1fb55579b427cfc4fd201495388ac00000000000000000100
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.witness.hex)
        );
        assert.strictEqual(tx.version, data.TX.witness.tx.version);
        assert.strictEqual(tx.vin.length, data.TX.witness.tx.vin.length);
        tx.vin.forEach(function (vin, index) {
          assert.strictEqual(
            uint8arraytools.toHex(vin.txid.reverse()),
            data.TX.witness.tx.vin[index].txid
          );
          assert.strictEqual(vin.vout, data.TX.witness.tx.vin[index].vout);
          assert.strictEqual(
            vin.sequence,
            data.TX.witness.tx.vin[index].sequence
          );
          // assert.strictEqual(vin.amountin, data.TX.witness.tx.vin[index].amountin)
          // assert.strictEqual(vin.blockheight, data.TX.witness.tx.vin[index].blockheight)
          // assert.strictEqual(vin.txindex, data.TX.witness.tx.vin[index].txindex)
          assert.deepStrictEqual(
            vin.script,

            uint8arraytools.fromHex(data.TX.witness.tx.vin[index].scriptSig.hex)
          );
          assert.strictEqual(107, vin.script.length);
        });
        assert.strictEqual(tx.vout.length, data.TX.witness.tx.vout.length);
        tx.vout.forEach(function (vout, index) {
          assert.strictEqual(
            Number(vout.amount),
            Number(data.TX.witness.tx.vout[index].amount)
          );
          assert.deepStrictEqual(
            vout.script,
            uint8arraytools.fromHex(
              data.TX.witness.tx.vout[index].scriptPubKey.hex
            )
          );
          assert.strictEqual(25, vout.script.length);
          assert.strictEqual(
            25,
            uint8arraytools.fromHex(
              data.TX.witness.tx.vout[index].scriptPubKey.hex
            ).length
          );
        });
        assert.strictEqual(tx.locktime, data.TX.witness.tx.locktime);
        assert.strictEqual(tx.exprie, data.TX.witness.tx.expire);
        assert.strictEqual(tx.timestamp, data.TX.witness.tx.timestamp);
      });
      it("byteLength", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.witness.hex)
        );
        assert.strictEqual(
          tx.byteLength(),
          uint8arraytools.fromHex(data.TX.witness.hex).length
        );
      });
      it("getHash", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.witness.hex)
        );

        assert.deepStrictEqual(
          tx.toBuffer(
            undefined,
            undefined,
            qitmeer.Transaction.TxSerializeFull
          ),
          uint8arraytools.fromHex(data.TX.witness.hex)
        );
        assert.deepStrictEqual(
          tx.getTxIdBuffer().reverse(),
          uint8arraytools.fromHex(data.TX.witness.tx.txid)
        );
      });
      it("getTxId " + data.TX.witness.tx.txid, function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.witness.hex)
        );
        assert.strictEqual(tx.getTxId(), data.TX.witness.tx.txid);
      });
      it("getTxIdBuffer", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.witness.hex)
        );
        assert.deepStrictEqual(
          tx.getTxIdBuffer().reverse(),
          uint8arraytools.fromHex(data.TX.witness.tx.txid)
        );
      });
      it("getTxHashBuffer" + data.TX.witness.tx.txhash, function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.witness.hex)
        );
        assert.deepStrictEqual(
          tx.getTxHashBuffer().reverse(),
          uint8arraytools.fromHex(data.TX.witness.tx.txhash)
        );
      });
      it("clone", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.witness.hex)
        );
        const txClone = tx.clone();
        assert.strictEqual(tx.version, txClone.version);
        assert.strictEqual(tx.vin.length, txClone.vin.length);
        tx.vin.forEach(function (vin, index) {
          assert.strictEqual(vin.txid, txClone.vin[index]!.txid);
          assert.strictEqual(vin.vout, txClone.vin[index]!.vout);
          assert.strictEqual(vin.sequence, txClone.vin[index]!.sequence);
          assert.deepStrictEqual(vin.script, txClone.vin[index]!.script);
        });
        assert.strictEqual(tx.vout.length, txClone.vout.length);
        tx.vout.forEach(function (vout, index) {
          assert.strictEqual(vout.amount, txClone.vout[index]!.amount);
          assert.deepStrictEqual(vout.script, txClone.vout[index]!.script);
        });
        assert.strictEqual(tx.locktime, txClone.locktime);
        assert.strictEqual(tx.exprie, txClone.exprie);
        assert.deepStrictEqual(tx.getTxHash(), txClone.getTxHash());
        assert.strictEqual(tx.getTxId(), txClone.getTxId());
        assert.deepStrictEqual(tx.getTxIdBuffer(), txClone.getTxIdBuffer());
        assert.deepStrictEqual(tx.getTxHashBuffer(), txClone.getTxHashBuffer());
      });
    });
    describe("two inputs", function () {
      it("fromBuffer/toBuffer", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.TX.twoinputs.hex)
        );
        assert.strictEqual(tx.vin.length, data.TX.twoinputs.vin.length);
        assert.strictEqual(
          uint8arraytools.toHex(tx.toBuffer()),
          data.TX.twoinputs.hex
        );
      });
    });
    describe("signhash", function () {
      it("hashForSignature, throw invalid index", function () {
        const tx = qitmeer.Transaction.fromBuffer(
          uint8arraytools.fromHex(data.SignHashTest[0].txHex)
        );
        const preScript = qitmeer.script.fromBuffer(
          uint8arraytools.fromHex(data.SignHashTest[0].prvScriptHex)
        );
        assert.throws(function () {
          tx.hashForSignature(1, preScript!, qitmeer.Transaction.SIGHASH_ALL);
        }, /^Error: invalid input index 1, out of the range of tx input 1$/);
      });
      data.SignHashTest.forEach(function (f: any) {
        it("hashForSignature " + f.signHash, function () {
          const mytx = qitmeer.Transaction.fromBuffer(
            uint8arraytools.fromHex(f.txHex)
          );
          assert.strictEqual(mytx.getTxId(), f.txId);
          const preScript = qitmeer.script.fromBuffer(
            uint8arraytools.fromHex(f.prvScriptHex)
          );
          assert.strictEqual(preScript?.toAsm(), f.prvScriptAsm);
          const signHash = mytx.hashForSignature(
            0,
            preScript!,
            qitmeer.Transaction.SIGHASH_ALL
          );
          assert.deepStrictEqual(signHash, uint8arraytools.fromHex(f.signHash));
        });
      });
    });
  });
  describe("qitmeer.block", function () {
    describe("test block", function () {
      it("fromBuffer", function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.Block.hex)
        );
        assert.strictEqual(block.version, data.Block.json.version);
        assert.strictEqual(
          uint8arraytools.toHex(block.parentRoot!.reverse()),
          data.Block.json.parentroot
        );
        assert.strictEqual(
          uint8arraytools.toHex(block.txRoot!.reverse()),
          data.Block.json.txRoot
        );
        assert.strictEqual(
          uint8arraytools.toHex(block.stateRoot!.reverse()),
          data.Block.json.stateRoot
        );
        assert.strictEqual(block.difficulty, data.Block.json.difficulty);
        // assert.strictEqual(block.height, data.Block.json.height)
        assert.strictEqual(
          (new Date(block.timestamp) as unknown as number) * 1000,
          (new Date(data.Block.json.timestamp) as unknown as number) * 1000
        );
        assert.strictEqual(block.pow.nonce, data.Block.json.pow.nonce);
        assert.strictEqual(block.pow.pow_type, data.Block.json.pow.pow_type);
        assert.strictEqual(
          block.pow.proof_data.edge_bits,
          data.Block.json.pow.proof_data.edge_bits
        );
        assert.strictEqual(
          uint8arraytools.toHex(block.pow.proof_data.circle_nonces),
          data.Block.json.pow.proof_data.circle_nonces
        );
        assert.strictEqual(
          block.transactions.length,
          data.Block.json.transactions.length
        );
        block.transactions.forEach(function (tx, index) {
          assert.strictEqual(
            tx.version,
            data.Block.json.transactions[index].version
          );
          assert.strictEqual(
            tx.vin.length,
            data.Block.json.transactions[index].vin.length
          );
          tx.vin.forEach(function (vin, i) {
            // assert.strictEqual(vin.txid.reverse().toString('hex'), data.Block.json.transactions[index].vin[j].txid)
            // assert.strictEqual(vin.vout, data.Block.json.transactions[index].vin[j].vout)
            assert.strictEqual(
              vin.sequence,
              data.Block.json.transactions[index].vin[i].sequence
            );
            // assert.strictEqual(vin.amountin, data.Block.json.transactions[index].vin[i].amountin)
            // assert.strictEqual(vin.blockheight, data.Block.json.transactions[index].vin[i].blockheight)
            // assert.strictEqual(vin.txindex, data.Block.json.transactions[index].vin[i].txindex)
          });
          assert.strictEqual(
            tx.vout.length,
            data.Block.json.transactions[index].vout.length
          );
          // tx.vout.forEach(function (vout, i) {
          //   assert.strictEqual(vout.amount, data.Block.json.transactions[index].vout[i].amount)
          //   assert.deepStrictEqual(vout.script, uint8arraytools.fromHex(data.Block.json.transactions[index].vout[i].scriptPubKey.hex, 'hex'))
          // })
          assert.strictEqual(
            tx.locktime,
            data.Block.json.transactions[index].locktime
          );
          assert.strictEqual(
            tx.exprie,
            data.Block.json.transactions[index].expire
          );
          assert.strictEqual(
            tx.byteLength(),
            uint8arraytools.fromHex(data.Block.json.transactions[index].hex)
              .length
          );
        });
      });
      it("byteLength", function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.Block.hex)
        );
        assert.strictEqual(
          block.byteLength(false),
          uint8arraytools.fromHex(data.Block.hex).length
        );
      });
      it("toBuffer headeronly", function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.Block.hex)
        );
        assert.deepStrictEqual(
          block.toBuffer(true),
          uint8arraytools.fromHex(data.BlockHeader.hex)
        );
      });
      it("toBuffer full", function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.Block.hex)
        );
        assert.deepStrictEqual(
          block.toBuffer(false),
          uint8arraytools.fromHex(data.Block.hex)
        );
      });
      it("getHashBuffer", function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.Block.hex)
        );
        assert.deepStrictEqual(
          block.getHashBuffer(),
          uint8arraytools.fromHex(data.Block.json.hash).reverse()
        );
      });
      it("getHash " + data.Block.json.hash, function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.Block.hex)
        );
        assert.strictEqual(block.getHash(), data.Block.json.hash);
      });
    });
    describe("tx in block", function () {
      const block = qitmeer.block.fromBuffer(
        uint8arraytools.fromHex(data.Block.hex)
      );
      block.transactions.forEach(function (tx, index) {
        const txid = data.Block.json.transactions[index].txid;
        it("txid " + txid, function () {
          assert.strictEqual(tx.getTxId(), txid);
        });
        const fullhash = data.Block.json.transactions[index].txhash;
        it("txhash " + fullhash, function () {
          assert.strictEqual(tx.getTxHash(), fullhash);
        });
      });
    });
    describe("txRoot", function () {
      it("calculate txRoot, single tx", function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.Block.hex)
        );
        const singleTxInBlock = block.transactions;
        assert.strictEqual(1, singleTxInBlock.length);
        // console.log(qitmeer.block.calculateTxRoot(singleTxInBlock).reverse().toString('hex'), data.Block.json.txRoot)
        assert.deepStrictEqual(
          qitmeer.block.calculateTxRoot(singleTxInBlock),
          uint8arraytools.fromHex(data.Block.json.txRoot).reverse()
        );
      });
      it("calculate txRoot, multi tx", function () {
        const block = qitmeer.block.fromBuffer(
          uint8arraytools.fromHex(data.BlockMultipleTx.hex)
        );
        const txInBlock = block.transactions;
        assert.strictEqual(2, txInBlock.length);
        txInBlock.forEach(function (tx, i) {
          assert.strictEqual(
            tx.getTxId(),
            data.BlockMultipleTx.json.transactions[i].txid
          );
          assert.strictEqual(
            tx.getTxHash(),
            data.BlockMultipleTx.json.transactions[i].txhash
          );
        });
        assert.deepStrictEqual(
          qitmeer.block.calculateTxRoot(txInBlock),
          uint8arraytools.fromHex(data.BlockMultipleTx.json.txRoot).reverse()
        );
      });
    });
    describe("ops", function () {
      it("test OP_CHECKSIG", function () {
        assert.strictEqual(
          qitmeer.OPS_MAP[qitmeer.OPS.OP_CHECKSIG as number],
          "OP_CHECKSIG"
        );
        assert.strictEqual(qitmeer.OPS.OP_CHECKSIG, 172);
      });
    });
  });
  describe("qitmeer script", function () {
    describe("fromBuffer ", function () {
      data.ScriptTest.forEach(function (f: any) {
        const script = qitmeer.script.fromBuffer(
          uint8arraytools.fromHex(f.hex)
        );
        it("test script toAsm " + f.asm, function () {
          assert.strictEqual(f.asm, script?.toAsm());
        });
        it("test script toBuffer " + f.hex, function () {
          assert.deepStrictEqual(
            uint8arraytools.fromHex(f.hex),
            script?.toBuffer()
          );
        });
      });
    });
    describe("fromAsm ", function () {
      data.ScriptTest.forEach(function (f: any) {
        const script = qitmeer.script.fromAsm(f.asm);
        it("test script toAsm " + f.asm, function () {
          assert.strictEqual(f.asm, script.toAsm());
        });
        it("test script toBuffer " + f.hex, function () {
          assert.deepStrictEqual(
            uint8arraytools.fromHex(f.hex),
            script.toBuffer()
          );
        });
      });
    });
    describe("removeCodeSeparator ", function () {
      data.ScriptRemoveTest.forEach(function (f: any) {
        it("test script " + f.before.hex + "->" + f.after.hex, function () {
          const script = qitmeer.script.fromAsm(f.before.asm);
          assert.strictEqual(f.before.asm, script.toAsm());
          assert.strictEqual(script.removeCodeSeparator().toAsm(), f.after.asm);
          assert.strictEqual(
            uint8arraytools.toHex(script.removeCodeSeparator().toBuffer()),
            f.after.hex
          );
        });
      });
    });
  });
  describe("example", function () {
    it("sign a raw transaction", function () {
      // alex's privkey 9af3b7c0b4f19635f90a5fc722defb961ac43508c66ffe5df992e9314f2a2948
      const alex = qitmeer.ec.fromWIF(
        "L2QvAGZrNTdJSjzMSEA15vXkbjzdhn7fBJrcWHv3sprLFhkHXksC"
      );
      // create a new tx-signer
      const txsnr = qitmeer.TxSigner.newSigner(qitmeer.networks.privnet);
      txsnr.setVersion(1);
      // alex's previous transaction output, has 450 qitmeer
      txsnr.addInput(
        "5c0dff371fe9c762139570bdfef7d34aca5e84325871e67fd0203f0da8c5e50c",
        2
      );
      txsnr.addOutput("RmFskNPMcPLn4KpDqYzkgwBoa5soPS2SDDH", 44000000000);
      txsnr.addOutput("RmQNkCr8ehRUzJhmNmgQVByv7VjakuCjc3d", 990000000);
      // (in)45000000000 - (out)44990000000 = (miner fee)10000000

      // sign
      txsnr.sign(0, alex);
      // get raw Tx
      const rawTx = txsnr.build().toBuffer();
      // can be broadcast to the qitmeer network
      assert.strictEqual(
        uint8arraytools.toHex(rawTx),
        "01000000010ce5c5a80d3f20d07fe6715832845eca4ad3f7febd70951362c7e91f37ff0d5c02000000ffffffff02000000b89a3e0a0000001976a91469570a6c1fcb68db1b1c50b34960e714d42c7b9c88ac00008033023b000000001976a914c693f8fbfe6836f1fb55579b427cfc4fd201495388ac000000000000000000000000016a4730440220438749b5e955d06da90cdd7c9ec4191e11994022b20cd541376019315ca130c3022035792747edcc60bcd60bf109ef8181f9929aed68139c2348c68333ec36a65d25012102abb13cd5260d3e9f8bc3db8687147ace7b6e5b63b061afe37d09a8e4550cd174"
      );
    });
    it("two inputs of alex", function () {
      // alex's privkey 9af3b7c0b4f19635f90a5fc722defb961ac43508c66ffe5df992e9314f2a2948
      const alex = qitmeer.ec.fromWIF(
        "L2QvAGZrNTdJSjzMSEA15vXkbjzdhn7fBJrcWHv3sprLFhkHXksC"
      );
      // create a new tx-signer
      const txsnr = qitmeer.TxSigner.newSigner(qitmeer.networks.privnet);
      txsnr.setVersion(1);
      txsnr.addInput(
        "d46a58fced5a05b1dc1f4450e1bdf09696291348a7eccec069ed59343ec35b4d",
        2
      );
      txsnr.addInput(
        "46a6d3d9e1ef552dc9b0eba147ea97e481654a2bccf59fd764652971cb4d9fdd",
        2
      );
      txsnr.addOutput("RmFskNPMcPLn4KpDqYzkgwBoa5soPS2SDDH", 89000000000);
      txsnr.addOutput("RmQNkCr8ehRUzJhmNmgQVByv7VjakuCjc3d", 990000000);
      // (in)90000000000 - (out)89990000000 = (miner fee)10000000
      // sign all index
      txsnr.sign(0, alex);
      txsnr.sign(1, alex);
      // get raw Tx
      const rawTx = txsnr.build();

      // can be broadcast to the qitmeer network
      assert.deepStrictEqual(
        rawTx.toBuffer(),
        uint8arraytools.fromHex(
          "01000000024d5bc33e3459ed69c0ceeca74813299696f0bde150441fdcb1055aedfc586ad402000000ffffffffdd9f4dcb71296564d79ff5cc2b4a6581e497ea47a1ebb0c92d55efe1d9d3a64602000000ffffffff020000003ad0b8140000001976a91469570a6c1fcb68db1b1c50b34960e714d42c7b9c88ac00008033023b000000001976a914c693f8fbfe6836f1fb55579b427cfc4fd201495388ac000000000000000000000000026b483045022100ed8567dedbc1320c7c60f4097182cbe4cd877c4223f5acd9884d80f5174e9e500220483e91a1506782277023c4eeb72c3585b787b1f619e0d7c5908159d39eb5ba44012102abb13cd5260d3e9f8bc3db8687147ace7b6e5b63b061afe37d09a8e4550cd1746a473044022017b7edfcc331a5df26ccc3f7db557798304ca9a7e4a03d678d0fe88a97b2ef79022043d57a371bbcace977a53016ba9640fcdb88b322ebdef5a9f819172b1b395306012102abb13cd5260d3e9f8bc3db8687147ace7b6e5b63b061afe37d09a8e4550cd174"
        )
      );
    });
    it("issues 17 verify txId", function () {
      const txHex =
        "01000000013f4c8c3c1726e6d813071ae4eb9ffec97d0350342a70a316f500b3873a834ddb02000000ffffffff01000000b89a3e0a0000001976a91469570a6c1fcb68db1b1c50b34960e714d42c7b9c88ac00000000000000003d7cf7600100";
      const txId = qitmeer.Transaction.fromBuffer(
        uint8arraytools.fromHex(txHex)
      ).getTxId();
      assert.strictEqual(
        txId,
        "1f26b9431ebef7c70418653cf58fd7d6b0db294c6445f2edc8c69f5e6680c556"
      );
    });
  });
});
