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

    function testRegisterAthlete() public {
        (address wallet, bool verified,,) = nilContract.getAthlete(address(this));
        Assert.equal(wallet, address(this), "Wallet address should match caller");
        Assert.equal(verified, false, "Athlete should be unverified by default");

        address registered = nilContract.registeredAthletes(0);
        Assert.equal(registered, address(this), "Athlete should be in the list");
    }

    function testSubmitNILContract() public {
        uint256 value = 0.5 ether;
        string memory desc = "Endorsement Deal";

        nilContract.submitNILContract(value, desc, true);
        NILTransparencyContract.NILContract[] memory contracts = nilContract.viewAthleteContracts(address(this));

        Assert.equal(contracts.length, 1, "One NIL contract should be stored");
        Assert.equal(contracts[0].contractValue, value, "Stored contract value mismatch");
        Assert.equal(contracts[0].isPublic, true, "Contract visibility mismatch");
        Assert.equal(contracts[0].description, desc, "Contract description mismatch");
    }

    function testVerifyAthlete() public {
        nilContract.verifyAthlete(address(this));
        (, bool verified,,) = nilContract.getAthlete(address(this));
        Assert.equal(verified, true, "Athlete should be marked as verified");
    }

    function testLogTransaction() public {
        string memory reason = "Appearance fee";
        uint256 amount = 1 ether;

        nilContract.logTransaction(amount, reason);
        NILTransparencyContract.Transaction[] memory txs = nilContract.getAthleteTransactions(address(this));

        Assert.equal(txs.length, 1, "There should be one logged transaction");
        Assert.equal(txs[0].amount, amount, "Transaction amount mismatch");
        Assert.equal(txs[0].purpose, reason, "Transaction purpose mismatch");
        Assert.equal(txs[0].fromAddress, address(this), "Sender address mismatch");
    }
}
