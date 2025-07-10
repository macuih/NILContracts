const NILTransparencyContract = artifacts.require("NILTransparencyContract");

module.exports = function (deployer) {
  deployer.deploy(NILTransparencyContract);
};
