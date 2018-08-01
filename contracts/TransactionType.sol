pragma solidity ^0.4.24;

import "./BaseTransactionType.sol";
import "./AllowedTransactions.sol";

contract TransactionType is BaseTransactionType, AllowedTransactions {

    function allowedTxType(address sender) public returns(uint32){
        uint32 txType = baseAllowedTxType(sender);
        return txType;
    }
}