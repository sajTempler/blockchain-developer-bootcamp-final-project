const TokenizedAccounts = artifacts.require("./TokenizedAccounts.sol");

module.exports = function (deployer) {
  deployer.deploy(TokenizedAccounts);
};
