pragma solidity ^0.4.24;

interface AllowedTransactions {

    function allowedTxType(address sender) external returns(uint32);

}