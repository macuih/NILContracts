const NILTransparencyContract = artifacts.require("NILTransparencyContract");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { assert } = require("chai");

contract("NILTransparencyContract", accounts => {
  const [owner, athlete, stranger] = accounts;
  let contract;

  beforeEach(async () => {
    contract = await NILTransparencyContract.new({ from: owner });
  });

  it("should register a new athlete and set verified to false", async () => {
    await contract.registerAthlete({ from: athlete });
    const athleteData = await contract.getAthlete(athlete);
    assert.equal(athleteData[0], athlete, "Wallet should match");
    assert.equal(athleteData[1], false, "Should not be verified");
  });

  it("should allow a registered athlete to submit a NIL contract", async () => {
    await contract.registerAthlete({ from: athlete });
    await contract.submitNILContract(web3.utils.toWei("0.5", "ether"), "Endorsement Deal", true, { from: athlete });

    const contracts = await contract.viewAthleteContracts(athlete);
    assert.equal(contracts.length, 1, "Should store one contract");
    assert.equal(contracts[0].description, "Endorsement Deal");
    assert.equal(contracts[0].isPublic, true);
  });

  it("should allow only the owner to verify an athlete", async () => {
    await contract.registerAthlete({ from: athlete });

    // owner can verify
    await contract.verifyAthlete(athlete, { from: owner });
    const verifiedData = await contract.getAthlete(athlete);
    assert.equal(verifiedData[1], true, "Athlete should be verified");

    // stranger cannot verify
    await expectRevert(
      contract.verifyAthlete(athlete, { from: stranger }),
      "Only owner can verify"
    );
  });

  it("should log a transaction for an athlete", async () => {
    await contract.registerAthlete({ from: athlete });
    await contract.logTransaction(web3.utils.toWei("1", "ether"), "Appearance fee", { from: athlete });

    const txs = await contract.getAthleteTransactions(athlete);
    assert.equal(txs.length, 1, "Should log one transaction");
    assert.equal(txs[0].purpose, "Appearance fee");
  });
});
