# txtype-permissioning
Smart contract that lets you set permissions on parity based PoA-Chain

__Ownable.sol:__ Open Zeppelin contract that handles ownership

__AllowedTransactions.sol:__ Interface that ensures the right implementation of ABI

__BaseTransactionType.sol:__ Basic logic of contract with functions that let you add and change permissions and add and remove permissioned users

__TransactionType.sol:__ Direct implementation of ABI without relay

__RelayTxType.sol:__ Relay contract that implements the ABI and communicates directly with the client

__RelayedTxType.sol:__ Contract that owner communicates with that is relayed by RelayTxType.sol
