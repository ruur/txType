const BaseTransactionType = artifacts.require("BaseTransactionType");
const TransactionType = artifacts.require("TransactionType");

contract('BaseTransactionType', accounts => {

  it("Should be empty user list.", async () => {
    const instance = await BaseTransactionType.deployed();
    const users = await instance.getUserList.call();
    assert.equal(users.length, 0, "Empty user list first.");
  });

  it("Test each tx type in addUser.", async () => {
    const instance = await BaseTransactionType.deployed();
    await instance.addUser(accounts[0], false, false);
    await instance.addUser(accounts[1], true, false);
    await instance.addUser(accounts[2], false, true);
    await instance.addUser(accounts[3], true, true);
    const users = await instance.getUserList.call();
    const defaultType = await instance.getTxType.call(accounts[0]);
    const createType = await instance.getTxType.call(accounts[1]);
    const privateType = await instance.getTxType.call(accounts[2]);
    const allType = await instance.getTxType.call(accounts[3]);
    assert.equal(users.length, 4, "Add users successed.");
    assert.equal(defaultType, 3, "Add default type successed.");
    assert.equal(createType, 7, "Add create type successed.");
    assert.equal(privateType, 11, "Add private type successed.");
    assert.equal(allType, 15, "Add all type successed.");
  });

  it("Check tx type in changeTxType.", async () => {
    const instance = await BaseTransactionType.deployed();
    await instance.changeTxType(accounts[0], true, false);
    await instance.changeTxType(accounts[1], false, true);
    await instance.changeTxType(accounts[2], false, false);
    const userTypeOne = await instance.getTxType.call(accounts[0]);
    const userTypeTwo = await instance.getTxType.call(accounts[1]);
    const userTypeThree = await instance.getTxType.call(accounts[2]);
    assert.equal(userTypeOne, 7, "Change userOne txType successed.");
    assert.equal(userTypeTwo, 11, "Change userTwo txType successed.");
    assert.equal(userTypeThree, 3, "Change userThree txType successed.");
    await instance.changeTxType(accounts[0], false, false);
    await instance.changeTxType(accounts[1], true, false);
    await instance.changeTxType(accounts[2], false, true);
  });

  it("Check user status after removed.", async () => {
    const instance = await BaseTransactionType.deployed();
    await instance.removeUser(accounts[3]);
    const users = await instance.getUserList.call();
    assert.equal(users.length, 3, "Remove user successed.");
    const userType = await instance.getTxType.call(accounts[3]);
    assert.equal(userType, 0, "tx type should be 0 after the user removed.");
  });

  it("Check owner is initialized.", async () => {
    const instance = await BaseTransactionType.deployed();
    const owner = await instance.owner.call();
    await instance.renounceOwnership();
    const newOwner = await instance.owner.call();
    assert.isFalse(owner === newOwner, 'Owner is initialized.');
  });

});

contract('TransactionType', accounts => {

  it("Create and Private are privileged transaction types that can be assigned by admin account.", async () => {
    const txInstance = await BaseTransactionType.deployed();
    const owner = await txInstance.owner.call();
    const instance = await TransactionType.deployed(owner);
    await instance.addUser(accounts[2], false, false);
    await instance.addUser(accounts[3], true, false);
    await instance.addUser(accounts[4], false, true);
    const defaultType = await instance.getTxType.call(accounts[2]);
    const createType = await instance.getTxType.call(accounts[3]);
    const privateType = await instance.getTxType.call(accounts[4]);
    assert.equal(defaultType, 3, "Add default type successed.");
    assert.equal(createType, 7, "Add create type successed.");
    assert.equal(privateType, 11, "Add private type successed.");
  });

  it("Test all users should by default be allowed for Base and Call transactions.", async () => {
    const instance = await TransactionType.deployed(accounts[0]);
    await instance.transferOwnership(accounts[2]);
    await instance.addUser(accounts[7], false, false);
    try {
      await instance.addUser(accounts[8], true, false);
    } catch(err) {
      assert.equal(err.reason, 'Not allowed.', "Create type can not be assigned by normal user.");
    }
    try {
      await instance.addUser(accounts[9], false, true);
    } catch(err) {
      assert.equal(err.reason, 'Not allowed.', "Private type can not be assigned by normal user.");
    }
    const defaultType = await instance.getTxType.call(accounts[2]);
    assert.equal(defaultType, 3, "Add default type successed.");
  });

});
