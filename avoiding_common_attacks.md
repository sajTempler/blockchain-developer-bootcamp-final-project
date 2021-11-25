# Contract security measures

## SWC-100 Function Default Visibility

All functions in `TokenizedAccounts` have visibility type specified.

## SWC-102 Outdated Compiler Version

Use of a recent version of the Solidity compiler
## SWC-103 Floating pragma

Specific compiler pragma `0.8.9` used in contract to avoid accidental bug inclusion through outdated compiler versions.

## SWC-108 State Variable Default Visibility

Explicitly mark visibility in functions and state variables
## Modifiers used only for validation

All modifiers in contract only validate data with `require` statements.
