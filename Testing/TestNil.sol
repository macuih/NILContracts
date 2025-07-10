// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../contracts/NILTransparencyContract.sol";

contract TestNILTransparency {
    NILTransparencyContract nilContract;

    function beforeEach() public {
        nilContract = new NILTransparencyContract();
        nilContract.registerAthlete(); // address(this) registers itself
    }

    // Test 1: Register athlete
    function testRegisterAthlete() public {
        (address wallet, bool verified,,) = nilContract.getAthlete(address(this));
        Assert.equal(wallet, address(this), "Wallet address should match caller");
        Assert.equal(verified, false, "Athlete should be unverified by default");

        address registered = nilContract.registeredAthletes(0);
        Assert.equal(registered, address(this), "Athlete address should be in the list");
    }

    // Test 2: Submit NIL contract
    function testSubmitNILContract() public {
        uint256 value = 0.5 ether;
        string memory desc = "Endorsement Deal";

        nilContract.submitNILContract(value, desc, true);
        NILTransparencyContract.NILContract[] memory contracts = nilContract.viewAthleteContracts(address(this));

        Assert.equal(contracts.length, 1, "One NIL contract should be stored");
        Assert.equal(contracts[0].contractValue, value, "Stored contract value should match");
        Assert.equal(contracts[0].isPublic, true, "Contract visibility should be public");
        Assert.equal(contracts[0].description, desc, "Description should match input");
    }

    // Test 3: Verify athlete
    function testVerifyAthlete() public {
        // This test contract is the "owner" since it deployed the contract
        nilContract.verifyAthlete(address(this));
        (, bool verified,,) = nilContract.getAthlete(address(this));
        Assert.equal(verified, true, "Athlete should be marked as verified");
    }

    // Test 4: Log a non-payment transaction
    function testLogTransaction() public {
        string memory reason = "Appearance fee";
        uint256 amount = 1 ether;

        nilContract.logTransaction(amount, reason);
        NILTransparencyContract.Transaction[] memory txs = nilContract.getAthleteTransactions(address(this));

        Assert.equal(txs.length, 1, "There should be one logged transaction");
        Assert.equal(txs[0].amount, amount, "Logged transaction amount mismatch");
        Assert.equal(txs[0].purpose, reason, "Transaction purpose mismatch");
        Assert.equal(txs[0].fromAddress, address(this), "Transaction sender should match");
    }
}
