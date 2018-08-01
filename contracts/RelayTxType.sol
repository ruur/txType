pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./AllowedTransactions.sol";
import "./RelayedTxType.sol";

contract RelayTxType is Ownable, AllowedTransactions {

    event NewRelayed(address indexed old, address indexed current);

    // Contract interface, Address of inner transaction type contract
    RelayedTxType public relayedTxType;

    // Set inner transaction type contract by initializing relayedTxType
    function setRelayed(address _relayedTxType) external onlyOwner {
        emit NewRelayed(relayedTxType, _relayedTxType);
        relayedTxType = RelayedTxType(_relayedTxType);
    }

    // allowed transaction type that calls baseAllowedTxType
    function allowedTxType(address sender) public returns(uint32) {
        uint32 txType = relayedTxType.relayAllowedTxType(sender);
        return txType; 
    }
}