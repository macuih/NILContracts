// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../contracts/NILTransparencyContract.sol";

contract TestNILTransparency {
    NILTransparencyContract nilContract;

    // Set up before tests
    function beforeEach() public {
        nilContract = new NILTransparencyContract();
    }

    // Test 1: Register an athlete and verify mapping/array update
    function testRegisterAthlete() public {
        // Call registerAthlete as this contract
        nilContract.registerAthlete();

        // Check athlete mapping
        ( , bool isVerified, , ) = nilContract.athletes(address(this));
        Assert.equal(isVerified, false, "Newly registered athlete should not be verified");

        // Check that address is in registeredAthletes array
        address[] memory list = nilContract.registeredAthletes();
        Assert.equal(list[0], address(this), "Athlete address should be in registeredAthletes list");
    }

    // Test 2: Submit a NIL contract and check that it's stored
    function testSubmitNILContract() public {
        // Must register before submitting
        nilContract.registerAthlete();

        // Submit a NIL contract
        nilContract.submitNILContract(
            500000000000000000, // 0.5 ETH in wei
            "Endorsement Deal",
            true
        );

        // Get all contracts for this athlete (should include private and public if self)
        NILTransparencyContract.NILContract[] memory contracts = nilContract.viewAthleteContracts(address(this));

        // Check contract values
        Assert.equal(contracts.length, 1, "There should be one NIL contract submitted");
        Assert.equal(contracts[0].contractValue, 500000000000000000, "Contract value should be 0.5 ETH in wei");
        Assert.equal(contracts[0].isPublic, true, "Contract should be public");
    }
}
