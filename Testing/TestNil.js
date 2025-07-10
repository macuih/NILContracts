const NILTransparencyContract = artifacts.require("NILTransparencyContract");

contract("NILTransparencyContract", accounts => {
  const athlete = accounts[1];
  const sponsor = accounts[2];

  let contractInstance;

  beforeEach(async () => {
    contractInstance = await NILTransparencyContract.new({ from: accounts[0] });
  });

  // Test 1: Register an athlete and verify status
  it("should register a new athlete and set verified to false", async () => {
    await contractInstance.registerAthlete({ from: athlete });
    const athleteData = await contractInstance.athletes(athlete);

    assert.equal(athleteData.walletAddress, athlete, "Wallet address mismatch");
    assert.equal(athleteData.isVerified, false, "Athlete should be unverified by default");
  });

  // Test 2: Submit a NIL contract and verify values
  it("should allow a registered athlete to submit a NIL contract", async () => {
    await contractInstance.registerAthlete({ from: athlete });

    const contractValue = web3.utils.toWei("1", "ether");
    const description = "Sponsorship Deal";
    const isPublic = true;

    await contractInstance.submitNILContract(contractValue, description, isPublic, { from: athlete });

    const contracts = await contractInstance.viewAthleteContracts(athlete, { from: athlete });

    assert.equal(contracts.length, 1, "There should be one NIL contract");
    assert.equal(contracts[0].contractValue.toString(), contractValue, "Contract value mismatch");
    assert.equal(contracts[0].description, description, "Contract description mismatch");
    assert.equal(contracts[0].isPublic, isPublic, "Visibility flag mismatch");
  });

  // ✅ Test 3: Only owner can verify an athlete
  it("should allow only the owner to verify an athlete", async () => {
    await contractInstance.registerAthlete({ from: athlete });

    // ✅ Owner verifies the athlete
    await contractInstance.verifyAthlete(athlete, { from: accounts[0] });

    const athleteData = await contractInstance.athletes(athlete);
    assert.equal(athleteData.isVerified, true, "Athlete should be marked as verified by owner");

    // ❌ Non-owner tries to verify (should fail)
    try {
      await contractInstance.verifyAthlete(athlete, { from: sponsor });
      assert.fail("Non-owner was able to verify an athlete");
    } catch (error) {
      assert(
        error.message.includes("Not authorized"),
        "Expected 'Not authorized' error, got: " + error.message
      );
    }
  });
});
