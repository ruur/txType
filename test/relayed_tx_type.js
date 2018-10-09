var RelayedTxType = artifacts.require("RelayedTxType");

contract('RelayedTxType', accounts => {

  it("...should the relayAllowedTxType be 3 for unknown address.", async () => {
    const instance = await RelayedTxType.deployed(accounts[0]);
    const txType = await instance.relayAllowedTxType.call(accounts[3]);
    assert.equal(txType, 3, "Get relayAllowedTxType successed.");
  });

  it("...should set relay.", async () => {
    const instance = await RelayedTxType.deployed(accounts[0]);
    await instance.addUser(accounts[0], true, true, true, true);
    const txType = await instance.relayAllowedTxType.call(accounts[0]);
    await instance.setRelay(accounts[0]);
    const userType = await instance.getTxType.call(accounts[0]);
    assert.equal(txType.toNumber(), 15, "Set relay successed.");
    assert.equal(userType.toNumber(), txType.toNumber(), "The value of txType is common as userTxType.");
  });

});
