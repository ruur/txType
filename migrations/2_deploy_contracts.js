var Ownable = artifacts.require("Ownable");
var BaseTransactionType = artifacts.require("BaseTransactionType");
var AllowedTransactions = artifacts.require("AllowedTransactions");
var TransactionType = artifacts.require("TransactionType");

module.exports = function(deployer) {
  var initAccount = '0xca35b7d915458ef540ade6068dfe2f44e8fa733c';
  deployer.deploy(Ownable);
  deployer.link(Ownable, BaseTransactionType);
  deployer.deploy(BaseTransactionType);
  deployer.deploy(TransactionType);
  deployer.link(TransactionType, [BaseTransactionType, AllowedTransactions]);
  deployer.deploy(TransactionType);
};
