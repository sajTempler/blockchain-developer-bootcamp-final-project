# Design patterns used

## Access Control Design Patterns

- `onlyNewAccounts` modifier used in `tokenize()` function. This function can be run only by account that does not yet associated token with it.

- `onlyTokenHolder` modifier used in `addAccountForSale()` function. This function can be run only by token holder and token owner to prevent anyone else from posting a trade but the token owner.

## Inheritance and Interfaces

- `TokenizedAccounts` contract inherits the OpenZeppelin `ERC721` contract to stick to best practices and battle tested solutions.
