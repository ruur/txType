pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./BaseTransactionType.sol";
import "./RelayTxType.sol";

contract RelayedTxType is Ownable, BaseTransactionType {

    event NewRelay(address indexed old, address indexed current);
    
    // Contract interface of inner transaction type contract
    RelayTxType public relayTxType;

    // Only allow access to relay contract
    modifier onlyRelay() {
        require(msg.sender == address(relayTxType));
        _;
    }

    // Constructor 
    constructor(address _relayTxType) public {
        relayTxType = RelayTxType(_relayTxType);
    }

    // Set new relay contract 
    function setRelay(address _relayTxType) external onlyOwner
	{
        emit NewRelay(relayTxType, _relayTxType);
        relayTxType = RelayTxType(_relayTxType);
    }

    // 
    function relayAllowedTxType(address sender) external returns(uint32) {
        uint32 txType = baseAllowedTxType(sender);
        return txType;
    }

}
