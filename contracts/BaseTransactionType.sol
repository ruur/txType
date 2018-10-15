pragma solidity ^0.4.24;

import "./Ownable.sol";

contract BaseTransactionType is Ownable {

    event ChangedTxType(address _user, uint32 _txType);

    event ChangedUserList(address[] _user);

    /// Allowed transaction types mask
    uint32 constant None = 0;
    uint32 constant All = 0xffffffff;
    uint32 constant Basic = 0x01;
    uint32 constant Call = 0x02;
    uint32 constant Create = 0x04;
    uint32 constant Private = 0x08;

    struct AddressStatus {
        bool isIn;
        uint index;
        uint32 txType;
    }

    mapping(address => AddressStatus) status;
    address[] permissionedUsers;

    // Modifiers
    modifier isPermissioned(address _user){
        bool isIn = status[_user].isIn;
        uint index = status[_user].index;

        require(isIn && index <= permissionedUsers.length && permissionedUsers[index] == _user);
        _;
    }

    modifier isNotPermissioned(address _user){
        require(!status[_user].isIn);
        _;
    }

    function setTxType(address _user, bool _basicTx, bool _callTx, bool _createTx, bool _privateTx) internal {
        uint32 basic = _basicTx ? Basic : 0;
        uint32 call = _callTx ? Call : 0;
        uint32 create = _createTx ? Create : 0;
        uint32 priv = _privateTx ? Private : 0;
        if(_createTx || _privateTx) require(msg.sender == owner, 'Not allowed.');
        status[_user].txType = basic | call | create | priv;
    }

    // Add a new address to the mapping and set allowed TX type
    function addUser(address _user, bool _basicTx, bool _callTx, bool _createTx, bool _privateTx) external isNotPermissioned(_user) {
        status[_user].isIn = true;
        status[_user].index = permissionedUsers.length;

        setTxType(_user, _basicTx, _callTx, _createTx, _privateTx);
        permissionedUsers.push(_user);

        address lastUser = permissionedUsers[permissionedUsers.length - 1];
        emit ChangedUserList(permissionedUsers);
        emit ChangedTxType(lastUser, status[lastUser].txType);
    }

    // Change TX type permissions of existing permissioned user
    function changeTxType(address _user, bool _basicTx, bool _callTx, bool _createTx, bool _privateTx) external isPermissioned(_user) {
        setTxType(_user, _basicTx, _callTx, _createTx, _privateTx);
        emit ChangedTxType(_user, status[_user].txType);
    }

    // Remove user by moving last element to its slot and reseting status
    function removeUser(address _user) external onlyOwner isPermissioned(_user) {
        uint index = status[_user].index;
        address lastUser = permissionedUsers[permissionedUsers.length - 1];
        permissionedUsers[index] = lastUser;
        status[permissionedUsers[index]].index = index;

        delete permissionedUsers[permissionedUsers.length - 1];
        permissionedUsers.length--;
        delete status[_user];

        emit ChangedUserList(permissionedUsers);
    }

    function getUserList() external view returns(address[]){
        return permissionedUsers;
    }

    function getTxType(address _user) external view returns(uint32) {
        return status[_user].txType;
    }

    // allow transaction types (internal) gets called by allowedTxType()
    function baseAllowedTxType(address _sender) internal view returns(uint32){
        if(!status[_sender].isIn) return 0x01 | 0x02;
        uint32 xType = status[_sender].txType;
        return xType;
    }
}
