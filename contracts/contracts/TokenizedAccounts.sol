// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TokenizedAccounts is Ownable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  /// @notice Emitted when a new account is minted
  /// @param accountToken Account token
  event AccountTokenized(uint256 indexed accountToken);

  /// @notice Mapping from owner address to token (Account Token)
  mapping(address => uint256) private _tokenHolders;
  constructor() public ERC721("TokenizedAccount", "TDA") {}

  /// @notice Mints new Non-Fungible token for given address, only administrator can do so
  /// @param userAccount user address for whom the token will be mined
  /// @param platformAccountId some off-chain accout id
  /// @param tokenURI link to the platform that platformAccountId is associated with
  function tokenize(address userAccount, string memory platformAccountId, string memory tokenURI)
      public
      onlyOwner
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 newItemId = _randomizeToken(userAccount, platformAccountId, _tokenIds.current());
      _safeMint(userAccount, newItemId);
      _setTokenURI(newItemId, tokenURI);
      _addTokenForOwner(userAccount, newItemId);
      emit AccountTokenized(newItemId);
      return newItemId;
  }

  function _randomizeToken(
    address userAccount,
    string memory accountId,
    uint256 uniqueNumber
  ) private pure returns (uint256) {
    return uint256(
      keccak256(
        abi.encode(
          userAccount,
          accountId,
          uniqueNumber
        )
      )
    );
  }

  function _addTokenForOwner(address owner, uint256 token) private {
    _tokenHolders[owner] = token;
  }

  function retrieveMyAccountTokens(address owner) public view returns (uint256) {
    require(owner == msg.sender, "Only owner can check his tokens");
    return _tokenHolders[owner];
  }
}
