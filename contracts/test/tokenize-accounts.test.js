require("truffle-test-utils").init();
const ethers = require("ethers");
const TokenizedAccounts = artifacts.require("TokenizedAccounts");

contract("TokenizedAccounts", (accounts) => {
  let testToken;
  it("should tokenize account and emit AccountTokenized", async () => {
    const instance = await TokenizedAccounts.deployed();

    const tx = await instance.tokenize(
      accounts[0],
      "12345",
      "https://example.com/users/12345"
    );

    testToken = `${tx.logs[1].args.token}`;

    assert.web3Event(
      tx,
      {
        event: "AccountTokenized",
      },
      "The event is emitted"
    );

    assert.equal(tx.logs[1].args.ownerAddress, accounts[0]);
  });

  it("should return token for given address", async () => {
    const instance = await TokenizedAccounts.deployed();

    const token = await instance.retrieveMyToken.call(accounts[0]);

    assert.equal(token.toString(), testToken);
  });

  it("should put token for sale and emit AccountPutForSale event", async () => {
    const instance = await TokenizedAccounts.deployed();

    const testPrice = ethers.utils.parseEther("0.002");
    const testToken = await instance.retrieveMyToken.call(accounts[0]);

    const tx = await instance.addAccountForSale(
      testPrice,
      testToken,
      accounts[1]
    );

    assert.web3Event(
      tx,
      {
        event: "AccountPutForSale",
        args: {
          0: 2000000000000000,
          1: accounts[0],
          2: accounts[1],
          __length__: 3,
          buyer: accounts[1],
          price: 2000000000000000,
          seller: accounts[0],
        },
      },
      "The event is emitted"
    );
  });

  it("token for sale should be listed for given account", async () => {
    const instance = await TokenizedAccounts.deployed();

    const offer = await instance.myOffers.call({ from: accounts[1] });

    assert.equal(offer.tokenId, testToken);
    assert.equal(offer.price, "2000000000000000");
    assert.equal(offer.seller, accounts[0]);
  });

  it("token can be bought and AccountBought event is emitted", async () => {
    const instance = await TokenizedAccounts.deployed();

    const tx = await instance.buyAccount(testToken, {
      from: accounts[1],
      value: 2000000000000000,
    });

    assert.web3Event(
      tx,
      {
        event: "AccountBought",
      },
      "The event is emitted"
    );
  });

  it("token should be transferred", async () => {
    const instance = await TokenizedAccounts.deployed();

    const token = await instance.retrieveMyToken.call(accounts[1], {
      from: accounts[1],
    });

    assert.equal(token.toString(), testToken);
  });

  it("token should be transferred not held by original owner", async () => {
    const instance = await TokenizedAccounts.deployed();

    const token = await instance.retrieveMyToken.call(accounts[0], {
      from: accounts[0],
    });

    assert.equal(token.toString(), "0");
  });
});
