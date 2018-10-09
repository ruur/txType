const BaseTransactionType = artifacts.require("BaseTransactionType");

contract('BaseTransactionType', accounts => {

  it("...should be empty user list.", async () => {
    const instance = await BaseTransactionType.deployed();
    const users = await instance.getUserList.call();
    assert.equal(users.length, 0, "Empty user list first.");
  });

  it("...should add three users.", async () => {
    const instance = await BaseTransactionType.deployed();
    await instance.addUser(accounts[0], true, true, true, true);
    await instance.addUser(accounts[1], true, false, true, true);
    await instance.addUser(accounts[2], true, true, false, false);
    const users = await instance.getUserList.call();
    assert.equal(users.length, 3, "Add users successed.");
  });

  it("...should getTxType for user.", async () => {
    const instance = await BaseTransactionType.deployed();
    const firstUserType = await instance.getTxType.call(accounts[0]);
    const secondUserType = await instance.getTxType.call(accounts[1]);
    const lastUserType = await instance.getTxType.call(accounts[2]);
    assert.equal(firstUserType, 15, "Add users successed.");
    assert.equal(secondUserType, 13, "Add users successed.");
    assert.equal(lastUserType, 3, "Add users successed.");
  });

  it("...should changeTxType for a user.", async () => {
    const instance = await BaseTransactionType.deployed();
    await instance.changeTxType(accounts[0], false, true, true, true);
    const userType = await instance.getTxType.call(accounts[0]);
    assert.equal(userType, 14, "Change user txType successed.");
  });

  it("...should remove a user.", async () => {
    const instance = await BaseTransactionType.deployed();
    await instance.removeUser(accounts[2]);
    const users = await instance.getUserList.call();
    assert.equal(users.length, 2, "Remove user successed.");
  });

  it("...should owner is initialized.", async () => {
    const instance = await BaseTransactionType.deployed();
    const owner = await instance.owner.call();
    await instance.renounceOwnership();
    const newOwner = await instance.owner.call();
    assert.isFalse(owner === newOwner, 'Owner is initialized.');
  });

});
