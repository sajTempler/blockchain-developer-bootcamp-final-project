# Design patterns used

## Access Control Design Patterns

- `Ownable` design pattern used in `tokenize()` function. This function do not need to be used by anyone else apart from the contract creator, e.g. the party that is responsible for managing the accounts (Steam, GOG).

## Inheritance and Interfaces

- `TokenizedAccounts` contract inherits the OpenZeppelin `Ownable` contract to enable ownership for one managing user/party.
