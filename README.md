
# Final project idea - tokenized accounts available for trade
  

## Public URL

(free tier on Heroku can be slow sometimes but app will load)

https://consensys-bootcamp-final-proje.herokuapp.com/

## Screencast URL:

- https://loom.com/share/d847e44451b3457798d7fd8c6813ce87

## Summary

Hooking into any existing platform with user login. Allow to tokenize existing user account and allow to trade ERC721 token associated with that account.
E.G. a Steam (gaming platform) account could be tokenized and sold. Then some other party could reclaim games based on that token associacion.

### Incentive for platform owner

Every time the account is traded small fee will be transferred to platform owner account *(not implemented yet)*

### Example flow
User logins to his/her account. Under 'Settings' -> 'Ethereum options' is a 'tokenize' switch that will mint an ERC721 token associated with `userId` from the platform (e.g. Steam). User then can put for trade his token (account on the platform) and sell to someone (public address obtained by other means e.g. Discord).

  

## Extra features (to be added)


  

## Possible problems

- work on Platform side to integrate with web3 flow

## Running locally:

### requirements

- node.js >= 16
- cloned this repo

### Contracts (location: `/contracts`)
Run following:
```bash
cd /contracts
npm i
./node_modules/.bin/ganache-cli --chainId=1337
# in separate terminal
./node_modules/.bin/truffle migrate --reset
```
Import accounts in Metamask from *private keys* displayed in `ganache-cli`
Copy *contract address* displayed in `truffle` terminal and paste into `<repo_root>/src/config.js`

The `ganache-cli` network runs on default `8545` port

Like so:
```javascript
export const CONTRACT_MAP = {
	TokenizeAccount: {
		address:  "0xe5530125Cf4805c148BBBf2ce40F06574f46fD26",
		abi: [...]
	}
}
```

### Web app (location `/`)
Run following (in repository root directory)
```bash
npm i
npm start
```
this will run application on `http://localhost:3000/

## Directory structure

-   `<root>`: Project's React frontend.
-   `/contracts/contracts`: Smart contract that is deployed in the Ropsten testnet.
-   `/contracts/migrations`: Migration files for deploying contracts in  `/contracts/contracts`  directory.
-   `/contracts/test`: Tests for smart contracts.

## Running contract tests

Run following:

```bash
# in first terminal
cd /contracts
# assuming you did already 'npm install'
./node_modules/.bin/ganache-cli --chainId=1337

# in second terminal
cd /contracts
./node_modules/.bin/truffle test

```

## Public address for NFT certification

`0x36d9E7c69Df4F0A20Ae41Ae21414Eaa56Aec6896`

## Known issues

### latest Metamask does not connect to localhost RPC

Just run local network with `./node_modules/.bin/ganache-cli --chainId=1338`
and add manually network in metamask with url http://127.0.0.1:8545 and chain id 1338