"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
var ethereumjs_util_1 = require("ethereumjs-util");
var solidity_helpers_1 = require("../../solidity-helpers");
var crypto_utils_1 = require("../../crypto-utils");
// import Web3 from 'web3'
var Web3 = require('web3');
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 *
 */
var newContractAndClient = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var privKey, client, from, loomProvider, web3, contractData, ABI, result, contract;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                from = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                web3 = new Web3(loomProvider);
                client.on('error', console.log);
                contractData = '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029';
                ABI = [
                    {
                        constant: false,
                        inputs: [{ name: '_value', type: 'uint256' }],
                        name: 'set',
                        outputs: [],
                        payable: false,
                        stateMutability: 'nonpayable',
                        type: 'function'
                    },
                    {
                        constant: true,
                        inputs: [],
                        name: 'get',
                        outputs: [{ name: '', type: 'uint256' }],
                        payable: false,
                        stateMutability: 'view',
                        type: 'function'
                    },
                    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
                    {
                        anonymous: false,
                        inputs: [{ indexed: true, name: '_value', type: 'uint256' }],
                        name: 'NewValueSet',
                        type: 'event'
                    }
                ];
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
            case 1:
                result = _a.sent();
                contract = new web3.eth.Contract(ABI, result.contractAddress, { from: from });
                return [2 /*return*/, { contract: contract, client: client, web3: web3, from: from, privKey: privKey }];
        }
    });
}); };
tape_1.default('LoomProvider + Web3 not matching topic', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, contract, client, newValue, tx, resultOfGet, err_1;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                t.plan(2);
                return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), contract = _a.contract, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 6, , 7]);
                newValue = 1;
                contract.events.NewValueSet({ filter: { _value: [4, 5] } }, function (err, event) {
                    console.log(err, event);
                    if (err)
                        t.error(err);
                    else {
                        t.fail('should not been dispatched');
                    }
                });
                return [4 /*yield*/, contract.methods.set(newValue).send()];
            case 3:
                tx = _b.sent();
                t.equal(tx.status, '0x1', 'SimpleStore.set should return correct status');
                return [4 /*yield*/, contract.methods.get().call()];
            case 4:
                resultOfGet = _b.sent();
                t.equal(+resultOfGet, newValue, "SimpleStore.get should return correct value");
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7:
                if (client) {
                    client.disconnect();
                }
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider + Web3 multiple topics', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, contract, client, newValue_1, tx, resultOfGet, err_2;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                t.plan(3);
                return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), contract = _a.contract, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 6, , 7]);
                newValue_1 = 1;
                contract.events.NewValueSet({ filter: { _value: [1, 2, 3] } }, function (err, event) {
                    if (err)
                        t.error(err);
                    else {
                        t.equal(+event.returnValues._value, newValue_1, "Return value should be " + newValue_1);
                    }
                });
                return [4 /*yield*/, contract.methods.set(newValue_1).send()];
            case 3:
                tx = _b.sent();
                t.equal(tx.status, '0x1', 'SimpleStore.set should return correct status');
                return [4 /*yield*/, contract.methods.get().call()];
            case 4:
                resultOfGet = _b.sent();
                t.equal(+resultOfGet, newValue_1, "SimpleStore.get should return correct value");
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                err_2 = _b.sent();
                console.log(err_2);
                return [3 /*break*/, 7];
            case 7:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider + Eth Sign', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, client, web3, from, privKey, msg, result, hash, _b, r, s, v, pubKey, privateHash, err_3;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _c.sent(), client = _a.client, web3 = _a.web3, from = _a.from, privKey = _a.privKey;
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                msg = '0xff';
                return [4 /*yield*/, web3.eth.sign(msg, from)
                    // Checking the ecrecover
                ];
            case 3:
                result = _c.sent();
                hash = solidity_helpers_1.soliditySha3('\x19Ethereum Signed Message:\n32', msg).slice(2);
                _b = ethereumjs_util_1.fromRpcSig(result), r = _b.r, s = _b.s, v = _b.v;
                pubKey = ethereumjs_util_1.ecrecover(Buffer.from(hash, 'hex'), v, r, s);
                privateHash = solidity_helpers_1.soliditySha3(privKey).slice(2);
                t.equal(crypto_utils_1.bytesToHexAddr(pubKey), crypto_utils_1.bytesToHexAddr(ethereumjs_util_1.privateToPublic(Buffer.from(privateHash, 'hex'))), 'Should pubKey from ecrecover be valid');
                return [3 /*break*/, 5];
            case 4:
                err_3 = _c.sent();
                console.log(err_3);
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-web3-tests.js.map