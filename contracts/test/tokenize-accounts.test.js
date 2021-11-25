require("truffle-test-utils").init();
const ethers = require("ethers");
const TokenizedAccounts = artifacts.require("TokenizedAccounts");

contract("TokenizedAccounts", (accounts) => {
  it("should tokenize account and emit AccountTokenized", async () => {
    const instance = await TokenizedAccounts.deployed();

    const tx = await instance.tokenize(
      accounts[0],
      "12345",
      "https://example.com/users/12345"
    );

    assert.web3Event(
      tx,
      {
        event: "AccountTokenized",
        // args: {
        // token:
        //   "82811743367304812115272119008401853174207022172515034953957631840453225150288",
        // cant verify due to Number can only safely store up to 53 bits
        // ownerAddress: "0xBD70bb01B821eB3C61dc9aD779b496d13b1d5737",
        // },
      },
      "The event is emitted"
    );
  });

  it("should return token for given address", async () => {
    const instance = await TokenizedAccounts.deployed();

    const token = await instance.retrieveMyToken.call(accounts[0]);

    assert.equal(
      token.toString(),
      "104521540626363347524687337254239023513155440674470254388754714499441519928735"
    );
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

    assert.equal(
      offer.tokenId,
      "104521540626363347524687337254239023513155440674470254388754714499441519928735"
    );
    assert.equal(offer.price, "2000000000000000");
    assert.equal(offer.seller, accounts[0]);
  });

  it("token can be bought and AccountBought event is emitted", async () => {
    const instance = await TokenizedAccounts.deployed();

    const tx = await instance.buyAccount(
      "104521540626363347524687337254239023513155440674470254388754714499441519928735",
      { from: accounts[1], value: 2000000000000000 }
    );

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

    assert.equal(
      token.toString(),
      "104521540626363347524687337254239023513155440674470254388754714499441519928735"
    );
  });

  it("token should be transferred not held by original owner", async () => {
    const instance = await TokenizedAccounts.deployed();

    const token = await instance.retrieveMyToken.call(accounts[0], {
      from: accounts[0],
    });

    assert.equal(token.toString(), "0");
  });
});

