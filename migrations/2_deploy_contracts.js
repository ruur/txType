var TransactionType = artifacts.require("TransactionType");

module.exports = function(deployer) {
  deployer.deploy(TransactionType);
};
