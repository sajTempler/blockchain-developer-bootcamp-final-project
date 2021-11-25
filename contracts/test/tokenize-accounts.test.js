require("truffle-test-utils").init();
const TokenizedAccounts = artifacts.require("TokenizedAccounts");

contract("TokenizedAccounts", (accounts) => {
  it("should tokenize account", async () => {
    const instance = await TokenizedAccounts.deployed();

    const tx = await instance.tokenize(
      accounts[0],
      "12345",
      "https://example.com/users/12345"
    );

    assert.web3Event(tx, {
        event: 'AccountTokenized',
        args: {
          ownerAddress: '0xBD70bb01B821eB3C61dc9aD779b496d13b1d5737',
        }
      }, 'The event is emitted');

    // assert.equal(
    //   token.toString(),
    //   "82811743367304812115272119008401853174207022172515034953957631840453225150288",
    //   "token wasnt returned"
    // );
  });
});

function sleep(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
