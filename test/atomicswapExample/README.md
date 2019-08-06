# HLC-atomicswap-Example

## HLC atomicswap javascript

```js

node index.js
{
    refundecontract: {
        Transaction: '0100000001fc9aaaccae6e68378d794a0f0d3aae9d725df84a3d7e8e5dc2ab1f6d8cb995a0000000000000000001e092f505000000001976a914cdd006e3adcd991a15f46c7e975686c1aec2077388ac00000000000000000100000000000000000000000000000000de4c6b483045022100d00df3d6ebbd79e8f77c594d22fbbe111fa6fcd667bc22ad50c0c3ff753bee9602207685e5062d32997bcad45bfcae8840d2502e81479d88e055b0b8f2840b959def0121023e4cc6f9ca030345a9e4e6f3859eae50169d6336001989f11ca71c67fd49954121023e4cc6f9ca030345a9e4e6f3859eae50169d6336001989f11ca71c67fd499541004c4c63a614eb7b3417f6a706a1ed04515467c3240ad63a0b4b8876a914d364af39e59cea1488a25e3cfcc48e20f31a7b166700b175a914cdd006e3adcd991a15f46c7e975686c1aec207736888ac',
        RefundId: '8c9c415b61bb31fcf3d401cda2df4aba1a64761d1a127859ea9d92f656a2e65b'
    },
    redeemcontract: {
        Transaction: '0100000001fc9aaaccae6e68378d794a0f0d3aae9d725df84a3d7e8e5dc2ab1f6d8cb995a000000000ffffffff01e092f505000000001976a914d364af39e59cea1488a25e3cfcc48e20f31a7b1688ac00000000000000000100000000000000000000000000000000fdfe004c6a473044022066f7d8e4cc96085c19467b225f66e1782e0d7f2acb34b9b1b5ee5cfa42616836022041039515d2e9f1e7618632d0887f8558c0e80c24601b9fab656826a63f8dd8bc0121029392d658b8f9c85461e462a1f4fce8574d3cd343cf787c4b39c458d218ca863021029392d658b8f9c85461e462a1f4fce8574d3cd343cf787c4b39c458d218ca8630206b83b3a7d4f53c778e73b3a77094ff957a90c8909fb833b0dea3504fe6fadaff514c4c63a614eb7b3417f6a706a1ed04515467c3240ad63a0b4b8876a914d364af39e59cea1488a25e3cfcc48e20f31a7b166700b175a914cdd006e3adcd991a15f46c7e975686c1aec207736888ac',
        RedeemId: 'af6b0379acbdbf3fd6da0f14cb7a88dfaa3487a2365b1f00d241ae164cd0cc1a'
    },
    initiatecontract: {
        transaction: '0100000001c766eaa31619601530236d4d35bebba1158727082f18cd454d66d5c52443941e02000000ffffffff02f0b9f5050000000017a91487699b1d22f0f3351e1f26581e86a28bb9b063f68700a13f740a0000001976a91444d959afb6db4ad730a6e2c0daf46ceeb98c53a088ac000000000000000001000000000000000000000000000000006b483045022100ccee8498db7c03c02caa3e31303bb1a29ae66e78904bf97afb4b689ba2dff42302205f8ae5ec37bf2fa6f92ec38868227e64685c8bd5782fc5ace080a0c230567d8e0121023e4cc6f9ca030345a9e4e6f3859eae50169d6336001989f11ca71c67fd499541',
        contractId: 'a095b98c6d1fabc25d8e7e3d4af85d729dae3a0d0f4a798d37686eaeccaa9afc'
    },
    lockcontract: {
        secret: '6b83b3a7d4f53c778e73b3a77094ff957a90c8909fb833b0dea3504fe6fadaff',
        secretHash: 'eb7b3417f6a706a1ed04515467c3240ad63a0b4b',
        contractScript: '63a614eb7b3417f6a706a1ed04515467c3240ad63a0b4b8876a914d364af39e59cea1488a25e3cfcc48e20f31a7b166700b175a914cdd006e3adcd991a15f46c7e975686c1aec207736888ac',
        contractAddress: 'RSPjQbyETuYHHiLdr3jFaXWtfvt8MqGkfCz'
    }
}
```

## BTC atomicswap javascript

```js
{
    refundecontract: {
        Transaction: '0200000001ce083d1cba794c13a959511d9e51a216928a5a972d3ddcfbfcb9bd7b6539c37000000000be47304402205ccb8a2c91548859657a4526df7605bcb906fd9bc651be89c009d094fe57710f02203ef0f757b490ed0391d7a26a3796f6f5a8cdb3a651e0602aac644a33b7b550100121023e4cc6f9ca030345a9e4e6f3859eae50169d6336001989f11ca71c67fd499541004c5163a614e691bca79409ddd0772b33a08fc8b3de607181e38876a914d8387451a961898753fe62534d6e57117ec49d9c67049036eb5cb17576a914c1c3092d17c917c2799c041aeaeac188227721496888ac0000000001f0230000000000001976a914c1c3092d17c917c2799c041aeaeac1882277214988ac9036eb5c',
        RefundId: '3ff0763c3dcc992610720aa8afac48407b34727c9e56045a96348bc5785ed7af' 
    },
    redeemcontract: {
        Transaction: '0200000001ce083d1cba794c13a959511d9e51a216928a5a972d3ddcfbfcb9bd7b6539c37000000000e04830450221008a42216639d794030e3ec21e148e5bc0acc7f8e909ae9bbe59145ddc6b97b8e902207a8655d28769382c49d2333666de947a651714b072ef41c1c4ef713e24b636d60121029392d658b8f9c85461e462a1f4fce8574d3cd343cf787c4b39c458d218ca863020b7d3f4546c301bbb806075953409c8ac02c30c5229369e15e098ef3bd625a976514c5163a614e691bca79409ddd0772b33a08fc8b3de607181e38876a914d8387451a961898753fe62534d6e57117ec49d9c67049036eb5cb17576a914c1c3092d17c917c2799c041aeaeac188227721496888acffffffff01f0230000000000001976a914d8387451a961898753fe62534d6e57117ec49d9c88ac00000000',
        RefundId: 'ca2747d1675cc38e930a0c0f0737dd964cf9be9e52b8b52bcba2adc7c9e5cfa9' 
    },
    initiatecontract: {
        transaction: '0200000001f95cd7af34e113e4ef2101037406918d406929164286591958dcab9900a03f87010000006b483045022100c064e8724cd3b4b0dfd1063256c90446650cf680bf1db5329c9f9187b959635e02205f8a0961fd972ca2be23380d36d964005ce2aa2025d5b3390786d755ef4066c30121023e4cc6f9ca030345a9e4e6f3859eae50169d6336001989f11ca71c67fd499541ffffffff02102700000000000017a914bab9cc4d92c053e42b5801fc1fce8905389c26f887f06e0000000000001976a914c1c3092d17c917c2799c041aeaeac1882277214988ac00000000',
        contractId: '70c339657bbdb9fcfbdc3d2d975a8a9216a2519e1d5159a9134c79ba1c3d08ce'
    },
    lockcontract: {
        secret: 'b7d3f4546c301bbb806075953409c8ac02c30c5229369e15e098ef3bd625a976',
        secretHash: 'e691bca79409ddd0772b33a08fc8b3de607181e3',
        contractScript:'63a614e691bca79409ddd0772b33a08fc8b3de607181e38876a914d8387451a961898753fe62534d6e57117ec49d9c67049036eb5cb17576a914c1c3092d17c917c2799c041aeaeac188227721496888ac',
        contractAddress: '2NAGYFSTtm3xrahJeiKpJtJFHsPr6hin5UL' 
    }
}
```